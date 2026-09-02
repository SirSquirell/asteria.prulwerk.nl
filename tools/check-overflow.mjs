// tools/check-overflow.mjs
//
// Controleert in een headless Chromium dat geen van beide pagina's horizontaal
// scrolt tussen 320 en 1600px, en dat er bij het laden niets in de console
// verschijnt (een CSP-overtreding komt daar als fout binnen). Draai dit na
// elke wijziging aan opmaak of aan de CSP-meta:
//
//   node tools/check-overflow.mjs
//
// De repo wordt over een lokale http-server geserveerd, niet via file://,
// want anders betekent 'self' in de CSP iets anders dan op GitHub Pages en
// test je een andere pagina dan de gepubliceerde.
//
// Playwright wordt niet in deze repo geïnstalleerd (geen package.json, geen
// node_modules): het script gebruikt een globale installatie via NODE_PATH of
// de map in PLAYWRIGHT_MODULE, en de browser via PLAYWRIGHT_CHROMIUM. Zonder
// die twee zegt het script wat er ontbreekt en stopt met code 2.

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, extname, normalize } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGES = ['/', '/handleiding.html'];
const WIDTHS = [320, 375, 768, 1024, 1600];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.woff2': 'font/woff2',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

let chromium;
try {
  const require = createRequire(import.meta.url);
  const from = process.env.PLAYWRIGHT_MODULE
    ? join(process.env.PLAYWRIGHT_MODULE, 'index.js')
    : 'playwright';
  ({ chromium } = require(from));
} catch {
  console.error(
    'Playwright niet gevonden. Zet NODE_PATH naar een globale node_modules of\n' +
      'PLAYWRIGHT_MODULE naar de map van het playwright-pakket.'
  );
  process.exit(2);
}

const server = createServer(async (req, res) => {
  let path = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': MIME[extname(file)] || 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || undefined,
});

let failures = 0;
for (const path of PAGES) {
  for (const width of WIDTHS) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const console_ = [];
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') console_.push(`${m.type()}: ${m.text()}`); });
    page.on('pageerror', (e) => console_.push(`pageerror: ${e.message}`));
    await page.goto(base + path, { waitUntil: 'load' });
    // De demoknop valt na 900ms terug op "Eerst installeren" als er geen
    // extensie is; dat wachten we af, dan hebben alle scripts gedraaid.
    await page.waitForTimeout(1200);
    const r = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      demo: document.getElementById('demo')?.getAttribute('data-state') ?? null,
    }));
    const overflow = r.scrollWidth > r.innerWidth;
    const demoOk = path !== '/' || r.demo === 'absent';
    const ok = !overflow && console_.length === 0 && demoOk;
    if (!ok) failures++;
    console.log(
      `${ok ? 'ok  ' : 'FOUT'} ${path.padEnd(18)} ${String(width).padStart(4)}px  ` +
        `scrollWidth ${r.scrollWidth} / innerWidth ${r.innerWidth}` +
        (path === '/' ? `  demoknop ${r.demo}` : '') +
        (console_.length ? `\n      ${console_.join('\n      ')}` : '')
    );
    if (overflow) {
      // Wie steekt eruit? Alle elementen waarvan de rechterrand voorbij de viewport valt.
      const wide = await page.evaluate(() =>
        [...document.querySelectorAll('body *')]
          .map((el) => ({ el, r: el.getBoundingClientRect() }))
          .filter(({ r }) => r.right > window.innerWidth + 0.5)
          .slice(0, 8)
          .map(({ el, r }) => `${el.tagName.toLowerCase()}${el.className ? '.' + String(el.className).split(' ').join('.') : ''} right=${Math.round(r.right)}`)
      );
      console.log('      ' + wide.join('\n      '));
    }
    await page.close();
  }
}

await browser.close();
server.close();
if (failures) {
  console.error(`\n${failures} controle(s) mislukt.`);
  process.exit(1);
}
console.log('\nGeen horizontale overflow, lege console, demoknop draait.');

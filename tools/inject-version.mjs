// tools/inject-version.mjs
//
// Leest manifest.json van de extensie en zet het versienummer plus de
// publicatiedatum in de gepubliceerde HTML en in sitemap.xml. Draai dit
// voordat GitHub Pages publiceert.
//
//   node tools/inject-version.mjs --manifest /pad/naar/Claudiclaude/manifest.json
//
// De site en de extensie leven in twee repo's (asteria.prulwerk.nl serveert
// de pagina, SirSquirell/Claudiclaude bevat manifest.json), dus het pad naar
// manifest.json is altijd een argument, nooit een aanname over waar de
// andere repo staat. Zie .github/workflows/pages.yml voor hoe CI dat pad
// invult na het clonen van beide repo's.
//
// Idempotent: het herschrijft de inhoud van de twee <b>-elementen en de
// softwareVersion in de JSON-LD, dus twee keer draaien geeft hetzelfde
// resultaat.

import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PAGE = join(root, 'index.html');
const SITEMAP = join(root, 'sitemap.xml');

const manifestFlagIndex = process.argv.indexOf('--manifest');
const MANIFEST =
  manifestFlagIndex !== -1 ? process.argv[manifestFlagIndex + 1] : process.env.ASTERIA_MANIFEST;

if (!MANIFEST) {
  console.error(
    'Geen manifest.json opgegeven. Gebruik --manifest <pad> of zet ASTERIA_MANIFEST.\n' +
      'Dit script leeft in de site-repo, maar manifest.json leeft in SirSquirell/Claudiclaude.'
  );
  process.exit(1);
}

const { version } = JSON.parse(await readFile(MANIFEST, 'utf8'));

// Publicatiedatum als jaar.maand.dag, in Europe/Amsterdam.
const todayDots = new Intl.DateTimeFormat('nl-NL', {
  timeZone: 'Europe/Amsterdam',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
  .format(new Date())
  .split('-')
  .reverse()
  .join('.');
const todayIso = todayDots.split('.').join('-');

let html = await readFile(PAGE, 'utf8');

const patterns = [
  /(<b id="ver">)[^<]*(<\/b>)/,
  /(<b id="sitever">)[^<]*(<\/b>)/,
  /("softwareVersion":\s*")[^"]*(")/,
];
const missing = patterns.filter((re) => !re.test(html));
if (missing.length) {
  console.error(
    'Kan niet vervangen: #ver, #sitever of softwareVersion ontbreekt in index.html.'
  );
  process.exit(1);
}

html = html
  .replace(patterns[0], `$1${version}$2`)
  .replace(patterns[1], `$1${todayDots}$2`)
  // ook in de JSON-LD, anders staat daar een andere versie dan in de footer
  .replace(patterns[2], `$1${version}$2`);

await writeFile(PAGE, html);

let sitemap = await readFile(SITEMAP, 'utf8');
sitemap = sitemap.replace(/(<lastmod>)[^<]*(<\/lastmod>)/, `$1${todayIso}$2`);
await writeFile(SITEMAP, sitemap);

console.log(`extensie ${version} · pagina ${todayDots}`);

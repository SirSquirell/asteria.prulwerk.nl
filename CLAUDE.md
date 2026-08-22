# asteria.prulwerk.nl

Statische GitHub Pages-site voor Asteria. Eén pagina: `index.html` in de
root. `fonts/` bevat de zelfgehoste Archivo-instances, `og.png` is het
gerenderde Open Graph-beeld, `robots.txt` en `sitemap.xml` staan in de root
omdat dit het enige pad is dat GitHub Pages voor dit domein serveert.

`asteria-site/` is niet meer in gebruik. De map bestond toen de site nog uit
losse `.webp`-schermafdrukken bestond; die zijn vervangen door de
gereconstrueerde HTML-uitsnedes in `index.html` zelf.

De broncode van de extensie staat in een andere repo:
[SirSquirell/Claudiclaude](https://github.com/SirSquirell/Claudiclaude).

## Versienummer in de footer

De footer toont twee versies, `extensie <b id="ver">` en `pagina
<b id="sitever">`, plus `softwareVersion` in de JSON-LD. Die komen uit
`manifest.json` in de Claudiclaude-repo, niet uit deze repo.

`tools/inject-version.mjs --manifest <pad naar manifest.json>` zet ze goed
en werkt ook `sitemap.xml`s `<lastmod>` bij. `.github/workflows/pages.yml`
doet dit automatisch bij elke push naar `main`, door Claudiclaude er even
naast te clonen.

**Eenmalige handmatige stap:** ga naar Settings > Pages > Build and
deployment > Source en zet die op **GitHub Actions**. Pages publiceert nu
nog rechtstreeks vanaf de branch; zolang die instelling niet is omgezet
bouwt de workflow wel, maar publiceert Pages de ongebouwde inhoud.

Draait er om wat voor reden ook geen workflow: draai het script met de hand
voordat je een versiebump publiceert. Een vergeten handmatige stap is nog
altijd beter dan een cijfer dat niemand kan controleren.

## Demoknop

De pagina detecteert de Asteria-extensie via een content script op
`https://asteria.prulwerk.nl/*` (zie `03-DEMOKNOP.md` in de opdrachtbrief en
de patch in `extension-patch/` in deze repo, die naar Claudiclaude toe moet).
Verander de eventnamen (`asteria:ready`, `asteria:open-demo`,
`asteria:demo-open`) niet zonder ze op beide plekken aan te passen.

## Harde randvoorwaarden

- Eén bestand voor de pagina zelf: geen framework, geen bundler.
- Geen extern script en geen externe fetch vanaf de pagina, behalve wat al
  zelfgehost is.
- Nul em-dashes in zichtbare tekst.
- Geen horizontale overflow tussen 320 en 1600px.
- Het app-palet (`--a-*` custom properties) staat op `:root`, niet in een
  `prefers-color-scheme`-query: de gereconstrueerde product-UI kleurt niet
  mee met het paginathema, net als een schermafdruk dat ook niet doet.
- Elk bedrag op de pagina komt uit de demomodus (`npm run demo` in
  Claudiclaude). Niet verzinnen, ook niet voor illustratiedoeleinden.

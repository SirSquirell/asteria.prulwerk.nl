# Patch voor SirSquirell/Claudiclaude

Deze map hoort niet in deze repo te blijven. De demoknop op
`asteria.prulwerk.nl` heeft een extensiekant nodig (`manifest.json`,
een nieuw content script, een handler in de service worker), en die
kant leeft in [SirSquirell/Claudiclaude](https://github.com/SirSquirell/Claudiclaude),
niet hier. Deze sessie had alleen leestoegang tot die repo, dus de patch
staat hier als kant-en-klaar toe te passen materiaal in plaats van als een
PR daar.

Alles hieronder is gecontroleerd tegen de echte broncode van Claudiclaude
(commit `493313d`), niet verzonnen:

- `wantsDemo()` in `src/ui/datasource.js` leest `?demo=` uit de URL. De
  demo-trigger is dus `app.html?demo=1`, exact zoals optie b in
  `03-DEMOKNOP.md` beschrijft. Dat is verwerkt in `sw.patch.js` hieronder.
- `host_permissions` in `manifest.json` blijven ongewijzigd op de twee
  bestaande hosts. Dit voegt alleen een `content_scripts`-entry toe.

## Toe te passen

1. **`manifest.json`** — voeg de tweede entry in `content_scripts` toe.
   Zie `manifest.patch.json` voor de volledige array zoals hij na de patch
   moet zijn.
2. **`src/content/site.js`** — nieuw bestand, zie `src/content/site.js`
   in deze map. Ongewijzigd overgenomen uit
   `asteria-brief/snippets/content-asteria-site.js`, want die was al
   correct: geen extensie-ID nodig, marker op `documentElement` bij
   `document_start`.
3. **`src/sw.js`** — voeg de `case 'open-demo':` toe aan de bestaande
   `handle()`-functie (rond regel 139, naast de bestaande `case 'openApp':`).
   Zie `sw.patch.js` voor het exacte blok, inclusief de ingevulde
   demo-trigger (`?demo=1`) in plaats van de `TODO` uit de brief.
4. **`WHATS-NEW.md`** — voeg de tekst in `WHATS-NEW-entry.md` toe boven
   de bestaande inhoud, want gebruikers met een al langer geladen unpacked
   install moeten de extensie herladen in `chrome://extensions` voordat de
   knop werkt.
5. Bump `version` in `manifest.json` en draai
   `node tools/inject-version.mjs --manifest manifest.json` in de
   asteria.prulwerk.nl-repo (of laat de Pages-workflow dat doen) zodat de
   footer de nieuwe versie toont.

## Wat hier bewust niet in zit

- Geen wijziging aan `host_permissions`: dit content script fetcht niets.
- Geen tweede weg naar demomodus. De handler gebruikt de bestaande
  `?demo=1`-trigger die `app.js` al kent, in plaats van een nieuwe
  storage-vlag te verzinnen.
- Geen implementatie van de Composition-userstory
  (`06-USERSTORY-composition.md`). Dat is een aparte, grotere wijziging in
  `engine.js` en `charts.js`, niet iets voor deze patch.

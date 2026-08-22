# asteria.prulwerk.nl

Projectpagina voor Asteria, de DEGIRO-portefeuillehistorie-extensie. Eén statisch bestand
plus de schermafdrukken.

- `index.html` bevat opmaak en tekst.
- `shots/` bevat de schermafdrukken, allemaal uit de demomodus met gegenereerde cijfers.
  Geen enkel bedrag komt uit een echte rekening.
- `CNAME` zet het custom domain voor GitHub Pages.
- `.nojekyll` slaat de Jekyll-verwerking over.

De broncode van de extensie zelf staat in [Claudiclaude](https://github.com/SirSquirell/Claudiclaude).

## Screenshots vernieuwen

In de Claudiclaude-repo `npm run demo`, dan de secties opnemen en de bestanden in `shots/`
vervangen. Nooit met echte data: de demomodus labelt zichzelf in de regel onder de titel,
en dat label is precies de reden dat deze beelden publiek kunnen.

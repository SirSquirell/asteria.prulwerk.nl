# Backlog asteria.prulwerk.nl

Wat er nog moet gebeuren aan de productpagina, en wat er in de review van
2 september 2026 al gebouwd is. Nummers zijn `AS-nn`; een nummer is bezet
zodra het hier op `main` staat. Het eerstvolgende vrije nummer staat onderaan.

De twee bovenste zijn voor de eigenaar: ze kunnen niet vanuit een sessie
zonder browser met de extensie of zonder repo-instellingen gedaan worden.

---

## AS-01 Pages publiceren vanuit GitHub Actions

**Waarom.** `pages.yml` bouwt bij elke push naar `main` en zet het versienummer
uit `manifest.json` van Claudiclaude in de footer en de JSON-LD. Maar Pages
staat nog op *Deploy from a branch*, dus wat er online staat is de ongebouwde
branch en het cijfer in de footer is wat de laatste sessie er met de hand in
heeft gezet. Op 2 september stond er 0.63.0 terwijl Claudiclaude 0.68.0 was.

**Scope.** In de repo-instellingen: Settings > Pages > Build and deployment >
Source op **GitHub Actions**. Daarna één push naar `main` (of een
`workflow_dispatch`). Geen codewijziging.

**Acceptatiecriteria.**
1. De workflow *Deploy Pages* draait groen en de job `deploy` toont een
   `page_url`.
2. De footer op https://asteria.prulwerk.nl toont dezelfde versie als
   `manifest.json` op `main` van Claudiclaude, zonder dat iemand
   `tools/inject-version.mjs` met de hand heeft gedraaid.
3. De paragraaf *Eenmalige handmatige stap* in `CLAUDE.md` en het commentaar
   bovenin `pages.yml` zijn daarna weg of herschreven als afgerond.

**Afhankelijkheden.** Repo-rechten op SirSquirell/asteria.prulwerk.nl. Geen.

**Test.** Bump de versie niet; vergelijk gewoon `curl -s https://asteria.prulwerk.nl/ | grep 'id="ver"'`
met `"version"` in `manifest.json` op `main` van Claudiclaude.

## AS-02 De demoknop één keer echt klikken vanaf de gepubliceerde pagina

**Waarom.** US-97 in Claudiclaude beschrijft dat de pagina de extensie
detecteert en dat de knop *Demo openen* de demo in een nieuw tabblad opent.
AC1 van die story (klik op de live pagina, demo opent) is nooit op de
gepubliceerde pagina uitgevoerd: alle checks tot nu toe draaiden zonder
extensie en zien de knop alleen terugvallen op *Eerst installeren*.

**Scope.** Eén handmatige sessie in Chrome met de extensie (0.68.0 of hoger)
geladen: open https://asteria.prulwerk.nl, wacht op *Extensie gevonden*, klik.
Meld wat er gebeurt. Geen codewijziging tenzij het misgaat.

**Acceptatiecriteria.**
1. Binnen een seconde na laden staat de knop op *Demo openen* en staat eronder
   *Extensie gevonden ...*. Het versienummer in de footer is dat van de
   geladen extensie.
2. Klikken opent de app-pagina van de extensie met demomodus aan, in een nieuw
   tabblad, zonder dat de eigen rekening wordt aangeraakt.
3. Met de extensie uitgeschakeld in `chrome://extensions` valt de knop na
   2,5 s terug op *Handleiding openen* met de bijbehorende tekst.

**Afhankelijkheden.** Een browser met de extensie; AS-01 niet nodig (de
knop staat al live), wel handig zodat het versienummer klopt.

**Test.** De drie criteria hierboven zijn de test. Faalt 1 of 2, dan is het
een defect in Claudiclaude (content script of service worker), niet hier:
de eventnamen `asteria:ready`, `asteria:open-demo` en `asteria:demo-open`
moeten aan beide kanten gelijk zijn.

---

## AS-03 Oude bestanden en verwijzingen weg (gebouwd)

**Waarom.** `index-oud-te-verwijderen.html`, `extension-patch/` en
`asteria-site/` stonden nog in de repo en `CLAUDE.md` verwees naar een
opdrachtbrief die hier niet staat.

**Scope.** Bestanden verwijderd; verwijzingen naar `03-DEMOKNOP.md` vervangen
door US-97 in `docs/BACKLOG.md` van Claudiclaude. Eventnamen ongewijzigd.

**Acceptatiecriteria.** `grep -rn "03-DEMOKNOP\|extension-patch\|asteria-site"`
buiten `.git` geeft niets.

**Afhankelijkheden.** Geen.

**Test.** De grep hierboven.

## AS-04 Demoknop zonder innerHTML (gebouwd)

**Waarom.** De toelichting onder de knop werd met `innerHTML` gezet. De strings
zijn vast, maar op een `role="status"`-element is dat de verkeerde gewoonte.

**Scope.** `textContent` en `createElement('b')` voor de ene melding met een
vet stuk.

**Acceptatiecriteria.** Geen `innerHTML` in `index.html`; alle vier de
meldingen tonen dezelfde tekst als voorheen.

**Afhankelijkheden.** Geen.

**Test.** `tools/check-overflow.mjs` controleert dat het script draait (knop
komt op `absent`). De foutmelding met `chrome://extensions` vet is alleen met
een niet-reagerende extensie te zien, zie AS-02 criterium 3.

## AS-05 Landmarks en kopvolgorde (gebouwd)

**Waarom.** Geen `<main>` op beide pagina's en acht `<h4>`'s in de
gereconstrueerde app-uitsnedes die van h2 naar h4 sprongen.

**Scope.** `<main>` om alles tussen navigatie en footer. De titels in de
`.ui-bar` zijn `<p class="ui-title">` geworden met dezelfde opmaak: ze zijn
chrome van een schermafdruk, geen documentstructuur.

**Acceptatiecriteria.** Beide pagina's hebben precies één `<main>`; de
kopvolgorde is h1 > h2 > h3 zonder sprongen.

**Afhankelijkheden.** Geen.

**Test.** `grep -oE '<h[1-6]' index.html` en lezen, of een
toegankelijkheidsboom in devtools.

## AS-06 Zichtbare focus (gebouwd)

**Waarom.** `index.html` had alleen op `.tab` een `focus-visible`-stijl,
`handleiding.html` had er geen.

**Scope.** Eén regel per pagina: knoppen, pills, tabs, wordmark, footerlinks,
de knoppen in de periode-rail en de outlook-controls; 2px `--accent-line`,
3px offset.

**Acceptatiecriteria.** Tabben door de pagina toont op elk bedienbaar
element een rand.

**Afhankelijkheden.** Geen.

**Test.** Tab door beide pagina's, in licht en donker.

## AS-07 Contrast van --text-3 in licht (gebouwd)

**Waarom.** `--text-3` staat op 11 tot 13,5px en haalde op surface-2
(`#EDEDE9`) maar 4,37:1.

**Scope.** Token in licht van `#6E6E69` naar `#66665F`: 4,93:1 op `#EDEDE9`,
5,25:1 op de pagina-achtergrond, 5,78:1 op wit. Donker ongewijzigd (4,62:1).

**Acceptatiecriteria.** Elke plek waar `--text-3` tekst kleurt haalt
minstens 4,5:1 op het vlak eronder.

**Afhankelijkheden.** Geen.

**Test.** Verhouding uitrekenen met de WCAG-formule; de waarden hierboven.

## AS-08 JSON-LD opgeschoond (gebouwd)

**Waarom.** `license` verwees naar een repo zonder LICENSE-bestand en
`author` was een `Person` met de naam van een site.

**Scope.** `license` weg, `author` is `Organization`, verouderd
versievoorbeeld in het commentaar bij de demoknop is een placeholder.

**Acceptatiecriteria.** De JSON-LD parset en bevat geen claim die de
broncode niet ondersteunt.

**Afhankelijkheden.** Komt er een LICENSE in Claudiclaude, dan mag `license`
terug met de juiste URL.

**Test.** Rich Results Test van Google of een JSON-LD-validator.

## AS-09 Overflow gemeten in plaats van verstopt (gebouwd)

**Waarom.** `body{overflow-x:hidden}` verborg elk te breed element in plaats
van het te repareren.

**Scope.** Regel weg op beide pagina's. `tools/check-overflow.mjs` meet in
headless Chromium op 320, 375, 768, 1024 en 1600px dat `scrollWidth` gelijk
is aan `innerWidth`, eist een lege console en controleert dat het script van
de demoknop heeft gedraaid.

**Acceptatiecriteria.** Het script geeft op beide pagina's en alle vijf
breedtes `ok`.

**Afhankelijkheden.** Een globale Playwright en een Chromium; zie het
commentaar bovenin het script.

**Test.** `node tools/check-overflow.mjs`.

## AS-10 Preload van het koplettertype (gebouwd)

**Waarom.** De zware kop staat boven de vouw; zonder preload wordt de font
pas na het parsen van de CSS aangevraagd.

**Scope.** Eén `<link rel="preload">` voor `fonts/archivo-900.woff2` op
`index.html`.

**Acceptatiecriteria.** Geen waarschuwing *preloaded but not used* in de
console; de kop rendert zonder zichtbare wissel.

**Afhankelijkheden.** Geen.

**Test.** Network-tab: de woff2 wordt als eerste na het document opgehaald.

## AS-11 Content-Security-Policy (gebouwd)

**Waarom.** De pagina laadt niets van buiten; dat mag ook afgedwongen worden.

**Scope.** Meta-CSP op beide pagina's: `default-src 'self'`, inline script en
stijl toegestaan, `img-src 'self' data:`, `font-src 'self'`,
`connect-src 'none'`, `base-uri 'none'`, `form-action 'none'`.

**Acceptatiecriteria.** Geen CSP-melding in de console bij laden; demoknop
draait.

**Afhankelijkheden.** Geen. Een toekomstig extern bestand moet hier eerst
langs.

**Test.** `tools/check-overflow.mjs` faalt op elke consolefout.

## AS-12 Issue bij een mislukte deploy (gebouwd)

**Waarom.** Een rode workflow staat alleen in het Actions-tabblad.

**Scope.** Job `melden` in `pages.yml`, alleen bij `failure()`, opent met `gh`
een issue *Deploy Pages mislukt* met de link naar de run; slaat over als er al
een open staat. `issues: write` toegevoegd.

**Acceptatiecriteria.** Een mislukte run levert precies één open issue op,
ook na drie mislukte runs achter elkaar.

**Afhankelijkheden.** AS-01, anders draait de workflow wel maar doet de
uitkomst er nog niet toe.

**Test.** Zet tijdelijk een fout in de build-step op een branch met
`workflow_dispatch` en kijk of het issue verschijnt en niet dubbel.

---

## AS-13 Actions op SHA pinnen

**Waarom.** `pages.yml` pint op tags (`actions/checkout@v4` enzovoort). Een tag
kan verplaatst worden; een SHA niet. Voor een workflow die met `id-token:
write` publiceert en met `issues: write` schrijft is dat het verschil tussen
weten wat er draait en hopen.

**Scope.** De vijf `uses:`-regels op de volledige commit-SHA zetten met de
tag als commentaar erachter. Dependabot voor `github-actions` aanzetten zodat
de SHA's bijgehouden worden.

**Acceptatiecriteria.**
1. Geen `uses:` meer met alleen een tag.
2. `.github/dependabot.yml` bestaat met een `github-actions`-ecosysteem.
3. De workflow draait nog groen.

**Afhankelijkheden.** AS-01 om criterium 3 te kunnen zien.

**Test.** `grep -n 'uses:' .github/workflows/pages.yml` toont alleen SHA's.

## AS-14 Overflowcheck als vaste stap

**Waarom.** Met `overflow-x:hidden` weg (AS-09) is de check in
`tools/check-overflow.mjs` het enige dat een te brede uitsnede tegenhoudt.
Nu draait hij alleen als iemand eraan denkt.

**Scope.** Kies één van twee: het script als stap in `pages.yml` (Playwright
installeren in CI, Chromium ophalen, faalt de build bij overflow of een
consolefout), of een regel in `CLAUDE.md` die hem verplicht maakt voor elke
push. De eerste is echt, de tweede is een afspraak.

**Acceptatiecriteria.** Een opzettelijk te breed element (bijvoorbeeld een
`.kpi .v` met `min-width:400px`) op een branch laat de check rood worden
voordat het online staat.

**Afhankelijkheden.** AS-01 als het in de workflow komt; AS-13 voor de
Playwright-action als die gebruikt wordt.

**Test.** Het acceptatiecriterium zelf.

---

Eerstvolgende vrije nummer: **AS-15**.

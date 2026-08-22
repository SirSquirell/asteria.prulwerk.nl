## De demoknop op asteria.prulwerk.nl werkt nu

De projectpagina had een knop die niets deed — er was geen kant aan de
extensie die reageerde. Die is er nu: een content script op
`https://asteria.prulwerk.nl/*` laat de pagina weten dat je Asteria
geïnstalleerd hebt, en een klik op de knop stuurt de extensie de demo
openen met gegenereerde cijfers, zonder je eigen rekening aan te raken.

**Actie nodig als je de extensie al geïnstalleerd had vóór deze versie:**
herlaad hem in `chrome://extensions` (het herlaad-icoontje op de
Asteria-kaart). Chrome geeft een unpacked extensie geen nieuwe hosts
totdat hij herladen is, dus zonder die stap blijft de knop op de site
zeggen dat hij niets vindt.

Geen nieuwe permissieprompt hierbij: de extensie is niet in de Chrome Web
Store en wordt unpacked geladen, dus er is geen review en geen prompt, maar
Chrome kent de nieuwe host wel pas toe na een herlaad.

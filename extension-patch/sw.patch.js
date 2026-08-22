// Toe te voegen aan de bestaande switch in de handle()-functie van src/sw.js
// (regel ~91-146 in commit 493313d), naast de bestaande `case 'openApp':`.
//
// Niet als een losse listener met een handmatige sendResponse, zoals de
// generieke snippet in de opdrachtbrief voorstelt: de bestaande handle()
// retourneert al gewoon data en laat de aanroeper in onMessage die
// vertalen naar { ok: true, data }, en die vorm past hier ook.
//
// De demo-trigger is geen TODO meer: wantsDemo() in src/ui/datasource.js
// leest ?demo= uit de URL, dus ?demo=1 is de echte, al bestaande weg naar
// demomodus. Geen tweede vlag, geen tweede waarheid.

    case 'open-demo': {
      const url = `${chrome.runtime.getURL('src/ui/app.html')}?demo=1`;

      // Hergebruik een al open tab van de options page in plaats van er
      // bij elke klik een nieuwe bij te maken.
      const existing = await chrome.tabs.query({
        url: `${chrome.runtime.getURL('src/ui/app.html')}*`,
      });

      if (existing.length) {
        await chrome.tabs.update(existing[0].id, { url, active: true });
        await chrome.windows.update(existing[0].windowId, { focused: true });
      } else {
        await chrome.tabs.create({ url });
      }
      return { opened: true };
    }

// De bestaande catch in de onMessage-listener (regel ~78-89) vangt een
// eventuele fout hier al af en stuurt { ok: false, ... } terug, precies
// wat site.js als "geen reactie" behandelt. Er is geen losse foutafhandeling
// nodig: de pagina heeft zelf al een timeout van 2500ms.

/* =========================================================
   COOKIE-KEUZE (variant: je GTM- en Contentsquare-scripts blijven staan)
   - Laat een banner zien met Accepteren / Weigeren en onthoudt de keuze
   - Weigeren: geeft de officiële opt-out door aan Contentsquare
   - Accepteren: geeft toestemming door aan Google (Consent Mode)
   Voeg dit toe op elke pagina, vlak voor </body>:
   <script src="cookie-consent-behouden.js"></script>
   Gebruik dezelfde cookie-banner.css als bij de andere versie.
========================================================= */
(function () {
    'use strict';
 
    var KEY = 'cookie-consent';
    var banner;
 
    function getConsent() {
        try { return localStorage.getItem(KEY); } catch (e) { return null; }
    }
    function saveConsent(value) {
        try { localStorage.setItem(KEY, value); } catch (e) { /* storage uit: negeren */ }
    }
 
    // Contentsquare: opt-out (zet een _cs_optout-cookie en stopt de meting)
    function contentsquareOptOut() {
        window._uxa = window._uxa || [];
        window._uxa.push(['optout']);
    }
 
    // Verwijdert de opt-out-cookie, voor wie later tóch accepteert
    function contentsquareRemoveOptOut() {
        document.cookie = '_cs_optout=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }
 
    // Google Consent Mode: werkt alleen voor Google-tags die ermee overweg kunnen
    // Vereist de gtag()-functie uit het standaardsnippet bovenin je <head>
  function googleConsent(state) {
    if (typeof window.gtag === 'function') {
        window.gtag('consent', 'update', {
            analytics_storage: state,
            ad_storage: 'denied',
            ad_user_data: 'denied',
            ad_personalization: 'denied'
        });
    }
}
 
    function apply(value) {
        if (value === 'accepted') {
            googleConsent('granted');
        } else if (value === 'rejected') {
            googleConsent('denied');
            contentsquareOptOut();
        }
    }
 
    function buildBanner() {
        banner = document.createElement('section');
        banner.className = 'cookie-banner';
        banner.setAttribute('role', 'region');
        banner.setAttribute('aria-labelledby', 'cookie-titel');
        banner.hidden = true;
        banner.innerHTML =
            '<div class="cookie-text">' +
                '<h2 id="cookie-titel">Cookies op deze website</h2>' +
                '<p>Ik gebruik cookies om te meten hoe mijn portfolio wordt gebruikt ' +
                '(Google Tag Manager en Contentsquare, inclusief sessie-opnames), zodat ik de website kan verbeteren. ' +
                'Lees meer in mijn <a href="privacy.html">privacyverklaring</a>.</p>' +
            '</div>' +
            '<div class="cookie-actions">' +
                '<button type="button" class="button" data-cookie="accept">Accepteren</button>' +
                '<button type="button" class="button" data-cookie="reject">Weigeren</button>' +
            '</div>';
        document.body.appendChild(banner);
 
        banner.addEventListener('click', function (e) {
            var btn = e.target.closest('[data-cookie]');
            if (!btn) return;
            choose(btn.getAttribute('data-cookie') === 'accept' ? 'accepted' : 'rejected');
        });
    }
 
    function choose(value) {
        var previous = getConsent();
        saveConsent(value);
        banner.hidden = true;
 
        if (value === 'accepted' && previous === 'rejected') {
            contentsquareRemoveOptOut();
            window.location.reload();   // zodat de meting weer normaal start
            return;
        }
        apply(value);
        if (value === 'rejected' && previous === 'accepted') {
            window.location.reload();   // zodat er niets meer meeloopt
        }
    }
 
    function init() {
        buildBanner();
 
        var saved = getConsent();
        if (saved === 'accepted' || saved === 'rejected') {
            apply(saved);
        } else {
            banner.hidden = false;
        }
 
        // Footerlink om de keuze later te wijzigen: <a href="#" data-cookie-settings>
        document.addEventListener('click', function (e) {
            var link = e.target.closest('[data-cookie-settings]');
            if (!link) return;
            e.preventDefault();
            banner.hidden = false;
        });
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
 
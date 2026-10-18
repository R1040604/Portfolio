(function () {
    'use strict';
 
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
    // Elementen die na elkaar (met een kleine vertraging) inschuiven
    var STAGGER = [
        'main .hero-content > *',
        'main .project-header__logo',
        'main .skills-grid > *',
        'main .process-cards > *',
        'main .projects-grid > *',
        'main .wireframe-gallery > *',
        'main .iteration-gallery > *',
        'main .gallery-two > *',
        'main .gallery-three > *',
        'main .gallery-four > *',
        'main .implementation-gallery > *',
        'main .side-image'
    ];
 
    // Elementen die gewoon naar boven inschuiven zodra ze in beeld komen
    var FADE_UP = [
        'main section > h1',
        'main section > h2',
        'main section > h3',
        'main section > p',
        'main section > ul',
        'main section > ol',
        'main section > img',
        'main section > a',
        'main .purple-block__inner > *',
        'main .text-column > *',
        'main .project-header__text > *',
        'main .projects-more'
        // Voeg hier zelf selectors toe, bijvoorbeeld: 'main .mijn-klasse'
    ];
 
    var targets = [];
 
    function mark(el, delay) {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
        targets.push(el);
    }
 
    function init() {
        // 1. Elementen met data-reveal="left" of "right" (en optioneel data-reveal-delay="150")
        document.querySelectorAll('[data-reveal]').forEach(function (el) {
            mark(el, parseInt(el.getAttribute('data-reveal-delay'), 10) || 0);
        });
 
        // 2. Rasters en kaarten, met een kleine vertraging per kaartje
        STAGGER.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el, i) {
                mark(el, Math.min(i * 90, 360));
            });
        });
 
        // 3. Gewone tekst en afbeeldingen
        FADE_UP.forEach(function (selector) {
            document.querySelectorAll(selector).forEach(function (el) {
                mark(el, 0);
            });
        });
 
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });
 
        targets.forEach(function (el) { observer.observe(el); });
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
 
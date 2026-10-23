(function () {
    'use strict';
 
    var container = document.querySelector('.page-decor--long');
    if (!container) return;
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
 
    var START = 900;          // vanaf waar de extra decoratie begint (px van boven)
    var STEP = 900;           // hoeveel px tussen twee blobs
    var MAX_SEGMENTS = 40;
 
    // Per stuk van 900px: vier blaadjes in de marges (grootte, draaiing, kant, % van de rand, afstand in px)
    var PETALS = [
        { s: 30, r: -25, side: 'left',  x: 3, dy: 120 },
        { s: 20, r: 30,  side: 'right', x: 4, dy: 330 },
        { s: 28, r: 20,  side: 'left',  x: 5, dy: 560 },
        { s: 18, r: -40, side: 'right', x: 3, dy: 760 }
    ];
 
    var observer = null;
    var timer = null;
    var lastHeight = 0;
 
    function make(className, css) {
        var el = document.createElement('span');
        el.className = className;
        el.setAttribute('data-generated', '');
        el.style.cssText = css;
        return el;
    }
 
    function clear() {
        if (observer) observer.disconnect();
        container.querySelectorAll('[data-generated]').forEach(function (el) {
            el.remove();
        });
    }
 
    function build() {
        clear();
 
        var height = container.offsetHeight;
        lastHeight = height;
 
        observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                // aan als het in beeld is, uit als het weg is: dus ook weer verdwijnen
                entry.target.classList.toggle('is-in', entry.isIntersecting);
            });
        }, { rootMargin: '-12% 0px -12% 0px', threshold: 0 });
 
        var count = 0;
        for (var y = START; y < height - 400 && count < MAX_SEGMENTS; y += STEP, count++) {
            var onLeft = count % 2 === 0;
 
            var blob = make(
                'hero-blob scroll-blob ' + (onLeft ? 'scroll-blob--pink' : 'scroll-blob--purple'),
                'top:' + (y - 120) + 'px;' + (onLeft ? 'left' : 'right') + ':-200px;'
            );
            container.appendChild(blob);
            observer.observe(blob);
 
            PETALS.forEach(function (p, i) {
                var petal = make(
                    'petal petal--scroll',
                    '--s:' + p.s + 'px;--r:' + p.r + 'deg;--d:-' + ((count + i) % 5) + 's;' +
                    'top:' + (y + p.dy) + 'px;' + p.side + ':' + p.x + '%;'
                );
                container.appendChild(petal);
                observer.observe(petal);
            });
        }
    }
 
    // Opnieuw bouwen als de pagina een stuk langer of korter wordt (bijvoorbeeld door lazy afbeeldingen)
    function schedule() {
        clearTimeout(timer);
        timer = setTimeout(function () {
            if (Math.abs(container.offsetHeight - lastHeight) > 300) build();
        }, 400);
    }
 
    build();
    window.addEventListener('load', build);
    window.addEventListener('resize', schedule);
    if ('ResizeObserver' in window) {
        new ResizeObserver(schedule).observe(document.body);
    }
})();
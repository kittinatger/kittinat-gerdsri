// Bootstraps every .fluid-word element with the Pixel Bulge effect
// instead of plain text — a pointer-follow lens bulges a pixel-grid
// rendering of the word. The real text node stays as the permanent
// fallback; the canvas only takes over once it has actually started
// drawing, so a slow load or Reduced Motion just leaves the plain text.
(function () {
  function reducedMotion() {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true'
    );
  }

  function setupOne(wrap) {
    if (!window.initPixelBulge) return;
    const textEl = wrap.querySelector('.fluid-word-text');
    const canvas = wrap.querySelector('.fluid-word-canvas');
    if (!textEl || !canvas) return;

    const rawOverride = wrap.getAttribute('data-fluid-text');
    const text = rawOverride ? rawOverride.replace(/\\n/g, ' ') : textEl.textContent;

    let cleanup = null;

    const start = () => {
      if (cleanup || reducedMotion()) return;
      const cs = getComputedStyle(textEl);
      cleanup = window.initPixelBulge(wrap, canvas, {
        text: text,
        font: {
          fontFamily: cs.fontFamily,
          fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle,
        },
        background: 'transparent',
        inkColor: cs.color,
        lineColor: 'transparent',
        scale: 100,
        cells: 90,
        bulge: 55,
        speed: 45,
        advanced: {
          wordWidth: 94,
          wordAspect: 30,
          hoverBoost: 18,
          pressPulse: 12,
        },
      });
      if (cleanup) wrap.classList.add('is-active');
    };

    const stop = () => {
      if (!cleanup) return;
      cleanup();
      cleanup = null;
      wrap.classList.remove('is-active');
    };

    const restart = () => { stop(); start(); };

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(restart, 200);
    });

    new MutationObserver(restart).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-text-size', 'data-reduced-motion'],
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.fluid-word').forEach(setupOne);
  });
})();

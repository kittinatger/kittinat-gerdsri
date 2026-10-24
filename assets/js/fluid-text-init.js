// Bootstraps every .fluid-word element on the page with the WebGL
// fluid-text effect from fluid-text.js. The real text node stays as the
// permanent fallback — a canvas only takes over once WebGL has actually
// initialized, so a slow load, no WebGL support, or Reduced Motion just
// leaves the plain text in place with no layout shift either way.
//
// A wrapper's text comes from its .fluid-word-text node by default; for
// multi-line text (where the fallback uses a <br>), set
// data-fluid-text="Line one\nLine two" on the wrapper instead — the
// backslash-n is unescaped to a real newline before it's handed to the
// WebGL text mask.
(function () {
  function reducedMotion() {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true'
    );
  }

  function setupOne(wrap) {
    if (!window.initFluidText) return;
    const textEl = wrap.querySelector('.fluid-word-text');
    const canvas = wrap.querySelector('.fluid-word-canvas');
    if (!textEl || !canvas) return;

    const rawOverride = wrap.getAttribute('data-fluid-text');
    const text = rawOverride ? rawOverride.replace(/\\n/g, '\n') : textEl.textContent;

    let cleanup = null;

    const start = () => {
      if (cleanup || reducedMotion()) return;
      const cs = getComputedStyle(textEl);
      cleanup = window.initFluidText(canvas, {
        text: text,
        font: {
          fontFamily: cs.fontFamily,
          fontWeight: cs.fontWeight,
          fontStyle: cs.fontStyle,
          fontSize: cs.fontSize,
          lineHeight: cs.lineHeight,
          letterSpacing: cs.letterSpacing,
          textAlign: 'center',
        },
        color: cs.color,
        splatRadius: 6,
        splatForce: 8,
        curl: 40,
        densityDissipation: 6,
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

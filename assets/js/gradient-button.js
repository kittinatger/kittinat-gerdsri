// Moving Gradient Button — ported from a React/Framer-Motion component
// (Originkit) to plain JS/CSS for a static site with no build step.
// Progressively enhances every .btn-primary: wraps its content so the
// rotating-border band and hover "cover" shimmer from style.css have
// something to sit behind, then drives one shared rotation angle for
// every enhanced button via a single CSS custom property, instead of a
// separate animation loop per button.
(function () {
  function reducedMotion() {
    return (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.getAttribute('data-reduced-motion') === 'true'
    );
  }

  function enhance() {
    document.querySelectorAll('.btn-primary:not(.gbtn)').forEach((btn) => {
      btn.classList.add('gbtn');

      const band = document.createElement('span');
      band.className = 'gbtn-band';
      band.setAttribute('aria-hidden', 'true');
      band.innerHTML =
        '<span class="gbtn-band-fill"></span><span class="gbtn-glow"></span><span class="gbtn-cover"></span>';
      btn.insertBefore(band, btn.firstChild);

      // Everything that isn't the band or an icon <svg> is the visible
      // label — wrap it in its own stacking-context span so it (and any
      // icon) sits above the band instead of being painted over by it.
      const toWrap = [...btn.childNodes].filter((node) => node !== band);
      if (toWrap.length) {
        const label = document.createElement('span');
        label.className = 'gbtn-label';
        toWrap.forEach((node) => label.appendChild(node));
        btn.appendChild(label);
      }
    });
  }

  function startLoop() {
    if (reducedMotion()) return null;
    let angle = 0;
    let last = 0;
    let raf = 0;
    const DEG_PER_SEC = 70;
    const tick = (t) => {
      if (!last) last = t;
      const dt = (t - last) / 1000;
      last = t;
      angle = (angle + DEG_PER_SEC * dt) % 360;
      document.documentElement.style.setProperty('--gbtn-angle', angle + 'deg');
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }

  document.addEventListener('DOMContentLoaded', () => {
    enhance();
    let stop = startLoop();
    new MutationObserver(() => {
      const shouldRun = !reducedMotion();
      if (shouldRun && !stop) stop = startLoop();
      if (!shouldRun && stop) { stop(); stop = null; }
    }).observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-reduced-motion'],
    });
  });
})();

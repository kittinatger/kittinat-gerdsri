// Arrow Reveal Button — ported from a React/Framer-Motion component
// (Originkit) to plain JS/CSS for a static site with no build step.
// Progressively enhances every .btn-outline: strips its trailing "→"
// text (the badge below supplies the arrow), adds a small circular
// badge that expands on hover to cover the whole pill, and a fixed-
// size arrow icon that sits on top without scaling with it.
(function () {
  const ARROW_SVG =
    '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

  function sizeFill(btn, fill) {
    const w = btn.offsetWidth;
    const h = btn.offsetHeight;
    if (!w || !h) return;
    const badgeSize = fill.offsetWidth || 26;
    const rect = fill.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2 - btnRect.left;
    const cy = rect.top + rect.height / 2 - btnRect.top;
    const far = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(w - cx, cy),
      Math.hypot(cx, h - cy),
      Math.hypot(w - cx, h - cy)
    );
    const coverD = Math.ceil(2 * far * 1.02);
    btn.style.setProperty('--arb-scale', String(coverD / badgeSize));
  }

  function enhance() {
    document.querySelectorAll('.btn-outline:not(.arb)').forEach((btn) => {
      btn.classList.add('arb');

      // Pull the trailing " →" (or any arrow-ish glyph) off the visible
      // label — the badge/icon below replaces it, so keeping both would
      // show two arrows.
      const cleanedText = btn.textContent.replace(/\s*(→|->|⟶)\s*$/, '').trim();
      btn.textContent = '';

      const label = document.createElement('span');
      label.className = 'arb-label';
      label.textContent = cleanedText;

      const fill = document.createElement('span');
      fill.className = 'arb-fill';
      fill.setAttribute('aria-hidden', 'true');

      const arrow = document.createElement('span');
      arrow.className = 'arb-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.innerHTML = ARROW_SVG;

      btn.appendChild(label);
      btn.appendChild(fill);
      btn.appendChild(arrow);

      const resize = () => sizeFill(btn, fill);
      resize();
      new ResizeObserver(resize).observe(btn);
    });
  }

  document.addEventListener('DOMContentLoaded', enhance);
})();

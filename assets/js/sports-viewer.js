/* Sports page photo viewer.
   Replaces the site-wide lightbox on sports.html only: it catches clicks on
   any .gallery figure in the capture phase (before main.js sees them), so
   the shared lightbox never opens here. */
(function () {
  var CHEV_L = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path></svg>';
  var CHEV_R = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path></svg>';
  var X = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path></svg>';
  var LEVELS = { champion: 'Champion', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

  function tr(text) {
    var lang;
    try { lang = localStorage.getItem('portfolio-language') || 'en'; } catch (e) { lang = 'en'; }
    if (lang === 'en' || !text) return text;
    var d = window.PORTFOLIO_TRANSLATIONS && window.PORTFOLIO_TRANSLATIONS[lang];
    return (d && d[text]) || text;
  }

  var root = document.createElement('div');
  root.className = 'sv';
  root.hidden = true;
  root.setAttribute('role', 'dialog');
  root.setAttribute('aria-modal', 'true');
  root.setAttribute('aria-label', 'Photo viewer');
  root.innerHTML =
    '<div class="sv-bg"><img alt="" aria-hidden="true"></div>' +
    '<header class="sv-top">' +
      '<span class="sv-ctx"></span>' +
      '<span class="sv-count"><b></b><i>/</i><span></span></span>' +
      '<button class="sv-close" type="button" aria-label="Close">' + X + '</button>' +
    '</header>' +
    '<div class="sv-stage"><img class="sv-img" alt="" draggable="false"></div>' +
    '<button class="sv-nav sv-prev" type="button" aria-label="Previous photo">' + CHEV_L + '</button>' +
    '<button class="sv-nav sv-next" type="button" aria-label="Next photo">' + CHEV_R + '</button>' +
    '<footer class="sv-bottom">' +
      '<div class="sv-cap"><span class="sv-tag" hidden></span><span class="sv-title"></span><span class="sv-year"></span></div>' +
      '<div class="sv-thumbs"></div>' +
    '</footer>';
  document.body.appendChild(root);

  var bg = root.querySelector('.sv-bg img');
  var stage = root.querySelector('.sv-stage');
  var img = root.querySelector('.sv-img');
  var ctx = root.querySelector('.sv-ctx');
  var cb = root.querySelector('.sv-count b');
  var cn = root.querySelector('.sv-count span');
  var tag = root.querySelector('.sv-tag');
  var title = root.querySelector('.sv-title');
  var year = root.querySelector('.sv-year');
  var thumbs = root.querySelector('.sv-thumbs');
  var prevBtn = root.querySelector('.sv-prev');
  var nextBtn = root.querySelector('.sv-next');
  var closeBtn = root.querySelector('.sv-close');

  var group = [], cur = 0, lastFocus = null;
  var scale = 1, tx = 0, ty = 0;

  function applyZoom() {
    img.style.transform = scale === 1 ? '' : 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')';
    root.classList.toggle('is-zoomed', scale > 1);
  }
  function resetZoom() { scale = 1; tx = 0; ty = 0; applyZoom(); }

  function contextLabel(el) {
    var sport = el.closest('.sp-sport');
    var h = sport ? sport.querySelector('.sp-sport-head h3') : null;
    var panel = el.closest('.gl-panel');
    var opp = panel ? panel.querySelector('.gl-panel-opp') : null;
    if (!h) { var sec = el.closest('section'); h = sec ? sec.querySelector('h2') : null; }
    var a = h ? h.textContent.trim() : '';
    var tabbed = panel ? document.getElementById(panel.getAttribute('aria-labelledby')) : null;
    var tb = tabbed ? tabbed.querySelector('b') : null;
    var b = tb ? (tabbed.querySelector('.gl-tab-vs') ? tr('vs') + ' ' : '') + tb.textContent : '';
    return [a, b || (opp ? opp.textContent.trim() : '')].filter(Boolean).join('  ·  ');
  }

  function buildThumbs() {
    thumbs.innerHTML = '';
    group.forEach(function (g, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'sv-thumb';
      b.setAttribute('aria-label', (i + 1) + ' / ' + group.length);
      var t = document.createElement('img');
      t.src = g.src;
      t.alt = '';
      t.loading = 'lazy';
      b.appendChild(t);
      b.addEventListener('click', function () { show(i); });
      thumbs.appendChild(b);
    });
    thumbs.hidden = group.length < 2;
  }

  function preload(i) {
    var g = group[(i + group.length) % group.length];
    if (g) { var p = new Image(); p.src = g.dataset.full || g.src; }
  }

  function show(i, instant) {
    if (!group.length) return;
    var dir = i > cur ? 1 : -1;
    cur = (i + group.length) % group.length;
    var g = group[cur];
    var fig = g.closest('figure');
    var url = g.dataset.full || g.src;
    resetZoom();
    img.classList.remove('is-in');
    img.style.setProperty('--dir', dir);
    img.alt = g.alt || '';
    img.onload = function () { img.classList.add('is-in'); };
    img.src = url;
    if (img.complete) img.classList.add('is-in');
    bg.src = url;
    cb.textContent = (cur < 9 ? '0' : '') + (cur + 1);
    cn.textContent = group.length;
    var level = fig && fig.dataset.award;
    if (level && LEVELS[level]) {
      tag.hidden = false;
      tag.className = 'sv-tag sv-tag-' + level;
      tag.textContent = tr(LEVELS[level]);
    } else { tag.hidden = true; }
    title.textContent = tr((fig && fig.dataset.caption) || g.alt || '');
    year.textContent = (fig && fig.dataset.year) || '';
    year.hidden = !year.textContent;
    var multi = group.length > 1;
    prevBtn.hidden = nextBtn.hidden = !multi;
    [].forEach.call(thumbs.children, function (b, k) {
      b.classList.toggle('is-current', k === cur);
      if (k === cur) {
        b.setAttribute('aria-current', 'true');
        thumbs.scrollTo({ left: b.offsetLeft - (thumbs.clientWidth - b.offsetWidth) / 2, behavior: instant ? 'auto' : 'smooth' });
      } else b.removeAttribute('aria-current');
    });
    preload(cur + 1);
    preload(cur - 1);
  }

  function open(el) {
    var gallery = el.closest('.gallery');
    var target = el.tagName === 'IMG' ? el : el.querySelector('img');
    if (!gallery || !target) return;
    group = [].slice.call(gallery.querySelectorAll('figure img'));
    cur = group.indexOf(target);
    ctx.textContent = contextLabel(gallery);
    buildThumbs();
    lastFocus = document.activeElement;
    root.hidden = false;
    document.documentElement.style.overflow = 'hidden';
    requestAnimationFrame(function () { root.classList.add('is-open'); });
    show(cur, true);
    closeBtn.focus({ preventScroll: true });
  }

  function close() {
    root.classList.remove('is-open');
    resetZoom();
    document.documentElement.style.overflow = '';
    setTimeout(function () { if (!root.classList.contains('is-open')) { root.hidden = true; img.removeAttribute('src'); } }, 260);
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  // Capture: runs before main.js's own image listeners, then swallows the click.
  document.addEventListener('click', function (e) {
    if (root.contains(e.target)) return;
    var fig = e.target.closest && e.target.closest('.gallery figure');
    if (!fig) return;
    e.stopPropagation();
    e.preventDefault();
    open(fig);
  }, true);

  closeBtn.addEventListener('click', close);
  prevBtn.addEventListener('click', function () { show(cur - 1); });
  nextBtn.addEventListener('click', function () { show(cur + 1); });
  stage.addEventListener('click', function (e) { if (e.target === stage && scale === 1) close(); });

  document.addEventListener('keydown', function (e) {
    if (root.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft' && scale === 1) show(cur - 1);
    else if (e.key === 'ArrowRight' && scale === 1) show(cur + 1);
    else if (e.key === 'Home') show(0);
    else if (e.key === 'End') show(group.length - 1);
    else if (e.key === 'Tab') {
      var f = [].slice.call(root.querySelectorAll('button:not([hidden])')).filter(function (b) { return !b.closest('[hidden]'); });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Zoom: double-click / double-tap toggles, drag pans, wheel zooms.
  img.addEventListener('dblclick', function () {
    if (scale > 1) resetZoom(); else { scale = 2.4; tx = 0; ty = 0; applyZoom(); }
  });
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    scale = Math.min(5, Math.max(1, scale * (e.deltaY < 0 ? 1.15 : 0.87)));
    if (scale === 1) { tx = 0; ty = 0; }
    applyZoom();
  }, { passive: false });

  var drag = null, lastTap = 0, sx = 0, sy = 0, swiping = false;
  img.addEventListener('pointerdown', function (e) {
    if (scale > 1 && e.pointerType !== 'touch') {
      drag = { x: e.clientX - tx, y: e.clientY - ty };
      img.setPointerCapture(e.pointerId);
      root.classList.add('is-dragging');
    }
  });
  img.addEventListener('pointermove', function (e) {
    if (!drag) return;
    tx = e.clientX - drag.x; ty = e.clientY - drag.y; applyZoom();
  });
  function endDrag() { drag = null; root.classList.remove('is-dragging'); }
  img.addEventListener('pointerup', endDrag);
  img.addEventListener('pointercancel', endDrag);

  stage.addEventListener('touchstart', function (e) {
    if (e.touches.length !== 1) { swiping = false; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY; swiping = true;
  }, { passive: true });
  stage.addEventListener('touchend', function (e) {
    if (!swiping) return;
    swiping = false;
    var t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
    var now = Date.now();
    if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      if (now - lastTap < 300) { if (scale > 1) resetZoom(); else { scale = 2.4; applyZoom(); } lastTap = 0; }
      else lastTap = now;
      return;
    }
    if (scale > 1) return;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(cur + (dx < 0 ? 1 : -1));
    else if (dy > 90 && Math.abs(dy) > Math.abs(dx)) close();
  });
})();

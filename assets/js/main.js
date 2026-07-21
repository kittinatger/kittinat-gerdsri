document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const isMobileNav = () => window.matchMedia('(max-width: 720px)').matches;

  // Floating panels need to live outside the header once open: the header
  // already has its own backdrop-filter, and a backdrop-filter nested
  // inside another backdrop-filter doesn't reliably blur the real page
  // behind it (renders as a near-flat tint instead of true glass). Moving
  // the panel to <body> with position:fixed while open makes its blur
  // apply for real, matching the header's own glass effect.
  function makeFloating(panel, computePosition) {
    const anchor = document.createComment('floating-panel-anchor');
    let placed = false;
    function reposition() { if (placed) computePosition(panel); }
    function place() {
      if (placed || !panel.parentNode) return;
      panel.parentNode.insertBefore(anchor, panel);
      document.body.appendChild(panel);
      panel.style.position = 'fixed';
      panel.style.transform = 'none';
      placed = true;
      reposition();
      window.addEventListener('scroll', reposition, { passive: true });
      window.addEventListener('resize', reposition);
    }
    function remove() {
      if (!placed) return;
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
      anchor.parentNode.insertBefore(panel, anchor);
      anchor.remove();
      panel.style.position = '';
      panel.style.top = '';
      panel.style.left = '';
      panel.style.right = '';
      panel.style.transform = '';
      placed = false;
    }
    return { place, remove };
  }

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav && header) {
    const floatingNav = makeFloating(nav, (el) => {
      const r = header.getBoundingClientRect();
      el.style.top = (r.bottom + 10) + 'px';
      el.style.left = r.left + 'px';
      el.style.right = (window.innerWidth - r.right) + 'px';
    });
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) floatingNav.place(); else floatingNav.remove();
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        floatingNav.remove();
      });
    });
  }

  // Work dropdown in the nav
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown) {
    const dropToggle = dropdown.querySelector('.nav-dropdown-toggle');
    const menu = dropdown.querySelector('.nav-dropdown-menu');
    const floatingMenu = menu ? makeFloating(menu, (el) => {
      const r = dropToggle.getBoundingClientRect();
      const width = el.offsetWidth || 220;
      const center = r.left + r.width / 2;
      el.style.top = (r.bottom + 14) + 'px';
      el.style.left = Math.max(8, Math.min(center - width / 2, window.innerWidth - width - 8)) + 'px';
    }) : null;

    dropToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      dropToggle.setAttribute('aria-expanded', String(open));
      // On mobile the dropdown is a plain inline sub-list inside the
      // already-floating mobile panel — only float it separately on
      // desktop, where it's its own translucent popup.
      if (floatingMenu && !isMobileNav()) {
        if (menu) menu.classList.toggle('is-open', open);
        if (open) floatingMenu.place(); else floatingMenu.remove();
      }
    });
    const closeDropdown = () => {
      dropdown.classList.remove('is-open');
      dropToggle.setAttribute('aria-expanded', 'false');
      if (menu) menu.classList.remove('is-open');
      if (floatingMenu) floatingMenu.remove();
    };
    document.addEventListener('click', (e) => {
      const insideDropdown = dropdown.contains(e.target);
      const insideMenu = menu && menu.contains(e.target);
      if (!insideDropdown && !insideMenu) closeDropdown();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDropdown(); });
  }

  // Lightbox for gallery images
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    document.querySelectorAll('.gallery figure img').forEach(img => {
      img.addEventListener('click', () => {
        lightboxImg.src = img.dataset.full || img.src;
        lightboxImg.alt = img.alt;
        lightbox.classList.add('is-open');
      });
    });
    const closeLightbox = () => lightbox.classList.remove('is-open');
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });
  }
});

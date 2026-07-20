document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => nav.classList.remove('is-open'));
    });
  }

  // Work dropdown in the nav
  const dropdown = document.querySelector('.nav-dropdown');
  if (dropdown) {
    const dropToggle = dropdown.querySelector('.nav-dropdown-toggle');
    dropToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = dropdown.classList.toggle('is-open');
      dropToggle.setAttribute('aria-expanded', String(open));
    });
    const closeDropdown = () => {
      dropdown.classList.remove('is-open');
      dropToggle.setAttribute('aria-expanded', 'false');
    };
    document.addEventListener('click', (e) => { if (!dropdown.contains(e.target)) closeDropdown(); });
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

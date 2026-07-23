document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('.site-header');
  const isMobileNav = () => window.matchMedia('(max-width: 720px)').matches;
  // Mobile nav and the settings popup are both full-width floating panels
  // there, so only one can be open at a time — each block below fills in
  // its real close function once it initializes.
  let closeMobileNav = () => {};
  let closeSettingsPanel = () => {};

  // Language selector. Translation text is deliberately kept in this file so
  // it remains part of the website and can be edited without a third-party
  // account or service.
  const translations = {
    en: {
      'Home': 'Home', 'Work': 'Work', 'Contact': 'Contact',
      'Core Discipline': 'Core Discipline', 'Graphics / Drawing': 'Graphics / Drawing',
      'Sports': 'Sports', 'AI / Coding': 'AI / Coding',
      '3D Design / Animation': '3D Design / Animation', 'Teamwork': 'Teamwork',
      'Robotics': 'Robotics', 'Photography': 'Photography', 'Music': 'Music',
      'Navigation': 'Navigation', 'Legal': 'Legal', 'Privacy Policy': 'Privacy Policy',
      'Terms & Support': 'Terms & Support', 'Language': 'Language', 'Theme': 'Theme'
    },
    th: {
      'Home': 'หน้าแรก', 'Work': 'ผลงาน', 'Contact': 'ติดต่อ',
      'Core Discipline': 'ทักษะหลัก', 'Graphics / Drawing': 'กราฟิก / วาดภาพ',
      'Sports': 'กีฬา', 'AI / Coding': 'AI / การเขียนโค้ด',
      '3D Design / Animation': 'การออกแบบ 3 มิติ / แอนิเมชัน', 'Teamwork': 'การทำงานเป็นทีม',
      'Robotics': 'หุ่นยนต์', 'Photography': 'การถ่ายภาพ', 'Music': 'ดนตรี',
      'Navigation': 'เมนูนำทาง', 'Legal': 'ข้อมูลทางกฎหมาย', 'Privacy Policy': 'นโยบายความเป็นส่วนตัว',
      'Terms & Support': 'ข้อกำหนดและการสนับสนุน', 'Language': 'ภาษา', 'Theme': 'ธีม'
    },
    'zh-CN': {
      'Home': '首页', 'Work': '作品', 'Contact': '联系',
      'Core Discipline': '核心学科', 'Graphics / Drawing': '平面设计 / 绘画',
      'Sports': '体育', 'AI / Coding': '人工智能 / 编程',
      '3D Design / Animation': '3D 设计 / 动画', 'Teamwork': '团队合作',
      'Robotics': '机器人', 'Photography': '摄影', 'Music': '音乐',
      'Navigation': '导航', 'Legal': '法律信息', 'Privacy Policy': '隐私政策',
      'Terms & Support': '条款与支持', 'Language': '语言', 'Theme': '主题'
    }
  };

  const languageNames = {
    en: 'English (Original)', th: 'Thai', 'zh-CN': 'Mandarin (Mainland)'
  };
  const selectedLanguage = localStorage.getItem('portfolio-language') || 'en';

  function translateTextNodes(language, suppliedDictionary) {
    const dictionary = suppliedDictionary || translations[language] || translations.en;
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim() || node.parentElement.closest('script, style, .language-options')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(node => {
      const original = node.nodeValue.trim();
      if (dictionary[original]) {
        node.nodeValue = node.nodeValue.replace(original, dictionary[original]);
      }
    });
  }

  document.documentElement.lang = selectedLanguage;
  translateTextNodes(selectedLanguage);
  if (selectedLanguage !== 'en') {
    const savedTranslations = window.PORTFOLIO_TRANSLATIONS;
    if (savedTranslations?.[selectedLanguage]) {
      translateTextNodes(selectedLanguage, savedTranslations[selectedLanguage]);
    }
  }

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
      el.style.top = (r.bottom + 18) + 'px';
      el.style.left = r.left + 'px';
      el.style.right = (window.innerWidth - r.right) + 'px';
    });
    closeMobileNav = () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      floatingNav.remove();
    };
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      if (open) { closeSettingsPanel(); floatingNav.place(); } else floatingNav.remove();
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
      el.style.top = (r.bottom + 22) + 'px';
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

  // Settings popup — combines the language picker and the dark-mode toggle
  // behind one button, so the header only shows a single control on the
  // right. Built as the same floating glass panel as the "Work" dropdown
  // (button + floating menu), not native form controls. It sits directly
  // in the header (not inside .main-nav), so it floats at every width,
  // including mobile.
  const headerWrap = header?.querySelector('.wrap');
  const navToggle = headerWrap?.querySelector('.nav-toggle');
  if (navToggle) {
    const navRight = navToggle.parentNode;
    const settingsLabel = translations[selectedLanguage] || translations.en;

    const settings = document.createElement('div');
    settings.className = 'settings';
    settings.innerHTML =
      '<button class="settings-toggle" type="button" aria-expanded="false" aria-haspopup="true" aria-label="Settings">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">' +
          '<line x1="4" y1="6" x2="20" y2="6"></line><circle cx="9" cy="6" r="2"></circle>' +
          '<line x1="4" y1="12" x2="20" y2="12"></line><circle cx="15" cy="12" r="2"></circle>' +
          '<line x1="4" y1="18" x2="20" y2="18"></line><circle cx="9" cy="18" r="2"></circle>' +
        '</svg>' +
      '</button>' +
      '<div class="settings-panel nav-dropdown-menu">' +
        '<div class="settings-section">' +
          `<p class="settings-label">${settingsLabel['Language']}</p>` +
          '<div class="language-options">' +
          Object.entries(languageNames).map(([code, name]) =>
            `<a href="#" data-lang="${code}"${code === selectedLanguage ? ' aria-current="true"' : ''}>${name}</a>`
          ).join('') +
          '</div>' +
        '</div>' +
        '<div class="settings-section settings-section-row">' +
          `<p class="settings-label">${settingsLabel['Theme']}</p>` +
          '<button class="theme-toggle" type="button" aria-label="Toggle dark mode">' +
            '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
              '<circle cx="12" cy="12" r="4.2"></circle>' +
              '<path d="M12 2.5v2.4M12 19.1v2.4M4.4 4.4l1.7 1.7M17.9 17.9l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.4 19.6l1.7-1.7M17.9 6.1l1.7-1.7"></path>' +
            '</svg>' +
            '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">' +
              '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z"></path>' +
            '</svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    navRight.insertBefore(settings, navToggle);

    const settingsToggle = settings.querySelector('.settings-toggle');
    const settingsPanel = settings.querySelector('.settings-panel');
    const floatingSettingsPanel = makeFloating(settingsPanel, (el) => {
      if (isMobileNav()) {
        // Match the mobile main-nav panel: a full-width card under the header.
        const r = header.getBoundingClientRect();
        el.style.top = (r.bottom + 18) + 'px';
        el.style.left = r.left + 'px';
        el.style.right = (window.innerWidth - r.right) + 'px';
        return;
      }
      const r = settingsToggle.getBoundingClientRect();
      const width = el.offsetWidth || 224;
      const center = r.left + r.width / 2;
      el.style.top = (r.bottom + 22) + 'px';
      el.style.left = Math.max(8, Math.min(center - width / 2, window.innerWidth - width - 8)) + 'px';
      el.style.right = '';
    });
    const closeSettings = () => {
      settings.classList.remove('is-open');
      settingsToggle.setAttribute('aria-expanded', 'false');
      settingsPanel.classList.remove('is-open');
      floatingSettingsPanel.remove();
    };
    closeSettingsPanel = closeSettings;
    settingsToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = settings.classList.toggle('is-open');
      settingsToggle.setAttribute('aria-expanded', String(open));
      settingsPanel.classList.toggle('is-open', open);
      if (open) { closeMobileNav(); floatingSettingsPanel.place(); } else floatingSettingsPanel.remove();
    });
    settingsPanel.querySelectorAll('.language-options a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem('portfolio-language', link.dataset.lang);
        window.location.reload();
      });
    });
    // Dark mode toggle. The theme itself is decided by the inline script in
    // <head> (runs before first paint, so there's no flash of the wrong
    // theme) — this button just flips <html data-theme> and remembers it.
    settingsPanel.querySelector('.theme-toggle').addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('portfolio-theme', next);
    });
    document.addEventListener('click', (e) => {
      const insideToggle = settings.contains(e.target);
      const insidePanel = settingsPanel.contains(e.target);
      if (!insideToggle && !insidePanel) closeSettings();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSettings(); });
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

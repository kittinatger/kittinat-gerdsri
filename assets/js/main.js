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
      'Terms & Support': 'Terms & Support', 'Settings': 'Settings', 'Language': 'Language', 'Theme': 'Theme',
      'Text Size': 'Text Size', 'Beta': 'Beta', 'Reduced Motion': 'Reduced Motion',
      'Enable Zoom': 'Enable Zoom', 'Enable Select/Drag': 'Enable Select/Drag',
      'Sticky Navbar': 'Sticky Navbar',
      'Pull to refresh': 'Pull to refresh', 'Release to refresh': 'Release to refresh', 'Refreshing…': 'Refreshing…',
      'Changing these may cause unexpected results.': 'Changing these may cause unexpected results.',
      'Translated by AI — changing the language may cause unexpected results.': 'Translated by AI — changing the language may cause unexpected results.'
    },
    th: {
      'Home': 'หน้าแรก', 'Work': 'ผลงาน', 'Contact': 'ติดต่อ',
      'Core Discipline': 'ทักษะหลัก', 'Graphics / Drawing': 'กราฟิก / วาดภาพ',
      'Sports': 'กีฬา', 'AI / Coding': 'AI / การเขียนโค้ด',
      '3D Design / Animation': 'การออกแบบ 3 มิติ / แอนิเมชัน', 'Teamwork': 'การทำงานเป็นทีม',
      'Robotics': 'หุ่นยนต์', 'Photography': 'การถ่ายภาพ', 'Music': 'ดนตรี',
      'Navigation': 'เมนูนำทาง', 'Legal': 'ข้อมูลทางกฎหมาย', 'Privacy Policy': 'นโยบายความเป็นส่วนตัว',
      'Terms & Support': 'ข้อกำหนดและการสนับสนุน', 'Settings': 'การตั้งค่า', 'Language': 'ภาษา', 'Theme': 'ธีม',
      'Text Size': 'ขนาดตัวอักษร', 'Beta': 'เบต้า', 'Reduced Motion': 'ลดการเคลื่อนไหว',
      'Enable Zoom': 'เปิดใช้งานการซูม', 'Enable Select/Drag': 'เปิดใช้งานการเลือก/ลากข้อความ',
      'Sticky Navbar': 'แถบนำทางแบบติดขอบจอ',
      'Pull to refresh': 'ดึงเพื่อรีเฟรช', 'Release to refresh': 'ปล่อยเพื่อรีเฟรช', 'Refreshing…': 'กำลังรีเฟรช…',
      'Changing these may cause unexpected results.': 'การเปลี่ยนแปลงนี้อาจทำให้เกิดผลลัพธ์ที่ไม่คาดคิด',
      'Translated by AI — changing the language may cause unexpected results.': 'แปลโดย AI — การเปลี่ยนภาษาอาจทำให้เกิดผลลัพธ์ที่ไม่คาดคิด'
    },
    'zh-CN': {
      'Home': '首页', 'Work': '作品', 'Contact': '联系',
      'Core Discipline': '核心学科', 'Graphics / Drawing': '平面设计 / 绘画',
      'Sports': '体育', 'AI / Coding': '人工智能 / 编程',
      '3D Design / Animation': '3D 设计 / 动画', 'Teamwork': '团队合作',
      'Robotics': '机器人', 'Photography': '摄影', 'Music': '音乐',
      'Navigation': '导航', 'Legal': '法律信息', 'Privacy Policy': '隐私政策',
      'Terms & Support': '条款与支持', 'Settings': '设置', 'Language': '语言', 'Theme': '主题',
      'Text Size': '文字大小', 'Beta': '测试版', 'Reduced Motion': '减少动态效果',
      'Enable Zoom': '启用缩放', 'Enable Select/Drag': '启用选择/拖动',
      'Sticky Navbar': '固定导航栏',
      'Pull to refresh': '下拉以刷新', 'Release to refresh': '松开以刷新', 'Refreshing…': '正在刷新…',
      'Changing these may cause unexpected results.': '更改这些设置可能会导致意外结果。',
      'Translated by AI — changing the language may cause unexpected results.': '由 AI 翻译——更改语言可能会导致意外结果。'
    }
  };

  const languageNames = {
    en: 'English (Original)', th: 'Thai', 'zh-CN': 'Mandarin (Mainland)'
  };
  // Short pill labels for the settings panel's language switcher.
  const langShort = { en: 'EN', th: 'ไทย', 'zh-CN': '中' };
  const selectedLanguage = localStorage.getItem('portfolio-language') || 'en';
  // For text built in JS after the load-time translation pass above.
  const tr = (text) => {
    if (selectedLanguage === 'en' || !text) return text;
    return window.PORTFOLIO_TRANSLATIONS?.[selectedLanguage]?.[text] || translations[selectedLanguage]?.[text] || text;
  };

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
  function makeFloating(panel, computePosition, toggleEl) {
    const anchor = document.createComment('floating-panel-anchor');
    let placed = false;
    function reposition() { if (placed) computePosition(panel); }
    function place() {
      if (placed || !panel.parentNode) return;
      panel.parentNode.insertBefore(anchor, panel);
      document.body.appendChild(panel);
      panel.style.position = 'fixed';
      // The panel's own CSS composes `transform` from a --panel-base-transform
      // custom property (its resting-position offset, e.g. translateX(-50%))
      // and --panel-anim-transform (the open/close animation). Floating no
      // longer needs the base offset since computePosition sets an absolute
      // left/top — clearing the custom property (not `transform` itself)
      // keeps the animation half intact.
      panel.style.setProperty('--panel-base-transform', 'none');
      placed = true;
      reposition();
      window.addEventListener('scroll', reposition, { passive: true });
      window.addEventListener('resize', reposition);
      // Reparenting to <body> moves the panel to the end of the document,
      // away from its toggle button's position in tab order — a keyboard
      // user pressing Tab after opening it would otherwise skip straight
      // past it into the rest of the page. Move focus in to compensate.
      const focusable = panel.querySelector('a, button, input, [tabindex]');
      if (focusable) focusable.focus();
    }
    function remove() {
      if (!placed) return;
      window.removeEventListener('scroll', reposition);
      window.removeEventListener('resize', reposition);
      const hadFocus = panel.contains(document.activeElement);
      anchor.parentNode.insertBefore(panel, anchor);
      anchor.remove();
      panel.style.position = '';
      panel.style.top = '';
      panel.style.left = '';
      panel.style.right = '';
      panel.style.width = '';
      panel.style.removeProperty('--panel-base-transform');
      placed = false;
      // Send focus back to the toggle rather than letting it fall off onto
      // whatever the panel happened to leave behind in the document.
      if (hadFocus && toggleEl) toggleEl.focus();
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
      el.style.width = r.width + 'px';
      el.style.right = '';
    }, toggle);
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
      link.addEventListener('click', () => closeMobileNav());
    });
    document.addEventListener('click', (e) => {
      const insideToggle = toggle.contains(e.target);
      const insideNav = nav.contains(e.target);
      if (!insideToggle && !insideNav) closeMobileNav();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMobileNav(); });
    // The floating panel's CSS (background, opacity/visibility, the
    // --panel-anim-transform animation) only exists inside the
    // max-width:720px media query, so if the viewport crosses back above it
    // while the panel is open — resizing, rotating a tablet — it'd be left
    // showing as an unstyled fragment. Close it on that transition instead.
    const mobileNavQuery = window.matchMedia('(max-width: 720px)');
    const handleMobileNavQueryChange = (e) => { if (!e.matches) closeMobileNav(); };
    if (mobileNavQuery.addEventListener) mobileNavQuery.addEventListener('change', handleMobileNavQueryChange);
    else mobileNavQuery.addListener(handleMobileNavQueryChange);
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
    }, dropToggle) : null;

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
        '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">' +
          '<path d="M216,130.16q.06-2.16,0-4.32l14.92-18.64a8,8,0,0,0,1.48-7.06,107.6,107.6,0,0,0-10.88-26.25,8,8,0,0,0-6-3.93l-23.72-2.64q-1.48-1.56-3-3L186,40.54a8,8,0,0,0-3.94-6,107.29,107.29,0,0,0-26.25-10.86,8,8,0,0,0-7.06,1.48L130.16,40Q128,40,125.84,40L107.2,25.11a8,8,0,0,0-7.06-1.48A107.6,107.6,0,0,0,73.89,34.51a8,8,0,0,0-3.93,6L67.32,64.27q-1.56,1.49-3,3L40.54,70a8,8,0,0,0-6,3.94,107.71,107.71,0,0,0-10.87,26.25,8,8,0,0,0,1.49,7.06L40,125.84Q40,128,40,130.16L25.11,148.8a8,8,0,0,0-1.48,7.06,107.6,107.6,0,0,0,10.88,26.25,8,8,0,0,0,6,3.93l23.72,2.64q1.49,1.56,3,3L70,215.46a8,8,0,0,0,3.94,6,107.71,107.71,0,0,0,26.25,10.87,8,8,0,0,0,7.06-1.49L125.84,216q2.16.06,4.32,0l18.64,14.92a8,8,0,0,0,7.06,1.48,107.21,107.21,0,0,0,26.25-10.88,8,8,0,0,0,3.93-6l2.64-23.72q1.56-1.48,3-3L215.46,186a8,8,0,0,0,6-3.94,107.71,107.71,0,0,0,10.87-26.25,8,8,0,0,0-1.49-7.06ZM128,168a40,40,0,1,1,40-40A40,40,0,0,1,128,168Z"></path>' +
        '</svg>' +
      '</button>' +
      '<div class="settings-panel nav-dropdown-menu settings-panel-v2">' +
        `<p class="settings-title">${settingsLabel['Settings']}</p>` +
        '<div class="settings-lang-block">' +
          `<p class="settings-label">${settingsLabel['Language']}</p>` +
          '<div class="language-options settings-lang-pills">' +
          Object.entries(languageNames).map(([code, name]) =>
            `<a href="#" data-lang="${code}"${code === selectedLanguage ? ' aria-current="true"' : ''} aria-label="${name}">${langShort[code] || code}</a>`
          ).join('') +
          '</div>' +
          `<p class="settings-warning">${settingsLabel['Translated by AI — changing the language may cause unexpected results.']}</p>` +
        '</div>' +
        '<div class="settings-tiles">' +
          '<button class="settings-tile theme-toggle" type="button" aria-label="Toggle dark mode">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 256 256" fill="currentColor" class="icon-sun" aria-hidden="true"><path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm8,24a64,64,0,1,0,64,64A64.07,64.07,0,0,0,128,64ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"></path></svg>' +
              '<svg viewBox="0 0 256 256" fill="currentColor" class="icon-moon" aria-hidden="true"><path d="M235.54,150.21a104.84,104.84,0,0,1-37,52.91A104,104,0,0,1,32,120,103.09,103.09,0,0,1,52.88,57.48a104.84,104.84,0,0,1,52.91-37,8,8,0,0,1,10,10,88.08,88.08,0,0,0,109.8,109.8,8,8,0,0,1,10,10Z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Theme']}</span>` +
          '</button>' +
          '<button class="settings-tile sticky-navbar-toggle" type="button" role="switch" aria-checked="true" aria-label="Toggle sticky navigation bar">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40Zm0,16V88H40V56Z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Sticky Navbar']}</span>` +
          '</button>' +
          '<button class="settings-tile zoom-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle pinch-to-zoom">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M229.66,218.34,179.6,168.28a88.21,88.21,0,1,0-11.32,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM144,120H120v24a8,8,0,0,1-16,0V120H80a8,8,0,0,1,0-16h24V80a8,8,0,0,1,16,0v24h24a8,8,0,0,1,0,16Z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Enable Zoom']}</span>` +
          '</button>' +
          '<button class="settings-tile select-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle text selection and image dragging">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M220.49,207.8,207.8,220.49a12,12,0,0,1-17,0l-56.57-56.57L115,214.08l-.13.33A15.84,15.84,0,0,1,100.26,224l-.78,0a15.82,15.82,0,0,1-14.41-11L32.8,52.92A15.95,15.95,0,0,1,52.92,32.8L213,85.07a16,16,0,0,1,1.41,29.8l-.33.13-50.16,19.27,56.57,56.56A12,12,0,0,1,220.49,207.8Z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Enable Select/Drag']}</span>` +
          '</button>' +
        '</div>' +
        `<p class="settings-warning settings-foot-warning">${settingsLabel['Changing these may cause unexpected results.']}</p>` +
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
      // Right-align the panel's edge with the toggle's edge rather than
      // centering it under the toggle. The panel got much wider in the v2
      // tile redesign, and the toggle sits near the right edge of the
      // header — centering a wide panel under a right-side anchor made it
      // bleed far past the left edge of the viewport and over the hero
      // content. Anchoring from the right (like a standard dropdown) keeps
      // it tucked under the gear icon regardless of panel width.
      const r = settingsToggle.getBoundingClientRect();
      const width = el.offsetWidth || 224;
      const left = Math.max(8, Math.min(r.right - width, window.innerWidth - width - 8));
      el.style.top = (r.bottom + 22) + 'px';
      el.style.left = left + 'px';
      el.style.right = '';
    }, settingsToggle);
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
    // Sticky Navbar — off by default (the header is position:static in
    // style.css). Turning this on sets data-sticky-navbar on <html>, which a
    // CSS override switches the header back to position:sticky.
    const stickyNavbarToggle = settingsPanel.querySelector('.sticky-navbar-toggle');
    if (stickyNavbarToggle) {
      const initialSticky = localStorage.getItem('portfolio-sticky-navbar') !== 'false';
      stickyNavbarToggle.setAttribute('aria-checked', String(initialSticky));
      if (initialSticky) document.documentElement.setAttribute('data-sticky-navbar', 'true');
      stickyNavbarToggle.addEventListener('click', () => {
        const next = stickyNavbarToggle.getAttribute('aria-checked') !== 'true';
        stickyNavbarToggle.setAttribute('aria-checked', String(next));
        if (next) document.documentElement.setAttribute('data-sticky-navbar', 'true');
        else document.documentElement.removeAttribute('data-sticky-navbar');
        localStorage.setItem('portfolio-sticky-navbar', String(next));
      });
    }
    // Enable Zoom — off by default (the viewport meta tag in <head> ships
    // with user-scalable=no). Turning this on relaxes that same meta tag at
    // runtime; turning it off restores the no-zoom content string.
    const zoomToggle = settingsPanel.querySelector('.zoom-toggle');
    if (zoomToggle) {
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const initialZoom = localStorage.getItem('portfolio-allow-zoom') === 'true';
      zoomToggle.setAttribute('aria-checked', String(initialZoom));
      if (initialZoom && viewportMeta) viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1');
      zoomToggle.addEventListener('click', () => {
        const next = zoomToggle.getAttribute('aria-checked') !== 'true';
        zoomToggle.setAttribute('aria-checked', String(next));
        localStorage.setItem('portfolio-allow-zoom', String(next));
        if (viewportMeta) {
          viewportMeta.setAttribute('content', next
            ? 'width=device-width, initial-scale=1'
            : 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
        }
      });
    }
    // Enable Select/Drag — off by default (see the html, body user-select:
    // none rule in style.css). Turning this on sets data-allow-select on
    // <html>, which a CSS override in style.css switches back to selectable.
    const selectToggle = settingsPanel.querySelector('.select-toggle');
    if (selectToggle) {
      const initialSelect = localStorage.getItem('portfolio-allow-select') === 'true';
      selectToggle.setAttribute('aria-checked', String(initialSelect));
      if (initialSelect) document.documentElement.setAttribute('data-allow-select', 'true');
      selectToggle.addEventListener('click', () => {
        const next = selectToggle.getAttribute('aria-checked') !== 'true';
        selectToggle.setAttribute('aria-checked', String(next));
        if (next) document.documentElement.setAttribute('data-allow-select', 'true');
        else document.documentElement.removeAttribute('data-allow-select');
        localStorage.setItem('portfolio-allow-select', String(next));
      });
    }
    // Text size (beta) and Reduced Motion are disabled for now (their
    // settings-section markup above is removed), but the wiring below is
    // kept intact — guarded by these element-existence checks — so both
    // can be re-enabled later just by restoring their HTML blocks above.
    // Text size, a 4-step slider. Same flash-free pattern as the
    // theme toggle — the inline script in <head> applies a saved step
    // before first paint — this just moves <html data-text-size> and
    // remembers it.
    const textSizeSteps = ['S', 'M', 'L', 'XL'];
    const textSizeRange = settingsPanel.querySelector('.text-size-range');
    const textSizeValue = settingsPanel.querySelector('.text-size-value');
    const applyTextSizeUI = (step) => {
      const pct = (step / (textSizeSteps.length - 1)) * 100;
      textSizeRange.style.background =
        `linear-gradient(to right, var(--navy) ${pct}%, var(--line) ${pct}%)`;
      textSizeValue.style.left = pct + '%';
      textSizeValue.textContent = textSizeSteps[step];
    };
    if (textSizeRange) {
      const initialTextSizeStep = Number(document.documentElement.getAttribute('data-text-size')) || 0;
      textSizeRange.value = String(initialTextSizeStep);
      applyTextSizeUI(initialTextSizeStep);
      textSizeRange.addEventListener('input', () => {
        const step = Number(textSizeRange.value);
        applyTextSizeUI(step);
        if (step === 0) document.documentElement.removeAttribute('data-text-size');
        else document.documentElement.setAttribute('data-text-size', String(step));
        localStorage.setItem('portfolio-text-size', String(step));
      });
    }
    // Reduced motion. Kills transitions/animations site-wide via the CSS
    // attribute selector, and separately tells the browser to skip the
    // cross-page view transition (see the inline <head> script, which does
    // the same thing pre-paint so it's already correct on load).
    const motionToggle = settingsPanel.querySelector('.motion-toggle');
    const applyViewTransitionOverride = (reduced) => {
      let styleTag = document.getElementById('vt-override');
      if (reduced && !styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'vt-override';
        styleTag.textContent = '@view-transition{navigation:none;}';
        document.head.appendChild(styleTag);
      } else if (!reduced && styleTag) {
        styleTag.remove();
      }
    };
    if (motionToggle) {
      const initialReducedMotion = document.documentElement.getAttribute('data-reduced-motion') === 'true';
      motionToggle.setAttribute('aria-checked', String(initialReducedMotion));
      motionToggle.addEventListener('click', () => {
        const next = motionToggle.getAttribute('aria-checked') !== 'true';
        motionToggle.setAttribute('aria-checked', String(next));
        if (next) document.documentElement.setAttribute('data-reduced-motion', 'true');
        else document.documentElement.removeAttribute('data-reduced-motion');
        localStorage.setItem('portfolio-reduced-motion', String(next));
        applyViewTransitionOverride(next);
      });
    }
    document.addEventListener('click', (e) => {
      const insideToggle = settings.contains(e.target);
      const insidePanel = settingsPanel.contains(e.target);
      if (!insideToggle && !insidePanel) closeSettings();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSettings(); });
  }

  // Sort-by-date toggle for certificate galleries (core-discipline page).
  // Figures carry a data-date attribute; the "coming soon" placeholder (no
  // data-date) is newer than everything else, so it leads under "Newest
  // first" and trails under "Oldest first".
  document.querySelectorAll('.gallery-heading').forEach(heading => {
    const sortToggle = heading.querySelector('.sort-toggle:not(.cert-filter-toggle)');
    const gallery = heading.nextElementSibling;
    if (!sortToggle || !gallery || !gallery.classList.contains('gallery')) return;
    const comingSoon = gallery.querySelector('figure.coming-soon');
    const applySort = (order) => {
      const figures = [...gallery.querySelectorAll('figure[data-date]')];
      figures.sort((a, b) => order === 'desc'
        ? b.dataset.date.localeCompare(a.dataset.date)
        : a.dataset.date.localeCompare(b.dataset.date));
      if (comingSoon && order === 'desc') gallery.appendChild(comingSoon);
      figures.forEach(fig => gallery.appendChild(fig));
      if (comingSoon && order === 'asc') gallery.appendChild(comingSoon);
    };
    applySort('desc');
    sortToggle.addEventListener('click', () => {
      const next = sortToggle.dataset.order === 'desc' ? 'asc' : 'desc';
      sortToggle.dataset.order = next;
      applySort(next);
    });
  });

  // Same toggle for the Sports lockers: sorts whole lockers by the date on
  // their front figure. Ties (several lockers share a year) keep their
  // original order so the toggle only moves what's genuinely newer/older.
  // Empty "spare" lockers fill whatever slots the last row would otherwise
  // leave open, so the bank always reads as a full cabinet. They're rebuilt
  // from scratch on every call (and on resize, when the column count
  // changes), so adding or removing a real locker just works.
  const fillLockerRow = (row) => {
    row.querySelectorAll(':scope > .locker-empty').forEach(el => el.remove());
    const cols = getComputedStyle(row).gridTemplateColumns.split(' ').filter(Boolean).length;
    const count = row.querySelectorAll(':scope > .locker:not(.locker-empty)').length;
    const missing = cols > 1 ? (cols - (count % cols)) % cols : 0;
    for (let i = 0; i < missing; i++) {
      const spare = document.createElement('div');
      spare.className = 'locker locker-empty';
      spare.setAttribute('aria-hidden', 'true');
      spare.innerHTML = '<div class="locker-inner"><div class="locker-face locker-front"><span class="locker-handle"></span></div><span class="locker-padlock"><svg viewBox="0 0 24 30" aria-hidden="true"><path class="padlock-shackle" d="M6.5 13V9.5a5.5 5.5 0 0 1 11 0V13" fill="none" stroke-width="2.4" stroke-linecap="round"></path><rect class="padlock-body" x="3" y="13" width="18" height="14.5" rx="3.2"></rect><circle class="padlock-hole" cx="12" cy="19.2" r="2"></circle><rect class="padlock-hole" x="11.1" y="19.6" width="1.8" height="4.2" rx="0.9"></rect></svg></span><span class="locker-graffiti">' + tr('Coming Soon') + '</span></div>';
      row.appendChild(spare);
    }
    return cols;
  };
  document.querySelectorAll('.locker-row').forEach(row => {
    let lastCols = fillLockerRow(row);
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        const cols = getComputedStyle(row).gridTemplateColumns.split(' ').filter(Boolean).length;
        if (cols !== lastCols) lastCols = fillLockerRow(row);
      }).observe(row);
    }
  });
  document.querySelectorAll('.locker-row').forEach(row => {
    const sortToggle = row.closest('.wrap')?.querySelector('.gallery-heading .sort-toggle');
    if (!sortToggle) return;
    const lockers = [...row.querySelectorAll(':scope > .locker:not(.locker-empty)')];
    const original = new Map(lockers.map((l, i) => [l, i]));
    const dateOf = l => l.querySelector('figure[data-date]')?.dataset.date || '';
    const applySort = (order) => {
      [...lockers].sort((a, b) => {
        const byDate = dateOf(a).localeCompare(dateOf(b));
        return byDate !== 0 ? (order === 'desc' ? -byDate : byDate) : original.get(a) - original.get(b);
      }).forEach(l => row.appendChild(l));
      fillLockerRow(row);
    };
    applySort('desc');
    sortToggle.addEventListener('click', () => {
      const next = sortToggle.dataset.order === 'desc' ? 'asc' : 'desc';
      sortToggle.dataset.order = next;
      applySort(next);
    });
  });

  // Filter certificate galleries by award level. Each .cert-filter dropdown
  // drives only the .gallery in its own section (the next sibling of the
  // .gallery-heading it lives in) — a page like Core Discipline has one
  // per subject (Mathematics, English, Chinese, Sciences), and each filters
  // independently. Filtering only toggles visibility (via
  // .is-filtered-out), so it doesn't disturb the sort toggle beside it,
  // which reorders the same figures. Built as the same floating glass-panel
  // dropdown as the "Work" nav menu and the settings popup (button +
  // makeFloating menu).
  // Award-level badges on Core Discipline certificate thumbnails, read
  // straight off the same data-award attribute the filter below uses.
  const awardBadgeLabels = { champion: 'Champion', gold: 'Gold', silver: 'Silver', bronze: 'Bronze', merit: 'Merit', pass: 'Passed', participate: 'Participant', attend: 'Attended' };
  document.querySelectorAll('.page-core-discipline .gallery figure[data-award]').forEach(figure => {
    const level = figure.dataset.award;
    const label = figure.dataset.awardLabel || awardBadgeLabels[level];
    if (!label) return;
    const badge = document.createElement('span');
    badge.className = `award-badge award-badge-${level}`;
    badge.textContent = tr(label);
    figure.appendChild(badge);
  });

  // Locker row (Sports Awards): the only thing that flips the locker is a
  // single shared flip button sitting below the card (outside the 3D
  // rotation, so it never flips itself) — so the trophy/cert image is
  // free to behave like every other gallery image (click opens the
  // lightbox). Enter/Space on the flip button do the same as a click.
  document.querySelectorAll('.locker:not(.locker-empty)').forEach(locker => {
    const front = locker.querySelector('.locker-front');
    const back = locker.querySelector('.locker-back');
    if (front) {
      const handle = document.createElement('span');
      handle.className = 'locker-handle';
      handle.setAttribute('aria-hidden', 'true');
      front.appendChild(handle);
      const lock = document.createElement('span');
      lock.className = 'locker-lock';
      lock.setAttribute('aria-hidden', 'true');
      front.appendChild(lock);
    }
    // iOS Safari's backface-visibility/preserve-3d support is unreliable
    // even with -webkit- prefixes — it can render both faces stacked
    // instead of hiding the one facing away. Belt-and-braces: explicitly
    // hide the inactive face with visibility, timed to the midpoint of
    // the flip so it still reads as a rotation rather than a hard cut.
    if (back) back.classList.add('is-facing-away');
    let flipTimer = null;
    const flipBtn = document.createElement('button');
    flipBtn.type = 'button';
    flipBtn.className = 'locker-flip';
    flipBtn.setAttribute('aria-expanded', 'false');
    flipBtn.setAttribute('aria-label', tr('Flip locker'));
    flipBtn.innerHTML = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1-5.66-13.66l17-17-10.55-9.65-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60l10.93,10L226.34,50.3A8,8,0,0,1,240,56Z"></path></svg><span>' + tr('Flip') + '</span>';
    flipBtn.addEventListener('click', () => {
      const opening = locker.classList.toggle('is-open');
      flipBtn.setAttribute('aria-expanded', String(opening));
      clearTimeout(flipTimer);
      flipTimer = setTimeout(() => {
        if (front) front.classList.toggle('is-facing-away', opening);
        if (back) back.classList.toggle('is-facing-away', !opening);
      }, 350);
    });
    locker.appendChild(flipBtn);
  });

  const awardedLevels = new Set(['champion', 'gold', 'silver', 'bronze', 'merit', 'pass', 'grade']);
  // Each toggle below stops its click from bubbling to document (so opening
  // one doesn't immediately trigger its own outside-click close). On a page
  // with several filters — Core Discipline has one per subject — that also
  // means opening filter B's menu never reaches filter A's own outside-click
  // listener, leaving A open underneath B. Instances are tracked here so
  // opening any one explicitly closes the rest, and outside-click/Escape are
  // each bound once for all of them instead of once per filter.
  const certFilterInstances = [];
  document.querySelectorAll('.cert-filter').forEach(certFilter => {
    const filterToggle = certFilter.querySelector('.cert-filter-toggle');
    const filterLabel = filterToggle.querySelector('.cert-filter-label');
    const filterMenu = certFilter.querySelector('.cert-filter-menu');
    const gallery = certFilter.closest('.gallery-heading')?.nextElementSibling;
    if (!gallery || !gallery.classList.contains('gallery')) return;
    // "Participated" and "Attended" are different things, so each gets its own
    // option — shown only when this section actually has a matching item.
    const matchesFilter = (filter, award) => filter === 'all'
      || (filter === 'awarded' && awardedLevels.has(award))
      || award === filter;
    const hasAny = (filter) => [...gallery.querySelectorAll('figure[data-date]')].some(fig => matchesFilter(filter, fig.dataset.award));
    [['participate', 'Participated'], ['attend', 'Attended']].forEach(([value, label]) => {
      if (filterMenu.querySelector(`[data-filter="${value}"]`) || !hasAny(value)) return;
      const opt = document.createElement('button');
      opt.type = 'button';
      opt.className = 'cert-filter-option';
      opt.dataset.filter = value;
      opt.textContent = tr(label);
      filterMenu.appendChild(opt);
    });
    filterMenu.querySelectorAll('.cert-filter-option').forEach(opt => {
      if (opt.dataset.filter !== 'all' && !hasAny(opt.dataset.filter)) opt.remove();
    });
    const filterOptions = [...filterMenu.querySelectorAll('.cert-filter-option')];
    const floatingFilterMenu = makeFloating(filterMenu, (el) => {
      const r = filterToggle.getBoundingClientRect();
      const width = el.offsetWidth || 200;
      el.style.top = (r.bottom + 8) + 'px';
      el.style.left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) + 'px';
    }, filterToggle);
    const applyFilter = (filter) => {
      gallery.querySelectorAll('figure[data-date]').forEach(fig => {
        fig.classList.toggle('is-filtered-out', !matchesFilter(filter, fig.dataset.award));
      });
    };
    const closeFilterMenu = () => {
      certFilter.classList.remove('is-open');
      filterToggle.setAttribute('aria-expanded', 'false');
      filterMenu.classList.remove('is-open');
      floatingFilterMenu.remove();
    };
    filterToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !certFilter.classList.contains('is-open');
      certFilterInstances.forEach(inst => { if (inst.certFilter !== certFilter) inst.closeFilterMenu(); });
      certFilter.classList.toggle('is-open', open);
      filterToggle.setAttribute('aria-expanded', String(open));
      filterMenu.classList.toggle('is-open', open);
      if (open) floatingFilterMenu.place(); else floatingFilterMenu.remove();
    });
    filterOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        filterOptions.forEach(o => o.classList.toggle('is-active', o === opt));
        filterLabel.textContent = opt.textContent;
        applyFilter(opt.dataset.filter);
        closeFilterMenu();
      });
    });
    certFilterInstances.push({ certFilter, filterMenu, closeFilterMenu });
  });
  if (certFilterInstances.length) {
    document.addEventListener('click', (e) => {
      certFilterInstances.forEach(({ certFilter, filterMenu, closeFilterMenu }) => {
        const insideToggle = certFilter.contains(e.target);
        const insideMenu = filterMenu.contains(e.target);
        if (!insideToggle && !insideMenu) closeFilterMenu();
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') certFilterInstances.forEach(inst => inst.closeFilterMenu());
    });
  }

  // Lightbox for gallery images. Clicking an image opens it within the
  // context of its own .gallery — prev/next (buttons, arrow keys, or a
  // touch swipe) step through that gallery's currently visible images, so
  // a cert-filter's hidden figures are skipped and navigation never jumps
  // into a different section's gallery.
  const lightbox = document.querySelector('.lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    let currentGroup = [];
    let currentIndex = -1;

    // On Core Discipline, show each thumbnail's badge and caption below the
    // image in the lightbox too, built from the same alt text/data-date —
    // as a plain caption in flow, not an overlay on top of the cert.
    let lightboxCaption = null;
    let lightboxBadgePill = null;
    if (document.body.classList.contains('page-core-discipline')) {
      lightboxCaption = document.createElement('div');
      lightboxCaption.className = 'lightbox-caption';
      lightboxCaption.hidden = true;
      lightbox.appendChild(lightboxCaption);

      // On mobile only (see CSS), the award tag moves out of the caption
      // and into this pill, centered in the gap between the bottom-row
      // prev/next arrows — same color treatment as the grid's badges.
      lightboxBadgePill = document.createElement('span');
      lightboxBadgePill.className = 'lightbox-badge-pill';
      lightboxBadgePill.hidden = true;
      lightbox.appendChild(lightboxBadgePill);
    }

    // Zoom + pan. zoomScale 1 = fit (default); up to maxZoom. Pan is in
    // screen px, loosely clamped so the image can't be dragged entirely
    // off-frame. Applied as an inline transform that overrides the plain
    // CSS scale(1)/scale(0.94) open/close rule once zoomed.
    const maxZoom = 4;
    let zoomScale = 1;
    let panX = 0;
    let panY = 0;

    const clampPan = () => {
      const rect = lightboxImg.getBoundingClientRect();
      const baseW = rect.width / zoomScale;
      const baseH = rect.height / zoomScale;
      const maxX = Math.max(0, (baseW * zoomScale - baseW) / 2);
      const maxY = Math.max(0, (baseH * zoomScale - baseH) / 2);
      panX = Math.min(maxX, Math.max(-maxX, panX));
      panY = Math.min(maxY, Math.max(-maxY, panY));
    };
    const applyZoom = (withTransition) => {
      lightboxImg.style.transition = withTransition ? 'transform 0.2s ease' : 'none';
      lightboxImg.style.transform = zoomScale === 1 ? '' : `translate(${panX}px, ${panY}px) scale(${zoomScale})`;
      lightboxImg.classList.toggle('is-zoomed', zoomScale > 1);
    };
    const resetZoom = () => { zoomScale = 1; panX = 0; panY = 0; applyZoom(false); };
    const setZoom = (next, withTransition) => {
      zoomScale = Math.min(maxZoom, Math.max(1, next));
      if (zoomScale === 1) { panX = 0; panY = 0; }
      clampPan();
      applyZoom(withTransition);
    };

    const showImage = (index) => {
      if (!currentGroup.length) return;
      currentIndex = (index + currentGroup.length) % currentGroup.length;
      const img = currentGroup[currentIndex];
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
      resetZoom();
      if (lightboxCaption) {
        const figure = img.closest('figure[data-date], figure[data-caption]');
        if (figure) {
          const date = new Date((figure.dataset.date || '') + 'T00:00:00');
          const dateLabel = figure.dataset.year || (Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
          const level = figure.dataset.award;
          const tagLabel = level && tr(figure.dataset.awardLabel || awardBadgeLabels[level]);
          lightboxCaption.innerHTML = '';
          if (tagLabel) {
            const tag = document.createElement('span');
            tag.className = `lightbox-caption-tag tag-${level}`;
            tag.textContent = tagLabel;
            lightboxCaption.appendChild(tag);
          }
          const title = document.createElement('span');
          title.className = 'lightbox-caption-title';
          title.textContent = tr(figure.dataset.caption || img.alt);
          lightboxCaption.appendChild(title);
          if (dateLabel) {
            const dateEl = document.createElement('span');
            dateEl.className = 'lightbox-caption-date';
            dateEl.textContent = dateLabel;
            lightboxCaption.appendChild(dateEl);
          }
          lightboxCaption.hidden = false;
          if (lightboxBadgePill) {
            if (tagLabel) {
              lightboxBadgePill.className = `lightbox-badge-pill award-badge-${level}`;
              lightboxBadgePill.textContent = tagLabel;
              lightboxBadgePill.hidden = false;
            } else {
              lightboxBadgePill.hidden = true;
            }
          }
        } else {
          lightboxCaption.hidden = true;
          if (lightboxBadgePill) lightboxBadgePill.hidden = true;
        }
      }
    };
    // Direction-aware slide + fade between images, instead of a hard cut.
    // The old image/caption animate out, then showImage() swaps content
    // while it's invisible off to one side, then animates back in from
    // there — all on the same elements, so no second <img> is needed.
    let navAnimating = false;
    const animateNav = (direction) => {
      if (navAnimating || currentGroup.length < 2) { showImage(currentIndex + direction); return; }
      navAnimating = true;
      const exitX = direction === 1 ? -28 : 28;
      const enterX = direction === 1 ? 28 : -28;
      const els = lightboxCaption ? [lightboxImg, lightboxCaption] : [lightboxImg];
      els.forEach(el => {
        el.style.transition = 'opacity 0.16s ease, transform 0.16s ease';
        el.style.opacity = '0';
        el.style.transform = `translateX(${exitX}px)`;
      });
      setTimeout(() => {
        showImage(currentIndex + direction);
        els.forEach(el => {
          el.style.transition = 'none';
          el.style.transform = `translateX(${enterX}px)`;
        });
        void lightboxImg.offsetWidth;
        els.forEach(el => {
          el.style.transition = 'opacity 0.24s cubic-bezier(0.22, 1, 0.36, 1), transform 0.24s cubic-bezier(0.22, 1, 0.36, 1)';
          el.style.opacity = '1';
          el.style.transform = 'translateX(0)';
        });
        setTimeout(() => {
          els.forEach(el => { el.style.transition = ''; el.style.opacity = ''; el.style.transform = ''; });
          navAnimating = false;
        }, 240);
      }, 160);
    };
    const showPrev = () => animateNav(-1);
    const showNext = () => animateNav(1);

    const openImageInLightbox = (gallery, img) => {
      currentGroup = [...gallery.querySelectorAll('figure:not(.is-filtered-out) img')];
      if (gallery.classList.contains('gallery-masonry')) {
        currentGroup.sort((a, b) => (Number(a.closest('figure').dataset.order) || 0) - (Number(b.closest('figure').dataset.order) || 0));
      }
      const hasMultiple = currentGroup.length > 1;
      if (prevBtn) prevBtn.hidden = !hasMultiple;
      if (nextBtn) nextBtn.hidden = !hasMultiple;
      showImage(currentGroup.indexOf(img));
      lightbox.classList.add('is-open');
    };

    document.querySelectorAll('.gallery').forEach(gallery => {
      [...gallery.querySelectorAll('figure img')].forEach(img => {
        img.addEventListener('click', () => openImageInLightbox(gallery, img));
      });
    });

    const closeLightbox = () => { lightbox.classList.remove('is-open'); resetZoom(); };
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft' && zoomScale === 1) showPrev();
      else if (e.key === 'ArrowRight' && zoomScale === 1) showNext();
    });

    // Desktop: double-click toggles zoom, mouse wheel zooms continuously,
    // and dragging pans once zoomed.
    lightboxImg.addEventListener('dblclick', (e) => {
      e.stopPropagation();
      setZoom(zoomScale > 1 ? 1 : 2.5, true);
    });
    lightbox.addEventListener('wheel', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      e.preventDefault();
      setZoom(zoomScale - e.deltaY * 0.0025, false);
    }, { passive: false });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let panStartX = 0;
    let panStartY = 0;
    lightboxImg.addEventListener('mousedown', (e) => {
      if (zoomScale === 1) return;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      panStartX = panX;
      panStartY = panY;
      e.preventDefault();
    });
    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      panX = panStartX + (e.clientX - dragStartX);
      panY = panStartY + (e.clientY - dragStartY);
      clampPan();
      applyZoom(false);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch: pinch-to-zoom with two fingers; a single-finger drag pans
    // while zoomed in, or steps to the next/previous image (swipe) at the
    // default 1x fit, same threshold-based swipe as before.
    let touchStartX = 0;
    let touchStartY = 0;
    let pinchStartDist = 0;
    let pinchStartScale = 1;
    const touchDist = (touches) => Math.hypot(touches[0].clientX - touches[1].clientX, touches[0].clientY - touches[1].clientY);

    lightbox.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        pinchStartDist = touchDist(e.touches);
        pinchStartScale = zoomScale;
      } else if (e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        panStartX = panX;
        panStartY = panY;
      }
    }, { passive: true });
    lightbox.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const scale = pinchStartScale * (touchDist(e.touches) / pinchStartDist);
        setZoom(scale, false);
      } else if (e.touches.length === 1 && zoomScale > 1) {
        e.preventDefault();
        panX = panStartX + (e.touches[0].clientX - touchStartX);
        panY = panStartY + (e.touches[0].clientY - touchStartY);
        clampPan();
        applyZoom(false);
      }
    }, { passive: false });
    lightbox.addEventListener('touchend', (e) => {
      if (zoomScale > 1 || e.touches.length > 0) return;
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) showNext(); else showPrev();
      }
    }, { passive: true });
  }

  // Photography masonry wall. Photos are dealt into the shortest column in
  // reading order (so left-to-right, top-to-bottom roughly matches the
  // lightbox order), and any column that ends short gets a strip of film
  // rolled out to fill the leftover space. Rebuilt when the column count or
  // width changes. Also: a live "N frames" count beside the heading, and
  // each frame fades up (lightly staggered) as it scrolls into view.
  document.querySelectorAll('.gallery-masonry').forEach(gal => {
    const figs = [...gal.querySelectorAll('figure')];
    figs.forEach((fig, i) => {
      fig.dataset.order = String(i);
      fig.dataset.frame = String(i + 1).padStart(2, '0');
    });

    const heading = gal.closest('.wrap')?.querySelector('.gallery-heading');
    if (heading && !heading.querySelector('.gallery-count')) {
      const meta = document.createElement('div');
      meta.className = 'gallery-heading-controls';
      const count = document.createElement('span');
      count.className = 'gallery-count';
      count.textContent = figs.length + ' ' + tr(figs.length === 1 ? 'frame' : 'frames');
      meta.appendChild(count);
      heading.appendChild(meta);
    }

    let builtFor = '';
    const buildWall = () => {
      const style = getComputedStyle(gal);
      const cols = parseInt(style.getPropertyValue('--cols'), 10) || 3;
      const gap = parseFloat(style.getPropertyValue('--mgap')) || 16;
      const width = gal.clientWidth;
      const key = cols + ':' + Math.round(width);
      if (!width || key === builtFor) return;
      builtFor = key;

      gal.querySelectorAll('.film-roll').forEach(el => el.remove());
      figs.forEach(fig => gal.appendChild(fig));
      gal.querySelectorAll('.masonry-col').forEach(el => el.remove());

      const colWidth = (width - gap * (cols - 1)) / cols;
      const columns = [];
      for (let c = 0; c < cols; c++) {
        const col = document.createElement('div');
        col.className = 'masonry-col';
        gal.appendChild(col);
        columns.push({ el: col, height: 0, count: 0 });
      }
      figs.forEach(fig => {
        const img = fig.querySelector('img');
        const ratio = (img && img.naturalWidth && img.naturalHeight) ? img.naturalWidth / img.naturalHeight : 0.75;
        const target = columns.reduce((a, b) => (b.height < a.height ? b : a));
        target.height += (target.count ? gap : 0) + colWidth / ratio;
        target.count += 1;
        target.el.appendChild(fig);
      });
      gal.classList.add('is-built');

      // Use the real laid-out heights (borders, rounding) rather than the
      // estimates used for dealing, so the strips end flush with the tallest.
      const actual = columns.map(c => c.el.getBoundingClientRect().height);
      const tallest = Math.max(...actual);
      columns.forEach((col, i) => {
        const room = tallest - actual[i] - gap;
        if (room < 70) return;
        const roll = document.createElement('div');
        roll.className = 'film-roll';
        roll.setAttribute('aria-hidden', 'true');
        roll.style.height = Math.floor(room) + 'px';
        const pitch = Math.round((colWidth - 44) / 1.5 + 10);
        roll.style.setProperty('--pitch', pitch + 'px');
        // Holes and frames scroll at the same speed (60px/s).
        roll.style.setProperty('--frame-dur', (pitch / 60).toFixed(2) + 's');
        roll.style.setProperty('--hole-dur', (22 / 60).toFixed(3) + 's');
        const frames = document.createElement('div');
        frames.className = 'film-roll-frames';
        roll.appendChild(frames);
        const grain = document.createElement('div');
        grain.className = 'film-roll-grain';
        roll.appendChild(grain);
        const tag = document.createElement('span');
        tag.className = 'film-roll-tag';
        tag.textContent = tr('Coming Soon');
        roll.appendChild(tag);
        col.el.appendChild(roll);
      });
    };

    // Wait (briefly) for the photos so their real proportions are known.
    const loaded = figs.map(fig => {
      const img = fig.querySelector('img');
      if (!img || img.complete) return Promise.resolve();
      return new Promise(res => { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); });
    });
    Promise.race([Promise.all(loaded), new Promise(res => setTimeout(res, 4000))]).then(buildWall);
    let resizeTimer;
    window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(buildWall, 150); });

    if (!('IntersectionObserver' in window)) return;
    gal.classList.add('is-reveal-ready');
    const frameObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        frameObserver.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.05 });
    figs.forEach((fig, i) => {
      fig.style.setProperty('--d', ((i % 4) * 70) + 'ms');
      frameObserver.observe(fig);
    });
  });

  // Video player: a minimal overlay over the video itself — a thin progress
  // line at the bottom edge with the time tucked in the corner, a big
  // centered play/pause flanked by skip ±5s, and small volume/fullscreen/PiP
  // buttons in the top-right. No native controls, no speed or repeat
  // controls. Icons are drawn from scratch rather than using Apple's SF
  // Symbols glyphs, which aren't licensed for use outside Apple-platform UI;
  // explicit width/height attributes (not just CSS) keep them sized
  // correctly on every browser.
  // Icon paths below are from Phosphor Icons (phosphoricons.com), "fill"
  // weight — MIT License, Copyright (c) 2020-2024 Phosphor Icons.
  // Reproduced under that license (unlike Apple's SF Symbols, which are not
  // licensed for use outside Apple-platform UI).
  const videoIcons = {
    play: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path></svg>',
    pause: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M216,48V208a16,16,0,0,1-16,16H160a16,16,0,0,1-16-16V48a16,16,0,0,1,16-16h40A16,16,0,0,1,216,48ZM96,32H56A16,16,0,0,0,40,48V208a16,16,0,0,0,16,16H96a16,16,0,0,0,16-16V48A16,16,0,0,0,96,32Z"></path></svg>',
    volumeHigh: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M160,32.25V223.69a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.57-51A4,4,0,0,1,80,176.16V79.84a4,4,0,0,1,1.55-3.15l65.57-51a8,8,0,0,1,10,.16A8.27,8.27,0,0,1,160,32.25ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Zm126.77,20.84a8,8,0,0,0-.72,11.3,24,24,0,0,1,0,31.72,8,8,0,1,0,12,10.58,40,40,0,0,0,0-52.88A8,8,0,0,0,186.74,100.84Zm40.89-26.17a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66Z"></path></svg>',
    volumeLow: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M160,32.25V223.69a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.57-51A4,4,0,0,1,80,176.16V79.84a4,4,0,0,1,1.55-3.15l65.57-51a8,8,0,0,1,10,.16A8.27,8.27,0,0,1,160,32.25ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80ZM198,101.56a8,8,0,1,0-12,10.58,24,24,0,0,1,0,31.72,8,8,0,1,0,12,10.58,40,40,0,0,0,0-52.88Z"></path></svg>',
    volumeMuted: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M213.92,210.62a8,8,0,1,1-11.84,10.76L160,175.09v48.6a8.29,8.29,0,0,1-3.91,7.18,8,8,0,0,1-9-.56l-65.55-51A4,4,0,0,1,80,176.18V87.09L42.08,45.38A8,8,0,1,1,53.92,34.62Zm-27.21-55.46a8,8,0,0,0,11.29-.7,40,40,0,0,0,0-52.88,8,8,0,1,0-12,10.57,24,24,0,0,1,0,31.72A8,8,0,0,0,186.71,155.16Zm40.92-80.49a8,8,0,1,0-11.92,10.66,64,64,0,0,1,0,85.34,8,8,0,1,0,11.92,10.66,80,80,0,0,0,0-106.66ZM153,119.87a4,4,0,0,0,7-2.7V32.25a8.27,8.27,0,0,0-2.88-6.4,8,8,0,0,0-10-.16L103.83,59.33a4,4,0,0,0-.5,5.85ZM60,80H32A16,16,0,0,0,16,96v64a16,16,0,0,0,16,16H60a4,4,0,0,0,4-4V84A4,4,0,0,0,60,80Z"></path></svg>',
    enterFullscreen: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M216,48V96a8,8,0,0,1-13.66,5.66L184,83.31l-26.34,26.35a8,8,0,0,1-11.32-11.32L172.69,72,154.34,53.66A8,8,0,0,1,160,40h48A8,8,0,0,1,216,48ZM98.34,146.34,72,172.69,53.66,154.34A8,8,0,0,0,40,160v48a8,8,0,0,0,8,8H96a8,8,0,0,0,5.66-13.66L83.31,184l26.35-26.34a8,8,0,0,0-11.32-11.32Zm112.72,6.27a8,8,0,0,0-8.72,1.73L184,172.69l-26.34-26.35a8,8,0,0,0-11.32,11.32L172.69,184l-18.35,18.34A8,8,0,0,0,160,216h48a8,8,0,0,0,8-8V160A8,8,0,0,0,211.06,152.61ZM83.31,72l18.35-18.34A8,8,0,0,0,96,40H48a8,8,0,0,0-8,8V96a8,8,0,0,0,13.66,5.66L72,83.31l26.34,26.35a8,8,0,0,0,11.32-11.32Z"></path></svg>',
    exitFullscreen: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M144,104V64a8,8,0,0,1,13.66-5.66L172,72.69l30.34-30.35a8,8,0,0,1,11.32,11.32L183.31,84l14.35,14.34A8,8,0,0,1,192,112H152A8,8,0,0,1,144,104Zm-40,40H64a8,8,0,0,0-5.66,13.66L72.69,172,42.34,202.34a8,8,0,0,0,11.32,11.32L84,183.31l14.34,14.35A8,8,0,0,0,112,192V152A8,8,0,0,0,104,144Zm79.31,28,14.35-14.34A8,8,0,0,0,192,144H152a8,8,0,0,0-8,8v40a8,8,0,0,0,13.66,5.66L172,183.31l30.34,30.35a8,8,0,0,0,11.32-11.32ZM107.06,56.61a8,8,0,0,0-8.72,1.73L84,72.69,53.66,42.34A8,8,0,0,0,42.34,53.66L72.69,84,58.34,98.34A8,8,0,0,0,64,112h40a8,8,0,0,0,8-8V64A8,8,0,0,0,107.06,56.61Z"></path></svg>',
    // No separate "exit PiP" glyph in Phosphor; reused for both states,
    // same as many native players do.
    pipEnter: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H136V128h80v64Z"></path></svg>',
    pipExit: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48Zm0,144H136V128h80v64Z"></path></svg>',
    // Phosphor has no literal "skip 5 seconds" glyph (that numeral badge is
    // specific to Apple's SF Symbols set), so these are its plain circular
    // seek arrows; the 5-second behavior is still named in the aria-label.
    skipBack: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L60.63,81.29l17,17A8,8,0,0,1,72,112H24a8,8,0,0,1-8-8V56A8,8,0,0,1,29.66,50.3L49.31,70,60.25,60A96,96,0,0,1,224,128Z"></path></svg>',
    skipForward: '<svg viewBox="0 0 256 256" width="100%" height="100%" fill="currentColor" aria-hidden="true"><path d="M240,56v48a8,8,0,0,1-8,8H184a8,8,0,0,1-5.66-13.66l17-17-10.55-9.65-.25-.24a80,80,0,1,0-1.67,114.78,8,8,0,0,1,11,11.63A95.44,95.44,0,0,1,128,224h-1.32A96,96,0,1,1,195.75,60l10.93,10L226.34,50.3A8,8,0,0,1,240,56Z"></path></svg>',
  };
  const formatTime = (s) => {
    if (!Number.isFinite(s)) return '0:00';
    s = Math.max(0, Math.round(s));
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    const mm = h ? String(m).padStart(2, '0') : String(m);
    return (h ? h + ':' : '') + mm + ':' + String(sec).padStart(2, '0');
  };
  document.querySelectorAll('.video-frame video').forEach(video => {
    const frame = video.closest('.video-frame');
    if (!frame) return;
    video.removeAttribute('controls');
    video.disablePictureInPicture = true;
    frame.classList.add('has-custom-controls');

    const iconBtn = (cls, iconKey) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = cls;
      if (iconKey) btn.innerHTML = videoIcons[iconKey];
      return btn;
    };

    // --- Center cluster: skip back, play/pause, skip forward ---
    const centerRow = document.createElement('div');
    centerRow.className = 'video-center';

    const makeSkipBtn = (dir) => {
      const btn = iconBtn('video-skip-btn', dir === -1 ? 'skipBack' : 'skipForward');
      btn.setAttribute('aria-label', tr(dir === -1 ? 'Back 5 seconds' : 'Forward 5 seconds'));
      btn.title = btn.getAttribute('aria-label');
      btn.addEventListener('click', () => {
        if (!Number.isFinite(video.duration)) return;
        video.currentTime = Math.min(video.duration, Math.max(0, video.currentTime + dir * 5));
      });
      return btn;
    };
    const skipBackBtn = makeSkipBtn(-1);
    const skipForwardBtn = makeSkipBtn(1);

    const playBtn = iconBtn('video-play-btn', 'play');
    const syncPlay = () => {
      playBtn.innerHTML = video.paused ? videoIcons.play : videoIcons.pause;
      playBtn.setAttribute('aria-label', tr(video.paused ? 'Play' : 'Pause'));
      playBtn.title = playBtn.getAttribute('aria-label');
    };
    playBtn.addEventListener('click', () => { video.paused ? video.play() : video.pause(); });
    video.addEventListener('play', syncPlay);
    video.addEventListener('pause', syncPlay);
    syncPlay();
    video.addEventListener('click', () => { video.paused ? video.play() : video.pause(); });

    centerRow.append(skipBackBtn, playBtn, skipForwardBtn);

    // --- Top-right: volume, PiP (if supported), fullscreen ---
    const topRow = document.createElement('div');
    topRow.className = 'video-top';

    const volBtn = iconBtn('video-tool-btn', 'volumeHigh');
    const syncVolume = () => {
      const icon = video.muted || video.volume === 0 ? 'volumeMuted' : video.volume < 0.5 ? 'volumeLow' : 'volumeHigh';
      volBtn.innerHTML = videoIcons[icon];
      volBtn.setAttribute('aria-label', tr(video.muted || video.volume === 0 ? 'Unmute' : 'Mute'));
      volBtn.title = volBtn.getAttribute('aria-label');
    };
    volBtn.addEventListener('click', () => { video.muted = !video.muted; if (!video.muted && video.volume === 0) video.volume = 1; syncVolume(); });
    video.addEventListener('volumechange', syncVolume);
    syncVolume();
    topRow.appendChild(volBtn);

    const standardPip = !!document.pictureInPictureEnabled;
    const safariPip = typeof video.webkitSupportsPresentationMode === 'function' && video.webkitSupportsPresentationMode('picture-in-picture');
    if (standardPip || safariPip) {
      const pipBtn = iconBtn('video-tool-btn', 'pipEnter');
      const syncPip = () => {
        const active = standardPip ? document.pictureInPictureElement === video : video.webkitPresentationMode === 'picture-in-picture';
        pipBtn.innerHTML = videoIcons[active ? 'pipExit' : 'pipEnter'];
        pipBtn.setAttribute('aria-label', tr(active ? 'Exit picture in picture' : 'Picture in picture'));
        pipBtn.title = pipBtn.getAttribute('aria-label');
      };
      pipBtn.addEventListener('click', async () => {
        try {
          if (standardPip) {
            if (document.pictureInPictureElement === video) {
              await document.exitPictureInPicture();
            } else {
              video.disablePictureInPicture = false;
              await video.requestPictureInPicture();
            }
          } else {
            video.webkitSetPresentationMode(video.webkitPresentationMode === 'picture-in-picture' ? 'inline' : 'picture-in-picture');
          }
        } catch (err) {
          video.disablePictureInPicture = true;
        }
      });
      video.addEventListener('enterpictureinpicture', syncPip);
      video.addEventListener('leavepictureinpicture', () => { video.disablePictureInPicture = true; syncPip(); });
      if (!standardPip) video.addEventListener('webkitpresentationmodechanged', syncPip);
      syncPip();
      topRow.appendChild(pipBtn);
    }

    const fsBtn = iconBtn('video-tool-btn', 'enterFullscreen');
    const syncFullscreen = () => {
      const isFs = document.fullscreenElement === frame;
      fsBtn.innerHTML = videoIcons[isFs ? 'exitFullscreen' : 'enterFullscreen'];
      fsBtn.setAttribute('aria-label', tr(isFs ? 'Exit fullscreen' : 'Enter fullscreen'));
      fsBtn.title = fsBtn.getAttribute('aria-label');
    };
    if (document.fullscreenEnabled) {
      fsBtn.addEventListener('click', () => {
        if (document.fullscreenElement === frame) document.exitFullscreen();
        else frame.requestFullscreen().catch(() => {});
      });
      document.addEventListener('fullscreenchange', () => { if (document.fullscreenElement === frame || !document.fullscreenElement) syncFullscreen(); });
      syncFullscreen();
      topRow.appendChild(fsBtn);
    }

    // --- Bottom: thin full-width scrub line + time in the corner ---
    const bottomRow = document.createElement('div');
    bottomRow.className = 'video-bottom';

    const scrubWrap = document.createElement('div');
    scrubWrap.className = 'video-scrub';
    scrubWrap.setAttribute('role', 'slider');
    scrubWrap.tabIndex = 0;
    scrubWrap.setAttribute('aria-label', tr('Seek'));
    scrubWrap.setAttribute('aria-valuemin', '0');
    const scrubFill = document.createElement('div');
    scrubFill.className = 'video-scrub-fill';
    const scrubThumb = document.createElement('div');
    scrubThumb.className = 'video-scrub-thumb';
    scrubWrap.append(scrubFill, scrubThumb);
    const seekTo = (clientX) => {
      const r = scrubWrap.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      if (Number.isFinite(video.duration)) video.currentTime = ratio * video.duration;
    };
    let scrubbing = false;
    scrubWrap.addEventListener('pointerdown', (e) => {
      scrubbing = true;
      seekTo(e.clientX);
      try { scrubWrap.setPointerCapture(e.pointerId); } catch (err) { /* synthetic/invalid pointer id */ }
    });
    scrubWrap.addEventListener('pointermove', (e) => { if (scrubbing) seekTo(e.clientX); });
    scrubWrap.addEventListener('pointerup', () => { scrubbing = false; });
    scrubWrap.addEventListener('keydown', (e) => {
      if (!Number.isFinite(video.duration)) return;
      if (e.key === 'ArrowRight') { video.currentTime = Math.min(video.duration, video.currentTime + 5); e.preventDefault(); }
      else if (e.key === 'ArrowLeft') { video.currentTime = Math.max(0, video.currentTime - 5); e.preventDefault(); }
    });

    const timeLabel = document.createElement('span');
    timeLabel.className = 'video-time';
    const syncTime = () => {
      const dur = video.duration;
      const ratio = Number.isFinite(dur) && dur > 0 ? video.currentTime / dur : 0;
      scrubFill.style.width = (ratio * 100) + '%';
      scrubThumb.style.left = (ratio * 100) + '%';
      scrubWrap.setAttribute('aria-valuemax', Number.isFinite(dur) ? String(Math.round(dur)) : '0');
      scrubWrap.setAttribute('aria-valuenow', String(Math.round(video.currentTime)));
      timeLabel.textContent = formatTime(video.currentTime) + ' / ' + formatTime(dur);
    };
    ['timeupdate', 'loadedmetadata', 'durationchange'].forEach(ev => video.addEventListener(ev, syncTime));
    syncTime();

    bottomRow.append(scrubWrap, timeLabel);

    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.append(topRow, centerRow, bottomRow);
    frame.appendChild(overlay);

    // Overlay stays visible while the video is paused (including before
    // first play), and otherwise appears on hover/focus.
    const syncVisibility = () => frame.classList.toggle('tools-visible', video.paused);
    ['play', 'pause', 'ended', 'loadedmetadata'].forEach(ev => video.addEventListener(ev, syncVisibility));
    syncVisibility();
  });

  // Concert tickets tilt toward the pointer.
  // Skipped on touch and when motion is reduced; the pointer is ignored while
  // it's over the video so the player stays still under the controls.
  const ticketsCanTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    && document.documentElement.getAttribute('data-reduced-motion') !== 'true';
  if (ticketsCanTilt) {
    document.querySelectorAll('.perf').forEach(perf => {
      const ticket = perf.querySelector('.ticket');
      if (!ticket) return;
      const reset = () => {
        ticket.classList.remove('is-tracking');
        ticket.style.setProperty('--rx', '0deg');
        ticket.style.setProperty('--ry', '0deg');
      };
      perf.addEventListener('pointermove', (e) => {
        const r = ticket.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        if (e.target.closest('.video-frame')) { reset(); return; }
        ticket.classList.add('is-tracking');
        ticket.style.setProperty('--ry', ((px - 0.5) * 6).toFixed(2) + 'deg');
        ticket.style.setProperty('--rx', ((0.5 - py) * 4).toFixed(2) + 'deg');
      });
      perf.addEventListener('pointerleave', reset);
    });
  }

  // Touch has no hover, so a tap plays the hover animation instead: the
  // tapped concert ticket / film strip / locked locker gets .is-active for a
  // moment (the CSS mirrors its :hover rules). Delegated, so the film strips
  // that are built later are covered too. Scrolling fires pointercancel, not
  // pointerup, so swiping past never triggers it.
  const tapHold = { perf: 3200, 'film-roll': 2600, 'locker-empty': 800 };
  const tapTimers = new WeakMap();
  document.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch') return;
    const target = e.target.closest('.perf, .film-roll, .locker-empty');
    if (!target) return;
    if (target.matches('.perf') && e.target.closest('video, button, a, .video-frame')) return;
    const kind = ['perf', 'film-roll', 'locker-empty'].find(k => target.classList.contains(k));
    clearTimeout(tapTimers.get(target));
    target.classList.remove('is-active');
    void target.offsetWidth; // restart one-shot animations (the lock rattle)
    target.classList.add('is-active');
    tapTimers.set(target, setTimeout(() => target.classList.remove('is-active'), tapHold[kind]));
  });

  // Scroll reveal: fade/rise each top-level section in as it enters the
  // viewport. Elements only opt into the hidden starting state once .reveal
  // is added here, so a page with JS disabled (or this running before
  // IntersectionObserver support lands) just shows everything normally.
  if ('IntersectionObserver' in window) {
    const revealTargets = document.querySelectorAll('.page-hero, main > section');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach((el, i) => {
      el.classList.add('reveal');
      // The hero is what's on screen at load — reveal it immediately
      // rather than waiting on the observer's first tick.
      if (i === 0) el.classList.add('is-visible');
      else revealObserver.observe(el);
    });
  }

  // Hero photo arc: deal the cards in from a gathered stack with a
  // staggered fan-out. Double rAF so the gathered state actually paints
  // before it's removed, otherwise some browsers skip the transition.
  const heroArc = document.querySelector('.hero-arc');
  if (heroArc) {
    heroArc.classList.add('will-deal');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => heroArc.classList.remove('will-deal'));
    });
  }

  // Pull-to-refresh. The browser's native overscroll bounce/refresh is
  // turned off site-wide (see `overscroll-behavior: none` in style.css,
  // there to stop the page rubber-banding when installed as a standalone
  // app), so this replaces it with the same gesture: pull down from the
  // very top of the page, release past the threshold, and the page
  // reloads. Touch-only — desktop pointers don't send touch events, so
  // this never activates on a mouse.
  //
  // Redesigned as a "liquid glass" drop that stretches and pinches live
  // with the finger (height + border-radius set directly, no transition,
  // so it tracks 1:1 — the same instant-follow feel as the edge-swipe
  // gesture below), pops with an elastic overshoot + ripple burst the
  // instant it crosses the threshold, then morphs smoothly into a
  // spinning circle on refresh. A .ptr-snap class is added only during
  // the release animation (snap-back or morph-to-circle), so live
  // dragging stays instant while the release still gets a springy
  // cubic-bezier transition.
  const ptrLabel = translations[selectedLanguage] || translations.en;
  const ptrIndicator = document.createElement('div');
  ptrIndicator.className = 'ptr-indicator';
  ptrIndicator.innerHTML =
    '<span class="ptr-drop">' +
      '<svg viewBox="0 0 256 256" fill="currentColor" class="ptr-arrow" aria-hidden="true"><path d="M215.39,92.94A8,8,0,0,0,208,88H48a8,8,0,0,0-5.66,13.66l80,80a8,8,0,0,0,11.32,0l80-80A8,8,0,0,0,215.39,92.94Z"></path></svg>' +
    '</span>' +
    `<span class="ptr-label">${ptrLabel['Pull to refresh']}</span>`;
  document.body.appendChild(ptrIndicator);
  const ptrDrop = ptrIndicator.querySelector('.ptr-drop');
  const ptrArrow = ptrIndicator.querySelector('.ptr-arrow');
  const ptrLabelEl = ptrIndicator.querySelector('.ptr-label');

  const PTR_THRESHOLD = 64;
  let ptrStartY = 0;
  let ptrPulling = false;
  let ptrRefreshing = false;
  let ptrWasReady = false;
  let ptrPopTimer = null;

  // Live-follow: called on every touchmove, no transition, 1:1 with the
  // finger. progress is 0-1 (clamped at the threshold). Stays a circle
  // throughout — just grows as the pull progresses.
  const ptrApplyProgress = (progress) => {
    ptrDrop.style.transform = `scale(${0.72 + progress * 0.33})`;
    ptrArrow.style.transform = `rotate(${progress * 180}deg)`;
  };
  // Release: clears the live inline values so the CSS resting/is-ready/
  // is-refreshing rules take over, with .ptr-snap giving that a springy
  // transition instead of jumping.
  const ptrClearProgress = () => {
    ptrDrop.style.transform = '';
    ptrArrow.style.transform = '';
  };

  const ptrReset = () => {
    ptrPulling = false;
    ptrWasReady = false;
    ptrIndicator.classList.add('ptr-snap');
    ptrIndicator.classList.remove('is-visible', 'is-ready', 'ptr-pop');
    ptrClearProgress();
    ptrLabelEl.textContent = ptrLabel['Pull to refresh'];
  };

  document.addEventListener('touchstart', (e) => {
    if (ptrRefreshing || window.scrollY > 0) { ptrPulling = false; return; }
    ptrStartY = e.touches[0].clientY;
    ptrPulling = true;
    ptrWasReady = false;
    ptrIndicator.classList.remove('ptr-snap', 'ptr-pop');
    // The CSS top:78px fallback assumes a single-line header; on narrow
    // phones the brand name wraps to two lines and the header grows
    // taller, which used to leave the indicator overlapping it. Anchor
    // to the header's real bottom edge instead, same pattern as the nav
    // dropdown and settings panel's own floating position logic.
    if (header) ptrIndicator.style.top = (header.getBoundingClientRect().bottom + 16) + 'px';
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!ptrPulling || ptrRefreshing) return;
    if (window.scrollY > 0) { ptrReset(); return; }
    const delta = e.touches[0].clientY - ptrStartY;
    if (delta <= 0) { ptrReset(); return; }
    const progress = Math.min(1, delta / PTR_THRESHOLD);
    ptrIndicator.classList.add('is-visible');
    ptrApplyProgress(progress);
    const ready = delta >= PTR_THRESHOLD;
    ptrIndicator.classList.toggle('is-ready', ready);
    ptrLabelEl.textContent = ready ? ptrLabel['Release to refresh'] : ptrLabel['Pull to refresh'];
    // Crossing into "ready" for the first time this pull: a one-shot
    // elastic pop + ripple burst, purely as tactile feedback — doesn't
    // affect the live stretch/pinch tracking above.
    if (ready && !ptrWasReady) {
      ptrWasReady = true;
      clearTimeout(ptrPopTimer);
      ptrIndicator.classList.remove('ptr-pop');
      void ptrIndicator.offsetWidth; // restart the animation if re-triggered
      ptrIndicator.classList.add('ptr-pop');
      ptrPopTimer = setTimeout(() => ptrIndicator.classList.remove('ptr-pop'), 500);
    } else if (!ready) {
      ptrWasReady = false;
    }
  }, { passive: true });

  const ptrEnd = () => {
    if (!ptrPulling || ptrRefreshing) return;
    const ready = ptrIndicator.classList.contains('is-ready');
    ptrPulling = false;
    ptrIndicator.classList.add('ptr-snap');
    if (!ready) {
      ptrIndicator.classList.remove('is-visible', 'is-ready');
      ptrClearProgress();
      ptrLabelEl.textContent = ptrLabel['Pull to refresh'];
      return;
    }
    ptrRefreshing = true;
    ptrIndicator.classList.add('is-refreshing');
    ptrClearProgress();
    ptrLabelEl.textContent = ptrLabel['Refreshing…'];
    window.location.reload();
  };
  document.addEventListener('touchend', ptrEnd);
  document.addEventListener('touchcancel', ptrReset);

  // Edge-swipe back/forward: a drag from the left edge (rightward) goes back;
  // a drag from the right edge (leftward) goes forward.
  // Ignored while the lightbox is open.
  const EDGE_SIZE = 30;
  const EDGE_THRESHOLD = 60;

  let backStartX = 0, backStartY = 0, backActive = false;
  let fwdStartX = 0, fwdStartY = 0, fwdActive = false;

  const backReset = () => { backActive = false; };
  const fwdReset  = () => { fwdActive  = false; };

  document.addEventListener('touchstart', (e) => {
    if (lightbox.classList.contains('is-open')) return;
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    if (x <= EDGE_SIZE) {
      backStartX = x; backStartY = y; backActive = true;
    } else if (x >= window.innerWidth - EDGE_SIZE) {
      fwdStartX = x; fwdStartY = y; fwdActive = true;
    }
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    const x = e.touches[0].clientX;
    const y = e.touches[0].clientY;
    if (backActive) {
      const dx = x - backStartX, dy = y - backStartY;
      if (dx <= 0 || Math.abs(dy) > Math.abs(dx)) backReset();
    }
    if (fwdActive) {
      const dx = x - fwdStartX, dy = y - fwdStartY;
      if (dx >= 0 || Math.abs(dy) > Math.abs(dx)) fwdReset();
    }
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (backActive) {
      const dx = e.changedTouches[0].clientX - backStartX;
      backReset();
      if (dx >= EDGE_THRESHOLD) history.back();
    }
    if (fwdActive) {
      const dx = e.changedTouches[0].clientX - fwdStartX;
      fwdReset();
      if (-dx >= EDGE_THRESHOLD) history.forward();
    }
  });
  document.addEventListener('touchcancel', () => { backReset(); fwdReset(); });
});

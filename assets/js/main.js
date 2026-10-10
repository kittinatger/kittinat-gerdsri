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
        '<svg viewBox="0 0 26.5527 26.2012" fill="currentColor" aria-hidden="true">' +
          '<path d="M11.9141 26.2012L14.2773 26.2012C14.9512 26.2012 15.4199 25.8105 15.5762 25.1367L16.2207 22.4121C16.6699 22.2559 17.1191 22.0801 17.5195 21.8945L19.9023 23.3691C20.4688 23.7305 21.0938 23.6719 21.5527 23.2031L23.2129 21.5527C23.6816 21.084 23.75 20.4492 23.3691 19.873L21.9043 17.5098C22.0898 17.0898 22.2656 16.6602 22.4023 16.2305L25.1465 15.5859C25.8203 15.4297 26.1914 14.9609 26.1914 14.2871L26.1914 11.9531C26.1914 11.2891 25.8203 10.8301 25.1465 10.6641L22.4219 10.0098C22.2656 9.54102 22.0801 9.11133 21.9238 8.73047L23.3887 6.32812C23.75 5.75195 23.7109 5.15625 23.2324 4.67773L21.5527 3.01758C21.0742 2.57812 20.498 2.48047 19.9316 2.8418L17.5195 4.33594C17.1289 4.14062 16.6895 3.97461 16.2207 3.81836L15.5762 1.06445C15.4199 0.390625 14.9512 0 14.2773 0L11.9141 0C11.2402 0 10.7715 0.390625 10.6152 1.06445L9.9707 3.79883C9.52148 3.95508 9.07227 4.12109 8.66211 4.32617L6.25977 2.8418C5.69336 2.48047 5.09766 2.55859 4.63867 3.01758L2.95898 4.67773C2.48047 5.15625 2.44141 5.75195 2.80273 6.32812L4.26758 8.73047C4.11133 9.11133 3.92578 9.54102 3.76953 10.0098L1.04492 10.6641C0.380859 10.8301 0 11.2891 0 11.9531L0 14.2871C0 14.9609 0.380859 15.4297 1.04492 15.5859L3.78906 16.2305C3.92578 16.6602 4.10156 17.0898 4.28711 17.5098L2.82227 19.873C2.44141 20.4492 2.50977 21.084 2.97852 21.5527L4.63867 23.2031C5.09766 23.6719 5.72266 23.7305 6.28906 23.3691L8.67188 21.8945C9.08203 22.0801 9.52148 22.2559 9.9707 22.4121L10.6152 25.1367C10.7715 25.8105 11.2402 26.2012 11.9141 26.2012ZM13.0957 17.5781C10.625 17.5781 8.61328 15.5664 8.61328 13.0957C8.61328 10.625 10.625 8.61328 13.0957 8.61328C15.5664 8.61328 17.5781 10.625 17.5781 13.0957C17.5781 15.5664 15.5664 17.5781 13.0957 17.5781Z"></path>' +
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
              '<svg class="icon-sun" viewBox="0 0 27.4805 27.1973" fill="currentColor" aria-hidden="true">' +
                '<path d="M13.5547 4.69727C14.0723 4.69727 14.4824 4.27734 14.4824 3.76953L14.4824 0.927734C14.4824 0.419922 14.0723 0 13.5547 0C13.0469 0 12.6367 0.419922 12.6367 0.927734L12.6367 3.76953C12.6367 4.27734 13.0469 4.69727 13.5547 4.69727ZM19.834 7.31445C20.1953 7.66602 20.7812 7.68555 21.1523 7.31445L23.1641 5.30273C23.5254 4.94141 23.5156 4.3457 23.1641 3.98438C22.8027 3.63281 22.2168 3.62305 21.8555 3.98438L19.834 6.00586C19.4727 6.36719 19.4824 6.95312 19.834 7.31445ZM22.4316 13.5938C22.4316 14.1016 22.8516 14.5117 23.3594 14.5117L26.1914 14.5117C26.6992 14.5117 27.1191 14.1016 27.1191 13.5938C27.1191 13.0859 26.6992 12.666 26.1914 12.666L23.3594 12.666C22.8516 12.666 22.4316 13.0859 22.4316 13.5938ZM19.834 19.873C19.4824 20.2344 19.4727 20.8301 19.834 21.1816L21.8555 23.2031C22.2168 23.5645 22.8027 23.5449 23.1641 23.1934C23.5156 22.832 23.5254 22.2461 23.1641 21.8945L21.1426 19.873C20.7812 19.5215 20.1953 19.5215 19.834 19.873ZM13.5547 22.4902C13.0469 22.4902 12.6367 22.9004 12.6367 23.4082L12.6367 26.25C12.6367 26.7676 13.0469 27.1777 13.5547 27.1777C14.0723 27.1777 14.4824 26.7676 14.4824 26.25L14.4824 23.4082C14.4824 22.9004 14.0723 22.4902 13.5547 22.4902ZM7.28516 19.873C6.92383 19.5215 6.32812 19.5215 5.9668 19.873L3.95508 21.8848C3.59375 22.2363 3.60352 22.8223 3.94531 23.1836C4.30664 23.5352 4.90234 23.5547 5.25391 23.1934L7.27539 21.1816C7.62695 20.8301 7.62695 20.2344 7.28516 19.873ZM4.67773 13.5938C4.67773 13.0859 4.26758 12.666 3.75977 12.666L0.927734 12.666C0.419922 12.666 0 13.0859 0 13.5938C0 14.1016 0.419922 14.5117 0.927734 14.5117L3.75977 14.5117C4.26758 14.5117 4.67773 14.1016 4.67773 13.5938ZM7.27539 7.31445C7.62695 6.96289 7.62695 6.35742 7.28516 6.00586L5.26367 3.98438C4.92188 3.64258 4.32617 3.63281 3.96484 3.98438C3.61328 4.3457 3.60352 4.94141 3.95508 5.29297L5.9668 7.31445C6.32812 7.67578 6.91406 7.66602 7.27539 7.31445Z"></path>' +
                '<path d="M13.5449 19.873C17.0117 19.873 19.834 17.0605 19.834 13.5938C19.834 10.127 17.0117 7.30469 13.5449 7.30469C10.0781 7.30469 7.26562 10.127 7.26562 13.5938C7.26562 17.0605 10.0781 19.873 13.5449 19.873Z"></path>' +
              '</svg>' +
              '<svg class="icon-moon" viewBox="0 0 25.4297 25.3088" fill="currentColor" aria-hidden="true">' +
                '<path d="M13.0859 25.2277C18.5254 25.2277 22.9883 21.9464 24.9414 17.6691C25.3027 16.9171 24.834 16.38 24.0918 16.6241C23.1836 16.9464 21.6113 17.3077 20.0488 17.3077C12.4414 17.3077 8.11523 12.9816 8.11523 5.37414C8.11523 3.8507 8.4375 2.30773 8.93555 1.0675C9.25781 0.256952 8.70117-0.23133 7.91992 0.110467C3.69141 1.90734 0 6.38976 0 12.132C0 19.3585 5.86914 25.2277 13.0859 25.2277Z"></path>' +
              '</svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Theme']}</span>` +
          '</button>' +
          '<button class="settings-tile sticky-navbar-toggle" type="button" role="switch" aria-checked="true" aria-label="Toggle sticky navigation bar">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C7.58 2 4 5.58 4 10c0 5.25 7 11.5 7.3 11.76a1 1 0 001.4 0C12.9 21.5 20 15.25 20 10c0-4.42-3.58-8-8-8zm0 11a3 3 0 110-6 3 3 0 010 6z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Sticky Navbar']}</span>` +
          '</button>' +
          '<button class="settings-tile zoom-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle pinch-to-zoom">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>' +
            '</span>' +
            `<span class="settings-tile-label">${settingsLabel['Enable Zoom']}</span>` +
          '</button>' +
          '<button class="settings-tile select-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle text selection and image dragging">' +
            '<span class="settings-tile-icon">' +
              '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"></path></svg>' +
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

  // Filter certificate galleries by award level. Each .cert-filter dropdown
  // drives only the .gallery in its own section (the next sibling of the
  // .gallery-heading it lives in) — a page like Core Discipline has one
  // per subject (Mathematics, English, Chinese, Sciences), and each filters
  // independently. Filtering only toggles visibility (via
  // .is-filtered-out), so it doesn't disturb the sort toggle beside it,
  // which reorders the same figures. Built as the same floating glass-panel
  // dropdown as the "Work" nav menu and the settings popup (button +
  // makeFloating menu).
  const awardedLevels = new Set(['gold', 'silver', 'bronze', 'merit']);
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
    const filterOptions = [...filterMenu.querySelectorAll('.cert-filter-option')];
    const gallery = certFilter.closest('.gallery-heading')?.nextElementSibling;
    if (!gallery || !gallery.classList.contains('gallery')) return;
    const floatingFilterMenu = makeFloating(filterMenu, (el) => {
      const r = filterToggle.getBoundingClientRect();
      const width = el.offsetWidth || 200;
      el.style.top = (r.bottom + 8) + 'px';
      el.style.left = Math.max(8, Math.min(r.left, window.innerWidth - width - 8)) + 'px';
    }, filterToggle);
    const applyFilter = (filter) => {
      gallery.querySelectorAll('figure[data-date]').forEach(fig => {
        const award = fig.dataset.award;
        const visible = filter === 'all'
          || (filter === 'awarded' && awardedLevels.has(award))
          || award === filter;
        fig.classList.toggle('is-filtered-out', !visible);
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

    const showImage = (index) => {
      if (!currentGroup.length) return;
      currentIndex = (index + currentGroup.length) % currentGroup.length;
      const img = currentGroup[currentIndex];
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
    };
    const showPrev = () => showImage(currentIndex - 1);
    const showNext = () => showImage(currentIndex + 1);

    document.querySelectorAll('.gallery').forEach(gallery => {
      [...gallery.querySelectorAll('figure img')].forEach(img => {
        img.addEventListener('click', () => {
          currentGroup = [...gallery.querySelectorAll('figure:not(.is-filtered-out) img')];
          const hasMultiple = currentGroup.length > 1;
          if (prevBtn) prevBtn.hidden = !hasMultiple;
          if (nextBtn) nextBtn.hidden = !hasMultiple;
          showImage(currentGroup.indexOf(img));
          lightbox.classList.add('is-open');
        });
      });
    });

    const closeLightbox = () => lightbox.classList.remove('is-open');
    lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'ArrowLeft') showPrev();
      else if (e.key === 'ArrowRight') showNext();
    });

    // Touch swipe: a horizontal drag past a small threshold, without too
    // much vertical drift (so a scroll attempt doesn't get mistaken for a
    // swipe), steps to the next/previous image.
    let touchStartX = 0;
    let touchStartY = 0;
    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) showNext(); else showPrev();
      }
    }, { passive: true });
  }

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

  // Pull-to-refresh. The browser's native overscroll bounce/refresh is
  // turned off site-wide (see `overscroll-behavior: none` in style.css,
  // there to stop the page rubber-banding when installed as a standalone
  // app), so this replaces it with the same gesture: pull down from the
  // very top of the page, release past the threshold, and the page
  // reloads. Touch-only — desktop pointers don't send touch events, so
  // this never activates on a mouse.
  //
  // Redesigned as a glass pill with a live circular progress ring (fills
  // as the finger pulls, using the classic stroke-dasharray="100 100"
  // percentage trick — r=15.9155 makes the circle's circumference exactly
  // 100), a caret that flips 180° once past the threshold, and a label
  // that steps through "Pull to refresh" -> "Release to refresh" ->
  // "Refreshing…".
  const ptrLabel = translations[selectedLanguage] || translations.en;
  const ptrIndicator = document.createElement('div');
  ptrIndicator.className = 'ptr-indicator';
  ptrIndicator.innerHTML =
    '<span class="ptr-ring-wrap">' +
      '<svg class="ptr-ring" viewBox="0 0 36 36" aria-hidden="true">' +
        '<circle class="ptr-ring-track" cx="18" cy="18" r="15.9155"></circle>' +
        '<circle class="ptr-ring-progress" cx="18" cy="18" r="15.9155" stroke-dasharray="100 100" stroke-dashoffset="100"></circle>' +
      '</svg>' +
      '<svg class="ptr-arrow" viewBox="0 0 20.3027 20.5176" fill="currentColor" aria-hidden="true"><path d="M19.9414 1.38672C19.9414 0.546875 19.3066 0.0195312 18.3105 0.0195312L1.64062 0.00976562C0.634766 0.00976562 0 0.537109 0 1.37695C0 1.83594 0.195312 2.1875 0.439453 2.68555L8.45703 19.2578C8.92578 20.2051 9.36523 20.5176 9.9707 20.5176C10.5859 20.5176 11.0254 20.2051 11.4844 19.2578L19.5117 2.68555C19.7461 2.19727 19.9414 1.8457 19.9414 1.38672Z"></path></svg>' +
    '</span>' +
    `<span class="ptr-label">${ptrLabel['Pull to refresh']}</span>`;
  document.body.appendChild(ptrIndicator);
  const ptrRingProgress = ptrIndicator.querySelector('.ptr-ring-progress');
  const ptrLabelEl = ptrIndicator.querySelector('.ptr-label');

  const PTR_THRESHOLD = 64;
  let ptrStartY = 0;
  let ptrPulling = false;
  let ptrRefreshing = false;

  const ptrReset = () => {
    ptrPulling = false;
    ptrIndicator.classList.remove('is-visible', 'is-ready');
    ptrRingProgress.style.strokeDashoffset = '100';
    ptrLabelEl.textContent = ptrLabel['Pull to refresh'];
  };

  document.addEventListener('touchstart', (e) => {
    if (ptrRefreshing || window.scrollY > 0) { ptrPulling = false; return; }
    ptrStartY = e.touches[0].clientY;
    ptrPulling = true;
  }, { passive: true });

  document.addEventListener('touchmove', (e) => {
    if (!ptrPulling || ptrRefreshing) return;
    if (window.scrollY > 0) { ptrReset(); return; }
    const delta = e.touches[0].clientY - ptrStartY;
    if (delta <= 0) { ptrReset(); return; }
    const progress = Math.min(1, delta / PTR_THRESHOLD);
    ptrRingProgress.style.strokeDashoffset = String(100 - progress * 100);
    ptrIndicator.classList.add('is-visible');
    const ready = delta >= PTR_THRESHOLD;
    ptrIndicator.classList.toggle('is-ready', ready);
    ptrLabelEl.textContent = ready ? ptrLabel['Release to refresh'] : ptrLabel['Pull to refresh'];
  }, { passive: true });

  const ptrEnd = () => {
    if (!ptrPulling || ptrRefreshing) return;
    const ready = ptrIndicator.classList.contains('is-ready');
    ptrPulling = false;
    if (!ready) { ptrReset(); return; }
    ptrRefreshing = true;
    ptrIndicator.classList.add('is-refreshing');
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

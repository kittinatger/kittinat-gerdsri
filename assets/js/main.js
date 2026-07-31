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
      'Terms & Support': 'Terms & Support', 'Language': 'Language', 'Theme': 'Theme',
      'Text Size': 'Text Size', 'Beta': 'Beta', 'Reduced Motion': 'Reduced Motion'
    },
    th: {
      'Home': 'หน้าแรก', 'Work': 'ผลงาน', 'Contact': 'ติดต่อ',
      'Core Discipline': 'ทักษะหลัก', 'Graphics / Drawing': 'กราฟิก / วาดภาพ',
      'Sports': 'กีฬา', 'AI / Coding': 'AI / การเขียนโค้ด',
      '3D Design / Animation': 'การออกแบบ 3 มิติ / แอนิเมชัน', 'Teamwork': 'การทำงานเป็นทีม',
      'Robotics': 'หุ่นยนต์', 'Photography': 'การถ่ายภาพ', 'Music': 'ดนตรี',
      'Navigation': 'เมนูนำทาง', 'Legal': 'ข้อมูลทางกฎหมาย', 'Privacy Policy': 'นโยบายความเป็นส่วนตัว',
      'Terms & Support': 'ข้อกำหนดและการสนับสนุน', 'Language': 'ภาษา', 'Theme': 'ธีม',
      'Text Size': 'ขนาดตัวอักษร', 'Beta': 'เบต้า', 'Reduced Motion': 'ลดการเคลื่อนไหว'
    },
    'zh-CN': {
      'Home': '首页', 'Work': '作品', 'Contact': '联系',
      'Core Discipline': '核心学科', 'Graphics / Drawing': '平面设计 / 绘画',
      'Sports': '体育', 'AI / Coding': '人工智能 / 编程',
      '3D Design / Animation': '3D 设计 / 动画', 'Teamwork': '团队合作',
      'Robotics': '机器人', 'Photography': '摄影', 'Music': '音乐',
      'Navigation': '导航', 'Legal': '法律信息', 'Privacy Policy': '隐私政策',
      'Terms & Support': '条款与支持', 'Language': '语言', 'Theme': '主题',
      'Text Size': '文字大小', 'Beta': '测试版', 'Reduced Motion': '减少动态效果'
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
      panel.style.width = '';
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
      el.style.width = r.width + 'px';
      el.style.right = '';
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
        '<svg viewBox="0 0 26.5527 26.2012" fill="currentColor" aria-hidden="true">' +
          '<path d="M11.9141 26.2012L14.2773 26.2012C14.9512 26.2012 15.4199 25.8105 15.5762 25.1367L16.2207 22.4121C16.6699 22.2559 17.1191 22.0801 17.5195 21.8945L19.9023 23.3691C20.4688 23.7305 21.0938 23.6719 21.5527 23.2031L23.2129 21.5527C23.6816 21.084 23.75 20.4492 23.3691 19.873L21.9043 17.5098C22.0898 17.0898 22.2656 16.6602 22.4023 16.2305L25.1465 15.5859C25.8203 15.4297 26.1914 14.9609 26.1914 14.2871L26.1914 11.9531C26.1914 11.2891 25.8203 10.8301 25.1465 10.6641L22.4219 10.0098C22.2656 9.54102 22.0801 9.11133 21.9238 8.73047L23.3887 6.32812C23.75 5.75195 23.7109 5.15625 23.2324 4.67773L21.5527 3.01758C21.0742 2.57812 20.498 2.48047 19.9316 2.8418L17.5195 4.33594C17.1289 4.14062 16.6895 3.97461 16.2207 3.81836L15.5762 1.06445C15.4199 0.390625 14.9512 0 14.2773 0L11.9141 0C11.2402 0 10.7715 0.390625 10.6152 1.06445L9.9707 3.79883C9.52148 3.95508 9.07227 4.12109 8.66211 4.32617L6.25977 2.8418C5.69336 2.48047 5.09766 2.55859 4.63867 3.01758L2.95898 4.67773C2.48047 5.15625 2.44141 5.75195 2.80273 6.32812L4.26758 8.73047C4.11133 9.11133 3.92578 9.54102 3.76953 10.0098L1.04492 10.6641C0.380859 10.8301 0 11.2891 0 11.9531L0 14.2871C0 14.9609 0.380859 15.4297 1.04492 15.5859L3.78906 16.2305C3.92578 16.6602 4.10156 17.0898 4.28711 17.5098L2.82227 19.873C2.44141 20.4492 2.50977 21.084 2.97852 21.5527L4.63867 23.2031C5.09766 23.6719 5.72266 23.7305 6.28906 23.3691L8.67188 21.8945C9.08203 22.0801 9.52148 22.2559 9.9707 22.4121L10.6152 25.1367C10.7715 25.8105 11.2402 26.2012 11.9141 26.2012ZM13.0957 17.5781C10.625 17.5781 8.61328 15.5664 8.61328 13.0957C8.61328 10.625 10.625 8.61328 13.0957 8.61328C15.5664 8.61328 17.5781 10.625 17.5781 13.0957C17.5781 15.5664 15.5664 17.5781 13.0957 17.5781Z"></path>' +
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
            '<svg class="icon-sun" viewBox="0 0 27.4805 27.1973" fill="currentColor" aria-hidden="true">' +
              '<path d="M13.5547 4.69727C14.0723 4.69727 14.4824 4.27734 14.4824 3.76953L14.4824 0.927734C14.4824 0.419922 14.0723 0 13.5547 0C13.0469 0 12.6367 0.419922 12.6367 0.927734L12.6367 3.76953C12.6367 4.27734 13.0469 4.69727 13.5547 4.69727ZM19.834 7.31445C20.1953 7.66602 20.7812 7.68555 21.1523 7.31445L23.1641 5.30273C23.5254 4.94141 23.5156 4.3457 23.1641 3.98438C22.8027 3.63281 22.2168 3.62305 21.8555 3.98438L19.834 6.00586C19.4727 6.36719 19.4824 6.95312 19.834 7.31445ZM22.4316 13.5938C22.4316 14.1016 22.8516 14.5117 23.3594 14.5117L26.1914 14.5117C26.6992 14.5117 27.1191 14.1016 27.1191 13.5938C27.1191 13.0859 26.6992 12.666 26.1914 12.666L23.3594 12.666C22.8516 12.666 22.4316 13.0859 22.4316 13.5938ZM19.834 19.873C19.4824 20.2344 19.4727 20.8301 19.834 21.1816L21.8555 23.2031C22.2168 23.5645 22.8027 23.5449 23.1641 23.1934C23.5156 22.832 23.5254 22.2461 23.1641 21.8945L21.1426 19.873C20.7812 19.5215 20.1953 19.5215 19.834 19.873ZM13.5547 22.4902C13.0469 22.4902 12.6367 22.9004 12.6367 23.4082L12.6367 26.25C12.6367 26.7676 13.0469 27.1777 13.5547 27.1777C14.0723 27.1777 14.4824 26.7676 14.4824 26.25L14.4824 23.4082C14.4824 22.9004 14.0723 22.4902 13.5547 22.4902ZM7.28516 19.873C6.92383 19.5215 6.32812 19.5215 5.9668 19.873L3.95508 21.8848C3.59375 22.2363 3.60352 22.8223 3.94531 23.1836C4.30664 23.5352 4.90234 23.5547 5.25391 23.1934L7.27539 21.1816C7.62695 20.8301 7.62695 20.2344 7.28516 19.873ZM4.67773 13.5938C4.67773 13.0859 4.26758 12.666 3.75977 12.666L0.927734 12.666C0.419922 12.666 0 13.0859 0 13.5938C0 14.1016 0.419922 14.5117 0.927734 14.5117L3.75977 14.5117C4.26758 14.5117 4.67773 14.1016 4.67773 13.5938ZM7.27539 7.31445C7.62695 6.96289 7.62695 6.35742 7.28516 6.00586L5.26367 3.98438C4.92188 3.64258 4.32617 3.63281 3.96484 3.98438C3.61328 4.3457 3.60352 4.94141 3.95508 5.29297L5.9668 7.31445C6.32812 7.67578 6.91406 7.66602 7.27539 7.31445Z"></path>' +
              '<path d="M13.5449 19.873C17.0117 19.873 19.834 17.0605 19.834 13.5938C19.834 10.127 17.0117 7.30469 13.5449 7.30469C10.0781 7.30469 7.26562 10.127 7.26562 13.5938C7.26562 17.0605 10.0781 19.873 13.5449 19.873Z"></path>' +
            '</svg>' +
            '<svg class="icon-moon" viewBox="0 0 25.4297 25.3088" fill="currentColor" aria-hidden="true">' +
              '<path d="M13.0859 25.2277C18.5254 25.2277 22.9883 21.9464 24.9414 17.6691C25.3027 16.9171 24.834 16.38 24.0918 16.6241C23.1836 16.9464 21.6113 17.3077 20.0488 17.3077C12.4414 17.3077 8.11523 12.9816 8.11523 5.37414C8.11523 3.8507 8.4375 2.30773 8.93555 1.0675C9.25781 0.256952 8.70117-0.23133 7.91992 0.110467C3.69141 1.90734 0 6.38976 0 12.132C0 19.3585 5.86914 25.2277 13.0859 25.2277Z"></path>' +
            '</svg>' +
          '</button>' +
        '</div>' +
        '<div class="settings-section">' +
          `<p class="settings-label">${settingsLabel['Text Size']}<span class="beta-badge">${settingsLabel['Beta']}</span></p>` +
          '<div class="text-size-slider">' +
            '<span class="text-size-value" aria-hidden="true"></span>' +
            '<input type="range" class="text-size-range" min="0" max="3" step="1" value="0" aria-label="Text size">' +
            '<div class="text-size-ticks" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
          '</div>' +
        '</div>' +
        '<div class="settings-section settings-section-row">' +
          `<p class="settings-label">${settingsLabel['Reduced Motion']}</p>` +
          '<button class="motion-toggle" type="button" role="switch" aria-checked="false" aria-label="Toggle reduced motion">' +
            '<span class="motion-toggle-thumb"></span>' +
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
    // Text size (beta), a 4-step slider. Same flash-free pattern as the
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
    const sortToggle = heading.querySelector('.sort-toggle');
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

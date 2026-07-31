# Kittinat Gerdsri — Portfolio

A static personal portfolio site for Kittinat (Will) Gerdsri, showcasing work across AI/coding, robotics, graphic design, 3D animation, sports, and music.

**Live site:** [kittinatger.github.io/kittinat-gerdsri](https://kittinatger.github.io/kittinat-gerdsri/)

## Tech stack

Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies. Each page is a standalone `.html` file sharing common assets from `assets/`.

- `assets/css/style.css` — all styling, including light/dark theme tokens
- `assets/js/main.js` — nav, settings panel (theme/language/text size/reduced motion), lightbox, and other interactive behavior
- `assets/js/translations.js` — Thai and Mandarin translation dictionaries
- `assets/img/` — images, grouped by page/section
- `assets/video/` — video assets

## Features

- Light/dark theme, saved to `localStorage` and synced with OS preference
- Thai and Mandarin (Simplified) translations, switchable from the settings panel
- Adjustable text size (4-step slider) and a Reduced Motion toggle
- Native cross-document view transitions between pages
- Fully responsive, mobile-first navigation

## Local development

No build tooling required — just serve the directory statically and open `index.html`.

```bash
npx serve .
```

or open `index.html` directly in a browser.

## Deployment

Published via GitHub Pages from this repository.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of notable changes.

## Acknowledgements

Some icons are derived from Apple's SF Symbols — see [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) for attribution details.

## Developed by

[Kittinat Gerdsri](https://kittinatger.github.io/kittinat-gerdsri/)

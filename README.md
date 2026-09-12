# Kittinat Gerdsri — Portfolio

[![Deployed on GitHub Pages](https://img.shields.io/github/deployments/kittinatger/kittinat-gerdsri/github-pages?label=deploy&logo=github)](https://github.com/kittinatger/kittinat-gerdsri/deployments)
[![Last commit](https://img.shields.io/github/last-commit/kittinatger/kittinat-gerdsri)](https://github.com/kittinatger/kittinat-gerdsri/commits/main)
[![Live site](https://img.shields.io/badge/live%20site-kittinatger.github.io-1d4f9c)](https://kittinatger.github.io/kittinat-gerdsri/)

A static personal portfolio site for Kittinat (Will) Gerdsri, showcasing work across AI/coding, robotics, graphic design, 3D animation, sports, and music.

**Live site:** [kittinatger.github.io/kittinat-gerdsri](https://kittinatger.github.io/kittinat-gerdsri/)

## Tech stack

Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no dependencies. Each page is a standalone `.html` file sharing common assets from `assets/`.

- `assets/css/style.css` — all styling, including light/dark theme tokens
- `assets/js/main.js` — nav, settings panel (theme/language/text size/reduced motion), lightbox, and other interactive behavior
- `assets/js/translations.js` — Thai and Mandarin translation dictionaries
- `assets/img/` — images, grouped by page/section (`brand/`, `icons/`, `pages/`)
- `assets/video/` — video assets

## Project structure

```
.
├── index.html                  # Home
├── contact.html                # Contact
├── core-discipline.html        # Discipline: Core Discipline
├── graphics-drawing.html       # Discipline: Graphics / Drawing
├── sports.html                 # Discipline: Sports
├── ai-coding.html              # Discipline: AI / Coding
│   └── tally.html              #   Project: Tally
├── 3d-design-animation.html    # Discipline: 3D Design / Animation
│   ├── f1-animation.html       #   Project: F1 Animation
│   ├── f1-animation-v1.html    #   Project: F1 Animation (v1)
│   └── wills-bites.html        #   Project: Will's Bites
├── teamwork.html                # Discipline: Teamwork
├── robotics.html                # Discipline: Robotics
├── photography.html             # Discipline: Photography
├── music.html                   # Discipline: Music
├── terms.html                   # Legal: Terms & Support
├── privacy.html                 # Legal: Privacy Policy
├── assets/                       # Shared CSS, JS, images, video
├── README.md
├── CHANGELOG.md
└── ACKNOWLEDGEMENTS.md
```

## Pages

| Section | Page |
| --- | --- |
| Home | [index.html](index.html) |
| Work | [Core Discipline](core-discipline.html) · [Graphics / Drawing](graphics-drawing.html) · [Sports](sports.html) · [AI / Coding](ai-coding.html) · [3D Design / Animation](3d-design-animation.html) · [Teamwork](teamwork.html) · [Robotics](robotics.html) · [Photography](photography.html) · [Music](music.html) |
| Projects | [Tally](tally.html) (under AI / Coding) · [F1 Animation](f1-animation.html), [v1](f1-animation-v1.html) & [Will's Bites](wills-bites.html) (under 3D Design / Animation) |
| Contact | [contact.html](contact.html) |
| Legal | [Terms & Support](terms.html) · [Privacy Policy](privacy.html) |

## Features

- Light/dark theme, saved to `localStorage` and synced with OS preference
- Thai and Mandarin (Simplified) translations, switchable from the settings panel
- Adjustable text size (4-step slider) and a Reduced Motion toggle
- Native cross-document view transitions between pages
- Fully responsive, mobile-first navigation
- A dedicated Contact page, reachable from every page's nav
- Project pages (e.g. Tally) with their own hero, screenshot gallery, and tools/credits sections

## Local development

No build tooling required — just serve the directory statically and open `index.html`.

```bash
npx serve .
```

or open `index.html` directly in a browser.

## Deployment

Published via GitHub Pages, built and deployed automatically from `main` on every push.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a history of notable changes.

## Acknowledgements

See [ACKNOWLEDGEMENTS.md](ACKNOWLEDGEMENTS.md) for third-party attribution and credits.

## License

All content (writing, drawings, photography, and design) is © Kittinat Gerdsri and not licensed for reuse — see [Terms & Support](https://kittinatger.github.io/kittinat-gerdsri/terms.html) on the live site.

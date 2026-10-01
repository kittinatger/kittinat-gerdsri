# Changelog

All notable changes to this site are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## 2026-09-30

### Fixed
- Lightbox prev/next/close buttons were covered by the image itself on mobile, silently eating taps.

## 2026-09-28

### Added
- Prev/next navigation (buttons, arrow keys, and touch swipe) to the lightbox, scoped to each gallery's currently visible images.

### Changed
- Merged Robotics into AI/Coding (renamed to AI/Coding/Robotics everywhere); its one non-duplicate award now lives in AI/Coding's gallery. The old Robotics page permanently redirects to AI/Coding.
- Removed the Selected Work/Scratch screenshot section from AI/Coding.
- Wrote fuller concept descriptions for the KAO bioplastics painting and the RBTW Machine illustration, replacing a caption that had been cut off mid-sentence.

### Fixed
- 3D/Animation's Awards section had a filter/sort UI around a single untagged photo, so neither control did anything; removed it rather than leave dead controls.

## 2026-09-25 to 2026-09-26

### Added
- A filter dropdown (All / Awards) next to the sort-by-date toggle on every certificate gallery, each section filtering independently of the others.
- A custom pull-to-refresh gesture on touch devices.

### Fixed
- The sort toggle was accidentally wired to the filter dropdown instead of itself.
- Opening one certificate filter could leave another one open underneath it.
- The "Coming Soon" placeholder was disappearing under a non-"All" filter.

## 2026-09-23

### Added
- GoFitr project card, marked as In Development.
- A Sticky Navbar setting, off by default.

## 2026-09-22

### Fixed
- Remaining hover/click animation gaps.
- Horizontal overflow left behind by the closed-but-in-flow settings panel.
- Elastic overscroll bounce past the page edges (now disabled site-wide).

## 2026-09-21

### Added
- Newest/oldest sort toggle to every Awards gallery.
- New certificates: UTS AI Masterclass, IMGO 2026 Bronze Medal, five depa CODE/KIT certificates, and the ASMOPSS Thailand 2026 English team result.
- Opt-in "Enable Zoom" and "Enable Select/Drag" settings.
- Scroll-reveal, click, and popup animations and transitions across the site.

### Changed
- Site typography switched from Radley/Arimo to Fraunces/Inter.
- Disabled pinch/double-tap zoom and text selection/image dragging by default (both have opt-in settings).
- Restored the language picker with an "unexpected results" warning, and noted that translations are AI-generated.

### Fixed
- Translation gaps found in a full site audit, including settings-panel additions that had bypassed the language system entirely.
- The mobile "Work" submenu wasn't collapsing, leaving a blank gap and a dark box behind it.
- iOS Safari's default tap-highlight box on links/buttons; `:hover` effects no longer stick after a tap on touch devices.
- Accessibility and cascade bugs found in a full audit of the animation work.

## 2026-09-20

### Added
- ASMOPSS Thailand 2026 certificates to Core Discipline.

### Changed
- Deployed the site to Vercel; GitHub Pages now redirects visitors there.

## 2026-09-19

### Changed
- Updated Magnolia's copy for the resort's relocation to St. Cloud, Florida.

## 2026-09-18

### Added
- Standalone web-app support (iOS/Android Home Screen mode) via a web app manifest and meta tags.

## 2026-09-13

### Added
- Magnolia hotel concept project, cross-listed under AI/Coding and Graphics/Drawing.

## 2026-09-05

### Changed
- Refreshed the Tally screenshot gallery for new features.

## 2026-08-15

### Added
- A fanned, browser-mockup screenshot gallery to the Tally page.

### Changed
- Refreshed Tally's screenshots and added a GitHub sign-in mention.

### Fixed
- Nav dropdown and settings panel rendering behind page content.
- Assorted HTML bugs (missing closing tags, invalid attributes).

## 2026-08-06

### Changed
- Updated the Tally page for its expansion into a full finance app.

## 2026-07-31

### Added
- Dedicated Contact page.

### Changed
- Replaced system/default icons (theme toggle, tile arrows, email CTA, settings gear, dropdown caret) with custom SF Symbol-based SVGs.
- Simplified the footer: removed the email signup form and tagline text, swapped the Behance/Dribbble links for GitHub, and moved Terms/Privacy links inline on mobile.
- Reworked the Tally project page for its move to multi-user accounts, and refreshed its screenshots.

### Fixed
- Reduced Motion toggle thumb was invisible against its track in dark mode.

## 2026-07-29

### Added
- Tally project page, with localization (Thai, Mandarin) and screenshots.

## 2026-07-28

### Added
- Tally project card on the AI/Coding page, with a theme-swapped logo cover.

## 2026-07-25

### Added
- Page-transition animations and a Reduced Motion setting.

### Changed
- Refined liquid-glass surfaces: fixed dark-mode contrast, balanced opacity.

### Removed
- The sliding "Kittinat Gerdsri" marquee banner.

## 2026-07-24

### Added
- Date sorting and a "Coming Soon" placeholder for Core Discipline galleries.

### Fixed
- Mobile nav dropdown width and text-size slider label overlap.

## 2026-07-23

### Added
- Text size control, now a 4-step S/M/L/XL slider.

### Changed
- Split language certificates by English/Chinese, added an HSK certificate, and redesigned the nav header.
- Centered Home/Work/Contact nav links on desktop.

## 2026-07-22

### Added
- Site-wide dark mode.

## 2026-07-21

### Added
- Apple touch icon and adaptive light/dark favicons.

### Changed
- Redesigned the nav bar with a floating liquid-glass pill treatment.
- Standardized page titles.

## 2026-07-20

### Added
- Initial static rebuild of the portfolio site.

### Fixed
- Discipline numbering to match nav/grid order.

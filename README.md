# N7 — Modern Banking Landing Page

A pixel-accurate, responsive marketing site for **N7**, a digital banking platform. Built as a static frontend from the Figma design no build framework, no SPA, no Backend.

**Repository:** [github.com/FoundersMind/codelinear](https://github.com/FoundersMind/codelinear)

---

## Overview

This project implements a full-length landing page with eleven distinct sections — from hero and product highlights to case studies and footer. Layout, spacing, typography, and color are mapped to Figma specs using CSS custom properties. The site is optimized for first-load performance while keeping source styles modular and easy to maintain.

### Page sections

| Section | Description |
|---------|-------------|
| **Hero** | Headline, CTAs, product photo, activity card, balance card |
| **Solutions** | Product capability grid with icons |
| **Core Banking** | Feature narrative with dashboard imagery |
| **Efficient Core** | Secondary product story with media |
| **Paperless CTA** | Mid-page conversion block |
| **Logo Marquee** | Partner / trust strip |
| **Digital Banking** | Three phone mockups with feature copy |
| **Insights** | Blog / article cards |
| **Case Studies** | Horizontal carousel with keyboard support |
| **Paperless CTA** | Bottom conversion block |
| **Footer** | Links, social, legal copy |

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Markup | Semantic HTML5 |
| Styling | Custom CSS (BEM-style `n7-*` classes), design tokens |
| Layout helpers | Bootstrap 5.3 (Reboot + `.container` only) |
| Typography | Inter, Archivo, Chivo Mono via Google Fonts |
| Interactivity | Vanilla JavaScript |
| Motion | GSAP 3 + ScrollTrigger (lazy-loaded, respects `prefers-reduced-motion`) |
| Images | SVG icons, WebP for photos and phone mockups |
| Deployment | Vercel (static) |

---

## Performance

- **CSS bundling** — 28 source stylesheets are concatenated into two production bundles (`critical` + `main`) to cut HTTP requests from 27 to 2.
- **Critical path** — Above-the-fold styles (tokens, base, navbar, hero) ship in `critical.bundle.css`.
- **Lazy GSAP** — Animation libraries load only when motion is allowed, keeping the initial JS payload small.
- **WebP assets** — Hero photo and digital-section phone mockups use compressed WebP instead of large SVG exports.
- **Lazy images** — Below-the-fold images use native `loading="lazy"`.

Rebuild bundles after editing source CSS:

```bash
npm run build:css
```

---

## Getting started

### Prerequisites

- A modern browser (Chrome, Edge, Firefox, Safari)
- [Node.js](https://nodejs.org/) 18+ (optional — only needed for CSS bundling)
- Any local static file server

### Run locally

**Option A — VS Code / Cursor Live Server**

Open the project folder and start Live Server on `index.html`.

**Option B — Python**

```bash
python -m http.server 5173
```

Then open [http://localhost:5173](http://localhost:5173).

**Option C — Node**

```bash
npx serve .
```

### Production CSS build

Source styles live in `styles/` and are edited individually during development. Before deploy (or after CSS changes), regenerate bundles:

```bash
npm run build:css
```

Output is written to `styles/bundles/`. Vercel runs this automatically via `vercel.json`.

---

## Project structure

```
codelinear/
├── index.html                 # Single-page entry
├── package.json               # CSS build script
├── vercel.json                # Vercel static deploy config
├── assets/
│   └── images/                # SVGs, WebP, PNG
├── scripts/
│   ├── main.js                # Mobile nav toggle
│   ├── cases-carousel.js      # Case studies carousel
│   ├── gsap-loader.js         # Deferred GSAP loader
│   ├── motion.js              # Scroll / entrance animations
│   └── build-css.mjs          # CSS bundle generator
└── styles/
    ├── tokens.css             # Design tokens (colors, spacing, type)
    ├── base.css               # Reset overrides, global utilities
    ├── motion.css             # Motion-related CSS hooks
    ├── bundles/               # Generated production CSS (do not edit)
    │   ├── critical.bundle.css
    │   └── main.bundle.css
    ├── components/            # Reusable UI (navbar, cards)
    ├── sections/              # Section-specific desktop styles
    └── responsive/            # Breakpoint overrides per section
```

---

## Architecture notes

### CSS organization

Styles follow a **slice-based** structure aligned with Figma frames:

1. **`tokens.css`** — Single source of truth for colors, spacing, typography, z-index, and section dimensions.
2. **`sections/`** — Desktop / 1440px layout for each block.
3. **`responsive/`** — Tablet and mobile overrides (primarily `max-width: 991px` and below).
4. **`components/`** — Shared pieces used across sections (navbar, activity card, balance card).

Class naming uses a **`n7-` BEM** convention (e.g. `.n7-hero__title`, `.n7-btn--primary`).

### Bootstrap usage

Bootstrap 5.3 CSS is included from CDN for **Reboot** (normalize) and the **`.container`** utility. Grid utilities, components, and Bootstrap JS are not used — layout is fully custom.

### JavaScript

All scripts are plain IIFEs with no bundler:

- **`main.js`** — Hamburger menu, `aria-expanded`, Escape-to-close, resize handling.
- **`cases-carousel.js`** — Case study slider with prev/next and keyboard navigation.
- **`gsap-loader.js`** — Loads GSAP + ScrollTrigger on demand, then `motion.js`.
- **`motion.js`** — Scroll-triggered entrance animations for sections and cards.

---

## Deployment

The site deploys to **Vercel** as a static project:

1. Push to the `main` branch on GitHub.
2. Vercel runs `npm run build:css` and publishes the root directory.
3. No environment variables or server-side config required.

---

## Responsive breakpoints

| Breakpoint | Target |
|------------|--------|
| `1440px` | Figma desktop artboard (primary reference) |
| `≤ 991px` | Tablet — stacked layouts, adjusted spacing |
| `≤ 767px` | Mobile — single column, nav drawer |

Responsive rules live in `styles/responsive/` and mirror their section counterparts.

---

## Accessibility

- Semantic landmarks (`header`, `main`, `section`, `footer`, `nav`)
- ARIA labels on carousels, nav toggle, and icon-only controls
- Keyboard support (Escape closes mobile nav; carousel is focusable)
- `prefers-reduced-motion` respected — GSAP is skipped when reduced motion is requested

---

## License

Built for the Codelinear frontend assignment. Assets and design belong to their respective owners.

# Codelinear / N7 Project — Interview Brief for Parakeet.ai

> **Purpose:** Feed this document to Parakeet.ai (or read it before interviews) so you can confidently explain the entire project and answer technical questions.
>
> **One-liner:** A pixel-accurate, high-performance static marketing landing page for **N7** (digital banking platform), built from Figma for the Codelinear frontend assignment — no React/Vue, no SPA, no backend.

---

## 30-Second Elevator Pitch

"I built a full-length fintech marketing landing page for N7 — eleven sections from hero to footer — translating a Figma design into semantic HTML and modular CSS. It's a static site with vanilla JavaScript: custom layout on top of Bootstrap Reboot only, design tokens for Figma fidelity, a CSS bundling pipeline for performance, and GSAP scroll animations that trigger on scroll but don't scrub with scroll — so scrolling stays smooth. It's deployed on Vercel and optimized for Lighthouse metrics like first paint and unused JS."

---

## 2-Minute Deep Pitch

"This is the Codelinear frontend assignment: implement a banking landing page from design to production-quality static frontend.

The page has eleven sections — hero with floating UI cards, solutions grid, core banking narrative, efficient core, paperless CTAs, logo marquee, digital banking with phone mockups, insights cards, a case-study carousel, and footer.

I chose **no framework** intentionally: the brief was design fidelity and performance, not app state. Everything is semantic HTML5, BEM-style `n7-*` classes, and CSS custom properties mapped to Figma values at 1440px.

For CSS I used a **slice-based architecture**: tokens, section desktop styles, responsive overrides, and shared components — 28 source files concatenated into two production bundles (`critical` + `main`) to cut HTTP requests from ~27 down to 2.

JavaScript is four small IIFE modules: mobile nav, carousel, GSAP lazy loader, and a ~1,500-line motion layer. Animations use **GSAP 3 + ScrollTrigger** with a deliberate pattern: scroll only *triggers* fixed-duration tweens — it never drives animation progress frame-by-frame. That avoids scroll jank. GSAP itself is lazy-loaded (~115 KiB off critical path) until the user scrolls, clicks, or the browser is idle.

I also handled accessibility — landmarks, ARIA on carousel and nav, keyboard nav, and `prefers-reduced-motion` — and responsive breakpoints at 991px and 767px."

---

## Project Facts (Quick Reference)

| Item | Value |
|------|-------|
| **Project name** | N7 — Modern Banking Landing Page |
| **Assignment** | Codelinear frontend assignment |
| **Repo** | github.com/FoundersMind/codelinear |
| **Type** | Static single-page site |
| **Entry file** | `index.html` (~1,290 lines) |
| **Sections** | 11 distinct page blocks |
| **CSS source files** | 28 → bundled into 2 |
| **JS files** | 4 runtime + 1 build script |
| **Primary breakpoint** | 992px (desktop vs tablet/mobile) |
| **Figma reference width** | 1440px |
| **Deploy** | Vercel (static, `npm run build:css` on deploy) |
| **No** | React, Vue, Next, backend, API, database, bundler for JS |

---

## Page Sections (What Each Block Does)

| # | Section | Class | Key UI |
|---|---------|-------|--------|
| 1 | **Hero** | `.n7-hero` | Headline, CTAs, hero photo (WebP), activity card, balance card, trusted logos |
| 2 | **Solutions** | `.n7-solutions` | Product capability grid with SVG icons |
| 3 | **Core Banking** | `.n7-core-banking` | Feature copy + dashboard imagery, CB7 watermark 3D reveal |
| 4 | **Efficient Core** | `.n7-efficient-core` | Checklist + media panel |
| 5 | **Paperless (mid)** | `.n7-paperless--after-dashboard` | CB7 SVG watermark, conversion copy + CTAs |
| 6 | **Logo Marquee** | `.n7-marquee` | Infinite partner/trust logo strip |
| 7 | **Digital Banking** | `.n7-digital` | Three phone mockups (WebP), feature pairs, embedded paperless block |
| 8 | **Insights** | `.n7-insights` | Blog/article cards (featured + compact), glow watermark |
| 9 | **Case Studies** | `.n7-cases` | Horizontal carousel, dots, prev/next, keyboard arrows |
| 10 | **Paperless CTA** | `.n7-paperless-cta` | Bottom conversion bar |
| 11 | **Footer** | `.n7-site-footer` | Offices, solution links, socials, legal copy |

---

## Tech Stack (With Interview Talking Points)

### HTML
- Semantic HTML5: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<aside>`
- `aria-labelledby` on sections, `aria-label` on regions without visible headings
- `lang="en"`, viewport meta, meaningful alt text on photos
- Decorative SVGs/icons use `aria-hidden="true"` and empty `alt`
- Data hooks: `data-n7-nav-toggle`, `data-n7-cases-carousel`

### CSS
- **Custom CSS** — no Tailwind, no CSS-in-JS
- **BEM naming** with `n7-` prefix: `.n7-hero__title`, `.n7-btn--primary`
- **Design tokens** in `styles/tokens.css` — colors, spacing, typography, z-index, section dimensions from Figma
- **Slice architecture:**
  - `tokens.css` — single source of truth
  - `sections/` — desktop / 1440px layout per Figma frame
  - `responsive/` — tablet/mobile overrides (`max-width: 991px`)
  - `components/` — reusable UI (navbar, activity card, balance card)
  - `base.css` — global resets, utilities, button base
  - `motion.css` — compositor hints, GSAP/CSS handoff rules
- **Bootstrap 5.3** — Reboot normalize + `.container` only; no Bootstrap grid, components, or JS

### JavaScript
- **Vanilla JS** — IIFEs, no npm bundler for app code
- `main.js` (41 lines) — mobile nav
- `cases-carousel.js` (82 lines) — case study slider
- `gsap-loader.js` (83 lines) — deferred GSAP loading
- `motion.js` (~1,493 lines) — all scroll/entrance/hover animations

### Motion
- **GSAP 3.12.7** + **ScrollTrigger** from jsDelivr CDN
- Lazy-loaded; not on initial page load

### Assets
- SVG for icons, vectors, watermarks
- **WebP** for hero photo and phone mockups (smaller than large SVG/PNG exports)
- `loading="lazy"` on ~35 below-the-fold images

### Fonts
- Google Fonts: **Inter** (display/body), **Archivo** (brand), **Chivo Mono** (nav/labels)
- `preconnect` to fonts.googleapis.com and fonts.gstatic.com

### Deployment
- **Vercel** static hosting
- `vercel.json`: `buildCommand: npm run build:css`, `outputDirectory: .`

---

## Architecture Decisions (WHY Questions)

### Q: Why no React / Next / Vue?
**A:** The assignment is a marketing landing page — mostly static content, no user auth, no client routing, no complex state. A framework would add bundle size, build complexity, and hydration cost without clear benefit. Plain HTML/CSS/JS gives maximum control for Figma pixel-matching and fastest first paint.

### Q: Why Bootstrap if layout is custom?
**A:** Bootstrap is used minimally — only **Reboot** (consistent cross-browser normalize) and the **`.container`** utility. We don't use Bootstrap grid, cards, modals, or Bootstrap JS. It's a pragmatic baseline, not the layout system.

### Q: Why 28 CSS files instead of one big stylesheet during development?
**A:** Maintainability. Each Figma section maps to its own file (`sections/hero.css` + `responsive/hero.css`). Developers edit one slice without merge conflicts across the whole site. Production bundles merge them for performance.

### Q: Why two CSS bundles (critical + main)?
**A:** **Critical path optimization.** Above-the-fold content (tokens, base, navbar, hero, cards) ships in `critical.bundle.css` and loads as a normal blocking stylesheet. Below-the-fold sections go in `main.bundle.css`, which loads **non-blocking** via `media="print"` + `onload="this.media='all'"` so first paint isn't delayed by footer/insights/case-study CSS. A `<noscript>` fallback loads main for users without JS.

### Q: Why lazy-load GSAP?
**A:** GSAP + ScrollTrigger is ~115 KiB. The hero is visible before animations run. We defer until first scroll, pointer interaction, keydown, or `requestIdleCallback` (2s timeout). That improves Lighthouse "unused JavaScript" and Time to Interactive while keeping full motion once engaged.

### Q: Why native scroll instead of Lenis / smooth-scroll libraries?
**A:** Native scroll is GPU-optimized, accessible (respects system scroll settings), and doesn't hijack wheel events. Our animations are **trigger-based**, not scroll-scrubbed — so we don't need a custom scroll engine. Less code, less jank risk.

### Q: Why scroll triggers animations instead of scrubbing?
**A:** **Performance and UX.** Scrubbing ties animation progress to every scroll tick — main-thread heavy. Our pattern: scroll enters viewport → play a **fixed-duration** tween (e.g. 0.7s). Scroll speed doesn't affect animation speed. This is the same approach used on many premium marketing sites (Apple, Stripe-style landings).

### Q: Why `clearProps` after GSAP tweens?
**A:** GSAP applies inline styles during animation. After completion, `clearProps` removes them so **CSS/Figma layout takes over again**. Without this, absolute-positioned Figma elements can drift or fight CSS on resize.

### Q: Why design tokens instead of hardcoded values in components?
**A:** Figma uses specific colors (`#568EB4`, `#000D12`), spacing (80px container pad), and typography scales. Tokens in `:root` let us update the design system in one place and keep section CSS readable (`var(--n7-blue)` vs magic numbers).

---

## CSS Build Pipeline

**File:** `scripts/build-css.mjs`  
**Command:** `npm run build:css`

- Node ESM script concatenates source CSS in strict cascade order
- Outputs to `styles/bundles/` with file banners (generated — do not hand-edit)
- **critical.bundle.css** (9 files): tokens, base, motion, navbar, activity card, balance card, hero
- **main.bundle.css** (19 files): all other sections + responsive pairs
- Vercel runs this automatically on every deploy

**Interview line:** "I built a lightweight CSS bundler without Webpack — just Node `fs` read/concat — because we only needed CSS merging, not JS tree-shaking."

---

## JavaScript Modules (Detailed)

### 1. `main.js` — Mobile Navigation
- Toggles `.is-open` on `.n7-nav`
- Updates `aria-expanded` and `aria-label` (Open/Close menu)
- Locks body scroll on mobile via `body.n7-nav-menu-open { overflow: hidden }`
- **Escape** key closes menu
- Resize to ≥992px auto-closes menu
- Clicking nav links closes menu on mobile
- Passive resize listener for performance

### 2. `cases-carousel.js` — Case Studies Carousel
- Root: `[data-n7-cases-carousel]`
- Slide track uses `translate3d(-index * 100%, 0, 0)` for GPU compositing
- Integrates with `window.N7Motion.carouselTo()` when GSAP is loaded (smooth GSAP tween); falls back to CSS transform
- Updates `aria-hidden` on slides, `aria-selected` on dots
- **Keyboard:** ArrowLeft / ArrowRight on carousel root
- Prev/next buttons + dot pagination
- `matchMedia` for mobile viewport height sync on resize

### 3. `gsap-loader.js` — Deferred Animation Boot
Boot order:
1. If `prefers-reduced-motion` → load only `motion.js` (static mode)
2. Else → GSAP → ScrollTrigger → `motion.js`
3. Triggers: first `scroll`, `pointerdown`, `keydown`, or `requestIdleCallback` (2s fallback: `load` + 1.2s timeout)
4. Exposes `window.N7Motion` early with `carouselTo` fallback for carousel before GSAP loads

### 4. `motion.js` — Motion System (~1,493 lines)

#### Core principles (memorize these)
1. **Scroll triggers, never scrubs** — `toggleActions: "play none none none"`, `once: true`
2. **Fixed-duration tweens** — paused tweens play at full speed on enter
3. **Compositor-friendly** — `force3D: true`, animate `transform` + `opacity` not `width`/`height`/`top`
4. **Layout handoff** — `clearProps` after tweens; CSS owns final positions
5. **Fast-scroll safety** — `fastScrollEnd: true`, `flushMissedReveals()`, `snapRevealComplete()`

#### Key functions
| Function | Purpose |
|----------|---------|
| `registerScrollReveal()` | One-shot ScrollTrigger + paused tween |
| `scrollRevealUp()` | Declarative fade/slide-up reveals; uses `ScrollTrigger.batch()` for stagger |
| `registerWatermarkDepthReveal()` | 3D watermark entrance (CB7/N7 marks with perspective, blur, z-axis) |
| `initHeroMotion()` | Timeline: photo + cards animate in; left copy stays static |
| `initDigitalMotion()` | Complex multi-beat digital section sequence |
| `initInsightsMotion()` | Glow orbit + card reveals |
| `initCoreBankingMarksMotion()` | CB7 3D watermark |
| `initPaperlessN7MarksMotion()` | N7 watermark inside digital section |
| `initPaperlessCtaMotion()` | Bottom CTA bar reveals |
| `initFooterMotion()` | Footer glow, logo, grid, copy |

#### ScrollTrigger config
```js
ScrollTrigger.config({ limitCallbacks: true }); // fewer callbacks during scroll
```

#### Responsive motion
- `gsap.matchMedia()` (`mm`) — different animation params at `min-width: 992px` vs `max-width: 991px`
- Desktop: lateral slides (`x: ±80px`); mobile: vertical (`y: 48px`)
- `layoutDesktopMq` change → `ScrollTrigger.refresh()` + `flushMissedReveals()` + `clearTransform()`

#### Hover interactions (desktop)
- `bindPressable`, `bindHoverLift`, `bindLinkArrow` — subtle GSAP micro-interactions
- Navbar excluded from opacity/transform animations to preserve `navbar.css` styling

#### Reduced motion
- `prefers-reduced-motion: reduce` → skip GSAP, add `n7-motion-static`, carousel uses CSS transition
- Media query change → `window.location.reload()` to re-init cleanly

#### Global API
```js
window.N7Motion = { enabled, carouselTo(track, index) }
```

---

## Performance Optimizations (Lighthouse-Focused)

| Optimization | Implementation |
|--------------|----------------|
| Fewer HTTP requests | 28 CSS files → 2 bundles |
| Critical CSS split | Hero/nav in first bundle |
| Deferred heavy JS | GSAP lazy-loaded on interaction |
| Image format | WebP for photos/mockups |
| Lazy loading | `loading="lazy"` on below-fold images |
| Compositor animations | `transform`, `opacity`, `force3D`, selective `will-change` |
| Passive listeners | `{ passive: true }` on scroll/resize |
| No layout thrashing | Avoid animating layout properties; `clearProps` after tweens |
| Font preconnect | Faster Google Fonts load |

**What we did NOT do (and why):**
- No SSR/SSG framework — static HTML is already fast
- No service worker — single landing page, overkill
- No image CDN transforms — assets are local/static

---

## Responsive Design

| Breakpoint | Behavior |
|------------|----------|
| **1440px** | Primary Figma artboard; `max-width: 1440px` centered `.n7-page` |
| **≤ 991px** | Tablet — stacked layouts, hamburger nav, adjusted spacing |
| **≤ 767px** | Mobile — single column, tighter padding |

- Rules live in `styles/responsive/` mirroring each `sections/` file
- Motion uses same 992px breakpoint via `matchMedia`
- Bootstrap Reboot img rule overridden for Figma-positioned assets (hero photo, laptops, phones) — `max-width: none` so absolute layouts don't collapse

---

## Accessibility

| Feature | Details |
|---------|---------|
| Landmarks | `header`, `main`, `section`, `footer`, `nav` |
| Section labels | `aria-labelledby` pointing to visible headings |
| Carousel | `aria-hidden` on inactive slides, `aria-selected` on dots, keyboard arrows |
| Nav toggle | `aria-expanded`, dynamic `aria-label` |
| Decorative icons | `aria-hidden="true"`, empty alt |
| Focus | Carousel root is focusable for keyboard nav |
| Motion | `prefers-reduced-motion` disables GSAP animations |
| Color | High contrast fintech palette; muted text via `--n7-text-muted` |

---

## Figma-to-Code Workflow

1. **Tokens first** — map Figma colors, type scales, spacing to `tokens.css`
2. **Desktop section CSS** — absolute/precise positioning at 1440px in `sections/`
3. **Responsive overrides** — stack/reflow in `responsive/` without rewriting desktop
4. **Components** — extract repeated UI (navbar, cards) to `components/`
5. **HTML slices** — comment markers in `index.html` (`<!-- Slice 2 + 3: Hero -->`)
6. **Motion last** — entrance animations that don't shift final layout

**Key challenge:** Figma uses absolute positioning; CSS must match at 1440px but reflow on mobile. Tokens + scoped responsive files keep this manageable.

---

## Common Interview Questions & Answers

### "Walk me through the project."
Use the **2-Minute Deep Pitch** above, then offer to go deeper on CSS architecture, motion, or performance.

### "What was the hardest part?"
"Keeping **Figma pixel fidelity** at 1440px while making eleven sections fully responsive. The digital banking section has multiple phone mockups with absolute coordinates — I used scoped tokens, separate responsive files, and GSAP `clearProps` so animations don't break the layout after they finish."

### "How did you handle animations without scroll lag?"
"Native browser scroll + GSAP ScrollTrigger as a **one-shot trigger**. Each reveal is a paused tween that plays at fixed duration when the element enters the viewport — scroll never scrubs animation progress. I also use `force3D`, `fastScrollEnd`, `limitCallbacks`, and `ScrollTrigger.batch` for staggered lists. GSAP is lazy-loaded so it doesn't block first paint."

### "Why not use Intersection Observer directly?"
"ScrollTrigger builds on the same idea but adds timeline integration, batching, refresh on resize, and `fastScrollEnd` for flick scrolling. For a GSAP-heavy page, one system is simpler than mixing IO + GSAP."

### "How is CSS organized?"
"Slice-based: tokens → sections (desktop) → responsive (mobile) → components. BEM `n7-` prefix. 28 dev files bundled to 2 production files via a Node concat script."

### "How would you scale this?"
"Current setup is right for one polished landing. To scale: split `motion.js` by section, use `data-reveal` attributes for generic reveals, add ScrollTrigger cleanup for SPA routes, and CMS-driven content. The **scroll-as-trigger pattern** scales well performance-wise; the monolithic motion file doesn't scale for many pages."

### "What would you improve?"
"Split motion.js into modules, add a visual regression test against Figma screenshots, consider `font-display: swap` audit, and data-attribute-driven reveals to reduce per-section boilerplate."

### "Did you use any build tools?"
"Only for CSS: `build-css.mjs` concatenates styles. No Webpack/Vite for JS — scripts are small enough to load individually with `defer`."

### "How do you deploy?"
"Push to GitHub `main` → Vercel runs `npm run build:css` → static files served from repo root. No env vars, no server."

### "Explain the carousel."
"CSS transform-based slider on a track element. Index wraps modulo slide count. When GSAP is available, `N7Motion.carouselTo` animates `xPercent` with GSAP; otherwise plain `translate3d`. ARIA and keyboard support for accessibility."

### "What is BEM and how did you use it?"
"Block Element Modifier. Block: `n7-hero`. Element: `n7-hero__title`. Modifier: `n7-btn--primary`. Prefix `n7-` namespaces the project and avoids collisions with Bootstrap."

### "What are CSS custom properties / design tokens?"
"Variables in `:root` like `--n7-page-width: 1440px` and `--n7-blue: #568EB4`. Single source of truth from Figma. Sections reference tokens instead of hardcoded values — easier theming and design updates."

### "What is `prefers-reduced-motion`?"
"OS-level accessibility setting for users who want less animation. We detect it via `matchMedia`, skip GSAP, show static content, and use CSS transitions only where needed (e.g. carousel)."

### "What is the critical rendering path?"
"Sequence browser follows to paint first content. We optimized it by: blocking only critical CSS for hero/nav, deferring main.bundle.css with the print/onload pattern, deferring GSAP, preconnecting fonts, lazy-loading images, and using `defer` on scripts."

### "Difference between `defer` and `async` on scripts?"
"`defer` — download parallel, execute after HTML parse, order preserved. We use `defer` on all four scripts so DOM is ready and order is `main.js` → `cases-carousel.js` → `gsap-loader.js`."

---

## File Structure (Memorize)

```
codelinear/
├── index.html              # Single-page entry (~1,290 lines)
├── package.json            # npm run build:css only
├── vercel.json             # Vercel deploy config
├── INTERVIEW_PREP.md       # This document
├── assets/images/          # SVG, WebP, PNG
├── scripts/
│   ├── main.js             # Mobile nav (41 lines)
│   ├── cases-carousel.js   # Carousel (82 lines)
│   ├── gsap-loader.js      # Lazy GSAP loader (83 lines)
│   ├── motion.js           # All animations (~1,493 lines)
│   └── build-css.mjs       # CSS bundle generator
└── styles/
    ├── tokens.css          # Design tokens
    ├── base.css            # Global base + utilities
    ├── motion.css          # Motion/CSS handoff
    ├── bundles/            # Generated (critical + main)
    ├── components/         # navbar, activity-card, balance-card
    ├── sections/           # Desktop layouts per section
    └── responsive/         # Mobile/tablet overrides
```

---

## Numbers to Cite in Interviews

- **11** page sections
- **28** CSS source files → **2** production bundles
- **~1,290** lines HTML
- **~1,493** lines motion.js
- **4** runtime JS files (all deferred)
- **~115 KiB** GSAP+ScrollTrigger deferred off critical path
- **35** lazy-loaded images
- **992px** primary responsive breakpoint
- **1440px** Figma/desktop canvas width

---

## Tradeoffs (Show Senior Thinking)

| Choice | Pro | Con |
|--------|-----|-----|
| No framework | Fast FCP, simple deploy | Harder to scale to multi-page app |
| Monolithic motion.js | All motion in one place | Harder for team parallel work |
| CDN GSAP | No bundler setup | External dependency, needs network |
| Figma absolute layout | Pixel-perfect desktop | More responsive CSS work |
| Trigger-only scroll anim | Smooth scroll | No scroll-scrubbed parallax storytelling |

---

## Demo / Run Commands

```bash
# Local dev
python -m http.server 5173
# or: npx serve .

# Rebuild CSS after editing styles/
npm run build:css
```

Open: http://localhost:5173

---

## Suggested Parakeet.ai Usage

1. Load this entire document as context before the interview.
2. For **"tell me about your project"** → use **2-Minute Deep Pitch**.
3. For **technical follow-ups** → search this doc by keyword (GSAP, CSS, carousel, performance, a11y).
4. For **"what would you do differently"** → use **Tradeoffs** + **How would you scale** sections.
5. Mention **Codelinear assignment** and **Figma-to-production** workflow — shows you understand design handoff.

---

## Brand / Product Context

- **N7** — digital banking platform (marketing brand)
- **CB7** — core banking product (watermark/branding in sections)
- **Linktia Infosystems Limited** — company in footer copyright
- Page goal: lead generation (Request Demo, Contact Us CTAs throughout)

---

*Last updated: project state as of Codelinear N7 landing implementation.*

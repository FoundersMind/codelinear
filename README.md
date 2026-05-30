# N7 Frontend (Pixel-perfect from Figma)

Static frontend implementation of the N7 Figma design using **HTML + CSS + Bootstrap + vanilla JS**.

## Run locally

Option A (recommended): use VS Code / Cursor "Live Server" extension.

Option B: Python simple server:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

## Project structure

- `index.html` - entry page
- `pages/` - additional pages (if needed)
- `styles/`
  - `tokens.css` - design tokens (colors, spacing, typography, radius, shadows)
  - `base.css` - base styles + utilities
  - `components/` - reusable components (navbar, buttons, cards, etc.)
  - `sections/` - page sections (hero, trusted-by, etc.)
- `scripts/` - vanilla JS (`main.js`, `cases-carousel.js`, `gsap-loader.js` defers GSAP ~115 KiB, `motion.js`)
- `assets/` - images, icons, fonts (if provided)


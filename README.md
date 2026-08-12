<div align="center">

# XTRN

### Premium Sports & Activewear E-Commerce

*Built with React · Vite · GSAP · Tailwind CSS v4*

</div>

---

## Overview

**XTRN** is a modern, performance-focused sports and activewear e-commerce storefront. Designed for athletes and enthusiasts across Men, Women, Sports, and Accessories categories, XTRN delivers a premium shopping experience with fluid animations, a responsive multi-level navigation system, and a clean, high-impact UI.

> This repository contains the frontend client. The backend (MERN stack) is in active development.

---

## Live Preview

> Coming soon.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animations | GSAP 3 |
| Icons | React Icons (Feather) |
| Slider | Swiper.js |
| Language | JavaScript (ES Modules) |

---

## Features

### Navigation
- **Desktop** — Full-width mega menu with hover-triggered category columns, smooth GSAP colour transitions on scroll, and a 4K-ready layout
- **Mobile & Tablet** — Multi-level hamburger navigation with path-based state (`menuPath`), slide animations between levels, and scroll-locked overlay
- Categories supported: **MEN · WOMEN · SPORTS · ACCESSORIES · SALE**
- 3 navigation levels: Category → Section → Item

### UI & UX
- Hero section with full-viewport layout
- Trending Products grid
- Explore Sports section
- Featured Collections showcase
- GSAP-powered micro-animations and transitions
- Fully responsive: mobile · tablet · desktop · 4K

### Performance
- Vite for near-instant HMR and optimised production builds
- Tree-shaken icon imports
- `will-change` and `overwrite` hints for GSAP performance


## Getting Started

### Prerequisites

- Node.js `>= 18`
- npm `>= 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/xtrn.git
cd xtrn

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

### Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |

---

## Navigation Architecture

All category data lives in a single file and is shared between the desktop mega menu and the mobile/tablet multi-level menu.

```
Navigation.js
      |
      |─────────────────────────────┐
      ↓                             ↓
Desktop MegaMenu          Mobile / Tablet Menu
(hover, mega columns)     (path-based, multi-level)
```

To add or edit categories, only edit `Navigation.js` — both menus update automatically.

---

## Responsive Breakpoints

| Breakpoint | Layout |
|---|---|
| `< 768px` | Mobile navbar + hamburger overlay |
| `768px – 1023px` | Tablet navbar + same hamburger overlay |
| `>= 1024px` | Desktop navbar + hover mega menu |
| `>= 1536px` | 4K desktop layout |

---

## Roadmap

- [ ] React Router — category and product pages
- [ ] Product listing and filtering
- [ ] Product detail page
- [ ] Cart and wishlist
- [ ] User authentication (MERN backend)
- [ ] Checkout flow
- [ ] Search with live suggestions
- [ ] Admin panel

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">
Made with care — XTRN
</div>

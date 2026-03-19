# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VietJewelers — a React e-commerce storefront for a Vietnamese jewelry brand. Static product data is generated from a Shopify CSV export, served as JSON, and rendered client-side. No backend; no payment processing yet.

## Commands

- **Dev server:** `npm run dev` (Vite on port 3000)
- **Build:** `npm run build` (runs data processing + sitemap generation + Vite build)
- **Type-check:** `npm run lint` (runs `tsc --noEmit`)
- **Process product data:** `npm run data:process` (parses `products_export_1.csv` → `public/data/*.json`)
- **Generate sitemap:** `npm run sitemap`
- **Preview production build:** `npm run preview`

## Architecture

### Data Pipeline
`products_export_1.csv` → `scripts/process-csv.ts` → `public/data/{products,categories,collections}.json`

The CSV is a Shopify product export. The processing script groups rows by handle, infers categories from product type, maps types to collections, and outputs JSON consumed at runtime. **You must run `npm run data:process` after modifying the CSV or the processing script** — the build does this automatically but dev server does not.

Other static data files (`blog-posts.json`, `testimonials.json`) are hand-maintained in `public/data/`.

### Frontend Stack
- **React 19** + **React Router 7** (client-side routing via `BrowserRouter`)
- **Tailwind CSS 4** via `@tailwindcss/vite` plugin (no `tailwind.config` file — uses CSS-first configuration in `src/index.css`)
- **Zustand** for state (cart, wishlist, UI toggles) — stores persist to localStorage
- **i18next** for English/Vietnamese translations (`src/i18n/{en,vi}.json`), language saved to localStorage
- **Fuse.js** for client-side fuzzy search
- **Gemini API** (`@google/genai`) powers the floating chatbot — requires `VITE_GEMINI_API_KEY` in `.env.local`
- **Motion** (formerly Framer Motion) for animations
- **Swiper** for carousels
- **react-helmet-async** for SEO meta tags

### Path Alias
`@/` maps to `src/` (configured in both `vite.config.ts` and `tsconfig.json`).

### Routing
All pages are lazy-loaded in `src/App.tsx`. URL structure mirrors Shopify conventions:
- `/collections/:handle`, `/products/:handle`, `/pages/:slug`, `/blogs/news/:handle`

### Key Patterns
- **Product data loading:** `useProducts()` hook fetches JSON once and caches in module-level variables. All pages share this cache.
- **Filtering:** `filterProducts()` in `src/hooks/useProducts.ts` handles category/collection/type/price/availability/sort filtering.
- **State stores:** `src/stores/` — `cartStore` (persisted), `wishlistStore` (persisted), `uiStore` (search overlay, quick view, mobile menu toggles).
- **Components:** organized as `layout/` (header, footer, mobile nav, chat), `sections/` (homepage blocks), `ui/` (reusable pieces like ProductCard, FilterSidebar, etc.).

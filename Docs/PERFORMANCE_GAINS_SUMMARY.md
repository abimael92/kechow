# Performance Gains Summary (Fast App)

This document summarizes performance optimizations applied to the Kechow client and the resulting gains.

---

## 1. Lazy-Load Routes

**What was done**

- **Layouts** are now lazy-loaded: `MainLayout`, `CustomerLayout`, `OwnerLayout`, `DeliveryLayout` are loaded only when a route that uses them is visited.
- **All page components** use dynamic `import()`: public (Landing, Login, Register), customer (Home, RestaurantList, RestaurantDetail, Cart, Checkout, Orders, etc.), owner, and delivery pages load on demand.

**Impact**

- **Smaller initial bundle**: The first load only fetches the router, auth guard, and the layout + page for the current route (e.g. Landing or Login). Owner, delivery, and heavy customer pages are not in the initial JS.
- **Faster Time to Interactive (TTI)**: Less JavaScript to parse and execute on first visit.
- **Role-based loading**: Customers don’t download owner/delivery code; owners don’t download delivery/customer-heavy code.

**Files**

- `kechow-client/src/app/router/index.ts` — All route components and layouts use `() => import('...')`.

---

## 2. Code Splitting

**What was done**

- **Vite `manualChunks`** in `vite.config.ts` split `node_modules` into:
  - `vue` — Vue runtime
  - `vue-router` — Router
  - `pinia` — State
  - `axios` — HTTP client
  - `charts` — Chart.js + vue-chartjs
  - `i18n` — vue-i18n
  - `vendor` — Remaining dependencies (e.g. headlessui, heroicons, lucide-vue-next, vue-toastification)

**Impact**

- **Better caching**: Vue, router, and vendor change less often than app code; separate chunks allow long-term caching.
- **Parallel downloads**: Browser can request multiple chunks in parallel.
- **Smaller incremental updates**: App changes don’t invalidate the whole vendor bundle.

**Files**

- `kechow-client/vite.config.ts` — `build.rollupOptions.output.manualChunks`.

---

## 3. Memoization

**What was done**

- **Cart store getters**: `totalItemCount` and `totalPrice` are computed once per store state; components use these instead of re-running `reduce` in their own computed.
- **`useFilteredRestaurants`**: Now accepts `MaybeRefOrGetter` for `restaurants`, `search`, and `selectedCategory`, and uses `toValue()` inside a single `computed`, so filtering is reactive and cached until inputs change.
- **Shared `memo()` utility**: `@shared/utils/memo.ts` provides a simple memoization helper for expensive pure functions (e.g. formatting, sorting). Prefer Vue `computed()` for reactive data; use `memo()` for one-off or non-reactive heavy work.

**Impact**

- **Fewer repeated calculations**: Cart totals and filtered lists are derived once per dependency change.
- **Reactive filtering**: Callers can pass refs to `useFilteredRestaurants` and get correct updates without extra wiring.

**Files**

- `kechow-client/src/features/customer/cart/cart.store.ts` — `getters.totalItemCount`, `getters.totalPrice`.
- `kechow-client/src/shared/composables/useFilteredRestaurants.ts` — `MaybeRefOrGetter` + `toValue` + single `computed`.
- `kechow-client/src/shared/utils/memo.ts` — `memo(fn, keyFn?)`.

---

## 4. Asset Optimization

**What was done**

- **Build settings** in `vite.config.ts`:
  - `assetsInlineLimit: 4096` — Assets under 4 KB are inlined as base64 to reduce HTTP requests.
  - `chunkSizeWarningLimit: 600` — Allow larger chunks before warning (e.g. charts bundle).
  - `chunkFileNames` / `entryFileNames` / `assetFileNames` — Hashed filenames under `assets/js` and `assets/[ext]` for cache busting and clear structure.
  - `minify: 'esbuild'` — Fast minification (default).
  - `cssCodeSplit: true` — Per-route CSS where possible (default).

**Impact**

- **Small assets inlined**: Fewer round-trips for tiny SVGs/icons.
- **Stable cache keys**: Hashed filenames so new deploys don’t reuse old cached JS/CSS.
- **Controlled chunk size**: Warnings only for very large chunks (e.g. charts), so heavy libs don’t hide in one giant bundle.

**Files**

- `kechow-client/vite.config.ts` — `build` section.

---

## Build Output (Reference)

After a production build, the app emits:

- **Entry**: `index-[hash].js` (router + app bootstrap).
- **Vendor chunks**: `vue`, `vue-router`, `pinia`, `axios`, `charts`, `i18n`, `vendor`.
- **Route/layout chunks**: One (or more) chunk per lazy route and layout (e.g. `MainLayout`, `HomePage`, `OwnerDashboardPage`, `AnalyticsPage`), so initial load stays small and role-specific code loads on demand.

---

## Summary

| Area              | Change                                           | Benefit                                  |
|-------------------|--------------------------------------------------|------------------------------------------|
| **Lazy routes**   | All layouts + pages use dynamic `import()`       | Smaller initial bundle, faster TTI       |
| **Code splitting**| Manual chunks for Vue, router, pinia, axios, etc.| Better caching, parallel loads           |
| **Memoization**   | Cart getters, reactive `useFilteredRestaurants`, `memo()` | Fewer repeated calculations, reactive filtering |
| **Assets**        | Inline limit, hashed filenames, chunk limits     | Fewer requests, cache busting, clear sizes |

Together, these changes make the app **faster** on first load and when switching routes, with **better caching** and **less redundant work** in the client.

# Phase 4 — Frontend Final Structure (Vue 3 + TypeScript)

**Target:** Feature-based, maintainable, production-ready client for Kechow (Ciudad Jiménez, Chihuahua, México).

---

## 1. Principles

- **Feature-based** structure under `src/features/<feature>`.
- **Shared** UI and layout under `src/shared` and `src/components`.
- **Single API client** (axios) with base URL and auth interceptors; all API calls via feature services.
- **Pinia stores** per feature; no duplicate store ids (single driver/delivery state source).
- **Route guards** by role; **layouts** per role (Main, Customer, Owner, Delivery).
- **Aliases** for stable imports: `@`, `@app`, `@features`, `@shared`, `@assets`, `@components`, `@layout`, `@pages`, `@store`.
- **Lazy loading** for role-specific and heavy routes.
- **i18n** for all user-facing text (Spanish default); keys in locale files.
- **SEO:** Meta (title, description) per route; Spanish for Jiménez market.

---

## 2. Final Folder Structure

```
kechow-client/src/
├── app/                                    # Core app (alias @app)
│   ├── config/
│   │   ├── app.config.ts
│   │   └── theme.config.ts
│   ├── lib/
│   │   └── axios.ts                        # Single API instance; interceptors
│   ├── locales/
│   │   ├── es.json
│   │   └── en.json
│   ├── router/
│   │   ├── index.ts                        # Route definitions, lazy imports
│   │   └── guards.ts                      # authGuard, role check
│   └── store/
│       ├── auth/
│       │   ├── auth.store.ts
│       │   └── auth.service.ts
│       ├── user.store.ts
│       └── theme.store.ts
├── assets/
│   ├── styles/
│   │   └── global.css
│   └── ...
├── components/                             # Shared global components
│   ├── layout/
│   ├── landing/
│   ├── Header.vue
│   ├── Footer.vue
│   ├── RestaurantCard.vue
│   └── ...
├── composables/                            # Global composables
│   └── useOfflineSync.ts
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterView.vue
│   │   └── ...
│   ├── business-owner/
│   │   ├── components/
│   │   ├── containers/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── views/
│   ├── customer/
│   │   ├── addresses/
│   │   ├── cart/
│   │   ├── services/
│   │   ├── store/
│   │   ├── types/
│   │   └── views/
│   └── delivery/
│       ├── components/                     # OrderCard, DriverHeader, DriverStats, etc.
│       ├── containers/                    # OrdersPanel, EarningsPanel, ProfilePanel
│       ├── services/
│       │   ├── delivery.service.ts        # Single service: availability, jobs, orders, stats, earnings, settings
│       │   └── echo.ts                    # WebSocket (optional)
│       ├── store/
│       │   ├── delivery.store.ts          # Single store: availability, jobs, active, completed, earnings, loading, error
│       │   └── stats.store.ts             # Optional: derived or cached stats
│       │   # REMOVE or merge: driver.store.ts duplicate; remove useDriverStore.ts (conflicting id)
│       ├── types/
│       │   └── index.ts
│       └── views/
│           ├── DeliveryDashboard.vue
│           ├── DeliveryOrderDetail.vue     # Full implementation with API
│           ├── EarningsView.vue
│           ├── LiveDelivery.vue
│           ├── OrdersView.vue
│           └── DeliverySettings.vue
├── pages/                                  # Route-level pages (thin wrappers or direct views)
│   ├── LandingPage.vue
│   ├── HomePage.vue
│   ├── RestaurantListPage.vue
│   ├── RestaurantDetailView.vue
│   ├── customer/
│   │   ├── CartPage.vue
│   │   ├── CheckoutPage.vue
│   │   ├── OrdersPage.vue
│   │   ├── OrderTrackingPage.vue
│   │   ├── ProfilePage.vue
│   │   └── ReviewsPage.vue
│   ├── delivery/
│   │   ├── DashboardPage.vue              # Optional; or use DeliveryDashboard as page
│   │   ├── EarningsPage.vue
│   │   ├── OrderDetailPage.vue
│   │   └── ProfilePage.vue                # Single; remove ProfilPage.vue typo
│   └── owner/
│       ├── OwnerDashboardPage.vue
│       ├── MenuPage.vue
│       ├── OrdersListPage.vue
│       ├── EditMenuItemPage.vue
│       ├── AnalyticsPage.vue
│       ├── ReviewsPage.vue
│       └── OwnerSettingsPage.vue
├── shared/
│   ├── layout/
│   │   ├── MainLayout.vue
│   │   ├── CustomerLayout.vue
│   │   ├── OwnerLayout.vue
│   │   ├── DeliveryLayout.vue
│   │   ├── RoleNavigation.vue
│   │   └── BottomNav.vue
│   ├── ui/
│   │   ├── NavButton.vue
│   │   └── NotFoundPage.vue
│   ├── data/
│   │   └── nav.config.ts                  # i18n keys for nav labels
│   ├── utils/
│   │   └── role.utils.ts
│   └── composables/
├── types/                                  # Global types
│   └── ...
├── main.ts
└── env.d.ts
```

---

## 3. Alias Configuration

**vite.config.ts:**

```ts
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
    '@app': path.resolve(__dirname, './src/app'),
    '@features': path.resolve(__dirname, './src/features'),
    '@shared': path.resolve(__dirname, './src/shared'),
    '@assets': path.resolve(__dirname, './src/assets'),
    '@components': path.resolve(__dirname, './src/components'),
    '@layout': path.resolve(__dirname, './src/shared/layout'),
    '@pages': path.resolve(__dirname, './src/pages'),
    '@store': path.resolve(__dirname, './src/app/store'),
  },
},
```

**tsconfig.json (paths):** Mirror the same paths with `baseUrl: "./src"` and `paths` for `@/*`, `@app/*`, `@features/*`, etc.

Optional: add `@core` as alias to `./src/app` if desired.

---

## 4. Router Conventions

- **Layouts:** One layout per role (Main for landing/login; Customer, Owner, Delivery for dashboards).
- **Guards:** Single `authGuard` that:
  - Redirects unauthenticated users to `/login` for protected routes.
  - Redirects authenticated users away from public routes (landing, login, register) to role dashboard.
  - For protected routes with `meta.role`, redirects if `user.role` does not match (e.g. customer hitting delivery URL → customer home).
- **Lazy loading:** Use `() => import('@pages/...')` or `() => import('@features/...')` for all role-specific and heavy pages. Eager only for landing, login, register, home, restaurant list/detail if needed for initial load.
- **Meta:** `requiresAuth: true`, `role: 'delivery' | 'customer' | 'owner' | 'admin'`. Optional: `title`, `description` for SEO (set in guard or route meta and applied via composable or head manager).

---

## 5. Delivery Module — State and API Contract

**Single store (delivery.store.ts):**

- State: `availability`, `availableJobs`, `activeOrder`, `completedOrders` (paginated list), `earningsSummary`, `loading`, `error`, `earningsLoading`, `earningsError`.
- Actions: `initialize`, `toggleAvailability`, `loadAvailableJobs`, `acceptDeliveryOrder`, `rejectOrder`, `updateStatus`, `loadEarningsSummary(period)`, `loadCompletedOrders(page)`, `loadOrderDetail(id)`.
- No second store with same Pinia id; remove or merge `useDriverStore.ts` and ensure `driver.store.ts` (if kept) only holds complementary state or is merged into delivery store.

**Single service (delivery.service.ts):**

- Base URL: from env (`VITE_API_URL`); path prefix `/api/v1` (or current `/api` until backend is versioned).
- Endpoints: GET/POST availability, GET jobs/available, POST jobs/:id/accept, POST jobs/:id/reject, GET orders/active, GET orders/completed, GET orders/:id (if backend adds), PATCH orders/:id/status, GET stats, GET earnings, GET/PATCH settings.
- All labels in UI via i18n (es.json); no hardcoded Spanish in template.

---

## 6. Error and Loading States

- **Delivery:** Every panel (Orders, Earnings) shows loading skeleton or spinner when `loading`/`earningsLoading`; error message when `error`/`earningsError`; empty state when list is empty.
- **Global:** Optional error boundary component for delivery (or app) to catch render errors and show fallback UI instead of white screen.

---

## 7. SEO and Meta

- **index.html:** Spanish default; meta title and description for Kechow (Jiménez, Chihuahua). Favicon and manifest as now.
- **Per-route:** Use Vue Router `meta.title`, `meta.description` and a composable or beforeEnter to set document title and meta (e.g. vue-meta or manual `document.title`). All in Spanish for local SEO.

---

## 8. Migration from Current State

1. Add `loadEarningsSummary`, `earningsSummary`, `loadCompletedOrders`, `completedOrdersList` to delivery store; call real API; remove hardcoded data from EarningsPanel and OrdersPanel.
2. Implement DeliveryOrderDetail view and route; add GET order detail in service and store.
3. Add `rejectOrder` to store and wire to OrdersPanel.
4. Remove or merge `useDriverStore.ts`; ensure one driver/delivery state source.
5. Move all delivery Spanish strings to `es.json`; replace hardcoded text with `$t()` / `t()`.
6. Delete or rename `ProfilPage.vue`; fix route to ProfilePage.
7. Align API base path with backend (add `/v1` when backend is versioned).
8. Add loading/error/empty states to Orders and Earnings panels.
9. Optional: add `@core` alias; add error boundary and route meta for SEO.

This structure keeps roles and features clearly separated, supports lazy loading and maintainability, and is ready for production and future mobile (API-first).

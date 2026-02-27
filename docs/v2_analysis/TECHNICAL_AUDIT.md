# Kechow — Technical Audit (Deep-Dive)

**Version:** v2 Analysis  
**Date:** February 2026  
**Audience:** Tech team (PM, Devs, DevOps, Data Engineering)

---

## 1. Architecture Overview

| Component | Stack | Location |
|-----------|--------|-----------|
| API | Laravel 12, PHP 8.2+ | `kechow-server/` |
| Frontend | Vue 3, Vite 6, Pinia, Vue Router, Tailwind | `kechow-client/` |
| DB | Laravel migrations, Eloquent (MySQL/PostgreSQL/SQLite) | `kechow-server/database/` |
| Auth | Laravel Sanctum (Bearer token) | Api\AuthController, auth:sanctum |
| Realtime | Laravel Reverb, Pusher protocol, Laravel Echo | config/reverb.php, frontend Echo |

Monorepo: two main apps (server, client); shared docs in `kechow-docs/` and `docs/`.

---

## 2. Backend (Laravel)

### 2.1 Structure

- **Modules:** Auth, Owner (admin CRUD for owners), Restaurant (CRUD + menu items), Order (customer/owner/driver flows), Cart.
- **Global API for delivery:** `App\Http\Controllers\Api\Driver\DeliveryController` — availability, jobs, accept/reject, active order, order detail, status update, completed orders, stats, earnings, settings.
- **Models:** User, Driver, Delivery in `app/Models/`; Order, OrderItem, Restaurant, MenuItem, Cart, CartItem in Modules or app.
- **Policies:** DeliveryPolicy; ownership checks for restaurant/order.
- **Form Requests:** LoginRequest, UpdateAvailabilityRequest, UpdateDeliveryStatusRequest, CreateOrderRequest, UpdateOrderStatusRequest, MenuItemRequest, etc.
- **API response:** ApiResponse trait (`success`, `error`); frontend expects `{ success, data }` and unwraps to `data`.

### 2.2 API Versioning and Rate Limiting

- All routes under `Route::prefix('v1')` in `api.php`; throttle `60,1` (60 req/min).
- Base URL for frontend: `/api/v1`.

### 2.3 Order and Delivery Logic

- **Order statuses:** pending, accepted, preparing, ready, out_for_delivery, delivered, cancelled. **OrderStateMachine** enforces valid transitions by role.
- **Delivery flow (DeliveryController):** Drivers see **pending** orders with no delivery record; on accept, a **deliveries** row is created and order set to accepted. Delivery status: assigned → picked_up → in_transit → delivered (or cancelled).
- **Order module driver routes** use `Order::STATUS_READY` and `driver_id` for “available” orders; **DeliveryController** uses `pending` and `whereDoesntHave('delivery')`. Two parallel flows exist; unification recommended.

### 2.4 Database

- Migrations for users, user_addresses, restaurants, menu_items, orders, order_items, drivers, deliveries, driver_locations, carts, cart_items, personal_access_tokens, cache, jobs, sessions.
- Indexes on FKs, status, delivered_at, (driver_id, status), (user_id, restaurant_id), expires_at, etc.
- No Prisma/Neon in repo; Laravel Eloquent only. DB connection via env (e.g. MySQL; Neon Postgres possible via Laravel config).

---

## 3. Frontend (Vue 3)

### 3.1 Structure

- **app:** router (guards), store (auth), config (i18n), lib (axios).
- **features:** auth, customer (cart, addresses, orders), business-owner (dashboard, menu, orders, analytics, reviews, settings), delivery (dashboard, jobs, live delivery, earnings, profile).
- **pages:** Route-level views; owner/delivery routes lazy-loaded.
- **shared:** layout (MainLayout, CustomerLayout, OwnerLayout, DeliveryLayout, RoleNavigation, BottomNav), ui, data (nav.config), utils (role.utils).

### 3.2 Routing and Guards

- **authGuard:** Redirects authenticated users from login/register to role dashboard; blocks unauthenticated access to protected routes; enforces **role** (customer/owner/delivery) so cross-role URL access is prevented.
- **Role dashboards:** customer → home/restaurants; owner → /owner/dashboard; delivery → /delivery/dashboard.

### 3.3 State and API

- **Pinia:** auth (user, token, login, register, logout); cart; delivery; menu (owner).
- **Axios:** Single instance; baseURL includes /api/v1; Bearer from localStorage; response unwraps `{ success, data }`; 401 clears storage and redirects to login.
- **Credentials:** withCredentials true for Sanctum/cookies if used; token in header is primary.

### 3.4 i18n and UI

- **vue-i18n:** locale `es`, fallback `es`; Spanish-first.
- **Tailwind:** Primary/secondary palette; dark mode; responsive.
- **Accessibility:** Skip link “Saltar al contenido principal” in layouts.

---

## 4. DevOps and CI/CD

- **CI/CD:** No `.github/` workflows or CI config in repo. No root Dockerfile (Laravel has fly-apps/dockerfile-laravel in composer dev).
- **Env:** Server: `.env` (DB_*, APP_*, FRONTEND_URL, CORS, LOG_*, QUEUE_*, etc.). Client: `VITE_API_URL` (and similar) for API base.
- **Recommendations:** Add GitHub Actions (or equivalent) for tests, lint, build; document deploy and env for staging/production; consider Neon/Postgres and queue workers for scale.

---

## 5. Data and Reporting

- **Analytics:** Owner dashboard and analytics use order/revenue data from API (today, weekly, monthly).
- **Driver earnings:** Aggregated from deliveries + orders (sum of order total per delivered delivery).
- **No dedicated data warehouse or ETL** in repo; reporting is query-time from the same DB. For growth, consider read replicas, caching, or a reporting layer.

---

## 6. Security Summary

- **Auth:** Sanctum; role stored on user; CheckRole middleware on delivery and admin routes.
- **Authorization:** DeliveryPolicy for delivery update/view; owner/restaurant checks for orders and menu.
- **CORS:** Config-driven. **Rate limit:** 60/min on v1.
- **Sensitive data:** Token and user in localStorage (XSS exposure); ensure CSP and hygiene. No hardcoded secrets in repo.

---

## 7. Gaps and Recommendations

| Area | Gap | Recommendation |
|------|-----|----------------|
| Delivery vs Order driver | Two flows (pending+deliveries vs ready+driver_id) | Unify: single source (e.g. deliveries table + order status) and one set of driver APIs. |
| CI/CD | No automated tests/lint/deploy | Add pipeline for PHPUnit, ESLint, Vue build, and optional deploy. |
| Logging/monitoring | Basic Laravel logging | Add structured logging and error tracking (e.g. Sentry). |
| Queue | Queue config present; usage unclear | Use queues for notifications, reports, and heavy tasks. |
| SEO | Limited meta/JSON-LD/sitemap | Implement per-route meta, JSON-LD, sitemap, robots. |
| Dependencies | Client/server deps | Regular bumps and security audits (npm audit, composer audit). |

---

## 8. Document References

- **CORE_MAP.md** — Architecture and strategy.  
- **SYSTEM_HEALTH_REPORT.md** — Ranked issues (CRITICAL → TRIVIAL).  
- **kechow-docs/** — Legacy architecture, DB design, audits, production readiness.  
- **kechow-client/docs/** — Client architecture, delivery lifecycle, layouts, ROUTE_SECURITY_AUDIT.

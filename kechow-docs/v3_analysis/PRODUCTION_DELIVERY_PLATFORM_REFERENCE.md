# Kechow Delivery Platform — Full Reference & Production Readiness

**Document version:** 1.0  
**Last updated:** March 2025  
**Purpose:** Single reference for app features, current state, technical debt, security, and launch readiness.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Backend Features](#3-backend-features)
4. [Frontend Features](#4-frontend-features)
5. [Database Structure](#5-database-structure)
6. [Pending Work & Technical Debt](#6-pending-work--technical-debt)
7. [Security Analysis & Recommendations](#7-security-analysis--recommendations)
8. [Improvements & Roadmap](#8-improvements--roadmap)
9. [Launch Checklist](#9-launch-checklist)

---

## 1. Executive Summary

| Aspect | Status |
|--------|--------|
| **Delivery API** | Consolidated under `/api/v1/delivery/*`, Auth + role middleware, ApiResponse, logging |
| **Frontend** | Vue 3 + TS, Pinia (delivery.store canonical), order detail & reject wired |
| **Database** | `deliveries`, `orders`, `drivers` with FKs and indexes; migrations applied |
| **Resolved** | Duplicate models removed, API consolidated, transactional acceptance, validated status, rate limiting, CORS, logging channel |
| **Pending** | Other modules not wrapped in ApiResponse, hardcoded copy, owner routes inactive in some flows, earnings = full order total (no commission), legacy driver code |

---

## 2. Architecture Overview

### 2.1 High-Level API Flow

```
┌─────────────────┐     HTTPS      ┌──────────────────────────────────────────┐
│  Vue 3 Client   │ ◄─────────────► │  Laravel API (kechow-server)            │
│  (kechow-client)│   /api/v1/*     │  • auth:sanctum + role:delivery on       │
│  baseURL=/api/v1│   throttle 60/m │    /api/v1/delivery/*                    │
└────────┬────────┘                 │  • ApiResponse trait (delivery only)    │
         │                           │  • CORS from config, delivery log       │
         │ axios + unwrap {data}      └──────────────────────────────────────────┘
         │                                    │
         │                                    ▼
         │                           ┌──────────────────────────────────────────┐
         │                           │  Models: Driver, Delivery, Order          │
         │                           │  Order from Modules/Order                 │
         └──────────────────────────►│  DB: deliveries, orders, drivers         │
                                     └──────────────────────────────────────────┘
```

### 2.2 Data Model Relations

```
User (1) ─────────────► (1) Driver
  │                           │
  │                           │ driver_id
  │                           ▼
  │                    Delivery (n) ◄──── order_id ────► Order (1)
  │                     order_id                              │
  │                                                           │ user_id, restaurant_id
  └───────────────────────────────────────────────────────────┘
```

- **Single Driver model:** `App\Models\Driver` (user_id → users).
- **Single Order model:** `App\Modules\Order\Models\Order` (used by DeliveryController via `delivery.order`).
- **Delivery:** `App\Models\Delivery` links `order_id` → orders, `driver_id` → drivers. Order status is updated on delivery lifecycle (e.g. accepted → delivered).

### 2.3 Frontend Store Relations

| Store | Role | Used by |
|-------|------|--------|
| **delivery.store.ts** | Canonical delivery state & API | OrdersPanel, DeliveryOrderDetail, EarningsPanel, LiveDelivery, DashboardOverview |
| **driver.store.ts** | Compatibility layer over delivery + stats | DriverDashboard, AvailableOrders, CurrentDelivery, DriverStats, useDriver, useDriverLocation |
| **stats.store.ts** | Today orders, earnings, rating (from `/delivery/stats`) | driver.store (stats), DriverStats |

---

## 3. Backend Features

### 3.1 API Base & Middleware

- **Base path:** `/api/v1` (from `routes/api.php`).
- **Rate limiting:** `throttle:60,1` on entire v1 group (60 req/min).
- **Delivery routes:** `prefix('delivery')` + `auth:sanctum` + `role:delivery`.
- **CORS:** `config/cors.php` — paths `api/*`, `login`, `register`, `sanctum/csrf-cookie`, `user`; `allowed_origins` from `CORS_ALLOWED_ORIGINS`; `supports_credentials: true`.

### 3.2 Delivery Endpoints (`/api/v1/delivery/*`)

| Method | URI | Controller Method | Request | Notes |
|--------|-----|-------------------|---------|-------|
| GET | `/delivery/availability` | `getAvailability` | — | isOnline, totalOnlineHours, hasActiveOrder |
| POST | `/delivery/availability` | `updateAvailability` | UpdateAvailabilityRequest | isOnline required boolean |
| GET | `/delivery/jobs/available` | `getAvailableJobs` | — | Orders pending, no delivery; returns jobs[] |
| POST | `/delivery/jobs/{orderId}/accept` | `acceptOrder` | — | Transaction: create Delivery + order status → accepted |
| POST | `/delivery/jobs/{orderId}/reject` | `rejectOrder` | — | **No-op:** returns success only, no DB change |
| GET | `/delivery/orders/active` | `getActiveOrder` | — | Single active delivery (assigned/picked_up/in_transit) |
| GET | `/delivery/orders/completed` | `getCompletedOrders` | Request (per_page) | Paginated delivered orders |
| GET | `/delivery/orders/{orderId}` | `getOrderDetail` | — | Policy: driver must own delivery |
| PATCH | `/delivery/orders/{orderId}/status` | `updateOrderStatus` | UpdateDeliveryStatusRequest | status in: assigned,picked_up,in_transit,delivered,cancelled; DeliveryPolicy used |
| GET | `/delivery/stats` | `getStats` | — | todayOrders, earnings, completed_deliveries, rating |
| GET | `/delivery/earnings` | `getEarnings` | Request | today, week, month, total (sum of order total) |
| GET | `/delivery/settings` | `getSettings` | — | Returns `{ language: 'es' }` |
| PATCH | `/delivery/settings` | `updateSettings` | Request | Echoes request body as success |

**Controller:** `App\Http\Controllers\Api\Driver\DeliveryController`  
**Form Requests:**  
- `App\Http\Requests\Delivery\UpdateAvailabilityRequest`: `isOnline` required boolean; authorize: user role === 'delivery'.  
- `App\Http\Requests\Delivery\UpdateDeliveryStatusRequest`: `status` required, in allowed list; authorize: true (policy used in controller).

### 3.3 Policies & Authorization

- **DeliveryPolicy** (`App\Policies\DeliveryPolicy`): `update(User, Delivery)` and `view(User, Delivery)` — require `user->role === 'delivery'` and `delivery->driver->user_id === user->id`. Only `updateOrderStatus` calls `$this->authorize('update', $delivery)`.
- **CheckRole middleware:** `role:delivery` (and `role:owner` for owner routes). Returns 401 if unauthenticated, 403 if role not in list.

### 3.4 ApiResponse Trait

- **File:** `App\Traits\ApiResponse`.
- **Methods:** `success($data, $message, $meta)` → JSON `{ success, message?, data, meta? }`; `error($message, $code, $errors)` → JSON `{ success: false, message, errors? }`.
- **Usage:** Only **DeliveryController** uses it. Auth, Owner, Restaurant, Order, Cart modules do **not** use it → response shape can differ; frontend unwrap expects `success` + `data`.

### 3.5 Logging

- **Channel:** `delivery` in `config/logging.php` (daily driver, `storage/logs/delivery.log`, 14 days).
- **Usage:** `Log::channel('delivery')->info('Delivery accepted', ...)` and `'Delivery status updated', ...` in DeliveryController.

### 3.6 Other Modules (Summary)

- **Auth, Owner, Restaurant, Order, Cart:** Loaded via `require` in `routes/api.php` under v1. No ApiResponse; various response shapes.
- **Owner routes:** `Module/Owner/routes.php` → prefix `owners`, middleware `auth:sanctum`, `role:owner` (comment says "role:admin" but code uses `role:owner`). May be inactive or unused in some flows (see [§6](#6-pending-work--technical-debt)).
- **Legacy driver (Order module):** `Route::prefix('driver')` in `app/Modules/Order/routes.php` — `driver/orders/available`, `accept`, `start-delivery`, `complete-delivery`. Uses `Order` with `driver_id` (user id) and statuses READY/OUT_FOR_DELIVERY. **Not** the same as `/api/v1/delivery/*`; duplicate/legacy surface.

---

## 4. Frontend Features

### 4.1 Stack & Config

- **Stack:** Vue 3, TypeScript, Pinia, Vue Router, axios, i18n (vue-i18n).
- **API client:** `kechow-client/src/app/lib/axios.ts` — baseURL from `VITE_API_URL` → `/api/v1`; `withCredentials: true`; request: add `Authorization: Bearer ${localStorage.getItem('token')}`; response: if `data.success === true` and `data` property, replace `response.data` with `data.data` (unwrap).
- **i18n:** Locales `es` (default), `en`; delivery keys under `delivery.*` and root keys (orderDetails, acceptOrder, etc.).

### 4.2 Delivery Store (Canonical)

**File:** `kechow-client/src/features/delivery/store/delivery.store.ts`

| State | Type | Purpose |
|-------|------|---------|
| availability | `{ isOnline, totalOnlineHours }` | From getAvailability |
| availableJobs | `any[]` | From getAvailableJobs |
| activeOrder | `any \| null` | From getActiveOrder / after accept |
| isOnline | boolean | Mirrors availability.isOnline |
| completedOrdersList | `{ orders, total, current_page, per_page }` | Paginated completed |
| earningsSummary | `{ today?, week?, month?, total? }` | From getEarnings |
| orderDetail | `any \| null` | Single order for detail view |
| loading, error, earningsLoading, completedLoading, etc. | — | UI state |

**Computed:** `hasActiveOrder`, `isAvailable` (isOnline && !hasActiveOrder).

**Actions:** `initialize`, `loadAvailableJobs`, `toggleAvailability`, `acceptDeliveryOrder`, `updateStatus`, `loadEarningsSummary`, `rejectOrder`, `fetchOrderDetail`, `loadCompletedOrders`, `$reset`.

### 4.3 Driver Store (Compatibility)

**File:** `kechow-client/src/features/delivery/store/driver.store.ts`  
Re-exposes delivery store + stats store with names like `currentOrder` → `activeOrder`, `availableOrders` → `availableJobs`, `toggleOnline` → `toggleAvailability`, `acceptOrder` / `acceptOrderAction` → `acceptDeliveryOrder`, `changeOrderStatus(status)` → `updateStatus(activeOrder.id, status)`.

### 4.4 Driver Service (API Layer)

**File:** `kechow-client/src/features/delivery/services/driver.service.ts`  
Calls `api.get/post/patch` to `/delivery/availability`, `/delivery/jobs/available`, `/delivery/jobs/:id/accept`, `/delivery/jobs/:id/reject`, `/delivery/orders/active`, `/delivery/orders/:id`, `/delivery/orders/:id/status`, `/delivery/orders/completed`, `/delivery/earnings`, `/delivery/stats`. Response is unwrapped by axios interceptor.

### 4.5 Routes (Delivery)

Under `DeliveryLayout`, meta `requiresAuth: true`, `role: 'delivery'`:

| Path | Name | Component |
|------|------|-----------|
| `delivery/dashboard` | DeliveryDashboard | DeliveryDashboard.vue |
| `delivery/order/:id` | DeliveryOrderDetail | DeliveryOrderDetail.vue |
| `delivery/live/:id` | LiveDelivery | LiveDelivery.vue |
| `delivery/profile` | DeliveryProfile | ProfilePage.vue |
| `delivery/earnings` | DeliveryEarnings | EarningsPage.vue |
| `delivery/orders` | DeliveryOrders | OrderDetailPage → OrdersView |

### 4.6 Key Components & Wiring

| Component | Store(s) | Main behavior |
|-----------|----------|----------------|
| OrdersPanel | delivery | Available/active/completed lists; **Accept** and **Reject** (reject calls `rejectOrder` → API no-op); pagination for completed |
| DeliveryOrderDetail | delivery | `fetchOrderDetail(orderId)` on mount; shows order id, status, pickup, dropoff, amount, notes |
| LiveDelivery | delivery | activeOrder, updateStatus (picked_up → in_transit → delivered); expects `orderNumber`, `fee`, `paymentMethod`, `customer.phone`, `restaurant.phone`, `currentLocation` — **API does not return all of these** |
| DashboardOverview | delivery | Online toggle, active order, steps, earnings |
| DriverDashboard | driver + delivery | Toggle, active order card, available jobs, accept, Echo; navigates to `/delivery/:id` |
| EarningsPanel | delivery | earningsSummary, loadEarningsSummary |
| DriverStats | driver (stats) | today deliveries, earnings, rating |

### 4.7 Order Detail & Reject

- **Order detail:** Wired. `DeliveryOrderDetail.vue` uses `deliveryStore.fetchOrderDetail(route.params.id)` and displays `orderDetail`.
- **Reject:** UI wired in `OrdersPanel.vue` (Rechazar → `deliveryStore.rejectOrder(orderId)`). Backend `rejectOrder` is a no-op (returns success only); job remains available for other drivers.

---

## 5. Database Structure

### 5.1 Tables Overview

| Table | Purpose |
|-------|---------|
| users | Auth; role used for delivery/owner/customer |
| drivers | One per user (user_id unique); is_online, status, location, vehicle_type, rating, total_deliveries |
| orders | user_id, restaurant_id, total, status, delivery_address, delivery_notes (+ driver_id, estimated/actual_delivery_time in model; see [§6](#6-pending-work--technical-debt)) |
| deliveries | order_id (unique), driver_id, status, assigned_at, picked_up_at, delivered_at, cancelled_at, cancellation_reason, notes |
| driver_locations | driver_id, latitude, longitude, created_at (for tracking) |

### 5.2 Deliveries Table

- **Migration:** `2026_02_04_100003_create_deliveries_table.php`
- **Columns:** id, order_id (FK orders CASCADE), driver_id (FK drivers CASCADE), status (default 'assigned'), assigned_at, picked_up_at, delivered_at, cancelled_at, cancellation_reason, notes, timestamps.
- **Indexes:** unique(order_id); index(driver_id, status); index(delivered_at).

### 5.3 Orders Table

- **Create:** `2025_06_19_000000_create_orders_table.php` — id, user_id, restaurant_id, total, status (default 'pending'), timestamps.
- **Add delivery fields:** `2026_02_18_060216_add_delivery_fields_to_orders_table.php` — delivery_address, delivery_notes.
- **Indexes:** `2026_02_25_100000_add_indexes_to_orders_and_deliveries.php` — index(status), index(restaurant_id, status).
- **Note:** Order model fillable includes `driver_id`, `estimated_delivery_time`, `actual_delivery_time`. DeliveryController updates `actual_delivery_time` on order when status → delivered. If these columns are missing in DB, a migration is needed.

### 5.4 Drivers Table

- **Migration:** `2026_02_04_100001_create_drivers_table.php` — id, user_id (unique, FK users CASCADE), status, current_latitude, current_longitude, vehicle_type, is_online, rating, total_deliveries, timestamps.
- Optional: `2026_02_18_183853_add_is_online_to_drivers_table.php` for is_online/total_deliveries/rating if not in create.

---

## 6. Pending Work & Technical Debt

### 6.1 Pending / Non-Working Features

| Item | Description |
|------|-------------|
| **Reject order** | Frontend calls POST `/delivery/jobs/{id}/reject`; backend returns `{ ok: true }` without persisting rejection or removing job from pool. Reject is effectively non-functional. |
| **Earnings calculation** | Earnings = sum of `orders.total` for delivered deliveries. No commission/fee logic; driver sees full order amount as "earnings". |
| **Owner routes** | Owner module routes exist (`/api/v1/owners/*`, role:owner). Comment says "role:admin"; if frontend or ops expect admin, access may be wrong. Some owner flows may be inactive or untested. |
| **LiveDelivery UI vs API** | LiveDelivery expects `activeOrder.orderNumber`, `fee`, `paymentMethod`, `customer.phone`, `restaurant.phone`, and `deliveryStore.currentLocation`. Delivery API does not return orderNumber, fee, paymentMethod, or customer/restaurant phone; currentLocation is not in delivery store. Partial breakage or fallbacks. |

### 6.2 Technical Debt

| Area | Detail |
|------|--------|
| **ApiResponse** | Only DeliveryController uses ApiResponse. Auth, Owner, Restaurant, Order, Cart return raw or different JSON. Frontend unwrap works only when backend sends `success` + `data`. |
| **Hardcoded copy** | Some frontend strings (e.g. "Entrega en vivo", "Marcar recogido") not in i18n. |
| **Legacy driver code** | Order module `driver/*` routes and `App\Modules\Driver\Controllers\DriverController` use `orders.driver_id` (user id) and statuses READY/OUT_FOR_DELIVERY. Delivery flow uses `deliveries` table and DeliveryController. Two parallel driver surfaces; risk of confusion and bugs. |
| **Orders schema** | Order model uses `driver_id`, `estimated_delivery_time`, `actual_delivery_time`; migrations reviewed do not add them. Verify schema or add migration. |
| **Settings** | PATCH `/delivery/settings` echoes request body without validation or persistence. |

### 6.3 Risks

- **Dual driver APIs:** Features or clients using `/driver/*` vs `/delivery/*` can diverge (e.g. different order states, different auth).
- **Earnings vs business rules:** Showing full order total as driver earnings may conflict with business rules (commission, fees).
- **Reject no-op:** Drivers may believe they rejected a job while it remains available; support/ops confusion.

---

## 7. Security Analysis & Recommendations

### 7.1 Current Security Measures

| Measure | Implementation |
|---------|----------------|
| Auth | `auth:sanctum` on delivery and owner routes |
| Role | `role:delivery` / `role:owner` via CheckRole middleware |
| Policy | DeliveryPolicy ensures driver can only update/view own delivery |
| Validation | Form requests for availability and status |
| Rate limit | 60 req/min per client on v1 |
| CORS | Config-driven origins; credentials supported |
| Logging | Delivery actions logged to delivery channel |

### 7.2 Potential Vulnerabilities & Recommendations

| Risk | Recommendation |
|------|----------------|
| **Token in localStorage** | XSS can steal token. Prefer httpOnly cookies for refresh/session where possible; minimize sensitive data in localStorage. |
| **Role on client** | Route meta `role: 'delivery'` is enforced by frontend guard only. Backend already enforces role; ensure auth guard always runs and redirects unauthenticated users. |
| **Mass assignment** | Order/Delivery/Driver models use fillable; no broad `$request->all()` on critical models in DeliveryController. Keep Form Requests for all writable inputs. |
| **IDOR on orderId** | getOrderDetail and updateOrderStatus both scope by `driver_id` (current driver). DeliveryPolicy used on update. getOrderDetail does not use policy but scopes by driver — acceptable; consider explicit policy for consistency. |
| **Reject no-op** | Not a vulnerability but misleading. Implement real reject (e.g. record rejection, optionally exclude from this driver’s list or mark as rejected). |
| **Settings echo** | PATCH `/delivery/settings` returns `$request->all()` without validation. Validate and persist only allowed keys (e.g. language). |
| **CORS** | Avoid `*` in production for origins; use explicit list (already env-driven). |
| **Sensitive data in logs** | Ensure delivery log does not log PII (e.g. full addresses). Current log lines use order_id, driver_id, status — acceptable. |

### 7.3 Dependency & Hardening

- Run `composer audit` and `npm audit` regularly; fix known CVEs.
- Keep Laravel and Vue ecosystem updated; monitor security advisories.
- Use HTTPS only in production; set secure cookie and HSTS headers.

---

## 8. Improvements & Roadmap

### 8.1 Backend

- **Implement reject:** Persist rejection (e.g. delivery_rejections or flag), optionally hide from same driver or decrement availability.
- **Earnings:** Introduce commission/fee config; return driver share in stats/earnings, not full order total.
- **ApiResponse everywhere:** Migrate Auth, Owner, Restaurant, Order, Cart to ApiResponse (or shared JSON resource) for consistent shape and frontend unwrap.
- **Settings:** Validate and persist settings (e.g. language) in DB or user meta.
- **Orders schema:** Add migration for `driver_id`, `estimated_delivery_time`, `actual_delivery_time` on orders if missing.
- **Deprecate legacy driver API:** Plan removal or redirect of Order module `driver/*` and Driver module routes; document single delivery API.

### 8.2 Frontend

- **i18n:** Move hardcoded delivery strings into locale files.
- **LiveDelivery:** Align with API: use `id` for display (e.g. order #id), optional fee/payment from backend or defaults; add `currentLocation` to store if live tracking is required, or remove UI.
- **TypeScript:** Replace `any` in delivery store with interfaces (Order, Job, Earnings, etc.).

### 8.3 DevOps

- **Env:** Document all `VITE_*` and Laravel env vars (e.g. CORS, LOG_LEVEL, DB, Sanctum).
- **Logs:** Rotate delivery log; consider forwarding to central logging in production.
- **Health:** Add `/api/v1/health` or similar for LB/availability checks.

### 8.4 Good-to-Have

- Real-time updates (Echo) for new jobs and status changes (DriverDashboard references Echo; ensure backend broadcast events).
- Driver location updates and live tracking (driver_locations table exists; backend/frontend flow to be completed).
- Optional in-app notifications for drivers.
- Admin view of delivery metrics and driver activity using delivery log and stats.

---

## 9. Launch Checklist

### 9.1 QA

- [ ] All delivery flows: go online → see available jobs → accept → update status (picked_up → in_transit → delivered) → see in completed and earnings.
- [ ] Order detail from list and from deep link; reject button (current behavior: no-op documented).
- [ ] Unauthorized access: 401 when not logged in, 403 when role is not delivery for delivery routes.
- [ ] Rate limit: verify 429 after 60 requests in 1 minute on v1.
- [ ] i18n: switch locale; no missing keys for critical delivery screens.
- [ ] LiveDelivery: test with actual API payload; fix or hide missing fields (orderNumber, fee, customer/restaurant phone, currentLocation).

### 9.2 DevOps

- [ ] Production env: APP_ENV=production, debug off, CORS_ALLOWED_ORIGINS set, DB and queue configured.
- [ ] Migrations run; no missing columns (orders.driver_id, etc.).
- [ ] Log rotation for delivery log; disk space and retention (e.g. 14 days).
- [ ] Backups for DB and critical config; restore tested.
- [ ] HTTPS only; secure and SameSite cookie settings for Sanctum if using cookies.

### 9.3 Security

- [ ] No secrets in repo or client bundle; .env not committed.
- [ ] Sanctum stateful domains or token lifetime configured as intended.
- [ ] composer audit / npm audit clean or risks accepted.
- [ ] Delivery and auth logs reviewed for PII/leakage.

### 9.4 PM / Product

- [ ] Reject behavior: either implement real reject or document "Reject is not yet implemented" for support.
- [ ] Earnings: confirm with product that showing full order total is intentional until commission is implemented.
- [ ] Owner vs admin: confirm which roles should access owner routes; align backend and frontend.
- [ ] Legacy driver API: decision to deprecate or support; communicate to any consumers.

---

## Quick Reference

### Backend (Delivery)

| Resource | Path / Class |
|----------|----------------|
| Routes | `kechow-server/routes/api.php` (v1 → delivery prefix) |
| Controller | `App\Http\Controllers\Api\Driver\DeliveryController` |
| Requests | `App\Http\Requests\Delivery\UpdateAvailabilityRequest`, `UpdateDeliveryStatusRequest` |
| Policy | `App\Policies\DeliveryPolicy` |
| Trait | `App\Traits\ApiResponse` |
| Models | `App\Models\Driver`, `App\Models\Delivery`; `App\Modules\Order\Models\Order` |
| Log | `config/logging.php` → channel `delivery` |

### Frontend (Delivery)

| Resource | Path |
|----------|------|
| Store (canonical) | `kechow-client/src/features/delivery/store/delivery.store.ts` |
| Store (compat) | `kechow-client/src/features/delivery/store/driver.store.ts` |
| Stats | `kechow-client/src/features/delivery/store/stats.store.ts` |
| Service | `kechow-client/src/features/delivery/services/driver.service.ts` |
| Axios | `kechow-client/src/app/lib/axios.ts` |
| Router | `kechow-client/src/app/router/index.ts` (delivery routes under DeliveryLayout) |

---

*This document is the single reference for the delivery platform’s features, current state, pending work, security, and launch readiness. Update it as the codebase and product evolve.*

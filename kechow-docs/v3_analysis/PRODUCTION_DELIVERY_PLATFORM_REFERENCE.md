# Kechow Delivery Platform — Production Reference (v3)

**Document version:** 2.2  
**Last updated:** March 2025  
**Purpose:** Single authoritative reference for the production delivery platform: issue analysis (cause, impact, risks), safe non-breaking fixes, code/config snippets, verification steps, and current system behavior.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Issue Analysis & Fixes](#2-issue-analysis--fixes)
3. [Architecture Overview](#3-architecture-overview)
4. [Backend Features](#4-backend-features)
5. [Frontend Features](#5-frontend-features)
6. [Database Structure](#6-database-structure)
7. [Configuration](#7-configuration)
8. [Remaining Technical Debt](#8-remaining-technical-debt)
9. [Verification & QA](#9-verification--qa)
10. [Quick Reference](#10-quick-reference)

---

## 1. Executive Summary

| Aspect | Status |
|--------|--------|
| **Delivery API** | Consolidated under `/api/v1/delivery/*`; auth + role middleware; ApiResponse; delivery logging |
| **Reject order** | **Fixed.** Persisted in `delivery_rejections`; excluded from driver’s available jobs |
| **Earnings** | **Fixed.** Config-driven commission rate and fixed fee; drivers see commission/fee, not full order total |
| **Owner routes** | **Clarified.** Middleware is `role:owner` (comment corrected); no admin required |
| **LiveDelivery vs API** | **Fixed.** API returns orderNumber, fee, paymentMethod, customer, restaurant.phone; store has deliveryProgress/currentLocation; component uses fallbacks |
| **Settings** | **Fixed.** PATCH validated and persisted (language); GET returns stored value |
| **Frontend** | Vue 3 + TS, Pinia (delivery.store canonical), order detail and reject wired and functional |

---

## 2. Issue Analysis & Fixes

Each subsection covers: **Issue description** → **Analysis (cause, impact, risks)** → **Recommended fixes (backend, frontend, config)** → **Code/config snippets** (where applicable) → **Verification/QA**. All fixes are safe and non-breaking; existing endpoints, API contracts, and frontend workflows are preserved.

---

### 2.1 Reject order

**Issue description**  
`POST /delivery/jobs/{id}/reject` returns `{ ok: true }` but does not persist the rejection or remove the job from the driver’s available pool. The reject action is non-functional from a data perspective.

**Analysis**

| Aspect | Detail |
|--------|--------|
| **Cause** | `rejectOrder()` in DeliveryController had no database logic; it only returned a success response. No table or model existed to record “driver D rejected order O.” `getAvailableJobs` did not filter out orders this driver had rejected. |
| **Impact** | Drivers believe they have rejected a job; the same order continues to appear in their available list. Other drivers can still accept it (correct), but the rejecting driver sees no change. Support and ops cannot distinguish real rejections from UI-only actions; no audit trail. |
| **Risks** | Driver trust erosion; duplicate accept attempts if the driver thinks the job was removed; inability to analyze rejection patterns or enforce “do not re-offer to same driver” policies. |

**Recommended fixes**

| Layer | Change |
|-------|--------|
| **Backend** | Add `delivery_rejections` table (driver_id, order_id, rejected_at, reason). Add model `DeliveryRejection`. In `rejectOrder`: resolve driver; validate order (pending, no delivery); insert or firstOrCreate rejection; log to delivery channel (order_id, driver_id only); return `{ ok: true }`. In `getAvailableJobs`: exclude orders this driver has rejected via Order relation `deliveryRejections`. |
| **Frontend** | No change; same endpoint and payload. Reject button and store action remain; backend now persists and filters. |
| **Config** | Run migration for `delivery_rejections`; no new env vars. |

**Code/config snippets**

Migration (`database/migrations/2026_03_03_100001_create_delivery_rejections_table.php`):

```php
Schema::create('delivery_rejections', function (Blueprint $table) {
    $table->id();
    $table->foreignId('driver_id')->constrained('drivers')->onDelete('cascade');
    $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
    $table->timestamp('rejected_at')->useCurrent();
    $table->text('reason')->nullable();
    $table->index(['driver_id', 'order_id']);
});
```

Controller (reject + filter in getAvailableJobs):

```php
// rejectOrder: after validating driver and order (pending, no delivery)
DeliveryRejection::firstOrCreate(
    ['driver_id' => $driver->id, 'order_id' => $orderId],
    ['reason' => $request->input('reason')]
);
// getAvailableJobs: add to query when driver exists
$query->whereDoesntHave('deliveryRejections', fn ($q) => $q->where('driver_id', $driver->id));
```

**Verification/QA**

- [ ] As driver, POST `/delivery/jobs/{orderId}/reject` → 200, body `{ ok: true }` (or unwrapped equivalent).
- [ ] Query DB: one row in `delivery_rejections` for that driver_id and order_id.
- [ ] GET `/delivery/jobs/available` as same driver → that order no longer in `jobs` array.
- [ ] As a different driver, GET available jobs → order still present if still pending and no delivery.
- [ ] In UI, click Reject on a job → job disappears from list; no console or network errors.

---

### 2.2 Earnings calculation

**Issue description**  
Earnings are computed as the sum of `orders.total` for delivered deliveries. There is no commission or fee logic; drivers see the full order amount as “earnings,” which may not match business rules.

**Analysis**

| Aspect | Detail |
|--------|--------|
| **Cause** | `getStats()` and `getEarnings()` use `sum('orders.total')` (and count of deliveries for stats) with no multiplier or fixed fee. The platform did not introduce a configurable driver share. |
| **Impact** | Finance/ops cannot reflect real driver pay (e.g. 15% commission + fixed fee per delivery). Driver-facing numbers are misleading if the business model is not “100% of order total to driver.” |
| **Risks** | Contractual or legal issues if displayed “earnings” do not match actual pay; driver disputes; inability to A/B test or change commission without code change. |

**Recommended fixes**

| Layer | Change |
|-------|--------|
| **Backend** | Introduce config for driver share: e.g. `driver_commission_rate` (0–1) and `delivery_fee_fixed` (currency units). In getStats and getEarnings: driver earnings = (sum of order totals for period) × rate + (count of deliveries in period) × fixed. Do not change `orders.total` or completed-order payloads; only the numeric values returned for “earnings” in stats and earnings endpoints. |
| **Frontend** | No change; same endpoints and response shape. Values may be lower when rate &lt; 1 or fixed is used; no new fields. |
| **Config** | Add env vars (e.g. `DELIVERY_DRIVER_COMMISSION_RATE`, `DELIVERY_FEE_FIXED`) and document in .env.example. Default rate 1.0 and fixed 0 to preserve current behavior. |

**Code/config snippets**

Config (`config/delivery.php`):

```php
return [
    'driver_commission_rate' => (float) env('DELIVERY_DRIVER_COMMISSION_RATE', 1.0),
    'delivery_fee_fixed'     => (float) env('DELIVERY_FEE_FIXED', 0),
];
```

Controller (concept for getStats; same pattern in getEarnings):

```php
$orderTotals = (float) Delivery::where(...)->join('orders', ...)->sum('orders.total');
$count = Delivery::where(...)->count();
$rate = (float) config('delivery.driver_commission_rate', 1.0);
$fixed = (float) config('delivery.delivery_fee_fixed', 0);
$earnings = $orderTotals * $rate + $count * $fixed;
return $this->success([..., 'earnings' => round($earnings, 2)]);
```

**.env.example:**

```env
DELIVERY_DRIVER_COMMISSION_RATE=1.0
DELIVERY_FEE_FIXED=0
```

**Verification/QA**

- [ ] With defaults (rate=1, fixed=0): GET `/delivery/stats` and `/delivery/earnings` → earnings equal sum of order totals (unchanged).
- [ ] Set `DELIVERY_DRIVER_COMMISSION_RATE=0.15`, `DELIVERY_FEE_FIXED=5`: earnings = 15% of sum + 5 per delivery for the period.
- [ ] Order total and completed-order list payloads unchanged; no regression in accept/complete flow.

---

### 2.3 Owner routes

**Issue description**  
`/api/v1/owners/*` routes exist with a file comment stating “role:admin.” The actual middleware is `role:owner`. Frontend or ops may assume admin users can access these routes, leading to role mismatch; some flows may be inactive or untested.

**Analysis**

| Aspect | Detail |
|--------|--------|
| **Cause** | Comment in `app/Modules/Owner/routes.php` was outdated (e.g. “Admin-only owner management”, “role:admin”) while the code uses `middleware(['auth:sanctum', 'role:owner'])`. |
| **Impact** | New developers or ops may grant “admin” expecting owner access, or expect “admin” to access owner endpoints; 403s or wrong access. Documentation and onboarding are misleading. |
| **Risks** | Inactive or untested owner flows if tests/roles are set up for admin; confusion when debugging permission issues. |

**Recommended fixes**

| Layer | Change |
|-------|--------|
| **Backend** | Update the comment to state that middleware is `auth:sanctum`, `role:owner` (not admin). Do not change route definitions or middleware arguments. |
| **Frontend** | Confirm router meta uses `role: 'owner'` for owner paths; no change if already correct. |
| **Config** | None. |

**Code/config snippets**

Owner routes comment (`app/Modules/Owner/routes.php`):

```php
/**
 * Owner module routes.
 * - Owner management: GET/POST/PUT/PATCH/DELETE /owners
 * - Middleware: auth:sanctum, role:owner (not admin)
 */
Route::prefix('owners')->middleware(['auth:sanctum', 'role:owner'])->group(function () {
    // ...
});
```

**Verification/QA**

- [ ] User with role `owner` can call `/api/v1/owners/*` and reach owner dashboard in UI.
- [ ] User with role `admin` only receives 403 on owner routes unless they also have owner role.
- [ ] No change to admin-only routes or delivery routes.

---

### 2.4 LiveDelivery UI vs API mismatch

**Issue description**  
LiveDelivery expected `activeOrder.orderNumber`, `fee`, `paymentMethod`, `customer.phone`, `restaurant.phone`, and `deliveryStore.currentLocation`. The delivery API did not return orderNumber, fee, paymentMethod, or customer/restaurant phone; currentLocation and deliveryProgress were missing from the store, causing partial breakage or missing UI.

**Cause and impact**  
- Cause: API response shape was minimal (id, status, pickup, dropoff, amount, restaurant.name, items); store had no deliveryProgress/currentLocation/loadDeliveryProgress/updateCurrentLocation.  
- Impact: Blank or undefined values in LiveDelivery; possible runtime errors; “Llamar al cliente” and restaurant phone link missing when data absent.

**Recommended fix (implemented)**  

| Layer | Change |
|-------|--------|
| **Backend** | getActiveOrder and getOrderDetail now return: `orderNumber` (#id), `fee` (from config), `paymentMethod` ('Card'), `restaurant` (name, address, phone), `customer` (name, address from order, phone from order.user), `distance` (null), `estimatedTime` (15). Order.user and restaurant loaded for customer/phone. |
| **Frontend** | **Store:** Added `deliveryProgress` (computed from activeOrder.status with steps accepted/pickedUp/onTheWay/delivered), `currentLocation` (ref null until location API exists), `loadDeliveryProgress` (no-op), `updateCurrentLocation` (no-op). **LiveDelivery:** Fallbacks: orderNumber → `#${id}`, fee → 0, paymentMethod → '—', customer/restaurant → optional chaining and defaults; “Teléfono no disponible” when customer.phone missing; restaurant phone link only if phone present; items with item.name ?? item.menu_item?.name ?? 'Item'; estimatedTime ?? 15. |
| **Config** | None for UI; fee from delivery config. |

**Risks**  
Poor driver UX; runtime errors if optional chaining is missing; inability to call customer/restaurant when data exists but was not returned.

**Code/config snippets**  
Backend: extend getActiveOrder/getOrderDetail with `orderNumber` ('#' . id), `fee` from config, `paymentMethod` ('Card'), `restaurant` (name, address, phone), `customer` (name, address, phone from order.user), `distance` (null), `estimatedTime` (15). Store: add computed `deliveryProgress` from activeOrder.status; ref `currentLocation` (null); no-op `loadDeliveryProgress` and `updateCurrentLocation`. LiveDelivery: fallbacks `orderNumber ?? '#' + id`, `fee ?? 0`, `paymentMethod ?? '—'`; optional chaining for customer/restaurant; v-if for phone links; "Teléfono no disponible" when missing.

**Verification/QA**  
- Open Live Delivery with an active order: order number, amount, fee, payment method, pickup/dropoff, and steps render.  
- If customer or restaurant phone missing: no link or “Teléfono no disponible”; no console errors.  
- Progress steps advance with status (picked_up → in_transit → delivered).  
- Location block shows “Ubicación no disponible” when currentLocation is null.

---

## 3. Architecture Overview

### 3.1 API flow

```
Vue 3 Client (baseURL /api/v1) ◄──► Laravel API
  • auth:sanctum + role:delivery on /delivery/*
  • ApiResponse trait; CORS from config; delivery log channel
  • Models: Driver, Delivery, Order (Modules/Order)
```

### 3.2 Data model relations

- **User** (1) → **Driver** (1).  
- **Driver** (1) → **Delivery** (n) ← **Order** (1).  
- Delivery: order_id, driver_id, status, timestamps.  
- Order: user_id, restaurant_id, total, status, delivery_address, etc.

### 3.3 Frontend store relations

- **delivery.store.ts**: Canonical; used by OrdersPanel, DeliveryOrderDetail, LiveDelivery, EarningsPanel, DashboardOverview.  
- **driver.store.ts**: Compatibility layer over delivery + stats.  
- **stats.store.ts**: Today orders, earnings, rating from `/delivery/stats`.

---

## 4. Backend Features

### 4.1 Delivery endpoints (`/api/v1/delivery/*`)

| Method | URI | Notes |
|--------|-----|-------|
| GET | `/delivery/availability` | isOnline, totalOnlineHours, hasActiveOrder |
| POST | `/delivery/availability` | UpdateAvailabilityRequest (isOnline) |
| GET | `/delivery/jobs/available` | Jobs: pending, no delivery, not rejected by this driver |
| POST | `/delivery/jobs/{orderId}/accept` | Transaction: create Delivery, order → accepted |
| POST | `/delivery/jobs/{orderId}/reject` | Persist rejection; return { ok: true } |
| GET | `/delivery/orders/active` | Single active order; includes orderNumber, fee, customer, restaurant.phone |
| GET | `/delivery/orders/completed` | Paginated delivered orders |
| GET | `/delivery/orders/{orderId}` | Order detail; policy view; same extended shape |
| PATCH | `/delivery/orders/{orderId}/status` | UpdateDeliveryStatusRequest; DeliveryPolicy |
| GET | `/delivery/stats` | todayOrders, earnings (commission/fee applied), completed_deliveries, rating |
| GET | `/delivery/earnings` | today, week, month, total (commission/fee applied) |
| GET | `/delivery/settings` | { language } from driver.preferred_language |
| PATCH | `/delivery/settings` | UpdateDeliverySettingsRequest; persist language only |

### 4.2 Policies and auth

- DeliveryPolicy: update/view require role delivery and delivery->driver->user_id = user->id.  
- getOrderDetail and updateOrderStatus both use policy; getOrderDetail calls `authorize('view', $delivery)`.

### 4.3 Config

- **config/delivery.php**: `driver_commission_rate`, `delivery_fee_fixed`.  
- **.env.example**: DELIVERY_DRIVER_COMMISSION_RATE, DELIVERY_FEE_FIXED.

---

## 5. Frontend Features

### 5.1 Delivery store (canonical)

- State: availability, availableJobs, activeOrder, isOnline, completedOrdersList, earningsSummary, orderDetail, deliveryProgress (computed), currentLocation (ref), loading/error, etc.  
- Actions: initialize, loadAvailableJobs, toggleAvailability, acceptDeliveryOrder, updateStatus, rejectOrder, fetchOrderDetail, loadCompletedOrders, loadEarningsSummary, loadDeliveryProgress (no-op), updateCurrentLocation (no-op), $reset.

### 5.2 LiveDelivery component

- Uses activeOrder with fallbacks for orderNumber, fee, paymentMethod, customer, restaurant.  
- Uses deliveryProgress for steps; currentLocation for GPS (shows “no disponible” when null).  
- No runtime errors when API or store fields are missing.

### 5.3 Owner routes (frontend)

- Router meta `role: 'owner'` for owner paths; backend enforces `role:owner`. No admin required for owner dashboard.

---

## 6. Database Structure

- **deliveries**: order_id, driver_id, status, assigned_at, picked_up_at, delivered_at, cancelled_at, cancellation_reason, notes.  
- **delivery_rejections**: driver_id, order_id, rejected_at, reason.  
- **drivers**: user_id, status, is_online, preferred_language, total_deliveries, etc.  
- **orders**: user_id, restaurant_id, total, status, delivery_address, delivery_notes, etc.

---

## 7. Configuration

| Key | Purpose | Default |
|-----|---------|---------|
| DELIVERY_DRIVER_COMMISSION_RATE | Fraction of order total as driver earnings (0–1) | 1.0 |
| DELIVERY_FEE_FIXED | Fixed amount per delivery added to driver earnings | 0 |
| CORS_ALLOWED_ORIGINS | Allowed SPA origins (comma-separated) | — |
| SANCTUM_STATEFUL_DOMAINS | Domains that receive session cookie | — |

---

## 8. Remaining Technical Debt

- Other modules (Auth, Owner, Restaurant, Order, Cart) do not use ApiResponse; response shapes can differ.  
- Some frontend copy still hardcoded (i18n).  
- Legacy driver API (`/driver/*` in Order module) coexists with `/delivery/*`; consider deprecation.  
- Orders table: confirm driver_id, estimated_delivery_time, actual_delivery_time columns exist; add migration if missing.  
- Real driver location (currentLocation) and live tracking not implemented; placeholder in store.

---

## 9. Verification & QA

### 9.1 Reject

- [ ] Reject a job as driver → 200, `delivery_rejections` row.  
- [ ] Available jobs no longer include that order for this driver.  
- [ ] Other driver can still see and accept the order.  
- [ ] UI reject button removes job from list.

### 9.2 Earnings

- [ ] Default config: earnings = sum of order totals (unchanged).  
- [ ] Set DELIVERY_DRIVER_COMMISSION_RATE=0.15: earnings = 15% of sum + fixed.  
- [ ] Stats and earnings endpoints return numbers; no errors.

### 9.3 Owner routes

- [ ] Owner user can access `/api/v1/owners/*` and owner dashboard.  
- [ ] Admin-only user gets 403 on owner routes.

### 9.4 LiveDelivery

- [ ] With active order: order number, amount, fee, payment method, pickup/dropoff, steps visible.  
- [ ] Customer/restaurant phone: link if present, “no disponible” or hidden if not.  
- [ ] Status updates (picked_up, in_transit, delivered) update steps.  
- [ ] Location shows “Ubicación no disponible” when currentLocation is null.

### 9.5 No regressions

- [ ] Login, delivery dashboard, available jobs, accept, order detail, completed orders, settings GET/PATCH all behave as before.  
- [ ] Migrations applied: delivery_rejections, preferred_language on drivers.

---

## 10. Quick Reference

### Backend

| Resource | Path / Class |
|----------|----------------|
| Delivery routes | `kechow-server/routes/api.php` (v1 → delivery prefix) |
| Controller | `App\Http\Controllers\Api\Driver\DeliveryController` |
| Config | `config/delivery.php` |
| Reject model | `App\Models\DeliveryRejection` |
| Settings request | `App\Http\Requests\Delivery\UpdateDeliverySettingsRequest` |

### Frontend

| Resource | Path |
|----------|------|
| Store | `kechow-client/src/features/delivery/store/delivery.store.ts` |
| LiveDelivery | `kechow-client/src/features/delivery/views/LiveDelivery.vue` |
| Driver service | `kechow-client/src/features/delivery/services/driver.service.ts` |

### Migrations (run in order)

- `2026_03_03_100001_create_delivery_rejections_table`  
- `2026_03_03_100002_add_preferred_language_to_drivers_table`

---

*This document is the authoritative reference for the production delivery platform and the fixes applied. Update it as the system evolves.*

# Kechow Delivery Platform — Production Reference (v3)

**Document version:** 2.0  
**Last updated:** March 2025  
**Purpose:** Authoritative reference for the production delivery platform: features, current behavior, issues addressed, and verification.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Issues Addressed (Re-Analysis)](#2-issues-addressed-re-analysis)
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

## 2. Issues Addressed (Re-Analysis)

### 2.1 Reject order

**Issue description**  
Frontend called `POST /delivery/jobs/{id}/reject`; backend returned `{ ok: true }` without persisting or removing the job from the available pool. Reject was non-functional.

**Cause and impact**  
- Cause: `rejectOrder` in DeliveryController had no DB logic.  
- Impact: Drivers believed they had rejected a job; the order stayed in the list; support/ops confusion.

**Recommended fix (implemented)**  

| Layer | Change |
|-------|--------|
| **Backend** | New table `delivery_rejections` (driver_id, order_id, rejected_at, reason). Model `DeliveryRejection`. `rejectOrder`: resolve driver; validate order (pending, no delivery); insert/update rejection; log (order_id, driver_id); return `{ ok: true }`. `getAvailableJobs`: exclude orders this driver has rejected via `deliveryRejections` relation on Order. |
| **Frontend** | No change; same button and store call. |
| **Config** | Run migration `2026_03_03_100001_create_delivery_rejections_table`. |

**Verification/QA**  
- As driver, reject a job → 200, row in `delivery_rejections`.  
- Get available jobs again → that order not in list for this driver.  
- Another driver still sees the order (if still pending).  
- Reject button in UI removes job from list without error.

---

### 2.2 Earnings calculation

**Issue description**  
Earnings were the sum of `orders.total` for delivered deliveries. There was no commission or fee logic; drivers saw the full order amount as “earnings”.

**Cause and impact**  
- Cause: getStats and getEarnings used `sum('orders.total')` with no rate or fee.  
- Impact: Business rules (commission/fees) could not be applied; driver-facing amounts were misleading.

**Recommended fix (implemented)**  

| Layer | Change |
|-------|--------|
| **Backend** | New `config/delivery.php`: `driver_commission_rate` (0–1, default 1.0), `delivery_fee_fixed` (default 0). Env: `DELIVERY_DRIVER_COMMISSION_RATE`, `DELIVERY_FEE_FIXED`. In getStats and getEarnings: driver earnings = (sum of order totals) × rate + (number of deliveries) × fixed. Order totals in DB unchanged. |
| **Frontend** | No change; same endpoints and response shape (earnings values now reflect commission/fee). |
| **Config** | Set `DELIVERY_DRIVER_COMMISSION_RATE` (e.g. 0.15 for 15%) and optionally `DELIVERY_FEE_FIXED` in production. |

**Verification/QA**  
- With default config (rate=1, fixed=0): earnings equal sum of order totals (unchanged behavior).  
- With rate=0.15, fixed=5: earnings = 15% of order total + 5 per delivery.  
- Stats and earnings endpoints return rounded amounts; no change to order total or completed-order list.

---

### 2.3 Owner routes

**Issue description**  
Owner module routes (`/api/v1/owners/*`) had a comment stating “role:admin”, while the code used `role:owner`. If frontend or ops expected admin, access could be wrong; some flows might be inactive or untested.

**Cause and impact**  
- Cause: Outdated comment in `app/Modules/Owner/routes.php`.  
- Impact: Documentation/onboarding confusion; possible wrong expectation that admin users access owner routes.

**Recommended fix (implemented)**  

| Layer | Change |
|-------|--------|
| **Backend** | Comment updated to state that middleware is `auth:sanctum`, `role:owner` (not admin). No change to route logic. |
| **Frontend** | Frontend already uses `role: 'owner'` for owner routes; no change. |
| **Config** | None. |

**Verification/QA**  
- User with role `owner` can access `/api/v1/owners/*`.  
- User with role `admin` receives 403 on owner routes unless also given owner role.  
- Owner dashboard and owner-only flows work with `role: 'owner'`.

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
| **Config** | None. |

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

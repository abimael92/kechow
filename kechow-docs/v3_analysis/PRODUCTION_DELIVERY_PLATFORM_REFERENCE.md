# Kechow Delivery Platform — Production Reference (v3)

**Document version:** 3.0  
**Last updated:** March 2025  
**Purpose:** Single authoritative reference for the production delivery platform: applied fixes, architecture, configuration, safe internal improvements, verification steps, and instructions for future external integrations. No external or paid APIs are required for current production behavior.

---

## Table of Contents

1. [Executive Summary / Status Table](#1-executive-summary--status-table)
2. [Issue Analysis & Fixes (Safe Fixes Applied)](#2-issue-analysis--fixes-safe-fixes-applied)
3. [Architecture Overview](#3-architecture-overview)
4. [Backend Features](#4-backend-features)
5. [Frontend Features](#5-frontend-features)
6. [Database Structure](#6-database-structure)
7. [Configuration & Env Variables](#7-configuration--env-variables)
8. [Verification & QA Checklist](#8-verification--qa-checklist)
9. [Remaining Technical Debt & Safe Improvements](#9-remaining-technical-debt--safe-improvements)
10. [Next Steps / Pending External Integrations](#10-next-steps--pending-external-integrations)
11. [Quick Reference](#11-quick-reference)

---

## 1. Executive Summary / Status Table

| Aspect | Status | Notes |
|--------|--------|--------|
| **Delivery API** | Production-ready | Consolidated under `/api/v1/delivery/*`; auth:sanctum + role:delivery; ApiResponse; delivery log channel |
| **Reject order** | Fixed | Persisted in `delivery_rejections`; excluded from driver’s available jobs; same response shape |
| **Earnings** | Fixed | Config-driven commission rate and fixed fee; drivers see commission/fee; order totals unchanged in DB |
| **Owner routes** | Clarified | Middleware is `role:owner` (comment corrected); frontend uses `role: 'owner'` |
| **LiveDelivery vs API** | Fixed | API returns orderNumber, fee, paymentMethod, customer, restaurant.phone; store has deliveryProgress/currentLocation stubs; component uses fallbacks |
| **Settings** | Fixed | PATCH validated (UpdateDeliverySettingsRequest) and persisted (language); GET returns stored value |
| **Frontend** | Production-ready | Vue 3 + TS, Pinia (delivery.store canonical), order detail and reject wired and functional |
| **External APIs** | Not required | All current features work without Google Maps, Stripe, SMS gateways, or push services |

---

## 2. Issue Analysis & Fixes (Safe Fixes Applied)

All fixes below are implemented, non-breaking, and preserve existing endpoints, API contracts, and frontend workflows.

---

### 2.1 Reject order persistence

**Issue**  
`POST /delivery/jobs/{id}/reject` returned `{ ok: true }` without persisting or removing the job from the driver’s available pool.

**Analysis**  
Cause: no DB logic in `rejectOrder()`. Impact: drivers saw the same job again; no audit trail. Risks: trust erosion, duplicate accept attempts.

**Fixes applied**

| Layer | Change |
|-------|--------|
| Backend | Table `delivery_rejections` (driver_id, order_id, rejected_at, reason). Model `DeliveryRejection`. `rejectOrder`: validate driver/order, firstOrCreate rejection, log (order_id, driver_id), return `{ ok: true }`. `getAvailableJobs`: exclude orders this driver rejected via `deliveryRejections`. |
| Frontend | No change. |
| Config | Run migration `2026_03_03_100001_create_delivery_rejections_table`. |

**Snippet (controller)**

```php
DeliveryRejection::firstOrCreate(
    ['driver_id' => $driver->id, 'order_id' => $orderId],
    ['reason' => $request->input('reason')]
);
$query->whereDoesntHave('deliveryRejections', fn ($q) => $q->where('driver_id', $driver->id));
```

**Verification**  
See [§8.1](#81-reject).

---

### 2.2 Earnings calculation (configurable commission/fee)

**Issue**  
Earnings = sum(orders.total) for delivered deliveries; no commission or fee logic.

**Analysis**  
Cause: getStats/getEarnings used `sum('orders.total')` only. Impact: finance cannot reflect real driver pay. Risks: contractual/legal if displayed ≠ actual pay.

**Fixes applied**

| Layer | Change |
|-------|--------|
| Backend | `config/delivery.php`: `driver_commission_rate` (0–1), `delivery_fee_fixed`. Earnings = (sum order totals) × rate + (count deliveries) × fixed. Order totals in DB unchanged. |
| Frontend | No change. |
| Config | `DELIVERY_DRIVER_COMMISSION_RATE`, `DELIVERY_FEE_FIXED` in .env; default 1.0 and 0. |

**Snippet (config)**

```php
// config/delivery.php
'driver_commission_rate' => (float) env('DELIVERY_DRIVER_COMMISSION_RATE', 1.0),
'delivery_fee_fixed'     => (float) env('DELIVERY_FEE_FIXED', 0),
```

**Verification**  
See [§8.2](#82-earnings).

---

### 2.3 Owner routes clarity

**Issue**  
Comment said “role:admin”; code uses `role:owner`; risk of role mismatch.

**Analysis**  
Cause: outdated comment. Impact: wrong expectation that admin accesses owner routes. Risks: 403s, untested flows.

**Fixes applied**

| Layer | Change |
|-------|--------|
| Backend | Comment updated to “role:owner (not admin)”. No route or middleware change. |
| Frontend | Already `role: 'owner'` for owner paths. |
| Config | None. |

**Verification**  
See [§8.3](#83-owner-routes).

---

### 2.4 LiveDelivery UI/API mismatch

**Issue**  
LiveDelivery expected orderNumber, fee, paymentMethod, customer.phone, restaurant.phone, currentLocation; API and store did not provide them.

**Analysis**  
Cause: minimal API shape; store missing deliveryProgress/currentLocation/loadDeliveryProgress/updateCurrentLocation. Impact: blanks, undefined, possible runtime errors. Risks: poor UX, broken “Llamar” links.

**Fixes applied**

| Layer | Change |
|-------|--------|
| Backend | getActiveOrder/getOrderDetail return orderNumber, fee, paymentMethod, restaurant (name, address, phone), customer (name, address, phone), distance (null), estimatedTime (15). Eager-load order.user, restaurant. |
| Frontend | Store: computed deliveryProgress from activeOrder.status; ref currentLocation (null); no-op loadDeliveryProgress, updateCurrentLocation. LiveDelivery: fallbacks for all optional fields; v-if for phone links; “Teléfono no disponible” when missing. |
| Config | Fee from delivery config. |

**Verification**  
See [§8.4](#84-livedelivery).

---

## 3. Architecture Overview

### 3.1 High-level flow

```
┌─────────────────────┐         HTTPS /api/v1          ┌──────────────────────────────┐
│  Vue 3 SPA          │  ◄──────────────────────────►  │  Laravel API (kechow-server) │
│  (kechow-client)    │  auth:sanctum, role:delivery    │  ApiResponse, CORS, throttle  │
│  Pinia, axios       │  on /delivery/*                 │  delivery log channel        │
└──────────┬──────────┘                                 └──────────────┬───────────────┘
           │                                                          │
           │ withCredentials, unwrap { success, data }                 │
           └──────────────────────────────────────────────────────────┘
                                    │
                                    ▼
           ┌────────────────────────────────────────────────────────────┐
           │  Models: Driver, Delivery, Order (Modules/Order)            │
           │  DB: users, drivers, deliveries, delivery_rejections,       │
           │      orders, restaurants, ...                              │
           └────────────────────────────────────────────────────────────┘
```

### 3.2 Backend

- **API prefix:** `/api/v1` (throttle 60/min).
- **Delivery:** `prefix('delivery')`, middleware `auth:sanctum`, `role:delivery`.
- **Single controller:** `App\Http\Controllers\Api\Driver\DeliveryController`.
- **Auth:** Sanctum session (stateful domains) or Bearer token; CheckRole middleware for role:delivery, role:owner.

### 3.3 Frontend

- **Stores:** delivery.store (canonical), driver.store (compatibility), stats.store.
- **API client:** axios baseURL `/api/v1`, withCredentials, response unwrap of `{ success, data }`.
- **Routes:** DeliveryLayout, meta requiresAuth + role: 'delivery'; OwnerLayout, role: 'owner'.

### 3.4 Data model (core)

- **User** 1→1 **Driver** (user_id).
- **Driver** 1→n **Delivery** ← **Order** (order_id, driver_id).
- **Order** 1→n **DeliveryRejection** (for “driver rejected this order”).
- **Order** belongs to User (customer), Restaurant; has delivery_address, delivery_notes.

---

## 4. Backend Features

### 4.1 Controllers

| Controller | Path | Purpose |
|------------|------|--------|
| DeliveryController | `App\Http\Controllers\Api\Driver\DeliveryController` | All `/api/v1/delivery/*` actions |
| AuthController | `App\Http\Controllers\Api\AuthController` | login, register, user, logout |
| Owner (module) | `App\Modules\Owner\Controllers\*` | Owner management, analytics |

### 4.2 Delivery endpoints (`/api/v1/delivery/*`)

| Method | URI | Request | Notes |
|--------|-----|---------|--------|
| GET | `/delivery/availability` | — | isOnline, totalOnlineHours, hasActiveOrder |
| POST | `/delivery/availability` | UpdateAvailabilityRequest | isOnline |
| GET | `/delivery/jobs/available` | — | jobs[] (excludes driver’s rejections) |
| POST | `/delivery/jobs/{orderId}/accept` | — | Transaction: Delivery + order accepted |
| POST | `/delivery/jobs/{orderId}/reject` | body: reason? | Persist rejection; { ok: true } |
| GET | `/delivery/orders/active` | — | Single active order (extended shape) |
| GET | `/delivery/orders/completed` | per_page? | Paginated delivered |
| GET | `/delivery/orders/{orderId}` | — | Order detail; authorize view |
| PATCH | `/delivery/orders/{orderId}/status` | UpdateDeliveryStatusRequest | status; authorize update |
| GET | `/delivery/stats` | — | todayOrders, earnings (commission/fee), completed_deliveries, rating |
| GET | `/delivery/earnings` | — | today, week, month, total (commission/fee) |
| GET | `/delivery/settings` | — | { language } |
| PATCH | `/delivery/settings` | UpdateDeliverySettingsRequest | language (persisted) |

### 4.3 Models

| Model | Path | Key relations |
|-------|------|----------------|
| Driver | `App\Models\Driver` | user, deliveries, locations |
| Delivery | `App\Models\Delivery` | order, driver |
| DeliveryRejection | `App\Models\DeliveryRejection` | order, driver |
| Order | `App\Modules\Order\Models\Order` | user, restaurant, items, delivery, deliveryRejections |

### 4.4 Policies and Form Requests

- **DeliveryPolicy:** update/view require user role delivery and delivery->driver->user_id = user->id. Used in getOrderDetail (view) and updateOrderStatus (update).
- **UpdateAvailabilityRequest:** isOnline required boolean; authorize role delivery.
- **UpdateDeliveryStatusRequest:** status required, in: assigned,picked_up,in_transit,delivered,cancelled.
- **UpdateDeliverySettingsRequest:** language sometimes, in: es,en; authorize role delivery.

### 4.5 Migrations (delivery-related, run in order)

- `2026_03_03_100001_create_delivery_rejections_table`
- `2026_03_03_100002_add_preferred_language_to_drivers_table`
- Plus base: create_orders_table, add_delivery_fields_to_orders_table, create_deliveries_table, create_drivers_table, add_indexes_to_orders_and_deliveries.

---

## 5. Frontend Features

### 5.1 Delivery store (`delivery.store.ts`)

- **State:** availability, availableJobs, activeOrder, isOnline, completedOrdersList, earningsSummary, orderDetail, deliveryProgress (computed), currentLocation (ref null), loading/error, etc.
- **Actions:** initialize, loadAvailableJobs, toggleAvailability, acceptDeliveryOrder, updateStatus, rejectOrder, fetchOrderDetail, loadCompletedOrders, loadEarningsSummary, loadDeliveryProgress (no-op), updateCurrentLocation (no-op), $reset.

### 5.2 Key components

| Component | Path | Role |
|-----------|------|------|
| OrdersPanel | `features/delivery/containers/OrdersPanel.vue` | Available/active/completed lists; accept; reject |
| DeliveryOrderDetail | `features/delivery/views/DeliveryOrderDetail.vue` | Order detail by id |
| LiveDelivery | `features/delivery/views/LiveDelivery.vue` | Active order; status steps; fallbacks for orderNumber, fee, customer/restaurant |
| DashboardOverview | `features/delivery/components/DashboardOverview.vue` | Toggle, active order, earnings |
| DriverDashboard | `features/delivery/components/DriverDashboard.vue` | Uses driver.store + delivery; Echo channel (optional) |
| EarningsPanel | `features/delivery/containers/EarningsPanel.vue` | earningsSummary, loadEarningsSummary |

### 5.3 Owner routes (frontend)

- Router meta `role: 'owner'` for paths under OwnerLayout (e.g. owner/dashboard, owner/menu, owner/orders).
- Backend enforces `role:owner` on `/api/v1/owners/*`; no admin required.

### 5.4 Driver service (API layer)

- `features/delivery/services/driver.service.ts`: getAvailability, updateAvailability, getAvailableJobs, getActiveOrder, acceptJob, rejectJob, updateOrderStatus, getCompletedOrders, getEarnings, getStats, getOrderDetail. All use axios instance with baseURL `/api/v1`; response unwrapped by interceptor.

---

## 6. Database Structure

| Table | Purpose | Key columns / indexes |
|-------|---------|------------------------|
| users | Auth, roles | id, email, role |
| drivers | One per driver user | id, user_id (unique), is_online, preferred_language, total_deliveries |
| orders | Customer orders | id, user_id, restaurant_id, total, status, delivery_address, delivery_notes |
| deliveries | Assignment of order to driver | id, order_id (unique), driver_id, status, assigned_at, picked_up_at, delivered_at |
| delivery_rejections | Driver rejected order (no accept) | id, driver_id, order_id, rejected_at, reason; index (driver_id, order_id) |
| driver_locations | Optional future tracking | driver_id, latitude, longitude, created_at |
| restaurants | Restaurant data | id, name, address, phone, ... |

---

## 7. Configuration & Env Variables

### 7.1 Required for production (no external APIs)

| Variable | Purpose | Example |
|----------|---------|--------|
| APP_ENV | environment | production |
| APP_DEBUG | debug mode | false |
| APP_KEY | encryption | base64:... |
| DB_* | Database | DB_CONNECTION, DB_HOST, DB_DATABASE, DB_USERNAME, DB_PASSWORD |
| SANCTUM_STATEFUL_DOMAINS | SPA origins for session cookie | your-app.example.com |
| CORS_ALLOWED_ORIGINS | Allowed SPA origins (no *) | https://your-app.example.com |
| DELIVERY_DRIVER_COMMISSION_RATE | 0–1 (e.g. 0.15 = 15%) | 1.0 |
| DELIVERY_FEE_FIXED | Fixed amount per delivery | 0 |
| SESSION_DRIVER | Session backend | database or redis |
| LOG_CHANNEL | Logging | stack |
| LOG_LEVEL | Log level | production: warning or error |

### 7.2 Optional (internal only)

| Variable | Purpose | Default |
|----------|---------|--------|
| LOG_DAILY_DAYS | Days to keep delivery.log | 14 |
| CACHE_STORE | Cache driver | database |
| QUEUE_CONNECTION | Queue driver | database |

### 7.3 Frontend (kechow-client)

| Variable | Purpose | Example |
|----------|---------|--------|
| VITE_API_URL | Backend base URL (no /api/v1) | https://api.kechow.com |

### 7.4 Not required for current production

- BROADCAST_CONNECTION (can stay `log` or `null`).
- REVERB_* / PUSHER_* (only for real-time; see [§10](#10-next-steps--pending-external-integrations)).
- Google Maps, Stripe, Twilio, FCM keys (see [§10](#10-next-steps--pending-external-integrations)).

---

## 8. Verification & QA Checklist

### 8.1 Reject

- [ ] As driver, POST `/delivery/jobs/{orderId}/reject` → 200, body includes ok: true.
- [ ] Row in `delivery_rejections` for that driver_id and order_id.
- [ ] GET `/delivery/jobs/available` as same driver → that order not in jobs.
- [ ] As another driver, available jobs still include order if pending and no delivery.
- [ ] UI Reject button removes job from list; no errors.

### 8.2 Earnings

- [ ] Default (rate=1, fixed=0): GET `/delivery/stats` and `/delivery/earnings` → earnings = sum of order totals.
- [ ] Set rate=0.15, fixed=5 → earnings = 15% of sum + 5 per delivery for period.
- [ ] Order total and completed-order payloads unchanged.

### 8.3 Owner routes

- [ ] User with role owner can access `/api/v1/owners/*` and owner dashboard.
- [ ] User with role admin only gets 403 on owner routes (unless also owner).

### 8.4 LiveDelivery

- [ ] With active order: order number, amount, fee, payment method, pickup/dropoff, steps render.
- [ ] Missing customer/restaurant phone: “Teléfono no disponible” or link hidden; no console errors.
- [ ] Status updates advance steps; location shows “Ubicación no disponible” when currentLocation null.

### 8.5 No regressions

- [ ] Login, delivery dashboard, available jobs, accept, order detail, completed orders, settings GET/PATCH work as before.
- [ ] Migrations applied; no 500s from missing columns.

---

## 9. Remaining Technical Debt & Safe Improvements

All items below can be done without external or paid APIs and without breaking existing behavior.

### 9.1 Internal improvements (recommended)

| Improvement | Description | Safe / non-breaking |
|-------------|-------------|----------------------|
| ApiResponse in other modules | Use ApiResponse trait (or same JSON shape) in Auth, Owner, Restaurant, Order, Cart so frontend unwrap is consistent | Yes; add trait and return success($data) |
| i18n for delivery copy | Move hardcoded strings (e.g. “Entrega en vivo”, “Marcar recogido”) into locale files | Yes |
| TypeScript interfaces | Replace `any` in delivery store with interfaces (Job, ActiveOrder, EarningsSummary) | Yes |
| Health endpoint | Add GET `/api/v1/health` (e.g. DB check, 200) for load balancer / monitoring | Yes |
| Orders table columns | Ensure orders has driver_id, estimated_delivery_time, actual_delivery_time if used by code; add migration if missing | Yes |
| Deprecate legacy driver API | Document that `/api/v1/delivery/*` is canonical; add deprecation comment or redirect for Order module `driver/*` routes | Yes |

### 9.2 Safe config/code practices

- **CORS:** Never use `*` for allowed_origins in production when using credentials.
- **Logging:** Do not log PII (addresses, names, phones) in delivery channel; only IDs and status.
- **Mass assignment:** Keep using Form Requests and validated() only; no $request->all() on critical models.
- **Rate limiting:** Keep throttle on v1; consider stricter limit on auth endpoints if needed.

### 9.3 What not to change (preserve)

- Existing delivery endpoint URLs and response shapes (except documented additions like orderNumber, customer, etc.).
- Frontend store action names and API call signatures used by components.
- Order total and completed-order list structure (earnings are derived, not stored per delivery).

---

## 10. Next Steps / Pending External Integrations

Features in this section depend on external APIs or paid services. They are **not required** for current production. Placeholders and instructions below allow enabling them later without breaking existing behavior.

---

### 10.1 Google Maps (or Mapbox)

**Where it’s used**

- **Admin:** `ActiveDispatchMap.vue` — show “In-Transit” drivers on a map. Currently shows a message: “Configure la API de mapas….”
- **Customer:** `AddressForm.vue` — address autocomplete via `useGooglePlaces` (Google Places API). If key missing, autocomplete is disabled or gracefully no-op.
- **Owner/Driver:** Optional “Open in Maps” links (e.g. `https://maps.google.com/?q=...`) — work without API key.

**Steps to enable**

1. **Obtain API key**
   - Google Cloud Console → APIs & Services → Credentials.
   - Enable: Maps JavaScript API (and optionally Geocoding, Places).
   - Restrict key by HTTP referrer (e.g. your domain) and optionally by API.

2. **Backend (if you add geocoding or distance)**  
   - Add to `.env`: e.g. `GOOGLE_MAPS_API_KEY=...` (server-side only; do not expose in frontend if used for billing-sensitive calls).

3. **Frontend**
   - Add to `.env` (or build env): `VITE_GOOGLE_MAPS_API_KEY=...` (or `VITE_MAPBOX_ACCESS_TOKEN` if using Mapbox).
   - In `ActiveDispatchMap.vue`: uncomment or add the map component; pass the key to the map library (e.g. Google Maps JS loader or Mapbox GL).
   - In `useGooglePlaces` / address autocomplete: when key is present, load the script and attach autocomplete; when missing, keep current fallback (manual address input).

4. **Documentation**
   - Update this section with: “Google Maps enabled; key restricted to [domain]. Place autocomplete and dispatch map active.”

**Placeholder / safe default**

- No key → no map in ActiveDispatchMap; no Places autocomplete. Rest of app works.

---

### 10.2 Real-time (Reverb / WebSockets)

**Where it’s used**

- **Driver:** `DriverDashboard.vue` subscribes to Echo channel `delivery.orders` for new jobs.
- **Backend:** Events such as `OrderCreated`, `OrderStatusUpdated` implement ShouldBroadcast; when BROADCAST_CONNECTION is reverb (or pusher), they push to WebSocket.

**Steps to enable**

1. **Backend**
   - Install and run Laravel Reverb (or configure Pusher).
   - In `.env`: set `BROADCAST_CONNECTION=reverb` (or `pusher`). Set `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_HOST`, `REVERB_PORT`, `REVERB_SCHEME`.
   - Run `php artisan reverb:start` (or use Pusher).
   - In `routes/channels.php`: authorize channel e.g. `delivery.orders` for authenticated delivery users.

2. **Frontend**
   - Ensure Echo is configured with same broadcaster and auth endpoint (e.g. `VITE_API_URL`/broadcasting/auth). Already in `echo.ts` / `app/lib/echo.ts`; when backend broadcasts, driver app will receive events.

3. **Documentation**
   - Update this section: “Real-time enabled via Reverb; driver dashboard receives new order events.”

**Placeholder / safe default**

- BROADCAST_CONNECTION=log or null → events logged only; driver polls or refreshes list. No WebSocket required.

---

### 10.3 Payment gateway (e.g. Stripe)

**Where it’s referenced**

- **Owner:** PaymentSettings (e.g. `stripeEnabled` in types); checkout/order flows may pass `paymentMethod` (cash/card/online) as state only; no charge API called today.

**Steps to enable**

1. **Obtain credentials**
   - Stripe (or chosen provider): API keys (publishable + secret), optional webhook secret.

2. **Backend**
   - Add to `.env`: `STRIPE_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` (or equivalent).
   - Implement payment intent or charge in order/checkout flow; keep existing order total and status flow; add payment_status or transaction_id if needed.
   - Do not change existing delivery earnings calculation (commission/fee) unless product explicitly extends it to “driver share of payment.”

3. **Frontend**
   - Use publishable key only in client; keep secret on server. Enable “card” or “online” only when backend confirms gateway is configured.

4. **Documentation**
   - Update this section: “Stripe enabled; checkout charges card; webhook updates payment status.”

**Placeholder / safe default**

- No keys → payment method remains UI/state only; orders still placeable (e.g. cash on delivery). No breaking change.

---

### 10.4 SMS / Notifications (e.g. Twilio, FCM)

**Where it’s used**

- **Owner/Driver:** “SMS” or “Llamar” often use `sms:` or `tel:` links (no gateway). Optional: Twilio (or similar) for actual SMS; FCM for push.

**Steps to enable**

1. **SMS (e.g. Twilio)**
   - Obtain account and API credentials. Add to `.env`: `TWILIO_SID`, `TWILIO_TOKEN`, `TWILIO_FROM`.
   - Backend: send SMS when order accepted, status changed, etc.; do not change existing delivery or order APIs; add optional “notify by SMS” flag if needed.
   - Frontend: no change required for existing tel/sms links; optional “Send SMS” button that calls backend to send via Twilio.

2. **Push (FCM)**
   - Obtain FCM project and server key / credentials. Store in backend .env.
   - Backend: store device tokens; send push when new job or status change (optional). Frontend: request permission, register token via API.
   - Document: “Push notifications enabled for drivers (new job, status).”

**Placeholder / safe default**

- No Twilio/FCM → existing tel/sms links still work; no outbound SMS or push. No breaking change.

---

### 10.5 Driver location (live tracking)

**Where it’s used**

- **Store:** `currentLocation` ref (null); `updateCurrentLocation` no-op. LiveDelivery shows “Ubicación no disponible.”
- **DB:** `driver_locations` table exists; backend could accept POST with lat/lng and store per driver.

**Steps to enable (no paid geo API required)**

1. **Backend**
   - Add endpoint e.g. POST `/api/v1/delivery/location` with validated lat/lng; store in `driver_locations` (and optionally update drivers.current_latitude/longitude).
   - Optional: GET `/api/v1/delivery/orders/{id}/location` for customer or admin to read driver’s last position (privacy/compliance consider).

2. **Frontend**
   - In delivery app: use browser Geolocation API; call POST location periodically when driver has active order; set `currentLocation` in store from response or from geolocation.
   - LiveDelivery: already shows currentLocation when present; no UI change needed.

3. **Documentation**
   - Update: “Driver location: backend stores last position; LiveDelivery shows current location when available.”

**Placeholder / safe default**

- No location endpoint or no geolocation permission → currentLocation stays null; “Ubicación no disponible” shown. No breaking change.

---

### 10.6 Summary table (external integrations)

| Feature | Blocked by | Steps to enable | Safe without it |
|---------|------------|------------------|-----------------|
| Google Maps / Places | API key | §10.1 | Yes: manual address; no dispatch map |
| Real-time (Reverb) | Reverb/Pusher config | §10.2 | Yes: polling or refresh |
| Stripe (payments) | Stripe keys + implementation | §10.3 | Yes: cash/state-only payment |
| SMS / Push | Twilio, FCM credentials | §10.4 | Yes: tel/sms links only |
| Driver location | Backend endpoint + Geolocation | §10.5 | Yes: location block shows “no disponible” |

---

## 11. Quick Reference

### Backend

| Resource | Path / Class |
|----------|----------------|
| Delivery routes | `kechow-server/routes/api.php` (v1 → delivery prefix) |
| DeliveryController | `App\Http\Controllers\Api\Driver\DeliveryController` |
| Config (delivery) | `config/delivery.php` |
| DeliveryRejection | `App\Models\DeliveryRejection` |
| UpdateDeliverySettingsRequest | `App\Http\Requests\Delivery\UpdateDeliverySettingsRequest` |

### Frontend

| Resource | Path |
|----------|------|
| Delivery store | `kechow-client/src/features/delivery/store/delivery.store.ts` |
| LiveDelivery | `kechow-client/src/features/delivery/views/LiveDelivery.vue` |
| Driver service | `kechow-client/src/features/delivery/services/driver.service.ts` |

### Migrations (delivery, run in order)

- `2026_03_03_100001_create_delivery_rejections_table`
- `2026_03_03_100002_add_preferred_language_to_drivers_table`

---

*This document is the authoritative production reference for the Kechow Delivery Platform (v3). All described fixes are applied and safe. External integrations are optional and documented in §10 with instructions for enabling when API access or credentials are available.*

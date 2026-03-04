# Kechow — Role-Based Feature Matrix

**Version:** v2 Analysis  
**Date:** February 2026  
**Purpose:** Map implemented features by role and call out gaps (e.g. real-time, missing admin features).

---

## 1. Client (Customer)

| Feature | Status | Real-time | Notes |
|---------|--------|-----------|--------|
| Order placement | ✅ Implemented | No | Cart → Checkout → POST order; address selection. |
| Order history | ✅ Implemented | No | List orders; filter by status. |
| Real-time order tracking | ⏳ Pending | No | Route exists (e.g. OrderTrackingPage); no live driver location or status push. Polling or Echo not wired. |
| Cart | ✅ Implemented | No | Per-restaurant cart; expiry; stock checks. |
| Addresses | ✅ Implemented | No | CRUD addresses; default. |
| Profile | ✅ Implemented | No | View and edit profile. |
| Reviews | ✅ Implemented | No | View and submit reviews. |
| Restaurant browsing / menu | ✅ Implemented | No | List, detail, menu. |

**Gaps:**

- **Real-time tracking:** Customer cannot see live driver position or live order status updates; needs Echo subscription to `order.{id}.tracking` or similar and a map/pin.

---

## 2. Driver (Delivery)

| Feature | Status | Real-time | Notes |
|---------|--------|-----------|--------|
| Job queue (available jobs) | ✅ Implemented | No | GET /delivery/jobs/available; list of pending orders. |
| Accept / reject job | ✅ Implemented | No | Accept creates delivery record; reject implemented. |
| Active order detail | ✅ Implemented | No | Single active delivery; status steps. |
| Earnings summary | ✅ Implemented | No | Today / week / month / total from API. |
| Real-time availability toggle | ⚠️ Broken / needs fixing | No | Toggle exists; backend updates `is_online`. Echo not used; no live “new job” push. Drivers may rely on refresh. |
| Completed orders list | ✅ Implemented | No | Paginated list. |
| Profile / settings | ✅ Implemented | No | Profile and vehicle/settings. |
| Live delivery status updates | ✅ Implemented (client → server) | One-way | Driver updates status (picked up, in transit, delivered); no push to driver UI for external changes (e.g. order cancelled). |

**Gaps:**

- **Real-time availability:** Toggle is HTTP-only; no WebSocket. “New job available” or “order assigned to you” not pushed; driver must refresh or poll.
- **Real-time job queue:** New orders appear only on refresh or poll; Echo channel for “available jobs for driver” not implemented.
- **Real-time order updates:** If owner cancels or updates order, driver is not pushed the update via Echo.

---

## 3. Admin (and Owner)

| Feature | Status | Real-time | Notes |
|---------|--------|-----------|--------|
| Full CRUD (owners) | ✅ Implemented | No | Admin-only `/owners` routes; CRUD for owner records. |
| System logs | ❌ Missing | — | No UI for backend logs or exception list. |
| Financials | ⚠️ Partial | No | Owner has dashboard stats (today revenue, etc.); no admin-wide financial report or export. |
| Real-time dispatching | ❌ Missing | — | No admin view to assign drivers or see “in-transit” on a map in real time. |
| Owner dashboard (orders, menu, analytics, reviews, settings) | ✅ Implemented | Polling | DashboardOverview polls orders; no Echo subscription yet. |
| Order status updates (owner) | ✅ Implemented | No | Owner can change status; no push to customer or driver. |
| Menu management | ✅ Implemented | No | CRUD menu items. |
| Restaurant settings | ✅ Implemented | No | Hours, delivery, etc. |

**Gaps:**

- **System logs:** No Error Logger or activity log UI for admin (see ADMIN_COMMAND_CENTER).
- **Financials:** No admin-level report (all restaurants, date range, export).
- **Real-time dispatching:** No live map of in-transit deliveries; no “assign driver” with live updates via Echo.
- **Real-time order updates:** Owner dashboard uses polling; no Echo for `order.created` / `order.status.updated` yet (backend events exist; frontend not subscribed).

---

## 4. Features That Lack Real-Time Data Synchronization

| Area | Current | Desired |
|------|---------|--------|
| **Customer:** order status / tracking | Polling or none | Echo: order status and driver location updates. |
| **Driver:** new available jobs | Polling or refresh | Echo: new order or “job assigned to you.” |
| **Driver:** order cancelled / updated by owner | None | Echo: order.updated so driver UI updates. |
| **Owner:** new orders | Polling (e.g. 8 s) | Echo: `order.created` on `restaurant.{id}.orders`. |
| **Owner:** order status (e.g. driver delivered) | Polling | Echo: `order.status.updated` on same channel. |
| **Admin:** exception list | None | Optional: Echo when new exception logged. |
| **Admin:** in-transit map | None | Echo: `delivery.location.updated` and status updates. |

---

## 5. Summary Table

| Role | Implemented | Pending / Broken | Missing |
|------|-------------|------------------|--------|
| **Client** | Order placement, history, cart, addresses, profile, reviews, browsing | Real-time tracking | — |
| **Driver** | Job queue, accept/reject, earnings, active order, completed list, profile | Real-time availability and new-job push | — |
| **Admin** | Owner CRUD | — | System logs UI, full financials, real-time dispatching map |

**Real-time gaps:** All three roles lack full real-time sync where it would matter (customer tracking, driver new jobs/updates, owner/admin live orders and map). Backend has Reverb and events (`OrderCreated`, `OrderStatusUpdated`); frontend Echo is present but not wired to these channels and not used for availability or tracking.

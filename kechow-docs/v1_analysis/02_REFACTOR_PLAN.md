# Phase 2 — Refactor Plan

**Project:** Kechow  
**Objective:** Eliminate technical debt, complete delivery module, align backend and frontend with production-ready architecture.

---

## 1. Priority Matrix

| Priority | Area | Actions | Risk if Deferred |
|----------|------|---------|-------------------|
| P0 | Delivery API authorization | Add role:delivery middleware; validate driver owns order on status update | Unauthorized access |
| P0 | Delivery backend completion | getCompletedOrders, getStats, earnings endpoint; acceptOrder updates Order + transaction | Broken delivery UX |
| P0 | Deliveries table | Add migration for `deliveries` if missing; document schema | Runtime errors |
| P1 | Single driver/delivery API | Deprecate api/driver/* or merge into api/delivery/* with single controller | Confusion, bugs |
| P1 | Delivery frontend store | Add earningsSummary, loadEarningsSummary, completed list, pagination, loading/error states | Broken earnings and history |
| P1 | Order status validation | Form Request + whitelist for delivery status; sync Order and Delivery status | Data inconsistency |
| P2 | Remove dead code | Delete app/Models/Order; unify Driver usage; remove routes_owner or wire it; remove BusinessOwnerMiddleware or use it | Bloat, confusion |
| P2 | CORS and rate limiting | Use config CORS; add throttle to api and auth | Production deploy block; abuse |
| P2 | API versioning and response format | /api/v1; ApiResponse trait or Resource pattern | Breaking mobile later |
| P3 | Backend feature structure | Repositories, DTOs, centralized exceptions | Maintainability |
| P3 | Frontend i18n and cleanup | All delivery UI strings to locale; remove useDriverStore duplicate | Consistency |
| P3 | SEO and meta | Meta per route; JSON-LD; Spanish titles/descriptions | Local SEO |

---

## 2. Backend Refactor Steps

### 2.1 Immediate (P0)

1. **Delivery role middleware**
   - Create or reuse middleware that allows only `user.role === 'delivery'` (or equivalent) for `api/delivery/*`.
   - Apply to the existing `delivery` route group in `api.php`.

2. **Delivery controller authorization**
   - In `updateOrderStatus`: resolve Delivery by orderId, then ensure `delivery.driver->user_id === Auth::id()`. Return 403 otherwise.
   - In `acceptOrder`: ensure order status is pending and order has no delivery; use DB transaction; create Delivery and optionally set Order status (e.g. accepted).

3. **Form Request for status**
   - Create `UpdateDeliveryStatusRequest`: validate `status` in `['assigned','picked_up','in_transit','delivered','cancelled']`.

4. **getCompletedOrders**
   - Query Deliveries for current driver with status `delivered` (and optionally `cancelled`), with order, restaurant, pagination. Return JSON list.

5. **getStats**
   - Compute from Deliveries (and Orders if needed): today’s deliveries count, earnings (from order total or delivery fee if stored), optionally rating. Return consistent shape expected by frontend.

6. **Earnings endpoint**
   - Add `GET /delivery/earnings` (or extend stats): period query (week/month), return summary (total earnings, by day or week, breakdown if applicable). Consume in frontend `loadEarningsSummary`.

7. **Deliveries table migration**
   - If table does not exist: create migration for `deliveries` (id, order_id FK, driver_id FK, status, assigned_at, picked_up_at, delivered_at, cancelled_at, cancellation_reason, notes, timestamps). Add indexes (driver_id, status, order_id).

### 2.2 Short-term (P1–P2)

8. **Single delivery API**
   - Decide canonical: keep `api/delivery/*` and mark `api/driver/*` as deprecated or remove. Update any remaining frontend references to driver/* to delivery/*. One controller/service for driver app.

9. **Driver identity consistency**
   - Option A: Keep Order.driver_id as user_id for display; Delivery.driver_id as drivers.id for assignment. Document and ensure acceptOrder creates Delivery and optionally sets orders.driver_id to driver’s user_id.
   - Option B: Add orders.driver_id as FK to drivers.id and use everywhere. Migrate and update Order model.

10. **Remove dead code**
    - Delete `app/Models/Order.php` (use only Module Order).
    - Remove or register `routes_owner.php`; if kept, require in api.php and ensure middleware/controllers exist.
    - Remove or use BusinessOwnerMiddleware.

11. **CORS**
    - Remove custom Cors middleware override; use `config/cors.php` and Laravel’s default CORS handling for API.

12. **Rate limiting**
    - Apply `throttle:60,1` (or similar) to `api` route group; stricter throttle on login/register.

13. **API versioning**
    - Group all API routes under `Route::prefix('v1')` in api.php; frontend and future mobile use `/api/v1/...`.

### 2.3 Medium-term (P3)

14. **Central API response**
    - Introduce JSON envelope (e.g. data, message, errors) via trait or base controller; use in delivery and other modules.

15. **Repositories / DTOs**
    - Introduce DeliveryRepository (and optionally OrderRepository) for reads/writes; DTOs for API response shapes. Refactor DeliveryController to use them.

16. **Exception handling**
    - API exception handler: map validation and domain exceptions to consistent HTTP and JSON structure; logging.

---

## 3. Frontend Refactor Steps

### 3.1 Immediate (P0–P1)

1. **Delivery store — earnings**
   - Add state: `earningsSummary`, `completedOrdersList`, `earningsLoading`, `earningsError`.
   - Add actions: `loadEarningsSummary(period?)`, `loadCompletedOrders(page?)`. Call real API (`/delivery/earnings`, `/delivery/orders/completed`).

2. **Delivery store — status response**
   - In `updateStatus`, do not assign backend response to `activeOrder` (backend returns `{ status }`). Either refetch active order or update local `activeOrder.status` only; on `delivered`, clear activeOrder and optionally append to completed list.

3. **EarningsPanel**
   - Remove hardcoded payouts and breakdown data. Use `deliveryStore.earningsSummary` and `loadEarningsSummary`. Loading and empty states from store. Keep Spanish labels via i18n keys.

4. **OrdersPanel**
   - Completed tab: use `completedOrdersList` from store with pagination. Available/Active from existing store. Replace hardcoded `paymentMethod` with API field or i18n fallback. Add loading/error states.

5. **Order detail**
   - Implement DeliveryOrderDetail: accept route param (order id); fetch order/delivery by id (new endpoint if needed); show details and status. Use for “Ver entrega” navigation.

6. **Reject order**
   - In store, add `rejectOrder(orderId)`: call `POST /delivery/jobs/{id}/reject`; remove from availableJobs. Wire OrdersPanel handleRejectOrder to store.

7. **Driver store cleanup**
   - Remove or refactor `useDriverStore.ts` so only one driver store exists (id `'driver'`). Migrate any used behavior into `driver.store.ts` or into `delivery.store.ts` and use single source of truth.

### 3.2 Short-term (P2–P3)

8. **i18n**
   - Move all delivery Spanish strings to locale files (es.json); use keys in EarningsPanel, OrdersPanel, DriverDashboard, nav.config (or shared nav component with i18n).

9. **ProfilPage**
   - Remove or rename ProfilPage to ProfilePage and fix route to avoid duplicate.

10. **Real-time**
    - Keep polling for delivery list/active order until broadcasting is implemented; document polling interval and consider visibility-based refresh.

11. **Error boundaries**
    - Add error boundary component for delivery (and optionally global) to avoid white screen on store/API errors.

### 3.3 Medium-term

12. **Aliases**
    - Optional: add `@core` pointing to `src/app` for clarity.

13. **SEO**
    - Per-route meta (title, description) via router or composable; index.html and landing meta in Spanish; JSON-LD and local business (see Phase 6).

---

## 4. Database Refactor (Summary)

- Add `deliveries` migration if missing; add indexes (driver_id, status, order_id, delivered_at).
- Add indexes on `orders` (status, driver_id, restaurant_id, created_at).
- Consider soft deletes and audit fields (created_by, updated_by) where required by policy.
- Document final schema in Phase 5 deliverable.

---

## 5. Documentation Refactor

- Remove duplicate files in kechow-docs (e.g. "copy" files).
- Create single index (e.g. README.md in kechow-docs) listing all documents.
- Remove references to deleted Docs/ files; point to kechow-docs.
- Consolidate OWNER_*, ROUTE_GUARDS, etc. into fewer, clearly named files (see Phase 8).

---

## 6. Risk Assessment

| Risk | Mitigation |
|------|------------|
| Breaking existing client app | API versioning (v1); keep backward compatibility until mobile is on v1. |
| Data inconsistency on accept/status | Use DB transactions; single source of truth for Order vs Delivery status. |
| Regression in owner/customer flows | No refactor of owner/customer routes in P0; test after delivery changes. |
| Missing deliveries table in prod | Run migrations in order; verify deliveries table before deploy. |

---

## 7. Execution Order (Recommended)

1. Backend: deliveries migration (if needed) → delivery role middleware → Form Request and controller authorization → getCompletedOrders, getStats, earnings endpoint → acceptOrder transaction and Order update.
2. Frontend: delivery store (earnings + completed) → EarningsPanel and OrdersPanel wiring → order detail page and reject → driver store cleanup and i18n.
3. Backend: CORS, rate limiting, API v1 prefix, remove dead code.
4. Frontend: i18n, error states, SEO and meta.
5. Documentation and cleanup.

This plan feeds into Phase 3 (Backend Structure), Phase 4 (Frontend Structure), and Phase 2 delivery implementation tasks.

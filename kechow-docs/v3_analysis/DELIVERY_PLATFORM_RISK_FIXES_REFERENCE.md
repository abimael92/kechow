# Delivery Platform — Risk Fixes Reference

**Audience:** Senior cross-functional team (Backend, Frontend, DevOps, QA, Security)  
**Status:** Fixes implemented; this document is the single reference for what was done and how to verify it.

All changes preserve existing API responses, frontend UX, and workflows. No breaking changes.

---

## 1. Token in localStorage (XSS risk)

### Risk

If a token is stored in `localStorage`, any XSS can read it and impersonate the user. The backend already uses **session-based auth** (no token in login response). The frontend must not write a token to localStorage from login/register and must rely on the session cookie when the SPA is on a stateful domain.

### Fix recommendation

**Backend**  
No change. Login/register continue to return only `user`; session cookie is set by Laravel when the request is from a stateful domain.

**Frontend**

- Do not set `token` in localStorage from login or register when the API returns only `user`.
- Keep `withCredentials: true` so the session cookie is sent.
- On 401, clear both `user` and `token` from localStorage and redirect to login.
- Comments were added in:
  - `kechow-client/src/app/lib/axios.ts` — request interceptor: session cookie is used when no token; do not store token from login/register when backend returns only user.
  - `kechow-client/src/app/store/auth/auth.store.ts` — login/register must NOT set `token`; logout clears any stale token.

**DevOps/Config**

- Ensure production `.env` sets `SANCTUM_STATEFUL_DOMAINS` to the SPA origin(s) so the session cookie is sent.
- `.env.example` documents `SANCTUM_STATEFUL_DOMAINS` and `CORS_ALLOWED_ORIGINS`.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Log in via UI (normal flow) | No `token` key is written to localStorage. |
| 1.2 | DevTools → Application → Local Storage | Only `user` (and non-secret prefs) after login. |
| 1.3 | Call GET `/api/v1/delivery/availability` while logged in | 200; auth via session cookie. |
| 1.4 | Log out | localStorage cleared of `user` and `token`. |
| 1.5 | After logout, call same endpoint | 401. |

---

## 2. Role on client (guard consistency)

### Risk

Route meta `role: 'delivery'` is enforced only by the frontend guard. If the guard does not run or unauthenticated users are not redirected, they could reach delivery UI (backend would still return 401/403 for API calls).

### Fix recommendation

**Backend**  
No change. All delivery routes remain protected by `auth:sanctum` and `role:delivery` middleware.

**Frontend**

- Auth guard already runs on every navigation via `router.beforeEach(authGuard)`.
- Guard logic: (1) redirect authenticated users away from public pages, (2) require auth for protected routes and redirect to `/login` if not authenticated, (3) require matching role and redirect to role dashboard if wrong role.
- No code change; behavior is correct. Ensure `await auth.initialize()` is always called so `user` is set before checks.

**DevOps/Config**  
None.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Log out, then open `/delivery/dashboard` directly | Redirect to `/login`. |
| 2.2 | Log in as customer, open `/delivery/dashboard` | Redirect to customer home (or role dashboard). |
| 2.3 | Log in as delivery, open `/delivery/dashboard` | Delivery dashboard loads. |
| 2.4 | Log in as delivery, call GET `/api/v1/delivery/availability` | 200. |
| 2.5 | With session expired, open `/delivery/orders` | Redirect to login. |

---

## 3. Mass assignment

### Risk

Using `$request->all()` or unfiltered input on models can allow mass assignment. Delivery flows already use Form Requests and explicit fields; `updateSettings` previously echoed `$request->all()` without persisting.

### Fix recommendation

**Backend**

- No use of `$model->update($request->all())` (or equivalent) for Delivery, Order, or Driver.
- All writable delivery endpoints use Form Requests; only validated or explicit keys are used.
- **Settings:** `UpdateDeliverySettingsRequest` validates only `language` (sometimes, in: es,en). Controller persists only that key and returns the same shape as before.

**Frontend**  
No change.

**DevOps/Config**  
None. In code review, reject any PR that uses `$request->all()` for model update on these models.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | PATCH `/delivery/settings` with `{ "language": "en" }` | 200; only language persisted and returned. |
| 3.2 | PATCH with extra keys (e.g. `driver_id`) | Only `language` persisted; response shape unchanged. |
| 3.3 | PATCH with `{ "language": "invalid" }` | 422 validation error. |

---

## 4. IDOR on orderId (explicit policy on getOrderDetail)

### Risk

`getOrderDetail` and `updateOrderStatus` both scope by current driver. `updateOrderStatus` already called `$this->authorize('update', $delivery)`. For consistency and explicit authorization, `getOrderDetail` should use the same policy.

### Fix recommendation

**Backend**

- In `DeliveryController::getOrderDetail`, after loading the delivery (same query as before), call `$this->authorize('view', $delivery)` before building the response.
- `DeliveryPolicy::view` delegates to `update` (same rules: user is delivery and owns the delivery).
- Response shape and status codes unchanged.

**Code change (implemented):**

```php
// In getOrderDetail, after: if (!$delivery) return $this->error(...);
$this->authorize('view', $delivery);
```

**Frontend**  
No change.

**DevOps/Config**  
None.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | As driver A, accept order 1; GET `/api/v1/delivery/orders/1` | 200; order detail. |
| 4.2 | As driver B, GET `/api/v1/delivery/orders/1` (order assigned to A) | 404 "Order not found or unauthorized". |
| 4.3 | As driver A, PATCH status for order 1 | 200. |
| 4.4 | As driver B, PATCH status for order 1 | 403. |

---

## 5. Reject no-op

### Risk

`POST /delivery/jobs/{orderId}/reject` previously returned success without recording anything. Drivers could believe they rejected a job while it stayed in the available list.

### Fix recommendation

**Backend**

- **Migration:** `2026_03_03_100001_create_delivery_rejections_table.php` — table `delivery_rejections` with `driver_id`, `order_id`, `rejected_at`, optional `reason`; indexes on (driver_id, order_id).
- **Model:** `App\Models\DeliveryRejection` with relations to Driver and Order.
- **Order model:** New relation `deliveryRejections()` for use in queries.
- **Controller:** `rejectOrder(Request $request, $orderId)` — resolve driver; ensure order exists, is pending, and has no delivery; insert or update row in `delivery_rejections` (optional reason from body); log to delivery channel (order_id, driver_id only); return `['ok' => true]` as before.
- **getAvailableJobs:** Exclude orders that this driver has already rejected (using `whereDoesntHave('deliveryRejections', ...)`). Other drivers still see the order until someone accepts it.

**Frontend**  
No change. Reject button and store still call the same endpoint; backend now persists the rejection and optionally removes the job from this driver’s list.

**DevOps/Config**  
Run migrations: `php artisan migrate`.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 5.1 | As driver, GET available jobs; note one order id | Order appears in list. |
| 5.2 | POST `/delivery/jobs/{orderId}/reject` for that order | 200; body includes `ok: true`. |
| 5.3 | Check DB | Row in `delivery_rejections` for that driver and order. |
| 5.4 | GET available jobs again (same driver) | That order no longer in list. |
| 5.5 | As another driver, GET available jobs | Order still in list (if still pending and no delivery). |
| 5.6 | Frontend: click Reject on a job | No error; job disappears from list. |

---

## 6. Settings echo

### Risk

`PATCH /delivery/settings` previously returned `$request->all()` with no validation or persistence. Any key could be echoed; nothing was stored.

### Fix recommendation

**Backend**

- **Migration:** `2026_03_03_100002_add_preferred_language_to_drivers_table.php` — add `preferred_language` (string, default `'es'`) to `drivers`.
- **Form Request:** `UpdateDeliverySettingsRequest` — authorize for role delivery; rules: `language` sometimes, string, in: es,en.
- **Driver model:** Add `preferred_language` to `$fillable`.
- **Controller:**  
  - `getSettings`: return `['language' => $driver->preferred_language ?? 'es']` (same shape as before).  
  - `updateSettings(UpdateDeliverySettingsRequest $request)`: resolve driver; update only `language` from validated input; return `['language' => $driver->preferred_language ?? 'es']`.

**Frontend**  
No change. Same request/response shape.

**DevOps/Config**  
Run migrations: `php artisan migrate`.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 6.1 | GET `/delivery/settings` | 200; e.g. `{ language: 'es' }`. |
| 6.2 | PATCH `/delivery/settings` with `{ language: 'en' }` | 200; `{ language: 'en' }`. |
| 6.3 | GET `/delivery/settings` again | 200; `{ language: 'en' }`. |
| 6.4 | PATCH with `{ language: 'invalid' }` | 422 validation error. |
| 6.5 | PATCH with `{ otherKey: 'x' }` | 200; only language in response; otherKey not stored. |

---

## 7. CORS in production

### Risk

Using `*` for origins in production is insecure when using credentials. The app already uses an env-driven list; production must use explicit origins only.

### Fix recommendation

**Backend**

- `config/cors.php` unchanged in behavior. Comment added: in production set `CORS_ALLOWED_ORIGINS` to exact SPA origin(s); never use `*` with `supports_credentials`.

**Frontend**  
No change.

**DevOps/Config**

- `.env.example` documents `CORS_ALLOWED_ORIGINS` with example values.
- Production `.env` must set `CORS_ALLOWED_ORIGINS` to the real SPA origin(s), no wildcards.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 7.1 | In production env, confirm `CORS_ALLOWED_ORIGINS` is set | No wildcard. |
| 7.2 | From allowed origin, call API with credentials | 200; no CORS error. |
| 7.3 | From disallowed origin, call API | CORS error in browser. |

---

## 8. Sensitive data in logs

### Risk

Delivery log must not contain PII (addresses, names, phone numbers). Existing log lines use only order_id, driver_id, delivery_id, status.

### Fix recommendation

**Backend**

- Comment added at top of `DeliveryController`: "Delivery log: do not log PII (addresses, names, phone numbers). Log only IDs and status."
- Reject action logs only `order_id` and `driver_id`.
- No new log parameters that include user/order/delivery text fields.

**Frontend**  
No change.

**DevOps/Config**  
None. When adding new log lines in this controller, use only IDs and status-like values.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 8.1 | Trigger accept, status update, reject; read `storage/logs/delivery.log` | Only IDs and status; no addresses/names/phones. |
| 8.2 | Code review | No delivery log calls with address, name, or phone. |

---

## Summary of implemented changes

| Risk | Backend | Frontend | Config |
|------|---------|----------|--------|
| 1. Token in localStorage | — | Comments in axios + auth store | .env.example (existing SANCTUM) |
| 2. Role on client | — | No change (guard already correct) | — |
| 3. Mass assignment | Settings use Form Request + persist only language | — | — |
| 4. IDOR getOrderDetail | `authorize('view', $delivery)` in getOrderDetail | — | — |
| 5. Reject no-op | Migration, DeliveryRejection model, rejectOrder logic, getAvailableJobs exclusion | — | Run migrations |
| 6. Settings echo | Migration preferred_language, UpdateDeliverySettingsRequest, getSettings/updateSettings | — | Run migrations |
| 7. CORS | Comment in cors.php | — | .env.example CORS_ALLOWED_ORIGINS |
| 8. Sensitive logs | Comment in DeliveryController; reject logs IDs only | — | — |

---

## Files touched

**Backend (Laravel)**  
- `app/Http/Controllers/Api/Driver/DeliveryController.php` — getOrderDetail policy; getAvailableJobs exclusion; rejectOrder implementation; getSettings/updateSettings with validation and persistence; log comment.  
- `app/Http/Requests/Delivery/UpdateDeliverySettingsRequest.php` — new.  
- `app/Models/DeliveryRejection.php` — new.  
- `app/Models/Driver.php` — `preferred_language` in fillable.  
- `app/Modules/Order/Models/Order.php` — `deliveryRejections()` relation.  
- `database/migrations/2026_03_03_100001_create_delivery_rejections_table.php` — new.  
- `database/migrations/2026_03_03_100002_add_preferred_language_to_drivers_table.php` — new.  
- `config/cors.php` — comment.  
- `.env.example` — CORS_ALLOWED_ORIGINS.

**Frontend (Vue/TS)**  
- `src/app/lib/axios.ts` — comment on token/session.  
- `src/app/store/auth/auth.store.ts` — comment on not storing token.

**Docs**  
- `docs/DELIVERY_PLATFORM_RISK_FIXES_REFERENCE.md` — this document.

---

*Use this document as the single reference for the applied risk fixes and for QA verification. Run `php artisan migrate` after pulling these changes.*

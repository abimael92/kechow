# Delivery App — Security & Robustness Fixes — Implementation Plan

**Audience:** Senior cross-functional team (Backend, Frontend, DevOps, QA, Security)  
**Principle:** All fixes preserve existing endpoints, flows, and frontend behavior. No breaking changes.

---

## Table of Contents

1. [Token in localStorage (XSS risk)](#1-token-in-localstorage-xss-risk)
2. [Role on client (guard consistency)](#2-role-on-client-guard-consistency)
3. [Mass assignment](#3-mass-assignment)
4. [IDOR on orderId (explicit policy for getOrderDetail)](#4-idor-on-orderid-explicit-policy-for-getorderdetail)
5. [Reject no-op](#5-reject-no-op)
6. [Settings echo](#6-settings-echo)
7. [CORS in production](#7-cors-in-production)
8. [Sensitive data in logs](#8-sensitive-data-in-logs)
9. [Implementation order & QA matrix](#9-implementation-order--qa-matrix)

---

## 1. Token in localStorage (XSS risk)

### Risk description

If a token is stored in `localStorage`, any XSS can read it and impersonate the user. The backend already supports **session-based auth** (Auth::login, no token in login response). The frontend axios interceptor still reads `localStorage.getItem('token')` and sends it when present; auth.store does not set token on login, but logout clears it and demo mode may set it.

### Recommended fix

**Backend:** No change. Keep session-based login (current behavior). Ensure Sanctum stateful domains include the SPA origin so session cookie is sent.

**Frontend:**

- Treat session as primary: do not store any token in localStorage after login when the API returns only `user`.
- Keep axios sending credentials (withCredentials: true) so the session cookie is sent.
- Use token only when the backend explicitly returns one (e.g. future mobile API); do not write token to localStorage from login/register responses that don’t include it.
- On 401, clear session state (user) and redirect to login; do not rely solely on presence of token.

**Config / DevOps:**

- Document that production uses session (same-origin or stateful domain + cookie). Ensure `SANCTUM_STATEFUL_DOMAINS` includes production SPA host(s).
- If you later add token-based auth (e.g. mobile), use short-lived tokens and avoid storing long-lived tokens in localStorage.

### Code changes

**1.1 Frontend — Axios: prefer session; use token only when present and returned by API**

File: `kechow-client/src/app/lib/axios.ts`

- Keep sending `Authorization: Bearer ${token}` when a token exists (for backward compatibility and future token-based clients).
- Add a short comment that session cookie is used when no token is present (stateful domain).
- No behavioral change: if no token, cookie is sent automatically with `withCredentials: true`.

```ts
// Interceptor: add Bearer token when present (session cookie is used when no token; stateful domain must be in SANCTUM_STATEFUL_DOMAINS)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
```

**1.2 Frontend — Auth store: never write token to localStorage from login/register**

File: `kechow-client/src/app/store/auth/auth.store.ts`

- Ensure login/register never do `localStorage.setItem('token', ...)`. Current code does not set token; keep it that way.
- In logout, keep `localStorage.removeItem('token')` so any stale token from demo or old builds is cleared.

No code change required if login/register already don’t set token; add a short comment to lock the contract:

```ts
// Login/register: do NOT set 'token' in localStorage; backend uses session (cookie). Token is only for legacy/demo or future token-based clients.
```

**1.3 Auth service — Demo mode**

File: `kechow-client/src/app/store/auth/auth.service.ts` (or where demo login returns token)

- If demo mode returns a fake token, avoid storing it in localStorage. Store only in memory for that tab, or clearly document that demo is dev-only and not for production.

Optional (if demo token is currently stored elsewhere): ensure auth.store never reads that into localStorage. No change if it already doesn’t.

**1.4 Config / DevOps**

- In `.env.example` (backend), document:

```env
# Comma-separated list of SPA origins that receive stateful session cookies (no token in localStorage).
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,127.0.0.1:5173,127.0.0.1:8000,your-app.example.com
```

- In deployment docs: production must set `SANCTUM_STATEFUL_DOMAINS` to the real SPA origin(s). No `*`.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 1.1 | Log in via UI (normal flow) | No `token` key written to localStorage; only `user` (and any non-secret prefs). |
| 1.2 | Open DevTools → Application → Local Storage | No `token` after login (unless you have a separate token-based flow). |
| 1.3 | Call any delivery endpoint (e.g. GET /api/v1/delivery/availability) | 200; auth via session cookie. |
| 1.4 | Log out | localStorage cleared of `user` and `token`. |
| 1.5 | After logout, call same delivery endpoint | 401. |

---

## 2. Role on client (guard consistency)

### Risk description

Route meta `role: 'delivery'` is enforced only by the frontend guard. Backend already enforces `role:delivery` middleware. Risk: guard not running (e.g. race), or unauthenticated user not redirected.

### Recommended fix

**Backend:** No change. Keep `role:delivery` middleware on all delivery routes.

**Frontend:**

- Ensure the auth guard runs on every navigation (it already does via `router.beforeEach(authGuard)`).
- Ensure `initialize()` is awaited so role is known before allowing access.
- For protected routes, if not authenticated → redirect to `/login` before any role check.
- Keep comment that guard is UX only; backend enforces auth and role.

### Code changes

**2.1 Router guard**

File: `kechow-client/src/app/router/guards.ts`

Current logic is correct: (1) redirect authenticated users from public pages, (2) require auth for protected routes and redirect to `/login`, (3) require role and redirect to role dashboard if wrong role. Ensure `await auth.initialize()` is always called so `user` is hydrated (e.g. from `/user` or localStorage) before checks.

Add one defensive check: if route has `requiresAuth` or `role`, and `initialize` has run but `user` is null, redirect to login (already covered by `!isAuthenticated`). Optional: add an explicit early return after initialize when auth is required and no user:

```ts
// After await auth.initialize();
if (requiresAuthentication(routeMeta) && !auth.isAuthenticated) {
  return next('/login');
}
```

Current code already does this with `authRequired && !isAuthenticated`. No change required; only verify order of checks.

**2.2 Ensure guard is registered**

File: `kechow-client/src/app/router/index.ts`

Confirm:

```ts
router.beforeEach(authGuard);
```

No change if already present.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 2.1 | Log out, then open `/delivery/dashboard` directly | Redirect to `/login`. |
| 2.2 | Log in as customer, open `/delivery/dashboard` | Redirect to customer home (or role dashboard). |
| 2.3 | Log in as delivery, open `/delivery/dashboard` | Delivery dashboard loads. |
| 2.4 | Log in as delivery, call GET /api/v1/delivery/availability | 200. |
| 2.5 | With session expired, open `/delivery/orders` | Redirect to login; API would return 401 if called. |

---

## 3. Mass assignment

### Risk description

Using `$request->all()` or unfiltered input on models can allow mass assignment. DeliveryController uses Form Requests and explicit fields; `updateSettings` currently returns `$request->all()` without persisting. Risk is in future code or in settings if we persist without validation.

### Recommended fix

**Backend:**

- Do not add any `$model->update($request->all())` (or similar) for Delivery, Order, Driver.
- Keep and use Form Requests for all writable delivery endpoints; validate and use only `$request->validated()` or explicit keys.
- For settings (see §6), persist only allowed keys via a Form Request.

**Frontend:** No change.

### Code changes

- No change to existing accept/availability/status flows; they already use Form Requests and explicit assignment.
- See §6 for UpdateSettingsRequest and allowed keys.
- In code review: reject any PR that uses `$request->all()` for model update on Delivery, Order, Driver.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 3.1 | Send PATCH with extra fields (e.g. `driver_id`, `order_id`) to availability or status | Only validated fields used; no change in DB for extra fields. |
| 3.2 | After §6, send PATCH /delivery/settings with unknown keys | Only allowed keys (e.g. language) persisted. |

---

## 4. IDOR on orderId (explicit policy for getOrderDetail)

### Risk description

`getOrderDetail` and `updateOrderStatus` are scoped by `driver_id` (current driver). `updateOrderStatus` also calls `$this->authorize('update', $delivery)`. For consistency and clarity, `getOrderDetail` should use the same policy so all order access is explicitly authorized.

### Recommended fix

**Backend:** After loading the delivery (same query as now), call `$this->authorize('view', $delivery)` before returning the order payload. Response shape and status codes unchanged.

**Frontend:** No change.

### Code changes

**4.1 DeliveryController::getOrderDetail**

File: `kechow-server/app/Http/Controllers/Api/Driver/DeliveryController.php`

After finding `$delivery` and the 404 when not found, add policy check:

```php
public function getOrderDetail($orderId)
{
    $driver = $this->getDriver();
    if (!$driver) {
        return $this->error('Driver profile not found.', 404);
    }

    $delivery = Delivery::with('order.restaurant', 'order.items', 'order.user')
        ->where('order_id', $orderId)
        ->where('driver_id', $driver->id)
        ->first();

    if (!$delivery) {
        return $this->error('Order not found or unauthorized.', 404);
    }

    $this->authorize('view', $delivery);  // ADD THIS LINE

    $o = $delivery->order;
    // ... rest unchanged
}
```

DeliveryPolicy already has `view(User, Delivery)` delegating to `update`. No change to policy.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 4.1 | As driver A, accept order 1; GET /api/v1/delivery/orders/1 | 200, order detail. |
| 4.2 | As driver B, GET /api/v1/delivery/orders/1 (same order) | 404 "Order not found or unauthorized". |
| 4.3 | As driver A, PATCH status for order 1 | 200. |
| 4.4 | As driver B, PATCH status for order 1 | 403. |

---

## 5. Reject no-op

### Risk description

`POST /delivery/jobs/{orderId}/reject` returns success but does not record the rejection. Drivers may believe they rejected the job; the order remains in the available list.

### Recommended fix

**Backend:**

- Record a rejection: “driver D rejected order O at time T” so the same order can be excluded from this driver’s available list (optional) and we have an audit trail.
- Do not remove the order from the global pool (other drivers can still accept).
- Keep response shape compatible: e.g. `{ ok: true }` or current success envelope.

**Frontend:** No change to the reject button or store; backend will return success after persisting.

### Code changes

**5.1 Migration: delivery_rejections table**

New file: `kechow-server/database/migrations/YYYY_MM_DD_HHMMSS_create_delivery_rejections_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_rejections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('drivers')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->timestamp('rejected_at')->useCurrent();
            $table->text('reason')->nullable();

            $table->index(['driver_id', 'order_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_rejections');
    }
};
```

**5.2 Model (optional but recommended)**

New file: `kechow-server/app/Models/DeliveryRejection.php`

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryRejection extends Model
{
    protected $table = 'delivery_rejections';

    public $timestamps = false;

    protected $fillable = ['driver_id', 'order_id', 'reason'];

    protected $casts = [
        'rejected_at' => 'datetime',
    ];

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(\App\Modules\Order\Models\Order::class);
    }
}
```

**5.3 DeliveryController::rejectOrder**

- Resolve driver (same as other actions).
- Validate order exists and is still available (pending, no delivery).
- Insert a row in `delivery_rejections` (driver_id, order_id, optional reason from body).
- Return same success response as today.
- Optionally: in `getAvailableJobs`, exclude orders that this driver has already rejected (e.g. `whereDoesntHave('rejections', fn ($q) => $q->where('driver_id', $driver->id))` on Order or via a subquery). That keeps “available” list clean for the driver.

**5.4 Reject request body (optional)**

If you want a reason: add a Form Request with optional `reason` string, max length. Otherwise reject with no body.

Example controller implementation:

```php
public function rejectOrder(Request $request, $orderId)
{
    $driver = $this->getDriver();
    if (!$driver) {
        return $this->error('Driver profile not found.', 404);
    }

    $order = Order::where('id', $orderId)->where('status', 'pending')->whereDoesntHave('delivery')->first();
    if (!$order) {
        return $this->error('Order not available for rejection.', 422);
    }

    DeliveryRejection::firstOrCreate(
        [
            'driver_id' => $driver->id,
            'order_id' => $orderId,
        ],
        [
            'reason' => $request->input('reason'),
        ]
    );

    Log::channel('delivery')->info('Order rejected by driver', [
        'order_id' => (int) $orderId,
        'driver_id' => $driver->id,
    ]);

    return $this->success(['ok' => true]);
}
```

**5.5 Exclude rejected orders from getAvailableJobs (optional)**

In `getAvailableJobs`, resolve the driver first, then exclude orders this driver has already rejected:

```php
public function getAvailableJobs()
{
    $driver = $this->getDriver();
    $driverId = $driver ? $driver->id : null;

    $orders = Order::where('status', 'pending')
        ->whereDoesntHave('delivery')
        ->when($driverId, function ($q) use ($driverId) {
            $q->whereDoesntHave('deliveryRejections', fn ($q2) => $q2->where('driver_id', $driverId));
        })
        ->with('restaurant', 'items')
        ->get();
    // ... rest of method unchanged (map to jobs, return success)
}
```

Add to **Order** model (`App\Modules\Order\Models\Order`) a relation so the query can use `whereDoesntHave('rejections', ...)`:

```php
public function deliveryRejections(): \Illuminate\Database\Eloquent\Relations\HasMany
{
    return $this->hasMany(\App\Models\DeliveryRejection::class, 'order_id');
}
```

Then in `getAvailableJobs`, use `whereDoesntHave('deliveryRejections', fn ($q) => $q->where('driver_id', $driver->id))` (relation name `deliveryRejections` to avoid clash with existing `delivery()`). Alternatively use a subquery on `delivery_rejections` without adding a relation.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 5.1 | As driver, get available jobs; note one order id | List includes the order. |
| 5.2 | POST /delivery/jobs/{orderId}/reject for that order | 200, body has ok: true (or current success shape). |
| 5.3 | Check DB | Row in delivery_rejections for that driver and order. |
| 5.4 | Get available jobs again (if you implemented exclusion) | That order no longer in list for this driver. |
| 5.5 | As another driver, get available jobs | Order still available (if still pending and no delivery). |
| 5.6 | Frontend: click Reject on a job | No error; job disappears from list (if exclusion implemented). |

---

## 6. Settings echo

### Risk description

`PATCH /delivery/settings` returns `$request->all()` without validation or persistence. Any key can be sent and echoed back; nothing is stored.

### Recommended fix

**Backend:**

- Define allowed settings (e.g. `language`).
- Use a Form Request to validate only those keys.
- Persist in DB (e.g. driver-level settings). Drivers table can get a JSON column `settings` or a separate `driver_settings` table; minimal approach: add `preferred_language` to `drivers` if only language is needed.
- Return the persisted settings in the same shape as GET (e.g. `{ language: 'es' }`).

**Frontend:** Keep calling PATCH with the same payload shape; backend will return the same shape but persisted. No breaking change.

### Code changes

**6.1 Migration: add settings to drivers**

Option A — single column (simplest if only a few keys):

New file: `kechow-server/database/migrations/YYYY_MM_DD_HHMMSS_add_settings_to_drivers_table.php`

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->string('preferred_language', 10)->default('es')->after('total_deliveries');
        });
    }

    public function down(): void
    {
        Schema::table('drivers', function (Blueprint $table) {
            $table->dropColumn('preferred_language');
        });
    }
};
```

Option B — JSON for multiple keys later:

```php
$table->json('settings')->nullable()->after('total_deliveries');
```

Use Option A below for a single `language` key.

**6.2 Form Request**

New file: `kechow-server/app/Http/Requests/Delivery/UpdateDeliverySettingsRequest.php`

```php
<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeliverySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'delivery';
    }

    public function rules(): array
    {
        return [
            'language' => ['sometimes', 'string', 'in:es,en'],
        ];
    }
}
```

**6.3 Driver model**

Add to `$fillable`: `'preferred_language'`. If you used JSON: add `'settings'` and cast to array.

**6.4 DeliveryController**

- `getSettings`: return language from driver (e.g. `$driver->preferred_language ?? 'es'`), same shape as now.
- `updateSettings`: inject `UpdateDeliverySettingsRequest`, validate, update driver, return only allowed keys.

Example:

```php
public function getSettings()
{
    $driver = $this->getDriver();
    $language = $driver ? ($driver->preferred_language ?? 'es') : 'es';
    return $this->success(['language' => $language]);
}

public function updateSettings(UpdateDeliverySettingsRequest $request)
{
    $driver = $this->getDriver();
    if (!$driver) {
        return $this->error('Driver profile not found.', 404);
    }

    $validated = $request->validated();
    if (array_key_exists('language', $validated)) {
        $driver->preferred_language = $validated['language'];
        $driver->save();
    }

    return $this->success(['language' => $driver->preferred_language ?? 'es']);
}
```

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 6.1 | GET /delivery/settings | 200, e.g. { language: 'es' }. |
| 6.2 | PATCH /delivery/settings with body { language: 'en' } | 200, { language: 'en' }. |
| 6.3 | GET /delivery/settings again | 200, { language: 'en' }. |
| 6.4 | PATCH with { language: 'invalid' } | 422 validation error. |
| 6.5 | PATCH with { otherKey: 'x' } | 200; otherKey not stored; response only language. |

---

## 7. CORS in production

### Risk description

Using `*` for origins in production is insecure. The app already uses an env-driven list; ensure production never falls back to `*` and that credentials are only sent to intended origins.

### Recommended fix

**Backend / Config:**

- Keep `config/cors.php` as-is: `allowed_origins` from `CORS_ALLOWED_ORIGINS` env, no `*`.
- In production `.env`, set `CORS_ALLOWED_ORIGINS` to the exact SPA origin(s), comma-separated (e.g. `https://app.kechow.com`). Do not use `*`.
- Keep `supports_credentials` true for cookie-based auth.

**DevOps:**

- Document required env vars: `CORS_ALLOWED_ORIGINS`, `SANCTUM_STATEFUL_DOMAINS`.
- In deployment checklist, verify these are set and do not contain `*` in production.

### Code changes

Optional hardening in `config/cors.php` to fail fast in production if origins are missing:

```php
'allowed_origins' => array_filter(explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173,https://kechow-frontend.onrender.com'))),
```

Add a comment:

```php
// In production, set CORS_ALLOWED_ORIGINS to exact SPA origin(s). Never use * with supports_credentials.
```

No functional change.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 7.1 | In production env, ensure CORS_ALLOWED_ORIGINS is set | No wildcard. |
| 7.2 | From allowed origin, call API with credentials | 200, no CORS error. |
| 7.3 | From disallowed origin, call API | CORS error (browser blocks). |

---

## 8. Sensitive data in logs

### Risk description

Delivery log should not contain PII (addresses, names, phone numbers). Current log lines use `order_id`, `driver_id`, `status`, `delivery_id` — acceptable. Ensure no future log calls add PII and that all delivery actions use the same channel and pattern.

### Recommended fix

**Backend:**

- Audit all `Log::channel('delivery')` calls: only IDs, status, and non-PII metadata.
- Do not log request body (may contain PII), full order/delivery payloads, or user/driver names in plain form. Log only numeric/slug identifiers and status.
- Add a one-line comment in DeliveryController or in a logging helper: “Do not log PII (addresses, names, phones) to delivery channel.”

**Code changes**

Current calls:

- `Delivery accepted` → `['order_id' => $orderId, 'driver_id' => $driver->id]` — OK.
- `Delivery status updated` → `['delivery_id' => $delivery->id, 'status' => $status]` — OK.
- After implementing reject: `Order rejected by driver` → `['order_id' => ..., 'driver_id' => ...]` — OK.

Add at top of DeliveryController or in a shared doc:

```php
// Delivery log: do not log PII (addresses, names, phone numbers). Log only IDs and status.
```

No new log parameters that include user/order/delivery text fields.

### Verification / QA

| Step | Action | Expected |
|------|--------|----------|
| 8.1 | Trigger accept, status update, reject; read delivery.log | Only IDs and status-like values; no addresses/names/phones. |
| 8.2 | Code review | No Log::channel('delivery')->...(..., [ 'address' => ..., 'name' => ... ]). |

---

## 9. Implementation order & QA matrix

### Suggested order

1. **Low risk, no new endpoints:** §4 (policy on getOrderDetail), §3 (review only), §7 (config/docs), §8 (comment + audit).
2. **Backend-only, new migration:** §6 (settings persist), then §5 (reject table + logic).
3. **Frontend comments / small tweaks:** §1 (comments, no token write), §2 (verify guard).

### QA matrix (no regressions)

| Area | After changes |
|------|----------------|
| Login / logout | Still works; no token in localStorage from login; cookie used when stateful. |
| Delivery dashboard | Loads for delivery role; redirects for others. |
| Available jobs | Same list (or with rejected excluded if §5.5 implemented). |
| Accept order | Unchanged; still creates delivery and updates order. |
| Reject order | Still 200; now persisted; optional exclusion in list. |
| Order detail | Same response; now explicitly authorized via policy. |
| Update status | Unchanged. |
| GET/PATCH settings | Same response shape; PATCH now persists language. |
| CORS | Same behavior; production uses explicit origins. |
| Logs | No PII; only IDs and status. |

### Rollback

- §4: remove one line (`authorize`).
- §5: migration rollback; revert controller and optional Order relation.
- §6: migration rollback; revert controller to echo `$request->all()` and GET to fixed `'es'`.
- §1/§2/§7/§8: comment/config only; revert comments/env if needed.

---

**End of implementation plan.** Use this document as the single reference for implementing the security and robustness fixes without breaking existing functionality.

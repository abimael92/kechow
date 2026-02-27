# Auth Security Proposal & Implementation Summary

**Phase 1 — Token storage and sensitive logging (Issues #1 & #2)**

---

## 1. Analysis: Auth Store and Axios

### 1.1 Current state (before changes)

- **auth.store.ts:** Persisted `user` and `token` in `localStorage`. `isAuthenticated` was derived from `!!token`. Login/register wrote both to localStorage. Logout cleared token and user (and other keys).
- **axios.ts:** Request interceptor read `localStorage.getItem('token')` and set `Authorization: Bearer <token>`. **Console.log** reported token presence; **console.warn** when missing. Response interceptor on 401 cleared token and user and redirected to login.
- **Risks:** (1) Token in localStorage is readable by any script on the same origin (XSS). (2) Logging token presence or auth state in views (EarningsView, OwnerDashboard, etc.) can leak into console/builds.

### 1.2 Backend capability

- **Laravel Sanctum** is configured with `EnsureFrontendRequestsAreStateful` on the API stack and `guard => ['web']`. For requests from **stateful domains** (see `config/sanctum.php`), Sanctum uses the **session** (HttpOnly cookie) first, then Bearer token. So the backend can authenticate the SPA via session without returning a token.
- **Session:** Laravel session is HttpOnly by default (`config/session.php`). CORS has `supports_credentials => true`. So the chosen approach was **session-based SPA auth**: login/register set the session (no token in response); frontend does not store a token.

---

## 2. Options Considered

| Option | Description | Chosen |
|--------|-------------|--------|
| **A. HttpOnly session cookie** | Backend uses `Auth::login($user)` on login/register; returns only `user` in JSON. Browser receives session cookie (HttpOnly). Frontend never sees or stores a token. Axios sends cookie via `withCredentials: true`. | **Yes** |
| **B. Token in HttpOnly cookie** | Backend sets token in a custom HttpOnly cookie; middleware injects it into `Authorization` for Sanctum. Frontend never reads token. | No (more custom code; session is built-in). |
| **C. Encrypt token in localStorage** | Keep token in localStorage but encrypt with a key (e.g. in memory/sessionStorage). Reduces casual inspection but does not mitigate XSS. | No (session removes token from JS entirely). |

---

## 3. Implementation Summary

### 3.1 Backend (Laravel)

- **AuthController::login:** Validate credentials, then `Auth::login($user, $request->boolean('remember', true))`. Return JSON `{ user: { id, name, email, role } }` only (no token). Removed `Log::info('Login attempt', $request->all())` to avoid logging credentials.
- **AuthController::register:** Create user (and restaurant when role is owner), then `Auth::login($user, false)`. Return `{ user }` only (no token).
- **AuthController::user:** New method. Return `{ user: { id, name, email, role } }` for `$request->user()`; 401 if unauthenticated.
- **AuthController::logout:** New method. Revoke current API token if present (try/catch for session-only auth), then `Auth::guard('web')->logout()`, `$request->session()->invalidate()`, `$request->session()->regenerateToken()`. Return 204.
- **.env.example:** Added `SANCTUM_STATEFUL_DOMAINS` so the frontend origin (e.g. `localhost:5173`, `127.0.0.1:5173`) is stateful and receives session cookies.

### 3.2 Frontend (Vue / Pinia)

- **auth.store.ts:** No longer stores or reads `token`. Only `user` is persisted in localStorage under a single key. `isAuthenticated = computed(() => !!user.value)`. Login/register save only `response.user`. Removed `token` from store state and return object. `initialize()` still verifies session via GET /user when a stored user exists; on 401 it clears user and calls logout.
- **axios.ts:** Request interceptor still adds `Authorization: Bearer <token>` **only when** `localStorage.getItem('token')` is present (backward compatibility for existing clients that might have an old token). No console.log or console.warn. Response 401: clear `user` and `token` from localStorage and redirect to login.
- **auth.service.ts:** `getUser()` no longer accepts a token argument; relies on cookie or interceptor-added Bearer. `isAuthenticated()` now checks only `localStorage.getItem('user')`.

### 3.3 Sensitive logging removed (Issue #2)

- **axios.ts:** Removed `console.log('Token desde localStorage:', ...)` and `console.warn('⚠️ No hay token ...')`.
- **EarningsView.vue, OwnerDashboard.vue:** Removed `onMounted` blocks that logged auth state (including `user`, `token`). Left only the panel/dashboard component import.
- **CartView.vue, OrderView.vue (customer), OrdersView.vue (delivery):** Same removal of auth-state console.log for consistency.

---

## 4. Constraints Respected

- **No Spanish UI changes:** All user-facing strings and components remain in Spanish; only code comments and this doc are in English where appropriate.
- **No refactor beyond the audit:** Only auth storage, auth controller, and removal of sensitive logs were changed; no unrelated logic refactor.
- **Features preserved:** Login, register, logout, GET /user, and role-based redirects behave as before; only the mechanism (session cookie vs token in localStorage) changed.

---

## 5. Deployment Notes

- Ensure **SANCTUM_STATEFUL_DOMAINS** in production includes the frontend origin (e.g. `https://your-app.example.com`).
- Ensure **CORS_ALLOWED_ORIGINS** includes that origin so credentials are accepted.
- Session cookie is HttpOnly and (in production) should use **Secure** and **SameSite=lax** (or **none** only if required for cross-site, with Secure).

---

## 6. References

- Laravel Sanctum: [SPA Authentication](https://laravel.com/docs/sanctum#spa-authentication)
- `docs/v2_analysis/SYSTEM_HEALTH_REPORT.md` — Issues #1 (token storage), #2 (console.log)

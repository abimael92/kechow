# Kechow — Roadmap 2026 (Good-to-Have & Security)

**Version:** v2 Analysis  
**Date:** February 2026  
**Scope:** Security, architecture, add-ons. Spanish UI unchanged; no removal of existing logic unless replaced by the items below.

---

## 1. Security

### 1.1 Rate limiting per API route

**Current:** Global throttle `60,1` (60 requests/minute) on the whole v1 group.

**Proposal:**

- Define route-specific limits in Laravel (e.g. `throttle:login,5,1` for login, `throttle:api,100,1` for general API).
- Apply stricter limits to auth and sensitive endpoints (e.g. login 5/min, password reset 3/min); higher limits for read-only or high-frequency endpoints (e.g. driver location ping).
- Document limits in API docs (e.g. Swagger) and return `Retry-After` and `X-RateLimit-*` headers where useful.

**Implementation:** Use named rate limiters in `RouteServiceProvider` or `bootstrap/app.php` and apply to route groups; keep existing 60/min as default for unnamed routes.

---

### 1.2 Two-factor authentication (2FA) for Admins

**Current:** Single-factor (email + password); session or token.

**Proposal:**

- Add 2FA for users with role `admin` (or optionally for `owner`): TOTP (e.g. Google Authenticator) or SMS backup.
- Backend: Store 2FA secret per user; endpoint to enable/verify 2FA; middleware that requires 2FA for admin routes when enabled.
- Frontend: Admin settings page to enable 2FA (QR + code), and a step after login to enter the code when 2FA is on.
- Spanish UI for all prompts and errors.

**Implementation:** Use a package (e.g. `pragmarx/google2fa-laravel` or Laravel Fortify 2FA) and custom middleware that checks a “2FA verified” session flag after login.

---

### 1.3 SQL injection audit

**Current:** Eloquent and Query Builder are used; raw queries are minimal (e.g. distance in `scopeNearby`).

**Proposal:**

- Audit all `DB::raw()`, `whereRaw()`, `selectRaw()`, and any user-controlled input in queries.
- Ensure all bindings use parameterized queries (e.g. `whereRaw("...", [$param])`).
- Run static analysis or a security scanner (e.g. `phpstan` with security rules, or manual review) and document findings.
- Fix any finding where user input reaches raw SQL.

---

## 2. Architecture

### 2.1 Restructuring Order vs Delivery into a unified state machine

**Current:** Two overlapping flows: (1) DeliveryController + `deliveries` table (driver accepts pending order; delivery status: assigned → picked_up → in_transit → delivered). (2) Order module driver routes + `orders.driver_id` and Order statuses (e.g. ready → out_for_delivery → delivered). OrderStateMachine defines order transitions; delivery state lives in `deliveries` and is partially mirrored in order status.

**Proposal:**

- **Single source of truth:** Treat `deliveries` as the driver lifecycle record; order status is derived or updated in sync (e.g. “accepted” when delivery is created, “delivered” when delivery status is delivered).
- **Unified state machine:** One model (e.g. a single state machine or a small service) that:
  - Defines valid order and delivery states and transitions.
  - Ensures order status and delivery status stay in sync (e.g. no “delivered” delivery with order still “out_for_delivery”).
- **Deprecate duplicate driver API:** Remove or clearly deprecate Order module driver routes (`/driver/orders/available`, etc.); use only `/delivery/*` and DeliveryController. Document the single flow in CORE_MAP and TECHNICAL_AUDIT.
- **Schema:** Keep `orders` and `deliveries` tables; optionally add a single “delivery_phase” or rely on `deliveries.status` and derive order display state from it.

**Implementation:** Refactor DeliveryController and OrderService so that driver actions only go through DeliveryController; OrderService (or a new DeliveryOrderSync service) updates order status when delivery status changes. Add tests for all transitions.

---

## 3. Add-ons

### 3.1 Google Maps API for optimized routing

**Current:** No map or routing in the app; driver/customer addresses are stored; no route optimization.

**Proposal:**

- **Use cases:** (1) Customer: show delivery ETA and optional “driver on map” (tracking). (2) Owner/Admin: “Active Job Map” with driver position. (3) Driver: optional “Navigate” with optimized route (e.g. Directions API).
- **Implementation:** Backend: store API key in env; optional proxy endpoint for Directions/Geocoding to avoid exposing key (or use key restrictions). Frontend: Google Maps JS SDK or Vue wrapper; use for map, markers, and optional polyline. Optional: compute route on backend when order is “out_for_delivery” and cache for display.
- **Cost:** Google Maps APIs are billable; set quotas and key restrictions; consider caching and throttling.

---

### 3.2 Twilio for SMS notifications

**Current:** No SMS; mail and in-app only (if any).

**Proposal:**

- **Use cases:** Order confirmed, “driver is on the way,” “order delivered”; optional 2FA fallback; password reset link.
- **Implementation:** Backend: Twilio SDK; queue jobs to send SMS; store phone on user/address. Frontend: no change unless adding “Notify me by SMS” preference (Spanish labels). Optional: admin notification for critical errors.
- **Cost and compliance:** Twilio pricing; comply with local SMS/consent rules (e.g. Mexico).

---

## 4. Priority and Phasing

| Phase | Focus | Items |
|-------|--------|--------|
| **Q1 2026** | Security & consistency | Rate limiting per route; SQL injection audit; unify Order/Delivery flow and deprecate duplicate driver API. |
| **Q2 2026** | Observability & admin | Sentry + Spatie Activity Log; Admin Command Center (Connectivity, Revenue, Error Logger, Active Job Map); 2FA for admins. |
| **Q3 2026** | Real-time & UX | Full Echo wiring (owner, driver, customer tracking); Vue Query migration; Zod + form validation. |
| **Q4 2026** | Add-ons | Google Maps (tracking + map); Twilio SMS (notifications and optional 2FA). |

---

## 5. References

- **DEPENDENCIES.md** — Validation (Zod/Vuelidate), Echo, Sentry, Vue Query.
- **ADMIN_COMMAND_CENTER.md** — Connectivity, Revenue, Error Logger, Active Job Map.
- **FEATURE_MATRIX.md** — Role-based features and real-time gaps.
- **SYSTEM_HEALTH_REPORT.md** — CRITICAL/CRUCIAL items (delivery flow, auth, CORS, pagination).

# Phase 7 — Mobile App Readiness (API-First)

**Objective:** Backend and API design ready for future React Native or Flutter apps (customer, delivery, owner). No web-specific coupling; stateless, token-based, versioned API.

---

## 1. Principles

- **Stateless API:** No session or cookie dependency; every request carries auth (Bearer token).
- **Token-based auth:** Laravel Sanctum (API tokens) or JWT; same tokens usable from web and mobile.
- **API versioning:** `/api/v1/...` so mobile can lock to v1 while web evolves.
- **Clean JSON:** Consistent envelope (data, message, errors); no HTML or web-only fields.
- **No web coupling:** No CSRF for API; CORS only for web; mobile uses same endpoints without CORS concerns.
- **Image upload:** Multipart or base64 strategy documented; same endpoints as web.
- **Push notifications:** Backend readiness (FCM/APNs tokens storage, send via job or service); no implementation required for “readiness” beyond schema and one endpoint to register device token.

---

## 2. Authentication

- **Current:** Sanctum; login returns token; client stores and sends `Authorization: Bearer <token>`.
- **Mobile:** Same. On login/register, return token + user (id, name, email, role). Mobile stores token securely (secure storage); sends header on every request.
- **Refresh:** If using short-lived tokens, provide refresh endpoint and document flow. Sanctum long-lived tokens may not need refresh; document token TTL and logout (revoke).
- **Multi-device:** Sanctum allows multiple tokens per user; mobile can have one token per device. Logout revokes current token only.

---

## 3. API Versioning and Base URL

- **Base URL:** `https://api.kechow.com/api/v1` (or same domain path).
- **Version in path:** All routes under `v1`; future v2 under `v2` without breaking mobile on v1.
- **Headers:** `Accept: application/json`; `Content-Type: application/json` for JSON bodies. Optional `X-App-Version` / `X-Platform` for support and feature flags.

---

## 4. Response Format (Recommended)

- **Success:** `{ "data": { ... }, "message": "optional" }`.
- **Error:** `{ "message": "Human message", "errors": { "field": ["validation message"] } }` with HTTP 4xx/5xx.
- **Validation:** 422 with `errors` object. Consistent structure so mobile can parse once.

---

## 5. CORS and Mobile

- **Web:** CORS configured in backend for allowed origins (production frontend URL). Mobile apps do not send Origin in same way; CORS does not block them.
- **Config:** Do not restrict API to “web only”; allow requests without Origin or with mobile app User-Agent. No CORS override that blocks non-browser clients.

---

## 6. Image Upload Strategy

- **Endpoints:** Same as web: e.g. `POST /api/v1/restaurants/{id}/logo`, `POST /api/v1/restaurants/{id}/menu-items` with multipart for image.
- **Format:** `multipart/form-data`; field name `image` or `logo`. Document max size (e.g. 2MB) and allowed MIMEs (image/jpeg, image/png).
- **Alternative:** Base64 in JSON if mobile prefers (less efficient); document one canonical method (multipart preferred).
- **Response:** Return URL or path to stored file so mobile can display.

---

## 7. Push Notification Readiness

- **Schema:** Table `device_tokens` or `push_tokens`: `user_id`, `token` (FCM/APNs), `platform` (android/ios), `created_at`, `updated_at`. Unique per (user_id, token) or per device.
- **Endpoint:** `POST /api/v1/device-token` (auth required) with body `{ "token": "...", "platform": "android" }`. Store or update.
- **Sending:** Not required for “readiness”; when implemented, use Laravel job + FCM/APNs SDK; trigger on order status change, new order for driver, etc.
- **Mobile:** Register token after login; send to backend; unsubscribe on logout.

---

## 8. Endpoints Checklist (Mobile-Relevant)

| Area | Endpoint | Notes |
|------|----------|--------|
| Auth | POST /login, /register, GET /user, POST /logout | Same as web |
| Restaurants | GET /restaurants, GET /restaurants/:id, GET /restaurants/:id/menu | Public or auth |
| Cart | GET/POST/PUT/DELETE carts | auth:sanctum |
| Orders | POST customer/orders, GET customer/orders, GET orders/:id | auth:sanctum, role |
| Delivery | GET/POST availability, GET jobs/available, POST accept/reject, GET orders/active, GET orders/completed, PATCH order status, GET stats, GET earnings | auth:sanctum, role:delivery |
| Owner | GET/POST/PUT owner/restaurants, orders, menu-items, etc. | auth:sanctum, role:owner |
| Profile | GET/PATCH profile, addresses | auth:sanctum |

All under `/api/v1`. No HTML responses; no redirects to web login (return 401 + JSON).

---

## 9. Mobile Integration Strategy (React Native / Flutter)

- **Same API:** One backend serves web and mobile. No separate “mobile API” unless required later.
- **Feature parity:** Document which endpoints each app uses (customer app: auth, restaurants, cart, orders; delivery app: delivery/*; owner app: owner/*). Implement once in backend.
- **Deep links:** Document URL scheme for mobile (e.g. kechow://order/123) if you add deep links later; backend can return deep link in push payload.
- **Offline:** API is stateless; offline handling (queue orders, sync later) is a mobile-side concern. Backend can support idempotency keys for critical writes if needed.
- **Testing:** Use same Postman/Insomnia collection or OpenAPI spec for web and mobile; add headers for token and platform.

---

## 10. Documentation for Mobile Team

- **API doc:** OpenAPI (Swagger) or static markdown with base URL, auth, and each endpoint (request/response samples). Include error responses.
- **Auth flow:** Step-by-step: login → store token → send header → logout (revoke).
- **Environment:** Staging base URL for mobile builds; production URL for release.
- **Versioning:** Mobile app locks to v1; backend maintains backward compatibility for v1 when adding v2.

This plan keeps the backend API-first, stateless, and ready for React Native or Flutter without re-architecting later.

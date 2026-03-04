# Security Checklist (Production Readiness)

This document summarizes security measures implemented in the Kechow client and server, and lists recommendations for further hardening.

---

## 1. Remove Client Trust Assumptions

| Item | Status | Location / Notes |
|------|--------|------------------|
| Route guards are UX-only | Done | `kechow-client/src/app/router/guards.ts` — comment states backend must enforce auth/role on every request |
| Auth store does not imply authorization | Done | `kechow-client/src/app/store/auth/auth.store.ts` — comment: do not trust client-held user/role for authorization |
| Backend enforces auth/role | Verify | Ensure all API endpoints validate token and role server-side (Laravel Sanctum + middleware) |

**Principle:** Never rely on the client for authorization. Route guards and client role checks improve UX only; the backend must reject unauthorized requests.

---

## 2. Harden Auth Flows

| Item | Status | Location / Notes |
|------|--------|------------------|
| No logging of tokens or user data | Done | `auth.service.ts` — no `console.log` of response/token; errors logged only in DEV |
| CSRF cookie requested before login/register | Done | `auth.service.ts` — `get('/sanctum/csrf-cookie')` before POST |
| 401 response → clear auth and redirect | Done | `kechow-client/src/app/lib/axios.ts` — response interceptor clears `token`/`user` from localStorage and redirects to `/login` |
| Request interceptor does not log URL/body in production | Done | `axios.ts` — request interceptor only attaches token |
| Single API entry point | Recommended | Prefer using `@app/lib/axios` for all API calls so 401 handling and headers are consistent |

---

## 3. Prevent Sensitive Data Exposure

| Item | Status | Location / Notes |
|------|--------|------------------|
| No `console.log` of credentials, tokens, or API response data | Done | `auth.service.ts`, `axios.ts` |
| Error messages to user are generic | Done | Login/register errors show generic messages; internal details not exposed in production logs |
| API error logging limited in production | Done | `axios.ts` — in DEV only: `console.error('API error', status ?? err.message)` |

---

## 4. Secure Local Storage Usage

| Item | Status | Location / Notes |
|------|--------|------------------|
| Logout clears all auth and app-related keys | Done | `auth.store.ts` — `logout()` removes: `user`, `token`, `theme`, `preferredLanguage`, `darkMode`, `deliverySettings`, `delivery_availability`, `delivery_active_order`, `delivery_settings`, `delivery_completed_orders`, `delivery_location_updates` |
| 401 interceptor clears token/user | Done | `axios.ts` — removes `token` and `user` from localStorage on 401 |
| Tokens in localStorage | Accepted risk | Prefer moving to httpOnly cookies for tokens (see Recommendations) |

---

## 5. Sanitize User Input

| Item | Status | Location / Notes |
|------|--------|------------------|
| XSS-safe HTML escaping utility | Done | `kechow-client/src/shared/utils/sanitize.ts` — `escapeHtml()`, `sanitizeForDisplay()` |
| Use when rendering raw HTML | Required | Use `escapeHtml()` (or `sanitizeForDisplay()`) whenever content is inserted via `v-html` or built HTML strings; Vue’s `{{ }}` escapes by default |
| Backend validation | Verify | Server must validate and sanitize all inputs (e.g. Laravel validation, prepared statements) |

---

## Recommendations

1. **httpOnly cookies for tokens**  
   Store access (and optionally refresh) tokens in httpOnly, secure, SameSite cookies so JavaScript cannot read them, reducing XSS impact. Requires backend to set cookies and client to use `withCredentials: true` (already set).

2. **CSP (Content-Security-Policy)**  
   Add a strict CSP header (e.g. in Laravel or reverse proxy) to limit script sources and reduce XSS impact.

3. **HTTPS only**  
   Enforce HTTPS in production; set `secure` on cookies and redirect HTTP → HTTPS.

4. **Rate limiting**  
   Ensure login/register and sensitive API endpoints are rate-limited on the server.

5. **Audit v-html usage**  
   Avoid `v-html` for user/API content; if required, always pass the string through `escapeHtml()` or a trusted sanitizer (e.g. DOMPurify with a strict config).

6. **Dependency scanning**  
   Run `npm audit` / `composer audit` and address critical/high issues before release.

---

## Summary

- **Client:** Route guards and auth store are UX-only; no sensitive logging; 401 clears auth and redirects; logout clears all relevant localStorage; sanitize utility available for safe HTML output.
- **Server:** Confirm all protected routes enforce authentication and role checks; validate and sanitize inputs; consider httpOnly cookies, CSP, HTTPS, and rate limiting for production.

Security checklist completed for production readiness.

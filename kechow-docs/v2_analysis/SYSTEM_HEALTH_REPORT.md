# Kechow — System Health Report (Single-File Audit)

**Version:** v2 Analysis  
**Date:** February 2026  
**Classification:** CRITICAL | CRUCIAL | IMPORTANT | WARNING | TRIVIAL

---

## CRITICAL

| # | Area | Issue | Location / Notes |
|---|------|--------|-------------------|
| 1 | **Security** | Auth token and user stored in **localStorage**; vulnerable to XSS. If script runs in same origin, token can be stolen. | `kechow-client/src/app/store/auth/auth.store.ts`; axios reads token from localStorage. |
| 2 | **Security** | **Console.log** of token and auth state in production code (e.g. “Token desde localStorage”, “Dashboard mounted - auth state”). | `kechow-client/src/app/lib/axios.ts`; `EarningsView.vue`, `OwnerDashboard.vue`, delivery service. |
| 3 | **Data consistency** | **Two delivery flows:** (1) DeliveryController: drivers accept **pending** orders, create `deliveries` row, order → accepted. (2) Order module driver routes: `Order::STATUS_READY` + `driver_id`. Order model has `driver_id` and `driver()` relation; Delivery model also links order–driver. Risk of conflicting behavior and bugs. | `api.php` (delivery/* vs Order routes); `OrderController` driver methods; `DeliveryController`; `OrderService::getAvailableDriverOrders` vs `DeliveryController::getAvailableJobs`. |

---

## CRUCIAL

| # | Area | Issue | Location / Notes |
|---|------|--------|-------------------|
| 4 | **Security** | **Role enforcement** on backend: Owner and customer routes rely on auth + ownership checks; delivery has `role:delivery`. Admin owner CRUD has `role:admin`. Ensure **all** sensitive routes use correct middleware and policies. | `routes/api.php`; Modules (Owner, Order, Restaurant); CheckRole middleware. |
| 5 | **Security** | **CORS** is config-driven; ensure production env has correct `CORS_ALLOWED_ORIGINS` and no overly permissive fallback. | `config/cors.php`; `.env` |
| 6 | **Scalability** | **No pagination** on some list endpoints (e.g. customer orders, restaurant orders). Large result sets can hurt performance and memory. | OrderController index; DeliveryController getCompletedOrders has pagination; verify all list APIs. |
| 7 | **Refactoring** | **Duplicate/overlap** between Order module driver routes (`/driver/orders/available`, accept, start-delivery, complete-delivery) and DeliveryController (`/delivery/jobs/available`, accept, status). Frontend uses `/delivery/*` only; backend has both. Remove or clearly deprecate one path. | `api.php`; Order module; DeliveryController. |
| 8 | **Dependencies** | **PHP/JS dependencies** not audited in this run. Outdated or vulnerable packages are a security and stability risk. | Run `composer audit`, `npm audit`; schedule regular updates. |

---

## IMPORTANT

| # | Area | Issue | Location / Notes |
|---|------|--------|-------------------|
| 9 | **CI/CD** | **No automated CI** (no GitHub Actions or similar). No guaranteed test/lint on push; risk of regressions and inconsistent quality. | Repo root; no `.github/workflows`. |
| 10 | **Testing** | Test coverage not verified. Laravel has PHPUnit; frontend may have limited E2E/unit tests. Gaps increase refactor risk. | `kechow-server/tests/`; client tests if any. |
| 11 | **API contract** | **Response shape** differs if some endpoints return raw JSON and others use ApiResponse `{ success, data }`. Frontend unwraps `data`; any endpoint not using the trait can break the client. | ApiResponse trait; all API controllers. |
| 12 | **Business logic** | **Driver earnings** = sum of order total for delivered deliveries. No separate delivery fee or tip in schema; if business model changes, schema and logic need updates. | DeliveryController::getEarnings; deliveries + orders. |
| 13 | **Performance** | **Indexes** added in migrations (e.g. orders status, restaurant_id+status, deliveries). Ensure all high-traffic queries are covered (orders by user, by restaurant, by driver, by date). | Migrations 2026_02_25, etc. |
| 14 | **SEO** | No per-route meta, JSON-LD, or sitemap in codebase. Limits discoverability and rich results for local SEO. | Frontend index.html; router; no sitemap/robots in client. |

---

## WARNING

| # | Area | Issue | Location / Notes |
|---|------|--------|-------------------|
| 15 | **Code quality** | **Debug logging** and console statements in production paths. Remove or guard with env (e.g. only in development). | axios.ts, EarningsView, OwnerDashboard, delivery.service.ts. |
| 16 | **Refactoring** | **Order.driver_id** vs **Delivery.driver_id**: Order has optional driver_id (FK to User in model); Delivery has driver_id (FK to Driver). Sync and usage should be documented and consistent. | Order model; Delivery model; OrderController driver methods. |
| 17 | **Documentation** | **kechow-docs** and **kechow-client/docs** contain legacy and planning docs; some may be outdated. Single source of truth (e.g. docs/v2_analysis) should be the reference. | kechow-docs/*; kechow-client/docs/*. |
| 18 | **Queue/Jobs** | Queue connection and config present; actual use of jobs for notifications, reports, or heavy tasks not verified. Underuse can lead to slow requests and timeouts. | config/queue.php; Events (OrderCreated); listeners if any. |
| 19 | **i18n** | Default locale is Spanish; fallback is Spanish. If English or other locales are added, ensure all user-facing strings are in message files. | i18n.config.ts; locales (es.json, en.json). |

---

## TRIVIAL

| # | Area | Issue | Location / Notes |
|---|------|--------|-------------------|
| 20 | **Style** | Inconsistent comment language (Spanish vs English) in code. Prefer one language for comments for consistency. | Various PHP/TS/Vue files. |
| 21 | **Dependencies** | Optional rollup native dependency (`@rollup/rollup-linux-x64-gnu`) in client; build uses `ROLLUP_NO_NATIVE=1`. Minor impact. | package.json. |
| 22 | **Docs** | Multiple doc folders (kechow-docs, kechow-client/docs, docs). Consolidation and index improve discoverability. | Repo structure. |
| 23 | **Landscaping** | “Landscaping” mentioned in scope; codebase is **food delivery** (restaurants, menus, orders). No landscaping-specific features found. May be a naming/scope clarification. | N/A. |
| 24 | **Neon/Prisma** | Task mentioned “Database (Neon/Prisma)”. Repo uses **Laravel migrations + Eloquent** only. Neon (Postgres) can be used as Laravel DB host; no Prisma. | Database layer. |

---

## Summary Counts

| Severity | Count |
|----------|--------|
| CRITICAL | 3 |
| CRUCIAL | 5 |
| IMPORTANT | 6 |
| WARNING | 5 |
| TRIVIAL | 5 |

**Recommended order of work:** Address CRITICAL first (token storage strategy, remove token logging, unify or document delivery flow). Then CRUCIAL (role/CORS, pagination, remove duplicate driver API, dependency audit). Then IMPORTANT (CI, tests, API contract, earnings model, indexes, SEO). WARNING and TRIVIAL can be scheduled as tech debt and cleanup.

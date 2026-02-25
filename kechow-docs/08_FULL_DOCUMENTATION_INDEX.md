# Phase 8 — Full Documentation Index

**Project:** Kechow — Plataforma de entrega (Ciudad Jiménez, Chihuahua, México)

This index lists all official documentation. Obsolete or duplicate files should be removed; references point to this structure.

---

## 1. System Overview

- **08_FULL_DOCUMENTATION_INDEX.md** (this file) — Index and entry point.
- **KECHOW_PROJECT_OVERVIEW.md** — Business context, roles (customer, owner, delivery, admin), high-level flows. Keep in kechow-docs; remove duplicate in Docs/ if present.
- **ARCHITECTURE.md** — High-level architecture (frontend, backend, DB, APIs). Consolidate with 03_BACKEND_FINAL_STRUCTURE and 04_FRONTEND_FINAL_STRUCTURE for details.

---

## 2. Architecture and Technical

- **03_BACKEND_FINAL_STRUCTURE.md** — Laravel folder structure, modules, routes, conventions.
- **04_FRONTEND_FINAL_STRUCTURE.md** — Vue 3 folder structure, aliases, router, delivery module contract.
- **05_DATABASE_FINAL_DESIGN.md** — Schema, tables, indexes, relationships, migrations, seeders.
- **02_REFACTOR_PLAN.md** — Refactor priorities and execution order.

---

## 3. API Documentation

- **BACKEND_FRONTEND_INTEGRATION_GUIDE.md** — How frontend calls backend; base URL, auth, endpoints. Update to use `/api/v1` when applied.
- **OWNER_MANAGEMENT_ROUTES.md** — Admin owner CRUD routes and behavior.
- **OWNER_API_BEHAVIOR_AND_ERRORS.md** — Owner API errors and status codes.
- **OWNER_RESOURCE_SCHEMA.md** — Owner API resource shapes.
- **ORDER_STATE_MACHINE.md** — Order and delivery status transitions.
- **DELIVERY_DASHBOARD_README.md** — Delivery API and dashboard integration.

**Recommended:** Generate a single **API_REFERENCE.md** or OpenAPI spec listing all public endpoints (auth, restaurants, cart, orders, delivery, owner) with method, path, auth, request/response samples. Maintain in kechow-docs.

---

## 4. Database

- **05_DATABASE_FINAL_DESIGN.md** — Full schema, indexes, migrations, seeders.
- **OWNER_SEEDERS_AND_RESPONSES.md** — Owner seed data and API response examples (keep one; remove "copy" file).

---

## 5. Deployment and Environment

- **Deployment Guide:** Create **DEPLOYMENT.md** — Server requirements (PHP, Node, MySQL), build steps (frontend `npm run build`, backend `composer install --no-dev`), env vars (APP_KEY, DB_*, VITE_API_URL, SANCTUM/cors), web server config (Nginx/Apache), cron for scheduler, queue worker.
- **Environment Configuration:** Create **ENV_CONFIGURATION.md** — List all `.env` keys (backend and frontend) with description and example; which are required for prod vs dev.

---

## 6. CI/CD and Quality

- **CI/CD Pipeline:** Create **CICD.md** — How to run tests (PHPUnit, frontend tests), lint, build; pipeline stages (test, build, deploy); deploy to staging/production (manual or auto from main).
- **OWNER_TEST_COVERAGE.md** — Owner module test coverage. Keep one; remove "copy".

---

## 7. Security and Performance

- **SECURITY_CHECKLIST.md** — OWASP-oriented checklist (auth, roles, validation, CORS, rate limit, secrets). Update with delivery role and policy checks.
- **Performance Strategy:** Add section in **ARCHITECTURE.md** or create **PERFORMANCE.md** — DB indexes, N+1 avoidance, pagination, caching (if any), frontend lazy load and Core Web Vitals.

---

## 8. SEO and Local

- **06_SEO_STRATEGY_JIMENEZ_CHIHUAHUA.md** — Local SEO, meta, JSON-LD, sitemap, robots, Core Web Vitals, Jiménez Chihuahua.

---

## 9. User Manuals (Spanish)

- **Admin Manual:** Create **MANUAL_ADMIN.md** — Admin role: gestionar dueños, restaurantes, usuarios; qué puede y no puede hacer.
- **Delivery Manual:** Create **MANUAL_REPARTIDOR.md** — Repartidor: activar disponibilidad, ver pedidos disponibles, aceptar/rechazar, actualizar estado, ganancias, perfil. Pantallas y flujos.
- **Owner Manual:** Create **MANUAL_PROPIETARIO.md** — Dueño: dashboard, menú, pedidos, analíticas, configuración.
- **Customer Manual:** Create **MANUAL_CLIENTE.md** — Cliente: buscar restaurantes, carrito, checkout, pedidos, seguimiento, perfil.

All in Spanish; professional tone; screenshots or step numbers where helpful.

---

## 10. Validation and UX

- **VALIDATION_OWNER.md** — Owner validation rules. Keep.
- **ERROR_SCENARIOS_COVERED.md** — Error handling and user-facing messages.
- **UX_ENHANCEMENTS.md** — UX improvements log or backlog.
- **ROUTE_GUARDS.md** — Frontend route guards and role redirects. Keep one; remove "copy".
- **LAYOUTS.md** — Layouts per role. Keep.

---

## 11. Cleanup and Consolidation

- **Delete or merge:** Any file named `* copy.md` in kechow-docs.
- **Remove references** to deleted `Docs/` files (e.g. from README in repo root); point to `kechow-docs/` and this index.
- **Single README** in repo root: short project description, links to `kechow-docs/08_FULL_DOCUMENTATION_INDEX.md`, and quick start (backend: `composer install`, `php artisan serve`; frontend: `npm install`, `npm run dev`).

This index is the single entry point for full professional documentation. New documents should be added here and obsolete ones removed.

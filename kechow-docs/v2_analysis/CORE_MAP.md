# Kechow — Core Map: Project Architecture and Working Strategy

**Version:** v2 Analysis  
**Date:** February 2026  
**Scope:** Full repository (backend, frontend, database, business logic)

---

## 1. Executive Summary

Kechow is a **food delivery platform** connecting **customers**, **restaurant owners**, and **delivery drivers** in Ciudad Jiménez, Chihuahua, México. The system is a **monorepo** with:

- **Backend:** Laravel 12 (PHP 8.2+) — REST API, Sanctum auth, modular structure.
- **Frontend:** Vue 3 + Vite 6 — SPA with role-based layouts (Customer, Owner, Delivery).
- **Database:** Laravel migrations (MySQL/PostgreSQL/SQLite); no Prisma/Neon in codebase (Laravel Eloquent only).
- **UI:** Spanish-first; vue-i18n with `es` as default and fallback.

---

## 2. Repository Structure

```
kechow-main/
├── kechow-server/          # Laravel API
│   ├── app/
│   │   ├── Http/           # Controllers (Api/), Middleware, Requests
│   │   ├── Models/         # User, Driver, Delivery (global)
│   │   └── Modules/        # Auth, Owner, Restaurant, Order, Cart, Driver
│   ├── config/             # database, auth, cors, logging, reverb
│   ├── database/migrations/
│   └── routes/api.php      # All API under /api/v1
├── kechow-client/          # Vue 3 SPA
│   ├── src/
│   │   ├── app/            # router, store (auth), config (i18n), lib (axios)
│   │   ├── features/       # auth, customer, business-owner, delivery
│   │   ├── pages/          # route-level views
│   │   └── shared/         # layout, ui, data (nav.config), utils
│   └── docs/               # Client-specific docs
├── kechow-docs/            # Legacy/planning docs (architecture, DB design, audits)
└── docs/                  # This v2_analysis + v1_analysis
```

---

## 3. Technology Stack

| Layer | Technology | Notes |
|-------|------------|--------|
| Backend | Laravel 12, PHP 8.2+ | Modules: Auth, Owner, Restaurant, Order, Cart; Api\Driver for delivery |
| API | REST, JSON | Base path `/api/v1`; throttle 60/min |
| Auth | Laravel Sanctum | Token in `Authorization: Bearer`; frontend stores in localStorage |
| Database | MySQL / PostgreSQL / SQLite | Via Laravel migrations; default from env |
| Frontend | Vue 3, Vite 6, Pinia, Vue Router | Role-based layouts; lazy-loaded owner/delivery routes |
| Styling | Tailwind CSS | Primary/secondary palette; dark mode support |
| i18n | vue-i18n | Locale `es`, fallback `es`; Spanish-first UI |
| Realtime | Laravel Reverb (Pusher protocol) | Config present; Echo used on frontend |

---

## 4. Database Architecture (Laravel Migrations)

- **users:** id, name, email, password, role (customer|owner|delivery|admin), phone, address, latitude, longitude, timestamps, soft deletes.
- **user_addresses:** user_id, label, street, city, state, zip_code, is_default, lat/lng.
- **restaurants:** id, owner_id, name, description, address, city, state, zip_code, phone, email, website, opening_time, closing_time, schedule_json, closed_dates, exceptional_closed_dates, logo_url, avg_prep_time_minutes, is_active, latitude, longitude, delivery_radius, timestamps.
- **menu_items:** id, restaurant_id, name, description, price, image_url, category, preparation_time, stock, is_available, timestamps.
- **orders:** id, user_id (customer), restaurant_id, total, status, delivery_address, delivery_notes, driver_id (nullable), estimated_delivery_time, actual_delivery_time, timestamps.
- **order_items:** order_id, menu_item_id, quantity, price.
- **drivers:** id, user_id (unique), status, vehicle_type, is_online, rating, total_deliveries, current_latitude, current_longitude, timestamps.
- **deliveries:** id, order_id (unique), driver_id, status (assigned|picked_up|in_transit|delivered|cancelled), assigned_at, picked_up_at, delivered_at, cancelled_at, cancellation_reason, notes, timestamps.
- **driver_locations:** driver_id, latitude, longitude, created_at.
- **carts:** id, user_id, restaurant_id, expires_at, timestamps.
- **cart_items:** cart_id, menu_item_id, quantity, notes.
- **personal_access_tokens:** Sanctum.
- **cache, jobs, sessions:** Laravel default.

---

## 5. API Surface (Strategy)

- **Prefix:** All routes under `Route::prefix('v1')` in `routes/api.php`.
- **Auth:** Public: `POST /login`, `POST /register`, `POST /forgot-password`, `POST /reset-password`. Protected: `POST /logout`, `GET /user` (auth:sanctum).
- **Restaurants:** Public: `GET /restaurants`, `GET /restaurants/{id}`, `GET /restaurants/{id}/menu`, `GET /restaurants/logo/{filename}`. Owner: `GET /restaurants/owner/my-restaurants`; CRUD + logo upload + toggle-status under auth.
- **Menu items:** Under `/{restaurant}/menu-items` (index, categories, store, show, update, destroy, toggle-availability).
- **Orders:** Customer: `GET/POST /customer/orders`, `GET /customer/orders/{id}`, `POST /customer/orders/{id}/cancel`. Owner: `GET /owner/restaurant/orders`, `PATCH /owner/orders/{id}/status`. Driver (Order module): `GET /driver/orders/available`, `POST /driver/orders/{id}/accept`, start-delivery, complete-delivery.
- **Delivery (API entry):** `GET/POST /delivery/availability`, `GET /delivery/jobs/available`, `POST /delivery/jobs/{orderId}/accept`, `POST /delivery/jobs/{orderId}/reject`, `GET /delivery/orders/active`, `GET /delivery/orders/completed`, `GET /delivery/orders/{id}`, `PATCH /delivery/orders/{id}/status`, `GET /delivery/stats`, `GET /delivery/earnings`, `GET/PATCH /delivery/settings`. Middleware: `auth:sanctum`, `role:delivery`.
- **Cart:** `GET /carts/current`, `POST /carts`, `PUT /carts/{cart}/items`, `DELETE /carts/{cart}/items/{item}` (auth:sanctum).
- **Owners (admin):** `GET/POST/GET/PUT|PATCH/DELETE /owners` — middleware `role:admin`.

**Working strategy:** Delivery flow is driven by **DeliveryController** (`/delivery/*`): drivers accept **pending** orders (no delivery record yet); order status moves to accepted and a **deliveries** row is created. Order module’s driver routes use `Order::STATUS_READY` and `driver_id`; the two paths can diverge and should be unified in a future refactor.

---

## 6. Middleware and Security

- **Global:** Throttle 60/min on v1 group.
- **Auth:** `auth:sanctum` on protected routes.
- **Role:** `CheckRole` middleware (`role:delivery`, `role:admin`, etc.) used on delivery and owner-management routes.
- **CORS:** Config-driven (`config/cors.php`, `CORS_ALLOWED_ORIGINS`).
- **Policies:** DeliveryPolicy (update/view); owner/restaurant access guarded by ownership checks.
- **Response format:** ApiResponse trait: `success($data)` / `error($message, $code, $errors)`; frontend axios unwraps `{ success, data }` to `data`.

---

## 7. Frontend Architecture

- **Router:** Vue Router; guards in `router/guards.ts` — role and auth from route meta; redirect to role dashboard or login.
- **Layouts:** MainLayout (landing, login, register), CustomerLayout, OwnerLayout, DeliveryLayout — each with Header + RoleNavigation (desktop) and main content; no separate “AdminShell” name (OwnerLayout is the owner shell).
- **Navigation:** `nav.config.ts` — Spanish labels per role (Restaurantes, Mi Carrito, Pedidos, Panel de Control, Menú, Ganancias, Perfil, etc.).
- **State:** Pinia: auth store (user, token, login, register, logout); cart store; delivery store; menu store for owner.
- **API:** Single axios instance in `app/lib/axios.ts`; baseURL includes `/api/v1`; Bearer token from localStorage; 401 clears storage and redirects to login.
- **Features:** `features/auth`, `features/customer` (cart, addresses, orders), `features/business-owner` (dashboard, menu, orders, analytics, reviews, settings), `features/delivery` (dashboard, jobs, live delivery, earnings, profile).

---

## 8. Business Logic Summary

- **Order lifecycle:** pending → accepted → preparing → ready → out_for_delivery → delivered (or cancelled). OrderStateMachine enforces transitions by role (owner/admin for most; delivery for out_for_delivery → delivered).
- **Delivery lifecycle (deliveries table):** assigned → picked_up → in_transit → delivered (or cancelled). Driver accepts from pending orders; Delivery record created; driver updates status via PATCH; on delivered, order status and actual_delivery_time updated, driver total_deliveries incremented.
- **Cart:** One cart per user per restaurant; 30-min expiry; items with quantity and notes; stock checked on add.
- **Restaurant:** schedule_json and exceptional_closed_dates for hours; `isOpen()` logic in model.
- **Earnings (driver):** Today/week/month/total from completed deliveries joining orders.total (no separate fee table in current schema).

---

## 9. CI/CD and DevOps

- **In repo:** No `.github/` workflows or CI config found. No Dockerfile in repo root (Laravel has fly-apps/dockerfile-laravel in composer dev).
- **Recommendation:** Add CI (e.g. GitHub Actions) for tests, lint, and optional deploy; document env and DB setup for Neon/PostgreSQL if used.

---

## 10. Document Conventions

- **English** for all technical and business audit docs in `docs/v2_analysis/`.
- **Spanish-first UI** is acknowledged in user-facing guides (USER_GUIDE_CLIENT, DRIVER_HANDBOOK, BUSINESS_OWNER_MANUAL): all in-app labels and flows are in Spanish unless otherwise noted.

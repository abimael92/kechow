# Safe, Non-Breaking Setup and Configuration Plan

**Kechow Delivery Platform** — Backend (Laravel), Frontend (Vue 3 + TypeScript + Pinia), DevOps, Testing, Monitoring.

**Principle:** Every change is additive or config-only. No removal or breaking change to existing API contracts, routes, or frontend behavior. Delivery workflows, earnings, LiveDelivery UI, and settings continue to work as today.

---

## Implementation Order (recommended)

| Phase | Scope | Risk |
|-------|--------|------|
| 1 | Backend: logging, .env.example, ApiResponse in other modules | Low |
| 2 | Backend: Swagger annotations (delivery API) | None |
| 3 | Frontend: TypeScript types, optional form validation | Low |
| 4 | DevOps: EditorConfig, lint/format, Docker Compose (dev) | Low |
| 5 | Git hooks (Husky), CI pipeline | Low |
| 6 | Testing: PHPUnit, Vitest, Cypress | Low (additive) |
| 7 | Monitoring: Telescope (dev), Sentry (optional) | Low |

---

## 1. Backend

### 1.1 Logging — Monolog, daily rotating, delivery + error channels

**Goal:** Keep existing `delivery` channel; add `error` channel; use stack in production so logs go to daily + error + delivery.

**Steps:**

1. **Add `error` channel** (daily rotating, separate file).

   Edit `kechow-server/config/logging.php`. Inside the `'channels'` array, add **before** the closing `];` of `channels`:

   ```php
   'error' => [
       'driver' => 'daily',
       'path' => storage_path('logs/error.log'),
       'level' => env('LOG_LEVEL', 'debug'),
       'days' => env('LOG_DAILY_DAYS', 14),
       'replace_placeholders' => true,
   ],
   ```

   Your existing `delivery` channel already uses `daily` and its own path; no change there.

2. **Production .env (when you deploy):** set:

   ```env
   LOG_CHANNEL=stack
   LOG_STACK=daily,error,delivery
   LOG_DAILY_DAYS=14
   ```

   Local can stay `LOG_STACK=single` or use `LOG_STACK=single,delivery` if you want delivery in a separate file locally.

**Verification:**

- Run the app; trigger a delivery action (e.g. toggle availability or fetch jobs). Check `storage/logs/delivery.log` still appears/rotates.
- Trigger an error (e.g. invalid route). Check `storage/logs/laravel.log` (or `error.log` if you added the channel and use stack with `error`). No change to API responses.

**Safety:** Config and new channel only; no change to request/response or behavior.

---

### 1.2 Security — CSRF, CORS from env, roles, validation, XSS/IDOR

**Goal:** Confirm current setup and document; no breaking changes.

| Item | Current state | Action |
|------|----------------|--------|
| CSRF | Sanctum SPA; frontend should call `GET /sanctum/csrf-cookie` before first mutating request | Ensure frontend does this when using cookies; no backend change. |
| CORS | `config/cors.php` uses `env('CORS_ALLOWED_ORIGINS')`, `supports_credentials` true | Keep; in production set `CORS_ALLOWED_ORIGINS` to exact SPA origin(s). |
| Roles | Delivery routes use `auth:sanctum` + `role:delivery`; Owner uses `role:owner` | No change. |
| Validation | Form Requests on delivery (e.g. `UpdateAvailabilityRequest`, `UpdateDeliveryStatusRequest`, `UpdateDeliverySettingsRequest`) | Keep; do not switch to unvalidated `$request->all()` for model updates. |
| XSS/IDOR | JSON responses; delivery scoped by driver via policy; no PII in delivery logs | No change. |

**Verification:**

- Call `GET /api/v1/delivery/availability` without auth → 401.
- Call with delivery user → 200 and same JSON shape as today.
- Call `GET /api/v1/delivery/orders/{id}` with another driver’s order → 403/404 (policy). No change to response format for allowed requests.

**Safety:** Verification only; no code change required if already in place.

---

### 1.3 Error handling — Centralized ApiResponse for all modules

**Goal:** Controllers that return JSON use `App\Traits\ApiResponse` so success/error shape is consistent. **Do not change the `data` payload shape** so frontend keeps working.

**Steps:**

1. In **Auth** module (e.g. `App\Http\Controllers\Api\AuthController` or the controller that handles login/register/user):
   - Add `use App\Traits\ApiResponse;` and `use ApiResponse;` in the class.
   - Replace `response()->json([...])` with `return $this->success($data);` for 200 and `return $this->error($message, $code);` for errors.
   - Keep the same keys inside `data` (e.g. `data.user`, `data.token` if still used) so existing frontend unwrapping does not break.

2. In **Owner, Order, Cart** modules:
   - Same pattern: use `ApiResponse` and `$this->success($data)` / `$this->error($message, $code)`.
   - Preserve existing response structure (e.g. what the frontend expects under `data`).

**Verification:**

- Login, register, get user: same status codes and same `data` content as before.
- Delivery endpoints: unchanged (already use ApiResponse).
- Frontend login/delivery flows and LiveDelivery UI work as today.

**Safety:** Only normalizes the wrapper (`success`/`message`/`data`); payload shape preserved.

---

### 1.4 Swagger/OpenAPI for delivery API

**Goal:** Document delivery API in existing L5-Swagger so `/api/documentation` (or your configured route) shows delivery endpoints.

**Steps:**

1. In `app/Http/Controllers/Api/Driver/DeliveryController.php`, add a class-level docblock and one operation so the pattern is clear:

   ```php
   /**
    * @OA\Tag(name="Delivery", description="Driver delivery API (auth:sanctum, role:delivery)")
    */
   class DeliveryController extends Controller
   ```

   For one endpoint, e.g. availability:

   ```php
   /**
    * @OA\Get(
    *     path="/api/v1/delivery/availability",
    *     tags={"Delivery"},
    *     security={{"sanctum":{}}},
    *     @OA\Response(response=200, description="Availability and hasActiveOrder")
    * )
    */
   public function getAvailability()
   ```

2. Run:

   ```bash
   cd kechow-server && php artisan l5-swagger:generate
   ```

3. Open the Swagger UI route (see `config/l5-swagger.php`). Confirm delivery tag and the documented endpoint appear.

**Verification:**

- All delivery endpoints still respond as before; only docs changed.
- In production, keep `L5_SWAGGER_GENERATE_ALWAYS=false` and generate at deploy time if needed.

**Safety:** Annotations only; no runtime behavior change.

---

### 1.5 Environment variables — `.env.example`

**Goal:** Single reference of all keys so new environments and CI are consistent. Merge with your current `.env.example`; only add or document, do not remove in-use keys.

Add or ensure these in `kechow-server/.env.example` (merge with existing; comments explain optional/external):

```env
# --- Application ---
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# --- Auth (Sanctum) ---
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,127.0.0.1:5173,127.0.0.1:8000

# --- CORS (exact SPA origins in production; never * with credentials) ---
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# --- Delivery ---
DELIVERY_DRIVER_COMMISSION_RATE=1.0
DELIVERY_FEE_FIXED=0

# --- Logging ---
LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug
LOG_DAILY_DAYS=14

# --- Database ---
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kechow
DB_USERNAME=root
DB_PASSWORD=

# --- Session / Cache / Queue ---
SESSION_DRIVER=database
CACHE_STORE=database
QUEUE_CONNECTION=database

# --- Optional: Swagger ---
# L5_SWAGGER_GENERATE_ALWAYS=false

# --- Optional: Error tracking (when Sentry enabled) ---
# SENTRY_LARAVEL_DSN=
# SENTRY_TRACES_SAMPLE_RATE=0.1

# --- Optional: Telescope (dev only; disable in production) ---
# TELESCOPE_ENABLED=false
```

**Verification:**

- Copy to `.env`, fill values, run `php artisan config:clear` and hit delivery endpoints; behavior unchanged.

**Safety:** Documentation only; no code depends on new keys until you use optional features.

---

## 2. Frontend

### 2.1 Form validation — VeeValidate (+ Yup or Zod)

**Goal:** Optional, non-breaking: add VeeValidate for form-level validation; keep existing API calls and payloads.

**Note:** Formik is React-only. For Vue use **VeeValidate**. You can pair it with **Zod** (already in the project) via `@vee-validate/zod`, or Yup via `@vee-validate/yup`.

**Steps:**

1. Install (choose one schema lib):

   ```bash
   cd kechow-client
   npm i vee-validate @vee-validate/zod
   # OR: npm i vee-validate @vee-validate/yup && npm i yup
   ```

2. Use only in **new or refactored forms** (e.g. delivery settings, login). Example with Zod:

   ```ts
   import { useForm } from 'vee-validate';
   import { toTypedSchema } from '@vee-validate/zod';
   import { z } from 'zod';

   const schema = z.object({
     language: z.enum(['es', 'en']),
   });

   const { handleSubmit, defineField, errors } = useForm({
     validationSchema: toTypedSchema(schema),
   });
   const [language] = defineField('language');
   // handleSubmit(submitFn) — submitFn still calls same API
   ```

3. Do **not** change the request/response of existing delivery API calls (availability, accept/reject, earnings, settings).

**Verification:**

- Existing delivery workflow (availability, accept/reject, earnings, LiveDelivery, settings) works without using VeeValidate.
- Any form you migrate to VeeValidate still submits the same payload and handles the same success/error response.

**Safety:** Additive; adopt per form without touching existing flow.

---

### 2.2 Typing — Full TypeScript types for API responses

**Goal:** Define interfaces for delivery API responses and use them in the delivery store/components. No change to runtime behavior or API contracts.

**Steps:**

1. Create or extend types (e.g. `kechow-client/src/features/delivery/types/api.ts`):

   ```ts
   export interface ApiSuccess<T> {
     success: true;
     data: T;
     message?: string;
     meta?: Record<string, unknown>;
   }

   export interface AvailabilityData {
     isOnline: boolean;
     totalOnlineHours?: number;
     currentSessionStart?: string | null;
     hasActiveOrder?: boolean;
   }

   export interface JobItem {
     id: number;
     pickup: string;
     dropoff: string;
     amount: number;
     restaurant: { name: string };
     items?: Array<{ id?: number; name?: string; quantity?: number }>;
   }

   export interface ActiveOrderData {
     id: number;
     orderNumber?: string;
     status: string;
     pickup: string;
     dropoff: string;
     amount: number;
     fee?: number;
     paymentMethod?: string;
     restaurant: { name: string; address?: string; phone?: string };
     customer?: { name: string; address?: string; phone?: string };
     items?: Array<{ id?: number; name?: string; quantity?: number }>;
     distance?: number | null;
     estimatedTime?: number;
   }

   export interface EarningsData {
     today: number;
     week: number;
     month: number;
     total: number;
   }

   export interface StatsData {
     todayOrders: number;
     earnings: number;
     completed_deliveries: number;
     rating: number;
   }
   ```

2. In `delivery.store.ts`, import and use these types for `availability`, `availableJobs`, `activeOrder`, earnings, stats (e.g. `ref<AvailabilityData>`, `ref<JobItem[]>()`, etc.).

**Verification:**

- `npm run typecheck` passes; delivery dashboard, earnings, LiveDelivery UI behave as before.

**Safety:** Types only; no API or response shape change.

---

### 2.3 State — Pinia modular stores (delivery, driver, stats)

**Goal:** Confirm current structure; no breaking change.

- **delivery.store:** canonical source for delivery API state (availability, jobs, active order, earnings, stats, settings).
- **driver.store:** compatibility/adapter if used elsewhere; can expose delivery state via getters.
- **stats.store:** stats/earnings if separated.

**Action:** No structural change. Ensure all delivery API calls go through one place (e.g. a delivery service used by the delivery store) and that LiveDelivery/earnings/dashboard read from the delivery store.

**Verification:** Toggle availability, accept/reject, view earnings, open LiveDelivery; state and UI unchanged.

**Safety:** Verification only.

---

### 2.4 E2E testing — Cypress (driver workflow, earnings, LiveDelivery)

**Goal:** Add Cypress and specs that mirror current behavior without changing app code.

**Steps:**

1. Install:

   ```bash
   cd kechow-client
   npm i -D cypress
   ```

2. Config: create `kechow-client/cypress.config.ts`:

   ```ts
   import { defineConfig } from 'cypress';

   export default defineConfig({
     e2e: {
       baseUrl: 'http://localhost:5173',
       supportFile: 'cypress/support/e2e.ts',
       specPattern: 'cypress/e2e/**/*.cy.ts',
       viewportWidth: 1280,
       viewportHeight: 720,
     },
     env: {
       API_URL: 'http://127.0.0.1:8000',
     },
   });
   ```

3. Support: create `kechow-client/cypress/support/e2e.ts` and `cypress/support/commands.ts`. In `commands.ts` add a custom command for delivery login (e.g. `cy.loginAsDelivery(email, password)` that visits login, fills form, submits, and asserts redirect).

4. Fixture: create `cypress/fixtures/delivery-user.json` with test user (e.g. `{"email":"driver@example.com","password":"password"}`). Use a user that exists in your dev/seed data.

5. Specs (examples; adjust selectors to your app):
   - **Driver workflow:** visit delivery dashboard, toggle availability, open available jobs list.
   - **Earnings:** visit earnings page; check that section or totals are visible.
   - **LiveDelivery:** visit dashboard; if there is an active order link go to live view; else visit live URL and assert “no active order” or equivalent.

**Verification:**

- Backend and frontend running; run `npx cypress run --headless`. All specs pass.
- No change to production code except optional `data-cy` attributes for stable selectors.

**Safety:** Additive; E2E does not alter API or app behavior.

---

### 2.5 UI — Tailwind / Icons (optional)

**Goal:** Optional consistency; no breaking change.

- Project already uses Tailwind and Heroicons. Optionally standardize on Heroicons and add `data-cy` to key elements (availability toggle, job list, earnings summary, LiveDelivery container) for Cypress.
- No removal of existing styles or components.

**Verification:** Visual and behavior unchanged; Cypress selectors more stable if you use `data-cy`.

**Safety:** Additive only.

---

## 3. DevOps / CI/CD

### 3.1 Dockerfile and Docker Compose for dev (PHP, Node, MySQL, Redis)

**Goal:** Local dev with containers; optional. Do not change how the app runs in production if you deploy differently.

**Steps:**

1. **Backend Dockerfile** (optional multi-stage): Keep your current Dockerfile if it works. For a slimmer image you can use a multi-stage build (composer stage + php-fpm stage); ensure `public/` is served and env (DB, Redis, CORS, Sanctum) is passed in.

2. **Compose for dev:** Create `docker-compose.yml` (or `docker-compose.dev.yml`) at repo root:

   ```yaml
   version: '3.8'
   services:
     mysql:
       image: mysql:8.0
       environment:
         MYSQL_DATABASE: kechow
         MYSQL_USER: kechow
         MYSQL_PASSWORD: secret
         MYSQL_ROOT_PASSWORD: root
       ports:
         - "3306:3306"
       volumes:
         - mysql-data:/var/lib/mysql
       healthcheck:
         test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
         interval: 5s
         timeout: 5s
         retries: 10

     redis:
       image: redis:alpine
       ports:
         - "6379:6379"

   volumes:
     mysql-data:
   ```

   Run backend and frontend on the host: `php artisan serve`, `npm run dev`. In `.env` set `DB_HOST=127.0.0.1`, `REDIS_HOST=127.0.0.1` (or use service names if you run app in Compose too).

3. **Optional:** Add a `backend` service that runs `php artisan serve --host=0.0.0.0` and a `frontend` service that runs `npm run dev`, with volumes for code; then you can run full stack with Compose. Same app code and API.

**Verification:**

- `docker compose up -d`; run migrations from host or inside backend container; hit API and frontend; delivery flow works.

**Safety:** Additive; existing “run on host” workflow still valid.

---

### 3.2 Nodemon-style hot reload for backend (dev)

**Goal:** No need to restart server on PHP file changes during dev.

- With `php artisan serve`, PHP loads code on each request; no Nodemon needed.
- If you want automatic restart on file change (e.g. for long-running queue workers), use a watcher that restarts `php artisan serve` or `queue:listen` when files change; that is optional and does not change API.

**Verification:** Edit a controller; refresh request; change is visible. No API contract change.

**Safety:** Dev convenience only.

---

### 3.3 Lint and format — Prettier, ESLint, PHP (Pint or PHP CS Fixer), EditorConfig

**Goal:** Consistent style; run without changing behavior.

**Steps:**

1. **Frontend:** You already have ESLint and Prettier. Add script: `"format": "prettier --write ."`. Run `npm run lint` and `npm run format` (or `format:check`) in CI.

2. **Backend:** Use **Laravel Pint** (already in project): `./vendor/bin/pint` (or `composer exec pint`). Alternatively **PHP CS Fixer**: add to composer and use a config that matches Pint/PSR-12; run in CI.

3. **EditorConfig** at repo root:

   ```ini
   root = true
   [*]
   charset = utf-8
   end_of_line = lf
   insert_final_newline = true
   trim_trailing_whitespace = true
   [*.{php,js,ts,vue,json,yml,yaml}]
   indent_style = space
   [*.php]
   indent_size = 4
   [*.{js,ts,vue,json,yml,yaml}]
   indent_size = 2
   ```

**Verification:**

- Backend: `cd kechow-server && ./vendor/bin/pint --test` (dry run). Fix only style; run tests to confirm no behavior change.
- Frontend: `npm run lint` and `npm run typecheck`; fix only style/types; manual check of delivery flow.

**Safety:** Style only; no API or business logic change if tests pass.

---

### 3.4 Git hooks — Husky pre-commit (lint / test)

**Goal:** Run lint (and optionally tests) on commit; avoid pushing broken style or failing tests.

**Steps:**

1. In frontend:

   ```bash
   cd kechow-client
   npm i -D husky
   npx husky init
   echo "npm run lint && npm run typecheck && npm run format:check" > .husky/pre-commit
   chmod +x .husky/pre-commit
   ```

2. Optional: add `npm run test` to pre-commit if you have Vitest and fast unit tests.

3. Backend: optional pre-push hook at repo root that runs `cd kechow-server && ./vendor/bin/pint --test && php artisan test`.

**Verification:**

- Commit with a lint error; hook fails. Fix and commit; hook passes. Delivery flow unchanged.

**Safety:** Only blocks bad commits; does not change app.

---

### 3.5 CI/CD — GitHub Actions or GitLab CI (build, lint, test)

**Goal:** On push/PR: lint and test backend and frontend; build frontend. Deploy only when you’re ready (separate job or workflow).

**Steps (GitHub Actions example):**

1. Create `.github/workflows/ci.yml`:

   ```yaml
   name: CI
   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]
   jobs:
     backend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup PHP
           uses: shivammathur/setup-php@v2
           with:
             php-version: '8.2'
             extensions: mbstring, pdo_mysql, bcmath
         - name: Install deps
           run: cd kechow-server && composer install --no-interaction --prefer-dist
         - name: Env
           run: cd kechow-server && cp .env.example .env && php artisan key:generate
         - name: Pint
           run: cd kechow-server && ./vendor/bin/pint --test
         - name: Tests
           run: cd kechow-server && php artisan test
           env:
             DB_CONNECTION: sqlite
             DB_DATABASE: ':memory:'
             APP_ENV: testing

     frontend:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Setup Node
           uses: actions/setup-node@v4
           with:
             node-version: '20'
             cache: 'npm'
             cache-dependency-path: kechow-client/package-lock.json
         - name: Install
           run: cd kechow-client && npm ci
         - name: Lint
           run: cd kechow-client && npm run lint
         - name: Typecheck
           run: cd kechow-client && npm run typecheck
         - name: Build
           run: cd kechow-client && npm run build
           env:
             VITE_API_URL: ${{ secrets.VITE_API_URL || 'http://localhost:8000' }}
   ```

2. For **deploy:** add a separate job or workflow that runs on `main` (or a release tag), and runs your deploy script (e.g. rsync, SSH, or PaaS CLI). Omit deploy from this plan so it stays provider-agnostic.

**Verification:**

- Push to a branch; CI runs. Fix any failures (lint/test); delivery behavior unchanged.

**Safety:** CI only; no production behavior change until you add deploy steps.

---

### 3.6 Optional: Kubernetes deployment template, Tilt

- **Kubernetes:** Add a commented example deployment/service (e.g. backend image, env from Secret, port 80 → 9000). Use when you move to K8s; not required for current delivery features.
- **Tilt:** Optional for local multi-service dev; use if you already use K8s locally. Not required for Docker Compose or host-based dev.

Mark these sections in your doc as “Optional / future” and “Requires K8s cluster” so they are not applied by mistake.

---

## 4. Testing

### 4.1 Unit tests — PHPUnit (backend), Vitest (frontend)

**Backend:**

- Existing PHPUnit: keep and extend. Add tests for delivery: e.g. `test_availability_requires_auth`, `test_availability_ok_for_delivery_user`, `test_reject_persists_rejection`, `test_get_order_detail_denies_other_driver` (policy). Use in-memory SQLite in CI (`DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`). Use factories for User, Driver, Order, Delivery; create `DeliveryRejection` via API or model.

**Frontend:**

- Add Vitest: `npm i -D vitest @vue/test-utils happy-dom`. Add `vitest.config.ts` and a small test (e.g. delivery store initial state). Run with `npm run test` (e.g. `vitest run`).

**Verification:**

- `php artisan test` and `npm run test` pass; no change to app behavior.

**Safety:** Additive tests only.

---

### 4.2 Integration tests — API endpoints, policies, Form Requests

- Use PHPUnit Feature tests: hit real routes with `$this->actingAs($user)->getJson(...)` and assert status and JSON. Test policies in Unit tests by instantiating the policy and asserting `allow`/`deny`. Test Form Requests by sending invalid payloads and asserting 422 and error keys.
- No change to routes or validation rules except adding new ones; existing behavior covered by tests.

**Verification:** All integration tests pass; manual smoke test of delivery flow unchanged.

**Safety:** Tests only.

---

### 4.3 E2E tests — login, availability, accept/reject, earnings, LiveDelivery

- Implement in Cypress as in §2.4: login (custom command), open delivery dashboard, toggle availability, open jobs list, (if test data allows) accept or reject a job, open earnings page, open LiveDelivery (with or without active order). Use fixtures for test user; optionally stub API for deterministic runs.
- Run with `npx cypress run --headless` after starting backend and frontend.

**Verification:** E2E passes; app behavior unchanged.

**Safety:** Additive; no production code change except optional `data-cy`.

---

### 4.4 Fixtures and mock data

- **Backend:** Seed or factory: delivery user, driver, orders in `pending` (for available jobs), one assigned to driver (for LiveDelivery). Use in local and in CI for E2E if you run full stack.
- **Frontend:** `cypress/fixtures/delivery-user.json`; optionally fixture JSON for API responses in Cypress with `cy.intercept()` to avoid backend dependency in some specs.

**Verification:** Tests and E2E are stable and repeatable.

---

## 5. Monitoring / Metrics

### 5.1 Error tracking — Sentry or Rollbar

**Goal:** Optional; capture exceptions in production without changing response format.

**Steps:**

1. Install Sentry: `cd kechow-server && composer require sentry/sentry-laravel`.
2. Publish config and set `SENTRY_LARAVEL_DSN` in `.env` (production/staging).
3. Ensure PII is not sent (no request body or user identifiers in breadcrumbs if policy forbids).

**Verification:** Trigger an error in staging; see event in Sentry; API still returns same error response to client.

**Safety:** Additive; no change to response body or status codes.

---

### 5.2 Performance — Laravel Telescope (dev)

**Goal:** Dev-only; inspect requests, queries, jobs. Disabled in production.

**Steps:**

1. `composer require laravel/telescope --dev`, `php artisan telescope:install`, `php artisan migrate`.
2. In `TelescopeServiceProvider`, gate so only `app()->environment('local')` (or `staging` if you want) can access the UI.
3. In production `.env`: `TELESCOPE_ENABLED=false` or do not install Telescope in production.

**Verification:** Local: open Telescope UI; trigger delivery requests; see entries. Production: no Telescope; delivery API unchanged.

**Safety:** Dev-only; no production impact.

---

### 5.3 Logs — Centralized format, separate channels

**Goal:** One format (e.g. structured context array); separate channels (e.g. `delivery`, `error`, default).

- Use `Log::channel('delivery')->info('...', ['order_id' => $id, 'driver_id' => $id])` (no PII).
- Use `Log::channel('error')->error(...)` for critical/exception logs.
- Optionally add a JSON formatter for production so log aggregators can parse.

**Verification:** Log files have expected content; no PII in delivery log; API unchanged.

**Safety:** Logging only; no request/response change.

---

## 6. Sections requiring external or pending modules

- **Owner / Cart APIs:** Any step that adds or changes Owner/Cart routes or integrations: comment in the plan that it “Requires Owner API access” or “Pending Cart module” and enable only when those services are available.
- **Sentry / Rollbar:** Requires account and DSN; document in `.env.example` as optional.
- **Kubernetes / Tilt:** Optional; document as “For future K8s adoption.”
- **Payment or third-party APIs:** Document in a “Next steps / external integrations” section; do not enable in default setup.

---

## 7. Verification checklist (after applying the plan)

Use this to confirm nothing is broken:

| Check | How |
|-------|-----|
| Delivery auth | GET `/api/v1/delivery/availability` without auth → 401; with delivery user → 200, same shape. |
| Availability | POST toggle; response and `delivery.log` (if used) unchanged. |
| Available jobs | GET jobs; list excludes already-rejected by driver; shape unchanged. |
| Accept order | POST accept; delivery created; order status updated; response shape unchanged. |
| Reject order | POST reject; rejection persisted; jobs list excludes it; response unchanged. |
| Active order | GET active order; shape unchanged (including optional fields). |
| Order detail | GET order by id (own delivery) → 200; other driver’s → 403/404. |
| Earnings / stats | GET earnings and stats; structure and calculations unchanged. |
| Settings | GET/PATCH settings; language persisted; response shape unchanged. |
| LiveDelivery UI | Dashboard and live view load; data displayed as before. |
| Frontend build | `npm run build` succeeds; `npm run typecheck` and `npm run lint` pass. |
| Backend tests | `php artisan test` passes. |
| E2E | `npx cypress run --headless` passes with backend + frontend up. |

---

## 8. Quick reference — commands

| Task | Command |
|------|--------|
| Backend tests | `cd kechow-server && php artisan test` |
| Backend lint (Pint) | `cd kechow-server && ./vendor/bin/pint --test` |
| Frontend lint | `cd kechow-client && npm run lint` |
| Frontend typecheck | `cd kechow-client && npm run typecheck` |
| Frontend unit tests | `cd kechow-client && npm run test` |
| E2E (headless) | `cd kechow-client && npx cypress run --headless` |
| Swagger generate | `cd kechow-server && php artisan l5-swagger:generate` |
| Docker Compose up | `docker compose up -d` (from repo root) |

---

This plan is designed so you can implement it step-by-step with verification after each block. All changes preserve current working functionality and API contracts for the delivery platform (delivery API, reject/accept, earnings, LiveDelivery UI, settings).

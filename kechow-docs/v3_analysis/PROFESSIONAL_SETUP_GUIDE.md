# Kechow Delivery Platform — Professional Setup Guide

**Audience:** Senior full-stack and DevOps  
**Scope:** Backend (Laravel), Frontend (Vue 3 + TypeScript + Pinia), DevOps/CI-CD, Testing, Monitoring.  
**Principle:** All changes are safe to integrate; existing API contracts and app behavior are preserved.

---

## Table of Contents

1. [Backend Enhancements](#1-backend-enhancements)
2. [Frontend Enhancements](#2-frontend-enhancements)
3. [DevOps & CI/CD](#3-devops--cicd)
4. [Testing](#4-testing)
5. [Monitoring & Metrics](#5-monitoring--metrics)
6. [Best Practices & Environment Config](#6-best-practices--environment-config)
7. [Optional / Future](#7-optional--future)

---

## 1. Backend Enhancements

### 1.1 Logging (Monolog, daily rotating, channels)

Laravel already uses Monolog. Ensure a dedicated **error** channel and **delivery** channel with daily rotation; use the **stack** channel in production to combine them.

**Step 1.1.1 — Add `error` daily channel**

Edit `config/logging.php` and add (or verify) an `error` channel that writes to a daily file:

```php
// config/logging.php — inside 'channels' array
'error' => [
    'driver' => 'daily',
    'path' => storage_path('logs/error.log'),
    'level' => env('LOG_LEVEL', 'debug'),
    'days' => env('LOG_DAILY_DAYS', 14),
    'replace_placeholders' => true,
],
```

**Step 1.1.2 — Use stack in production**

Set in production `.env`:

```env
LOG_CHANNEL=stack
LOG_STACK=daily,error,delivery
LOG_DAILY_DAYS=14
```

So that `stack` writes to `daily` (laravel.log), `error` (error.log), and `delivery` (delivery.log). Keep `delivery` channel as-is (already daily, path `storage/logs/delivery.log`).

**Step 1.1.3 — Log exceptions to error channel**

In `app/Exceptions/Handler.php` (or bootstrap/app.php in Laravel 11+), ensure unhandled exceptions are logged. Laravel does this by default to the default channel; if you want exceptions only in `error.log`, in the report method you can add:

```php
// app/Exceptions/Handler.php
public function register(): void
{
    $this->reportable(function (Throwable $e) {
        \Log::channel('error')->error($e->getMessage(), [
            'exception' => get_class($e),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
        ]);
    });
}
```

(Only add if you want a copy in the error channel; default logging already goes to the default channel.)

---

### 1.2 Security (CSRF, CORS, RBAC, validation, XSS/IDOR)

**Step 1.2.1 — CSRF**

- Sanctum SPA: frontend must call `GET /sanctum/csrf-cookie` before first state-changing request when using cookies.
- Ensure `config/sanctum.php` has correct `stateful` domains (e.g. `SANCTUM_STATEFUL_DOMAINS`).
- No change needed if the frontend already fetches CSRF cookie and sends `withCredentials`.

**Step 1.2.2 — CORS**

Current `config/cors.php` is correct: `allowed_origins` from env, no `*` in production, `supports_credentials` true. In production set:

```env
CORS_ALLOWED_ORIGINS=https://your-frontend.example.com
```

**Step 1.2.3 — Role-based access**

- Delivery routes: already use `auth:sanctum` and `role:delivery` (CheckRole middleware).
- Owner routes: `role:owner`. Ensure `CheckRole` is registered in `bootstrap/app.php` or `Kernel.php` as `role` alias.

**Step 1.2.4 — Validation**

- Keep using Form Requests for all writable inputs (e.g. `UpdateAvailabilityRequest`, `UpdateDeliveryStatusRequest`, `UpdateDeliverySettingsRequest`). Do not use `$request->all()` for model updates.

**Step 1.2.5 — XSS / IDOR**

- Responses are JSON; escape output if you add HTML views. For delivery, ensure `getOrderDetail` and `updateOrderStatus` scope by current driver and use `DeliveryPolicy` (already implemented). No raw user input in log messages (no PII in delivery channel).

---

### 1.3 Swagger/OpenAPI for delivery API

L5-Swagger is already installed. Add OpenAPI annotations for the delivery API so it appears in Swagger UI.

**Step 1.3.1 — Base controller annotation**

Create or update a base doc block that tags the delivery controller. In `app/Http/Controllers/Api/Driver/DeliveryController.php` add at the top of the class:

```php
/**
 * @OA\Tag(name="Delivery", description="Driver delivery API (auth:sanctum, role:delivery)")
 */
class DeliveryController extends Controller
```

**Step 1.3.2 — Document one endpoint (pattern for rest)**

Example for GET availability:

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

**Step 1.3.3 — Generate and serve**

```bash
php artisan l5-swagger:generate
```

Serve docs at the route configured in `config/l5-swagger.php` (e.g. `/api/documentation`). In production, disable generation in request or run it in deploy: `L5_SWAGGER_GENERATE_ALWAYS=false`.

**Optional:** Add a separate spec file for delivery-only (e.g. copy of api-docs.json filtered to paths `/api/v1/delivery/*`) for external partners.

---

### 1.4 Centralized ApiResponse for all modules

DeliveryController already uses `App\Traits\ApiResponse`. To standardize other modules without breaking clients:

**Step 1.4.1 — Use ApiResponse in Auth module**

In `App\Http\Controllers\Api\AuthController` (or the controller that handles login/register/user):

- Add `use App\Traits\ApiResponse;` and `use ApiResponse;` in the class.
- Replace `response()->json([...])` with `return $this->success($data);` for 200 responses and `return $this->error($message, $code);` for errors.
- Keep the same keys in the payload (e.g. `user` inside `data` if you want frontend to keep unwrapping: `success(data)` with `data = ['user' => ...]`).

**Step 1.4.2 — Owner, Order, Cart modules**

Same pattern: in each controller that returns JSON, use the ApiResponse trait and return `$this->success($data)` or `$this->error($message, $code)`. Ensure the shape of `data` stays the same so existing frontend code does not break.

**Step 1.4.3 — Optional global JSON exception response**

In the exception handler, for API routes return JSON in the same shape:

```php
// In Handler or bootstrap/app.php exception handling
if ($request->is('api/*')) {
    return response()->json([
        'success' => false,
        'message' => $e->getMessage(),
        'errors' => config('app.debug') ? [...optional trace...] : null,
    ], $e->getStatusCode());
}
```

---

### 1.5 Environment config — full .env.example

Provide a single source of truth for all keys. Below is the recommended **.env.example** (merge with your existing one; comments indicate optional or future use).

```env
# --- Application ---
APP_NAME=Laravel
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# --- Auth (Sanctum) ---
# Comma-separated SPA origins that receive session cookies
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,127.0.0.1:5173,127.0.0.1:8000

# --- CORS ---
# Comma-separated; in production use exact SPA URL(s), never *
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

# --- Session ---
SESSION_DRIVER=database
SESSION_LIFETIME=120

# --- Cache & Queue ---
CACHE_STORE=database
QUEUE_CONNECTION=database

# --- Broadcast (optional; set to reverb when using WebSockets) ---
BROADCAST_CONNECTION=log

# --- Swagger (optional) ---
L5_SWAGGER_GENERATE_ALWAYS=false
L5_SWAGGER_CONST_HOST=

# --- Error tracking (optional; when Sentry is enabled) ---
# SENTRY_LARAVEL_DSN=
# SENTRY_TRACES_SAMPLE_RATE=0.1

# --- Telescope (dev only; disable in production) ---
# TELESCOPE_ENABLED=false
```

---

## 2. Frontend Enhancements

### 2.1 Form validation (Zod + VeeValidate or Zod only)

The project already uses **Zod** for schemas. You can keep Zod-only validation or add **VeeValidate** for form-level integration.

**Option A — Zod only (no new deps)**

- Keep using Zod in components: `schema.parse(data)` or `schema.safeParse(data)` and show errors from `safeParse.result.error.flatten()`.
- Use in Pinia actions before calling the API.

**Option B — Add VeeValidate with Zod**

```bash
cd kechow-client && npm i vee-validate @vee-validate/zod
```

Example for a delivery form (e.g. availability toggle or settings):

```ts
// Example: useForm with Zod
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { z } from 'zod';

const schema = z.object({ language: z.enum(['es', 'en']) });
const { handleSubmit, defineField, errors } = useForm({
  validationSchema: toTypedSchema(schema),
});
const [language] = defineField('language');
// handleSubmit(submitFn)
```

Use for delivery settings, login, or any form where you want field-level errors without changing existing API calls.

---

### 2.2 Full TypeScript types for API responses

Define interfaces for all delivery API responses so the store and components are typed.

**Step 2.2.1 — Create API types file**

Create `kechow-client/src/features/delivery/types/api.ts` (or extend existing `types/index.ts`):

```ts
// Delivery API response types (match backend ApiResponse { success, data })
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

**Step 2.2.2 — Use in store**

In `delivery.store.ts`, type refs and return types:

```ts
import type { AvailabilityData, JobItem, ActiveOrderData, EarningsData, StatsData } from '../types/api';

const availability = ref<AvailabilityData>({ isOnline: false, totalOnlineHours: 0 });
const availableJobs = ref<JobItem[]>([]);
const activeOrder = ref<ActiveOrderData | null>(null);
// ...
```

Axios interceptor already unwraps `data`; so the service returns `T` (e.g. `AvailabilityData`), not `ApiSuccess<T>`.

---

### 2.3 Pinia modular stores (already in place)

Current structure is correct: **delivery.store** (canonical), **driver.store** (compatibility), **stats.store**. No structural change needed. Ensure:

- All delivery API calls go through one service (e.g. `driver.service.ts`) and the store uses it.
- No duplicate state for the same server data (e.g. active order lives in delivery store only; driver store exposes it via computed).

---

### 2.4 E2E testing (Cypress)

**Step 2.4.1 — Install Cypress**

```bash
cd kechow-client
npm i -D cypress @cypress/vite-dev-server
```

**Step 2.4.2 — Cypress config**

Create or update `kechow-client/cypress.config.ts`:

```ts
import { defineConfig } from 'cypress';
import viteConfig from './vite.config';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // Optional: use Vite dev server
      // const { startDevServer } = require('@cypress/vite-dev-server');
      // on('dev-server:start', (options) => startDevServer({ options, viteConfig }));
      return config;
    },
  },
  env: {
    API_URL: 'http://127.0.0.1:8000',
  },
});
```

**Step 2.4.3 — Support file**

Create `kechow-client/cypress/support/e2e.ts`:

```ts
import './commands';

beforeEach(() => {
  // Clear session so tests start fresh when needed
  // cy.clearLocalStorage();
});
```

**Step 2.4.4 — Custom commands (login as delivery)**

Create `kechow-client/cypress/support/commands.ts`:

```ts
declare global {
  namespace Cypress {
    interface Chainable {
      loginAsDelivery(email: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('loginAsDelivery', (email: string, password: string) => {
  cy.session(
    [email, password],
    () => {
      cy.visit('/login');
      cy.get('input[name="email"], input[type="email"]').first().type(email);
      cy.get('input[name="password"], input[type="password"]').first().type(password);
      cy.get('button[type="submit"]').click();
      cy.url().should('not.include', '/login');
    },
    { cacheAcrossSpecs: false }
  );
});
```

**Step 2.4.5 — Fixtures**

Create `kechow-client/cypress/fixtures/delivery-user.json`:

```json
{
  "email": "driver@example.com",
  "password": "password"
}
```

**Step 2.4.6 — E2E spec: driver workflow**

Create `kechow-client/cypress/e2e/delivery-workflow.cy.ts`:

```ts
import deliveryUser from '../fixtures/delivery-user.json';

describe('Delivery workflow', () => {
  beforeEach(() => {
    cy.loginAsDelivery(deliveryUser.email, deliveryUser.password);
  });

  it('opens delivery dashboard', () => {
    cy.visit('/delivery/dashboard');
    cy.contains(/repartidor|dashboard|disponible/i).should('be.visible');
  });

  it('toggles availability', () => {
    cy.visit('/delivery/dashboard');
    cy.get('button').contains(/disponible|online|conectar/i).click();
    cy.get('body').should('contain.text', 'disponible'); // or check for updated state
  });

  it('shows available jobs when online', () => {
    cy.visit('/delivery/dashboard');
    // First go online if needed
    cy.get('button').contains(/disponible|online|conectar/i).then(($btn) => {
      if ($btn.length) $btn.click();
    });
    cy.get('[data-cy="available-jobs"], .orders-panel, main').should('be.visible');
  });
});
```

**Step 2.4.7 — E2E spec: earnings and LiveDelivery**

Create `kechow-client/cypress/e2e/delivery-earnings-livedelivery.cy.ts`:

```ts
import deliveryUser from '../fixtures/delivery-user.json';

describe('Delivery earnings and LiveDelivery', () => {
  beforeEach(() => {
    cy.loginAsDelivery(deliveryUser.email, deliveryUser.password);
  });

  it('earnings page loads', () => {
    cy.visit('/delivery/earnings');
    cy.contains(/ganancias|earnings|hoy|today/i).should('be.visible');
  });

  it('LiveDelivery page shows message when no active order or shows order', () => {
    cy.visit('/delivery/dashboard');
    // If there is an active order, link to live exists
    cy.get('body').then(($body) => {
      if ($body.find('a[href*="/delivery/live/"]').length) {
        cy.get('a[href*="/delivery/live/"]').first().click();
        cy.url().should('include', '/delivery/live/');
        cy.contains(/entrega|pedido|order/i).should('be.visible');
      } else {
        cy.visit('/delivery/live/1');
        cy.contains(/entrega|pedido|no disponible|order/i).should('be.visible');
      }
    });
  });
});
```

**Step 2.4.8 — Add npm scripts**

In `kechow-client/package.json`:

```json
"scripts": {
  "cy:open": "cypress open",
  "cy:run": "cypress run",
  "cy:run:headless": "cypress run --headless"
}
```

Run E2E: start backend and frontend, then `npx cypress run --headless` (or `npm run cy:run:headless`).

---

### 2.5 UI (Tailwind, Heroicons)

Tailwind and Heroicons are already in the project. Optional improvements:

- Prefer Heroicons for consistency: `import { ... } from '@heroicons/vue/24/outline'`.
- Use a single design token set (e.g. primary color, spacing) in `tailwind.config.js` so delivery and owner UIs stay consistent.
- Add `data-cy` attributes to key elements (e.g. availability toggle, job list, earnings summary) for stable Cypress selectors.

---

## 3. DevOps & CI/CD

### 3.1 Dockerfile (backend and frontend, multi-stage)

**Backend Dockerfile (multi-stage, production-oriented)**

Create or replace `kechow-server/Dockerfile`:

```dockerfile
# Stage 1: Composer deps
FROM composer:2 AS backend-deps
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Stage 2: Backend build
FROM php:8.2-fpm-alpine AS backend
WORKDIR /var/www/html
RUN apk add --no-cache libzip-dev libpng-dev oniguruma-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql mbstring exif bcmath gd zip
COPY --from=backend-deps /app/vendor /var/www/html/vendor
COPY . .
RUN composer dump-autoload --optimize --no-dev
RUN chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache
EXPOSE 9000
CMD ["php-fpm"]
```

Use with a reverse-proxy (nginx or Apache) that serves `public/` and forwards PHP to PHP-FPM. For Apache-only (no FPM), keep your current Dockerfile and only add a second stage for composer if you want smaller images.

**Frontend Dockerfile (multi-stage)**

Create `kechow-client/Dockerfile`:

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# Stage 2: Serve with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Create `kechow-client/nginx.conf` (SPA fallback):

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location /api {
        # Optional: proxy to backend in same stack
        # proxy_pass http://backend:8000;
    }
}
```

---

### 3.2 Docker Compose (local dev: PHP, MySQL, Redis, Node)

Create `docker-compose.yml` at repo root:

```yaml
version: '3.8'
services:
  backend:
    build:
      context: ./kechow-server
      dockerfile: Dockerfile
    ports:
      - "8000:9000"
    environment:
      APP_ENV: local
      APP_DEBUG: "true"
      DB_CONNECTION: mysql
      DB_HOST: mysql
      DB_DATABASE: kechow
      DB_USERNAME: kechow
      DB_PASSWORD: secret
      REDIS_HOST: redis
      CACHE_STORE: redis
      SESSION_DRIVER: redis
    volumes:
      - ./kechow-server:/var/www/html
      - backend-vendor:/var/www/html/vendor
    depends_on:
      - mysql
      - redis
  # Use php artisan serve for simple local dev instead of FPM:
  # backend:
  #   image: php:8.2-cli
  #   working_dir: /app
  #   command: sh -c "composer install && php artisan serve --host=0.0.0.0"
  #   volumes: [ "./kechow-server:/app" ]
  #   ports: [ "8000:8000" ]
  #   env_file: ./kechow-server/.env
  #   depends_on: [ mysql, redis ]

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

  frontend:
    build:
      context: ./kechow-client
      dockerfile: Dockerfile
    ports:
      - "80:80"
    environment:
      VITE_API_URL: http://localhost:8000
    depends_on:
      - backend

volumes:
  mysql-data:
  backend-vendor:
```

For **local dev without building images**, run backend and frontend on the host (e.g. `php artisan serve`, `npm run dev`) and use Compose only for MySQL and Redis:

```yaml
# docker-compose.dev.yml — minimal
services:
  mysql:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: kechow
      MYSQL_USER: kechow
      MYSQL_PASSWORD: secret
      MYSQL_ROOT_PASSWORD: root
    ports: ["3306:3306"]
    volumes: [mysql-data:/var/lib/mysql]
  redis:
    image: redis:alpine
    ports: ["6379:6379"]
volumes:
  mysql-data:
```

Then: `docker compose -f docker-compose.dev.yml up -d` and in `kechow-server/.env`: `DB_HOST=127.0.0.1`, `REDIS_HOST=127.0.0.1`.

---

### 3.3 Hot reload for backend (dev)

- **Laravel Pail** (already in composer): `php artisan pail` tails logs.
- **Code reload:** Use `php artisan serve` in dev; PHP does not need a process restart for code changes. For queue workers run `php artisan queue:listen` (or `queue:work` with `--max-jobs=1` during dev).
- **Optional:** Use Laravel Sail or a custom script that runs `php artisan serve`, `queue:listen`, and `npm run dev` in parallel (your composer `dev` script already does this with pail).

---

### 3.4 Linting and formatting

**Backend — Laravel Pint (already installed)**

```bash
cd kechow-server
./vendor/bin/pint
# or
composer exec pint
```

Add `phpunit.xml` or `pint.json` if you want to exclude paths. Default Pint rules are PSR-12–like and safe.

**Frontend — ESLint and Prettier (already in package.json)**

```bash
cd kechow-client
npm run lint
npm run format:check
```

Add format script: `"format": "prettier --write ."`. Optionally add `eslint-config-prettier` and run Prettier after ESLint so they do not conflict.

**EditorConfig**

Create `.editorconfig` at repo root:

```ini
root = true
[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
[*.{php,js,ts,vue,json,yml,yaml}]
indent_style = space
indent_size = 4
[*.{js,ts,vue,json,yml,yaml}]
indent_size = 2
```

---

### 3.5 Git hooks (Husky + lint/test)

**Step 3.5.1 — Install Husky in frontend**

```bash
cd kechow-client
npm i -D husky
npx husky init
```

**Step 3.5.2 — Pre-commit**

```bash
echo "npm run lint && npm run typecheck && npm run format:check" > .husky/pre-commit
chmod +x .husky/pre-commit
```

Optional: add `npm run test` if you add Vitest unit tests.

**Step 3.5.3 — Backend (optional pre-commit)**

From repo root, run Pint and PHPUnit before push:

```bash
mkdir -p .husky
echo 'cd kechow-server && ./vendor/bin/pint && php artisan test' > .husky/pre-push
chmod +x .husky/pre-push
```

(Requires Husky at repo root or a separate tool like `pre-commit` for the backend.)

---

### 3.6 CI/CD pipeline (GitHub Actions)

Create `.github/workflows/ci.yml`:

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
          coverage: none
      - name: Install Composer deps
        run: |
          cd kechow-server
          composer install --no-interaction --prefer-dist
      - name: Copy env
        run: |
          cd kechow-server
          cp .env.example .env
          php artisan key:generate
      - name: Laravel Pint
        run: cd kechow-server && ./vendor/bin/pint --test
      - name: PHPUnit
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
      - name: Install npm deps
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

Add a **deploy** job (or separate workflow) that runs on `main` and deploys to your server (e.g. rsync, SSH, or a PaaS). Omit deploy steps here so the guide stays provider-agnostic.

---

### 3.7 Optional: Kubernetes deployment (commented for future)

```yaml
# k8s/deployment.yaml — EXAMPLE only; adjust image names and env
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: kechow-backend
# spec:
#   replicas: 1
#   selector:
#     matchLabels:
#       app: kechow-backend
#   template:
#     metadata:
#       labels:
#         app: kechow-backend
#     spec:
#       containers:
#         - name: backend
#           image: your-registry/kechow-backend:latest
#           ports:
#             - containerPort: 9000
#           envFrom:
#             - secretRef:
#                 name: kechow-backend-secrets
#           # When Owner/Cart expansion is ready, add more env or configmaps
# ---
# apiVersion: v1
# kind: Service
# metadata:
#   name: kechow-backend
# spec:
#   selector:
#     app: kechow-backend
#   ports:
#     - port: 80
#       targetPort: 9000
```

---

### 3.8 Optional: Tilt (local multi-service dev)

Create `Tiltfile` at repo root (optional):

```python
# Tiltfile — local multi-service dev; backend + frontend hot reload
# allow_duplicates()
# docker_build('kechow-backend', './kechow-server')
# k8s_yaml('k8s/deployment.yaml')
# local_resource('backend-logs', 'cd kechow-server && php artisan pail', serve_cmd='')
# For simpler setup, use docker-compose or host php artisan serve + npm run dev
```

Use only if you already use Kubernetes locally; otherwise Docker Compose + host processes are enough.

---

## 4. Testing

### 4.1 Backend — PHPUnit

**Step 4.1.1 — Unit test example (DeliveryController logic)**

Create `kechow-server/tests/Unit/ExampleTest.php` or a feature test for delivery. Example **Feature** test for delivery API:

Create `kechow-server/tests/Feature/DeliveryApiTest.php`:

```php
<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Driver;
use App\Modules\Order\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryApiTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(\Database\Seeders\DatabaseSeeder::class); // if you have one
    }

    public function test_availability_requires_auth(): void
    {
        $response = $this->getJson('/api/v1/delivery/availability');
        $response->assertStatus(401);
    }

    public function test_availability_returns_ok_for_delivery_user(): void
    {
        $user = User::factory()->create(['role' => 'delivery']);
        Driver::factory()->create(['user_id' => $user->id]);
        $response = $this->actingAs($user)->getJson('/api/v1/delivery/availability');
        $response->assertOk();
        $response->assertJsonPath('data.isOnline', false);
    }

    public function test_reject_persists_rejection(): void
    {
        $user = User::factory()->create(['role' => 'delivery']);
        $driver = Driver::factory()->create(['user_id' => $user->id]);
        $order = Order::factory()->create(['status' => 'pending']);
        $response = $this->actingAs($user)->postJson("/api/v1/delivery/jobs/{$order->id}/reject");
        $response->assertOk();
        $this->assertDatabaseHas('delivery_rejections', [
            'driver_id' => $driver->id,
            'order_id' => $order->id,
        ]);
    }
}
```

Adjust to your factories and seeders. Use in-memory SQLite for speed: in `phpunit.xml` set `DB_CONNECTION=sqlite` and `DB_DATABASE=:memory:` for the testing environment.

**Step 4.1.2 — Policy test**

Create `kechow-server/tests/Unit/DeliveryPolicyTest.php`:

```php
<?php

namespace Tests\Unit;

use App\Models\Delivery;
use App\Models\Driver;
use App\Models\User;
use App\Policies\DeliveryPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DeliveryPolicyTest extends TestCase
{
    use RefreshDatabase;

    public function test_driver_can_only_update_own_delivery(): void
    {
        $user = User::factory()->create(['role' => 'delivery']);
        $driver = Driver::factory()->create(['user_id' => $user->id]);
        $delivery = Delivery::factory()->create(['driver_id' => $driver->id]);
        $policy = new DeliveryPolicy();
        $this->assertTrue($policy->update($user, $delivery));
        $otherUser = User::factory()->create(['role' => 'delivery']);
        $otherDriver = Driver::factory()->create(['user_id' => $otherUser->id]);
        $otherDelivery = Delivery::factory()->create(['driver_id' => $otherDriver->id]);
        $this->assertFalse($policy->update($user, $otherDelivery));
    }
}
```

Add factories for `Driver`, `Delivery`, and `Order` if they do not exist.

---

### 4.2 Frontend — Vitest (unit)

**Step 4.2.1 — Install Vitest**

```bash
cd kechow-client
npm i -D vitest @vue/test-utils happy-dom
```

**Step 4.2.2 — Vitest config**

Create `kechow-client/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'url';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: { reporter: ['text', 'json-summary'], exclude: ['node_modules', 'cypress'] },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
```

**Step 4.2.3 — Sample unit test (store or util)**

Create `kechow-client/src/features/delivery/store/delivery.store.spec.ts`:

```ts
import { setActivePinia, createPinia } from 'pinia';
import { describe, it, expect, beforeEach } from 'vitest';
import { useDeliveryStore } from './delivery.store';

describe('delivery store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('has initial state', () => {
    const store = useDeliveryStore();
    expect(store.isOnline).toBe(false);
    expect(store.activeOrder).toBeNull();
    expect(store.hasActiveOrder).toBe(false);
  });
});
```

Add script in `package.json`: `"test": "vitest run"`, `"test:watch": "vitest"`.

---

### 4.3 Integration tests (API + policies + Form Requests)

- Reuse the same PHPUnit Feature tests as above; add more cases for:
  - Accept order (transaction creates delivery and updates order).
  - Update status (picked_up → in_transit → delivered) and assert DB and response.
  - getOrderDetail returns 404 for another driver’s order.
- Test Form Requests by calling the controller with invalid payloads and asserting 422 and validation errors.

---

### 4.4 E2E (Cypress) — already outlined in §2.4

- Use `npx cypress run --headless` (or `npm run cy:run:headless`).
- Ensure backend and frontend are up; optionally stub API in Cypress with `cy.intercept()` for faster or more deterministic runs.

---

## 5. Monitoring & Metrics

### 5.1 Error tracking (Sentry)

**Step 5.1.1 — Install Sentry Laravel**

```bash
cd kechow-server
composer require sentry/sentry-laravel
php artisan sentry:publish --dsn=
```

**Step 5.1.2 — Configure**

In `.env` add `SENTRY_LARAVEL_DSN=...` (from Sentry project). In `config/sentry.php` (or `.env`) set `SENTRY_TRACES_SAMPLE_RATE=0.1` if you want performance traces.

**Step 5.1.3 — Register (Laravel 11+)**

If the package does not auto-register, in `bootstrap/app.php` add the Sentry middleware and report handler. The package readme describes the exact steps. Ensure PII is not sent (e.g. do not log request body or user emails in breadcrumbs if restricted by policy).

---

### 5.2 Laravel Telescope (dev)

**Step 5.2.1 — Install**

```bash
cd kechow-server
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

**Step 5.2.2 — Restrict to local**

In `app/Providers/TelescopeServiceProvider.php`, in `gate()`:

```php
if (app()->environment('local')) {
    return true;
}
return false;
```

In production `.env`: `TELESCOPE_ENABLED=false` or do not install Telescope in production.

---

### 5.3 Log channels (centralized format)

You already have `stack`, `daily`, `delivery`, and (after adding) `error`. Use a consistent format:

- In code use `Log::channel('delivery')->info('Message', ['order_id' => $id, 'driver_id' => $id])` — no PII.
- For application logs, use structured context (array) instead of string interpolation so log aggregators can parse.
- Optional: create a custom Monolog formatter that adds `timestamp`, `channel`, `level` in JSON for production (e.g. `JsonFormatter`).

---

### 5.4 Optional: Prometheus / Grafana

- Expose a `/metrics` endpoint (e.g. via `promphp/prometheus_client_php` or a small middleware that increments counters for request count by route).
- Scrape with Prometheus; dashboards in Grafana. Not required for initial production; add when you need SLOs or custom business metrics.

---

## 6. Best Practices & Environment Config

### 6.1 API versioning

Already in place: `/api/v1`. Keep all delivery and other modules under `v1`. When introducing breaking changes, add `v2` and route accordingly; document in Swagger.

### 6.2 Rate limiting

Already applied: `throttle:60,1` on the v1 group. For stricter limits on auth:

```php
// In routes/api.php or Auth module routes
Route::post('/login', ...)->middleware('throttle:5,1');
Route::post('/register', ...)->middleware('throttle:5,1');
```

### 6.3 Transactions for critical operations

Accept delivery is already wrapped in `DB::transaction`. Keep any other multi-table writes (e.g. order + delivery + notifications) inside a transaction.

### 6.4 Prefer httpOnly cookies; minimize localStorage

- Backend: keep session-based auth for SPA (Sanctum stateful); do not return long-lived tokens in JSON if you rely on cookies.
- Frontend: do not store tokens in localStorage when using cookie auth; clear any legacy token on logout. Document in README or setup guide.

### 6.5 i18n (frontend)

Vue-i18n is already used. Move remaining hardcoded strings (e.g. delivery dashboard, LiveDelivery) into locale files and use `$t('key')` so all copy is centralized.

### 6.6 Feature toggles for Owner / Cart (comment placeholders)

For routes or features that depend on external Owner API or paid services:

- In code, add a comment: `// FEATURE_OWNER_API: when Owner API is available, uncomment below`.
- In config, you can add `config('features.owner_api_enabled', false)` and guard routes or controller logic so you can enable them via env without code change when the API is ready.

Example in a future Owner controller:

```php
// if (!config('features.owner_api_enabled')) {
//     return $this->error('Owner API not yet enabled.', 503);
// }
```

---

### 6.7 Staging vs production config

- **Staging:** `APP_ENV=staging`, `APP_DEBUG=false`, same DB/cache/queue as production-like (e.g. MySQL, Redis), `LOG_LEVEL=debug` or `info`, `CORS_ALLOWED_ORIGINS` and `SANCTUM_STATEFUL_DOMAINS` set to staging frontend URL.
- **Production:** `APP_ENV=production`, `APP_DEBUG=false`, `LOG_LEVEL=warning` or `error`, strict CORS and Sanctum domains, `LOG_STACK=daily,error,delivery`, migrations run automatically in deploy, no Telescope.

Use separate `.env.staging` and `.env.production` (or secrets in CI) and never commit real secrets.

---

## 7. Optional / Future

- **Kubernetes:** Example deployment in §3.7; expand when moving to K8s (e.g. Owner/Cart services).
- **Tilt:** §3.8 for local K8s dev.
- **Payment / Owner API:** When external APIs are available, add env vars and feature flags; document in the same setup guide or in PRODUCTION_DELIVERY_PLATFORM_REFERENCE.md “Next Steps / Pending External Integrations”.
- **Playwright instead of Cypress:** If you prefer Playwright, replace Cypress with Playwright and keep the same E2E scenarios (login as delivery, toggle availability, earnings page, LiveDelivery).

---

## Quick command reference

| Task | Command |
|------|--------|
| Backend tests | `cd kechow-server && php artisan test` |
| Backend lint | `cd kechow-server && ./vendor/bin/pint` |
| Frontend lint | `cd kechow-client && npm run lint` |
| Frontend typecheck | `cd kechow-client && npm run typecheck` |
| Frontend unit tests | `cd kechow-client && npm run test` |
| E2E (headless) | `cd kechow-client && npx cypress run --headless` |
| Swagger generate | `cd kechow-server && php artisan l5-swagger:generate` |
| Docker Compose up | `docker compose up -d` (from repo root) |

---

*This guide is designed to be applied incrementally. Apply one section at a time and run the test suite and E2E to ensure nothing is broken.*

# Kechow — Modern Stack Upgrade (Dependencies & Implementation)

**Version:** v2 Analysis  
**Date:** February 2026  
**Scope:** Infrastructure, validation, real-time, observability, data fetching.  
**Constraint:** Spanish UI strings unchanged; existing logic retained unless replaced by the proposed dependencies below.

---

## 1. Current Stack Snapshot

### 1.1 Frontend (package.json)

| Category | Current | Version |
|----------|---------|---------|
| Framework | Vue | ^3.5.17 |
| Build | Vite | ^6.3.5 |
| State | Pinia | ^3.0.3 |
| HTTP | axios | ^1.11.0 |
| Real-time | laravel-echo, pusher-js | ^2.3.0, ^8.4.0 |
| Charts | chart.js, vue-chartjs | ^4.5.0, ^5.3.2 |
| i18n | vue-i18n | ^12.0.0-alpha.2 |
| UI feedback | vue-toastification | ^2.0.0-rc.5 |
| Validation | None (manual `required`, v-model) | — |
| Data fetching | Raw axios in components/services | — |
| Error tracking | None | — |

### 1.2 Backend (composer.json)

| Category | Current | Version |
|----------|---------|---------|
| Framework | Laravel | ^12.0 |
| Auth | laravel/sanctum | ^4.0 |
| Realtime | laravel/reverb | ^1.7 |
| API docs | darkaonline/l5-swagger | ^9.0 |
| Validation | Laravel Form Requests | built-in |
| Audit / Activity log | None | — |
| Error tracking | None | — |

---

## 2. Proposed Additions & Implementation

### 2.1 Validation

**Backend:** Keep Laravel Form Requests as the source of truth for API validation. Optionally add **Zod-like** schema export for contract consistency (e.g. shared TypeScript types from OpenAPI/Swagger).

**Frontend:**

- **Zod** — Schema validation for API response shapes, shared types, and pre-submit form payloads (single source of truth for shape + validation).
- **Vuelidate** (or **VeeValidate** with Zod) — Form-level validation and error display; keep all Spanish error messages in i18n or component copy.

**Implementation outline:**

- Add `zod` to the client. Define schemas per form (login, register, address, checkout, menu item, etc.). Validate before calling API; optionally validate API responses.
- Add `vuelidate` (or `@vee-validate/zod` + `vee-validate`) for reactive form validation and `$v` / error bindings. Do not change existing Spanish strings; map Zod/Vuelidate errors to existing or new Spanish messages.

**New dependencies (client):**

```json
"zod": "^3.23.0",
"vuelidate": "^0.7.0",
"@vuelidate/validators": "^2.0.0"
```

Alternative (VeeValidate + Zod):

```json
"zod": "^3.23.0",
"vee-validate": "^4.14.0",
"@vee-validate/zod": "^4.14.0"
```

---

### 2.2 Real-Time: Laravel Echo + Pusher / Soketi

**Current state:** `laravel-echo` and `pusher-js` are present. `src/features/delivery/services/echo.ts` configures Reverb (Pusher protocol). Auth uses `localStorage.getItem('token')`; should use session or inject token from auth store. Backend has `OrderCreated` and `OrderStatusUpdated` (ShouldBroadcast); default broadcaster is `null` in env.

**Proposal:**

- **Backend:** Set `BROADCAST_CONNECTION=reverb` (or `pusher` for Pusher Cloud). Run Reverb (or Soketi for self-hosted Pusher-compatible server). Add private/presence channels and events for: order status updates, driver location (throttled), admin notifications. Authorize channels in `routes/channels.php`.
- **Frontend:** Keep Laravel Echo + Pusher (Reverb/Soketi use Pusher protocol). Refactor `echo.ts` to accept auth (session cookie or token from Pinia). Subscribe to:
  - `restaurant.{id}.orders` — OrderCreated, OrderStatusUpdated (owner dashboard).
  - `delivery.driver.{id}` or `order.{id}.tracking` — driver location / status (customer tracking, admin map).
  - `admin.notifications` — admin alerts (optional).
- **Soketi:** Use when self-hosting instead of Reverb; same Pusher protocol, same client config with different `wsHost`/`wsPort`.

**Implementation:** See code examples in this doc (Laravel Echo setup). No new frontend deps; ensure Reverb (or Soketi) is in backend `.env` and started in dev/prod.

---

### 2.3 Observability

**Sentry (error tracking):**

- **Backend:** `sentry/sentry-laravel`. Register in `AppServiceProvider` or `bootstrap/app.php`. Set `SENTRY_DSN` in env. Optionally add user context (id, role; no PII).
- **Frontend:** `@sentry/vue`. Init in `main.ts` with `VITE_SENTRY_DSN`. Attach user id/role; no tokens or sensitive data in breadcrumbs.

**Spatie Activity Log (audit trails):**

- **Backend:** `spatie/laravel-activitylog`. Log model events (e.g. Order status change, MenuItem update, critical settings). Use `activity()->causedBy($user)->performedOn($model)->withProperties([...])->log('description')`. Expose “last N log entries” via an admin-only API for the Error Logger / Activity view.

**New dependencies:**

- composer: `sentry/sentry-laravel`, `spatie/laravel-activitylog`
- client: `@sentry/vue`

---

### 2.4 Data Fetching: TanStack Query (Vue Query)

**Current state:** Components and services call axios directly; loading/error state is manual; no shared cache or refetch-on-focus.

**Proposal:** Add `@tanstack/vue-query`. Wrap the app with `VueQueryPlugin`. Replace raw axios in key flows with `useQuery` / `useMutation` (still using the existing axios instance). Preserve existing API shapes and Spanish UI; only change how and where HTTP is invoked.

**Benefits:** Auto-caching, loading/error states, refetch on window focus, retries, and a single place to invalidate (e.g. after order placement or status update).

**New dependency (client):**

```json
"@tanstack/vue-query": "^5.60.0"
```

**Implementation outline:**

- Create a small `queryClient` and install the plugin in `main.ts`.
- Migrate one module at a time (e.g. owner orders: `useQuery(['owner', 'orders', filters], () => fetchOrders(filters))`; update status: `useMutation(updateOrderStatus, { onSuccess: () => queryClient.invalidateQueries(['owner', 'orders']) })`).
- Keep existing services; call them from query/mutation functions so logic is not duplicated.

---

## 3. Dependency Summary Table

| Area | Package | Where | Purpose |
|------|---------|--------|---------|
| Validation | zod | Client | Schemas + validation for forms and API contracts |
| Validation | vuelidate or vee-validate + @vee-validate/zod | Client | Reactive form validation and errors (Spanish messages unchanged) |
| Real-time | laravel-echo, pusher-js | Client (existing) | Reverb/Soketi/Pusher; refactor auth in echo.ts |
| Real-time | laravel/reverb | Server (existing) | WebSocket server (or use Soketi) |
| Observability | @sentry/vue | Client | Frontend error tracking |
| Observability | sentry/sentry-laravel | Server | Backend error tracking |
| Observability | spatie/laravel-activitylog | Server | Audit trail (who changed what) |
| Data fetching | @tanstack/vue-query | Client | Caching, loading states, mutations |

---

## 4. Implementation Order

1. **Zod + form validation** — Add Zod; add Vuelidate or VeeValidate; migrate login/register and one other form; keep Spanish strings.
2. **Laravel Echo** — Fix auth in `echo.ts`; set `BROADCAST_CONNECTION`; subscribe to `restaurant.{id}.orders` in owner dashboard; replace polling where appropriate.
3. **Vue Query** — Install plugin; migrate owner orders and stats; then delivery and customer flows.
4. **Sentry** — Backend then frontend; configure DSN and user context.
5. **Spatie Activity Log** — Install; log order and key model changes; add admin API for “last N” and wire to Error Logger / Activity view.

---

## 5. Code Examples: Zod Validation

### 5.1 Install

```bash
npm install zod
# Optional: npm install vuelidate @vuelidate/validators
# Or: npm install vee-validate @vee-validate/zod
```

### 5.2 Login schema and shared API user type

```typescript
// src/app/schemas/auth.schema.ts
import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email requerido').email('Correo no válido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'owner', 'delivery', 'admin']),
});

export type LoginResponse = z.object({
  user: userSchema,
  // token: optional when using session; keep for backward compat if needed
});

export function validateLogin(data: unknown): LoginInput {
  return loginSchema.parse(data);
}

export function validateLoginSafe(data: unknown): z.SafeParseReturnType<LoginInput, LoginInput> {
  return loginSchema.safeParse(data);
}
```

### 5.3 LoginForm.vue — use Zod before submit (Spanish UI unchanged)

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { validateLoginSafe } from '@/app/schemas/auth.schema';

const loginForm = ref({ email: '', password: '' });
const errors = ref<Record<string, string>>({});

function handleLogin() {
  errors.value = {};
  const result = validateLoginSafe(loginForm.value);
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.flatten().fieldErrors?.forEach((msgs, key) => {
      if (msgs?.[0]) fieldErrors[key] = msgs[0];
    });
    errors.value = fieldErrors;
    return;
  }
  // proceed with login(result.data)
}
</script>
```

Use existing Spanish labels; only bind `errors.email` / `errors.password` under the inputs. No change to copy.

---

## 6. Code Examples: Laravel Echo Setup

### 6.1 Echo factory with auth from store (session or token)

Frontend uses session cookie or Bearer token. Inject auth so Echo can send credentials to `broadcasting/auth`.

```typescript
// src/app/lib/echo.ts
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

window.Pusher = Pusher;

export type EchoAuthProvider = () => Promise<{ token?: string; cookie?: boolean }>;

export function createEcho(getAuth: EchoAuthProvider) {
  return new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? '127.0.0.1',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
    forceTLS: import.meta.env.PROD ? true : false,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_URL?.replace(/\/api\/?.*$/, '')}/broadcasting/auth`,
    auth: {
      headers: async () => {
        const auth = await getAuth();
        const headers: Record<string, string> = { Accept: 'application/json' };
        if (auth.token) headers.Authorization = `Bearer ${auth.token}`;
        return headers;
      },
    },
  });
}
```

### 6.2 Bootstrap Echo in app (e.g. main.ts or a composable)

```typescript
// Example: get auth from Pinia auth store (or cookie for session)
import { createEcho } from '@/app/lib/echo';
import { useAuthStore } from '@/app/store/auth/auth.store';

let echoInstance: ReturnType<typeof createEcho> | null = null;

export function useEcho() {
  if (!echoInstance) {
    const authStore = useAuthStore();
    echoInstance = createEcho(async () => {
      const token = localStorage.getItem('token');
      if (token) return { token };
      return { cookie: true };
    });
  }
  return echoInstance;
}
```

### 6.3 Owner dashboard: subscribe to restaurant orders (real-time)

Replace or complement polling in `DashboardOverview.vue` with Echo.

```typescript
// In DashboardOverview.vue or a composable useOwnerOrdersChannel(restaurantId)
import { useEcho } from '@/app/lib/echo';

export function useOwnerOrdersChannel(restaurantId: Ref<number | null>, onOrderCreated: () => void, onOrderUpdated: (payload: any) => void) {
  const echo = useEcho();

  watch(restaurantId, (id) => {
    if (!id) return;
    const channel = echo.private(`restaurant.${id}.orders`);
    channel.listen('.order.created', onOrderCreated);
    channel.listen('.order.status.updated', onOrderUpdated);
    return () => {
      channel.stopListening('.order.created');
      channel.stopListening('.order.status.updated');
      echo.leave(`restaurant.${id}.orders`);
    };
  }, { immediate: true });
}
```

Backend: ensure `OrderCreated` and `OrderStatusUpdated` broadcast on `restaurant.{id}.orders`; authorize in `routes/channels.php`:

```php
Broadcast::channel('restaurant.{restaurantId}.orders', function ($user, $restaurantId) {
    return $user->restaurants()->where('id', $restaurantId)->exists();
});
```

### 6.4 Backend: broadcast driver and Reverb

- `.env`: `BROADCAST_CONNECTION=reverb`, `REVERB_APP_ID`, `REVERB_APP_KEY`, `REVERB_APP_SECRET`, `REVERB_HOST`, `REVERB_PORT`.
- Run: `php artisan reverb:start` (or Soketi). Frontend `VITE_REVERB_*` must match.

**Adoptable files added in repo:**

- `kechow-client/src/app/schemas/auth.schema.ts` — Zod login schema and `validateLoginSafe` (requires `zod` in package.json; added).
- `kechow-client/src/app/lib/echo.ts` — `createEcho(getAuth)` factory for shared Echo instance with async auth (token from store or cookie). Existing `features/delivery/services/echo.ts` can later be refactored to use this factory.

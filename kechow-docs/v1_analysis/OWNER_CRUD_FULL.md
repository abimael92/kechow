# Owner CRUD – Full Documentation

Complete reference for the **Owner management** API (admin-only CRUD): branch and file structure, routes, requests, resources, policies, seeders with Spanish example data, test cases, and frontend integration notes. Ready for final merge into `main`.

---

## 1. Branch and File Structure

### 1.1 Repository layout (relevant to Owner CRUD)

```
kechow-main/
├── Docs/
│   ├── OWNER_CRUD_FULL.md          ← This document
│   ├── OWNER_MANAGEMENT_ROUTES.md
│   ├── OWNER_POLICY_RULES.md
│   ├── OWNER_RESOURCE_SCHEMA.md
│   ├── OWNER_SEEDERS_AND_RESPONSES.md
│   ├── OWNER_TEST_COVERAGE.md
│   └── VALIDATION_OWNER.md
├── kechow-server/
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   └── Controller.php              # Base controller (AuthorizesRequests, extends Routing\Controller)
│   │   │   └── Middleware/
│   │   │       └── CheckRole.php               # role:admin (and others)
│   │   ├── Models/
│   │   │   └── User.php                        # role, phone, address, restaurants(), SoftDeletes
│   │   ├── Modules/
│   │   │   └── Owner/
│   │   │       ├── Controllers/
│   │   │       │   ├── OwnerController.php     # Placeholder (owner-scoped actions)
│   │   │       │   └── OwnerManagementController.php  # Admin CRUD: index, show, store, update, destroy
│   │   │       ├── Policies/
│   │   │       │   ├── OwnerPolicy.php        # viewAny, view, create, update, delete (admin only)
│   │   │       │   └── RestaurantPolicy.php   # Owner-scoped restaurant actions
│   │   │       ├── Requests/
│   │   │       │   ├── StoreOwnerRequest.php
│   │   │       │   └── UpdateOwnerRequest.php
│   │   │       ├── Resources/
│   │   │       │   └── OwnerResource.php
│   │   │       └── routes.php                  # /owners under api, auth:sanctum + role:admin
│   │   └── Providers/
│   │       ├── AuthServiceProvider.php        # User => OwnerPolicy
│   │       └── RouteServiceProvider.php       # api prefix, Route::bind('owner', ...)
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 0001_01_01_000000_create_users_table.php
│   │   │   ├── 2025_01_28_000000_add_soft_deletes_to_users_table.php
│   │   │   ├── 2025_08_14_063412_add_role_to_users_table.php
│   │   │   ├── 2025_11_12_015533_add_location_to_users_table.php  # phone, address, lat, lng
│   │   │   └── 2025_05_30_070246_create_restaurants_table.php     # owner_id, etc.
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php              # Calls OwnerSeeder
│   │       └── OwnerSeeder.php                 # 3 owners + Spanish restaurants
│   ├── routes/
│   │   └── api.php                            # require Owner/routes.php
│   └── tests/
│       └── Feature/
│           └── OwnerCrudTest.php               # 30 tests, OwnerResource assertions
```

### 1.2 Owner module files (summary)

| Path | Purpose |
|------|--------|
| `app/Modules/Owner/Controllers/OwnerManagementController.php` | Admin CRUD: index, show, store, update, destroy; `authorizeResource(User::class, 'owner')`. |
| `app/Modules/Owner/Policies/OwnerPolicy.php` | viewAny, view, create, update, delete → admin only; view/update/delete require target `role === 'owner'`. |
| `app/Modules/Owner/Requests/StoreOwnerRequest.php` | Validation + authorize (admin) for POST /owners. |
| `app/Modules/Owner/Requests/UpdateOwnerRequest.php` | Validation + authorize (admin) for PUT/PATCH /owners/{owner}. |
| `app/Modules/Owner/Resources/OwnerResource.php` | JSON: id, name, email, phone, address, restaurants[], created_at, updated_at, deleted_at (when present). No password. |
| `app/Modules/Owner/routes.php` | Prefix `owners`, middleware `auth:sanctum`, `role:admin`; GET/POST/PUT|PATCH/DELETE. |

---

## 2. Routes, Requests, Resources, Policies

### 2.1 API routes (base URL: `/api`)

All owner management routes are **admin-only** and require a valid **Sanctum** token.

| Method | URI | Controller method | Description |
|--------|-----|-------------------|-------------|
| `GET` | `/api/owners` | `index` | List all owners (users with `role = owner`). Optional: `?with_trashed=1` to include soft-deleted. |
| `GET` | `/api/owners/{owner}` | `show` | Show one owner by ID with `restaurants` (route binding: only owner users). |
| `POST` | `/api/owners` | `store` | Create a new owner (user with role owner). |
| `PUT` / `PATCH` | `/api/owners/{owner}` | `update` | Update owner; partial payload allowed. |
| `DELETE` | `/api/owners/{owner}` | `destroy` | Soft delete owner. |

- **Middleware:** `auth:sanctum`, `role:admin` (applied to the whole `owners` prefix).
- **Route model binding:** `{owner}` is resolved by `RouteServiceProvider`: `User::where('role', 'owner')->findOrFail($value)`. Requesting a non-owner user ID returns **404**.

### 2.2 Requests (validation and authorization)

**StoreOwnerRequest (POST /api/owners)**

- **Authorization:** `$this->user()->role === 'admin'`.
- **Rules:**  
  `name` required, string, max 255;  
  `email` required, email, unique in `users`;  
  `password` required, confirmed, min 8, letters, numbers, mixed case;  
  `role` required, `in:owner`;  
  `phone`, `address`, `latitude`, `longitude` optional (nullable, with max/bounds).

**UpdateOwnerRequest (PUT/PATCH /api/owners/{owner})**

- **Authorization:** `$this->user()->role === 'admin'`.
- **Rules:** All fields optional (`sometimes` or `nullable`).  
  `email` unique in `users` ignoring current owner (`$this->route('owner')`);  
  `password` optional but, if present, same strength + confirmed;  
  `role` when present must be `owner`.

### 2.3 Resources (JSON shape for frontend)

**OwnerResource** (single or collection item)

- **Always:** `id`, `name`, `email`, `phone`, `address`, `restaurants`, `created_at`, `updated_at`.
- **When loaded and not null:** `deleted_at`.
- **Never:** `password`, `remember_token`, or other sensitive fields.

**RestaurantResource** (each item in `data.restaurants`)

- `id`, `name`, `description`, `address`, `city`, `state`, `zip_code`, `phone`, `email`, `website`, `opening_time`, `closing_time`, `logo_url`, `is_active`, `is_open`, `latitude`, `longitude`, `delivery_radius`, `created_at`, `updated_at`; optionally `owner`, `menu_items` when loaded.

**List response (GET /api/owners)**

```json
{
  "data": [ { /* OwnerResource */ }, ... ],
  "meta": { "total": 3 }
}
```

**Single owner (GET/POST/PUT/PATCH)**

```json
{
  "data": { /* OwnerResource with restaurants */ }
}
```

**Delete (DELETE)**

```json
{
  "message": "Owner soft deleted."
}
```

### 2.4 Policies

**OwnerPolicy** (registered in `AuthServiceProvider`: `User::class => OwnerPolicy::class`)

- **viewAny:** `$user->role === 'admin'`.
- **view:** `$user->role === 'admin' && $owner->role === 'owner'`.
- **create:** `$user->role === 'admin'`.
- **update:** `$user->role === 'admin' && $owner->role === 'owner'`.
- **delete:** `$user->role === 'admin' && $owner->role === 'owner'`.

Controller uses `$this->authorizeResource(User::class, 'owner')` so Laravel runs the policy for each action. Non-admins get **403**; targeting a non-owner user ID yields **404** (binding) or **403** (policy).

---

## 3. Seeder Examples (Spanish Data)

### 3.1 OwnerSeeder

- **Class:** `Database\Seeders\OwnerSeeder`.
- **Run:** `php artisan db:seed` (after migrations) or `php artisan db:seed --class=OwnerSeeder`.
- **Password for all seeded owners:** `123456` (stored as `Hash::make('123456')`).

### 3.2 Seeded owners and restaurants (Spanish)

| Owner | Email | Phone | Address |
|-------|--------|--------|---------|
| Carmen López García | carmen.lopez@example.com | +34 912 345 678 | Calle Gran Vía 42, 28013 Madrid |
| Antonio Martínez Ruiz | antonio.martinez@example.com | +34 934 567 890 | Passeig de Gràcia 92, 08008 Barcelona |
| Elena Fernández Sánchez | elena.fernandez@example.com | +34 958 123 456 | Carrera del Darro 31, 18010 Granada |

**Restaurants (examples):**

- **Carmen:** La Taberna de Carmen (Madrid), El Rincón de Carmen (Plaza Mayor 8, Madrid).
- **Antonio:** Casa Antonio (Barcelona).
- **Elena:** La Alhambra Restaurante, Tetería Elena (Granada).

### 3.3 Example list response (after seeding)

```json
{
  "data": [
    {
      "id": 2,
      "name": "Carmen López García",
      "email": "carmen.lopez@example.com",
      "phone": "+34 912 345 678",
      "address": "Calle Gran Vía 42, 28013 Madrid",
      "restaurants": [
        {
          "id": 1,
          "name": "La Taberna de Carmen",
          "description": "Cocina tradicional española y tapas en el centro de Madrid.",
          "address": "Calle Gran Vía 42",
          "city": "Madrid",
          "state": "Madrid",
          "zip_code": "28013",
          "phone": "+34 912 345 678",
          "email": "info@latabernadecarmen.es",
          "website": "https://latabernadecarmen.example.com",
          "opening_time": "12:00:00",
          "closing_time": "00:00:00",
          "logo_url": null,
          "is_active": true,
          "is_open": false,
          "latitude": null,
          "longitude": null,
          "delivery_radius": null,
          "created_at": "2025-01-28T12:00:00.000000Z",
          "updated_at": "2025-01-28T12:00:00.000000Z"
        }
      ],
      "created_at": "2025-01-28T12:00:00.000000Z",
      "updated_at": "2025-01-28T12:00:00.000000Z"
    }
  ],
  "meta": { "total": 3 }
}
```

---

## 4. Test Cases

### 4.1 Test suite

- **File:** `kechow-server/tests/Feature/OwnerCrudTest.php`.
- **Run:** `php artisan test tests/Feature/OwnerCrudTest.php` (from `kechow-server`).
- **DB:** In-memory SQLite, `RefreshDatabase`; Sanctum for auth.

### 4.2 Coverage summary (30 tests)

| Category | Count | What is tested |
|----------|-------|----------------|
| List owners | 3 | Admin 200 + OwnerResource structure; with_trashed; default excludes soft-deleted |
| Show owner | 3 | Admin 200 + owner with restaurants; 404 invalid ID; 404 customer ID (binding) |
| Create owner | 3 | Admin 201 + OwnerResource; 422 validation; 422 duplicate email |
| Update owner | 4 | Admin 200 PUT/PATCH + updated resource; 422 invalid email; 404 invalid ID |
| Delete owner | 2 | Admin 200 + soft delete; 404 invalid ID |
| Unauthorized (non-admin) | 10 | Owner and customer get 403 on list, show, create, update, delete |
| Unauthenticated | 5 | No token → 401 on all five actions |

### 4.3 Assertions

- Success responses use **OwnerResource** shape: `data` (and `meta.total` for list), no `password` in response.
- Failure: **401** (no token), **403** (non-admin), **404** (invalid or non-owner ID), **422** (validation).

---

## 5. Frontend Integration

### 5.1 Base URL and auth

- **Base URL:** `{API_BASE}/api` (e.g. `https://api.kechow.example.com/api`).
- **Auth:** Send a valid **Sanctum** token for an **admin** user in the `Authorization` header:  
  `Authorization: Bearer {token}`.
- **Content-Type:** `application/json` for request bodies.

### 5.2 Endpoints for UI

| Action | Method | URL | Body (optional) |
|--------|--------|-----|------------------|
| List owners | `GET` | `/api/owners` | — |
| List including deleted | `GET` | `/api/owners?with_trashed=1` | — |
| Show owner | `GET` | `/api/owners/{id}` | — |
| Create owner | `POST` | `/api/owners` | See §5.3 |
| Update owner | `PUT` or `PATCH` | `/api/owners/{id}` | See §5.4 |
| Delete owner | `DELETE` | `/api/owners/{id}` | — |

### 5.3 Create owner (POST) – example body

```json
{
  "name": "Carmen López",
  "email": "carmen@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "role": "owner",
  "phone": "+34 912 345 678",
  "address": "Calle Gran Vía 42, Madrid"
}
```

- **Required:** `name`, `email`, `password`, `password_confirmation`, `role` (must be `"owner"`).
- **Optional:** `phone`, `address`, `latitude`, `longitude`.
- **Password:** Min 8 chars, letters, numbers, mixed case.

### 5.4 Update owner (PUT/PATCH) – example body

```json
{
  "name": "Carmen López García",
  "phone": "+34 912 999 888",
  "address": "Nueva dirección, Madrid"
}
```

- All fields optional; only send fields to change.  
- To change password: include `password` and `password_confirmation` (same rules as create).

### 5.5 Response handling

- **200:** Success (list, show, update, delete).
- **201:** Created (POST).
- **401:** Missing or invalid token → redirect to login / refresh token.
- **403:** Not admin → show “No autorizado” or hide owner-management UI.
- **404:** Owner not found or ID is not an owner → show “Propietario no encontrado”.
- **422:** Validation errors → use `response.data.errors` (e.g. `errors.email`, `errors.password`) for inline messages.
- **500:** Server error → show generic error message.

### 5.6 TypeScript-friendly response types (example)

```ts
interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  restaurants: Restaurant[];
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

interface OwnersListResponse {
  data: Owner[];
  meta: { total: number };
}

interface OwnerSingleResponse {
  data: Owner;
}
```

---

## 6. Merge Checklist (main)

- [ ] All Owner CRUD feature tests pass: `php artisan test tests/Feature/OwnerCrudTest.php`.
- [ ] Migrations run clean: `php artisan migrate` (including `add_location_to_users_table`, `add_soft_deletes_to_users_table`, `add_role_to_users_table`).
- [ ] Seeder runs: `php artisan db:seed --class=OwnerSeeder` (or full seed); confirm 3 owners + Spanish restaurants.
- [ ] API returns OwnerResource shape (no `password`); list has `data` + `meta.total`.
- [ ] Only admin can access `/api/owners/*`; owner/customer get 403; unauthenticated get 401.
- [ ] Route binding: requesting customer/delivery user ID on `/api/owners/{id}` returns 404.
- [ ] Docs: OWNER_CRUD_FULL.md (this file) and linked docs (OWNER_MANAGEMENT_ROUTES, OWNER_POLICY_RULES, OWNER_SEEDERS_AND_RESPONSES, OWNER_TEST_COVERAGE, VALIDATION_OWNER) are up to date and referenced where needed.

---

## 7. Related documentation

| Document | Content |
|----------|---------|
| [OWNER_MANAGEMENT_ROUTES.md](OWNER_MANAGEMENT_ROUTES.md) | Route definitions, query/body params, example responses. |
| [OWNER_POLICY_RULES.md](OWNER_POLICY_RULES.md) | Policy rules and integration. |
| [OWNER_RESOURCE_SCHEMA.md](OWNER_RESOURCE_SCHEMA.md) | OwnerResource and RestaurantResource schema. |
| [OWNER_SEEDERS_AND_RESPONSES.md](OWNER_SEEDERS_AND_RESPONSES.md) | OwnerSeeder, Spanish data, example JSON. |
| [OWNER_TEST_COVERAGE.md](OWNER_TEST_COVERAGE.md) | Test cases and assertions. |
| [VALIDATION_OWNER.md](VALIDATION_OWNER.md) | StoreOwnerRequest and UpdateOwnerRequest validation rules. |

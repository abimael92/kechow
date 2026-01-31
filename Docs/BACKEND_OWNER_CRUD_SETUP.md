# Backend Owner CRUD – Branch Setup

**Branch:** `feat/backend-owner-crud`  
**Purpose:** Prepare backend folder structure for Owner features (CRUD, policies). User and Restaurant models updated with owner relations and fillable documented; no migrations changed; no live data or active routes added.

---

## 1. Branch

- Created from: `main`
- Name: `feat/backend-owner-crud`
- Existing migrations and models are **unchanged**.

---

## 2. Backend Folder Structure (kechow-server)

Owner features live under a dedicated module, aligned with existing `Auth`, `Order`, and `Restaurant` modules.

```
kechow-server/app/Modules/Owner/
├── Controllers/
│   └── OwnerController.php    # Stub controller for owner-scoped actions
├── Requests/
│   └── .gitkeep               # Placeholder for FormRequests (e.g. StoreRestaurant, UpdateRestaurant)
├── Resources/
│   └── .gitkeep               # Placeholder for API resources (e.g. OwnerRestaurantResource)
├── Policies/
│   └── RestaurantPolicy.php   # Policy: owner can only act on own restaurants
└── routes.php                 # Empty route file; no active routes yet
```

### 2.1 Controllers

- **Path:** `app/Modules/Owner/Controllers/`
- **OwnerController.php:** Stub controller. Owner-specific actions (dashboard, “my restaurants”, settings) will be added here. Does **not** replace `RestaurantController`; it complements it with owner-scoped endpoints.

### 2.2 Requests

- **Path:** `app/Modules/Owner/Requests/`
- **Content:** `.gitkeep` only. Form requests for owner CRUD (e.g. create/update restaurant, settings) will go here when implemented.

### 2.3 Resources

- **Path:** `app/Modules/Owner/Resources/`
- **Content:** `.gitkeep` only. API resources for owner responses (e.g. owner dashboard, restaurant list) will go here when implemented.

### 2.4 Policies

- **Path:** `app/Modules/Owner/Policies/`
- **RestaurantPolicy.php:** Policy for owner actions on `Restaurant`:
  - `viewAny(User)`: owner or admin
  - `view(User, Restaurant)`: owner of restaurant or admin
  - `create(User)`: owner or admin
  - `update(User, Restaurant)`: owner of restaurant or admin
  - `delete(User, Restaurant)`: owner of restaurant or admin  
- **Registration:** Policy is **not** registered in `AuthServiceProvider` yet. Register when enabling owner CRUD authorization.

### 2.5 Routes

- **Path:** `app/Modules/Owner/routes.php`
- **Content:** RESTful owner management (admin only): `GET/POST/PUT/PATCH/DELETE /api/owners` and `/api/owners/{id}`. Loaded from `routes/api.php`.
- **Middleware:** `auth:sanctum`, `role:admin`. See **Docs/OWNER_MANAGEMENT_ROUTES.md** for full route list and expected responses.

---

## 3. Model Relations & Fillable (Owner CRUD)

### 3.1 User model (`App\Models\User`)

- **Relation added:** `restaurants()` — `hasMany(Restaurant::class, 'owner_id')`. Use when the user is an owner (or admin) to load their restaurants. Inverse of `Restaurant::owner()`.
- **Fillable (unchanged):** `name`, `email`, `password`, `role`, `phone`, `address`, `latitude`, `longitude`. Suitable for owner profile CRUD; no extra fields required for restaurant ownership.

### 3.2 Restaurant model (`App\Modules\Restaurant\Models\Restaurant`)

- **Relation (inverse):** `owner()` — `belongsTo(User::class, 'owner_id')`. Docblock added to state it is the inverse of `User::restaurants()`.
- **Fillable (unchanged):** `name`, `description`, `address`, `city`, `state`, `zip_code`, `phone`, `email`, `website`, `opening_time`, `closing_time`, `logo_url`, `is_active`, `latitude`, `longitude`, `delivery_radius`, `owner_id`. All fields needed for owner CRUD; set `owner_id` from authenticated user on create (do not mass-assign from client).

### 3.3 Relationship summary

| From   | To         | Relation   | Foreign key |
|--------|------------|------------|-------------|
| User   | Restaurant | hasMany    | `owner_id`  |
| Restaurant | User    | belongsTo  | `owner_id`  |

Usage example:

```php
// Owner's restaurants
$restaurants = $request->user()->restaurants;

// Restaurant's owner
$owner = $restaurant->owner;
```

---

## 4. What Was Not Changed

- **Migrations:** None added or modified.
- **Models:** `MenuItem`, `Order`, `OrderItem` unchanged.
- **Existing modules:** `Auth`, `Order`, `Restaurant` (only Restaurant model docblock/relation comment added).
- **routes/api.php:** Not modified; no new endpoints exposed.
- **AuthServiceProvider:** Policy not registered; no authorization changes.
- **Live data:** No seeders, no DB writes.

---

## 5. Next Steps (When Implementing CRUD)

1. **Register policy** (optional): In `AuthServiceProvider`, map `Restaurant` to `App\Modules\Owner\Policies\RestaurantPolicy`.
2. **Load Owner routes:** In `routes/api.php`, `require app_path('Modules/Owner/routes.php');` and wrap in `auth:sanctum` (and optional prefix).
3. **Add Requests:** e.g. `StoreRestaurantRequest`, `UpdateRestaurantRequest` in `Modules/Owner/Requests/` (or reuse/refactor from `Restaurant` module).
4. **Add Resources:** e.g. `OwnerRestaurantResource` in `Modules/Owner/Resources/` if owner responses differ from public `RestaurantResource`.
5. **Implement controller actions:** In `OwnerController` (or dedicated controllers), add dashboard, “my restaurants”, create/update/delete with policy checks.

---

## 6. File Summary

| File | Purpose |
|------|--------|
| `app/Modules/Owner/Controllers/OwnerController.php` | Stub for owner-scoped controller actions |
| `app/Modules/Owner/Requests/.gitkeep` | Keeps `Requests/` in Git; requests to be added later |
| `app/Modules/Owner/Resources/.gitkeep` | Keeps `Resources/` in Git; resources to be added later |
| `app/Modules/Owner/Policies/RestaurantPolicy.php` | Authorization for owner actions on Restaurant |
| `app/Modules/Owner/routes.php` | Placeholder route file; no active routes |

---

**Document version:** 1.1  
**Branch:** feat/backend-owner-crud  
**Updates (v1.1):** User `restaurants()` relation added; Restaurant `owner()` docblock added; fillable documented for owner CRUD.

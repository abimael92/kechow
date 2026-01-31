# Owner Management API — Behavior & Errors

**Controller:** `App\Modules\Owner\Controllers\OwnerManagementController`  
**Routes:** `GET/POST/PUT/PATCH/DELETE /api/owners` and `/api/owners/{id}`  
**Access:** Admin only (`auth:sanctum`, `role:admin`). FormRequest `authorize()` enforces admin for store/update.

---

## 1. API behavior summary

| Action   | Method   | Path              | Request body      | Success | Transactions | 404 / 403 / 422 / 500 |
|----------|----------|-------------------|--------------------|---------|--------------|------------------------|
| List     | GET      | /api/owners       | —                  | 200     | No           | 401, 403, 500          |
| Show     | GET      | /api/owners/{id} | —                  | 200     | No           | 401, 403, 404, 500     |
| Create   | POST     | /api/owners      | StoreOwnerRequest  | 201     | Yes          | 401, 403, 422, 500     |
| Update   | PUT/PATCH| /api/owners/{id} | UpdateOwnerRequest | 200     | Yes          | 401, 403, 404, 422, 500|
| Delete   | DELETE   | /api/owners/{id} | —                  | 200     | No           | 401, 403, 404, 500     |

- **FormRequest:** Store uses `StoreOwnerRequest`, update uses `UpdateOwnerRequest` (validation + admin authorize).
- **Responses:** All success payloads use `OwnerResource` (see **Docs/OWNER_RESOURCE_SCHEMA.md**).
- **Transactions:** Create and update run inside `DB::transaction()` for relational integrity (e.g. future default restaurant or related writes).

---

## 2. Success responses

- **List (GET /api/owners):** `200` — `{ "data": [ OwnerResource, ... ], "meta": { "total": N } }`.
- **Show (GET /api/owners/{id}):** `200` — `{ "data": OwnerResource }`.
- **Create (POST /api/owners):** `201` — `{ "data": OwnerResource }`.
- **Update (PUT/PATCH /api/owners/{id}):** `200` — `{ "data": OwnerResource }`.
- **Delete (DELETE /api/owners/{id}):** `200` — `{ "message": "Owner soft deleted." }`.

---

## 3. Error responses

### 3.1 401 Unauthorized

- **When:** Missing or invalid `Authorization: Bearer {token}`.
- **Body:** `{ "message": "Unauthenticated." }`.
- **Handled by:** `auth:sanctum` middleware.

### 3.2 403 Forbidden

- **When:** Authenticated user is not admin (e.g. customer, owner, delivery).
- **Body:** `{ "message": "Unauthorized." }`.
- **Handled by:** `role:admin` middleware and/or FormRequest `authorize()` (store/update).

### 3.3 404 Not Found

- **When:**  
  - Show: no user with given `id`, or user exists but is not an owner (e.g. customer/delivery).  
  - Update / Delete: no owner with given `id`.
- **Body:** `{ "message": "Owner not found." }`.
- **Handled by:** Controller catches `ModelNotFoundException` and returns 404 JSON.

### 3.4 422 Unprocessable Entity (validation)

- **When:** Store or update request fails validation (e.g. invalid email, weak password, duplicate email).
- **Body:**  
  `{ "message": "The given data was invalid.", "errors": { "field": [ "Error message." ], ... } }`
- **Handled by:** Laravel FormRequest validation; controller receives only validated data when passed.

### 3.5 500 Internal Server Error

- **When:** Unexpected exception (e.g. DB failure, constraint violation) during list, show, store, update, or delete.
- **Body:** `{ "message": "Error listing owners." }` (or "Error loading owner." / "Error creating owner." / "Error updating owner." / "Error deleting owner.").
- **Handled by:** Controller `catch (Throwable)`; exception is logged, client gets generic message (no stack trace or internal details in response).

---

## 4. Exception handling in the controller

- **ModelNotFoundException:** Caught in `show`, `update`, `destroy`; returns `404` with `{ "message": "Owner not found." }`.
- **Any other Throwable:** Caught in all five actions; logged via `Log::error()`; returns `500` with a generic message.
- **Validation / authorization:** Handled by Laravel (FormRequest and middleware); controller code runs only after validation and auth succeed for store/update.

---

## 5. Transactions

- **store():** Entire create (and future related writes, e.g. default restaurant) runs inside `DB::transaction()`. On failure, everything is rolled back; client receives 500.
- **update():** Owner update runs inside `DB::transaction()`. On failure, rollback; client receives 500.
- **index(), show(), destroy():** No transactions (read or single soft-delete).

---

## 6. Query behavior

- **List:** Only users with `role = 'owner'`. By default excludes soft-deleted; use `?with_trashed=1` to include them. Orders by `name`. Eager-loads `restaurants`.
- **Show / Update / Delete:** Only users with `role = 'owner'`. Non-owners (e.g. customer id) yield 404 "Owner not found."

---

**Document version:** 1.0

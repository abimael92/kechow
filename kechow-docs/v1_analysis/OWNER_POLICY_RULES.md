# Owner Policy Rules

This document describes the **OwnerPolicy** used to authorize owner-management actions. The policy ensures that only **admin** users can list, view, create, update, or delete owner records, and that owners cannot manipulate other roles’ data (e.g. customers, delivery, or other owners).

---

## Overview

- **Policy class:** `App\Modules\Owner\Policies\OwnerPolicy`
- **Model:** `App\Models\User` (owners are users with `role = 'owner'`)
- **Registration:** `AuthServiceProvider`: `User::class => OwnerPolicy::class`
- **Usage:** `OwnerManagementController` uses `$this->authorizeResource(User::class, 'owner')` so each action is authorized before execution.

---

## Rule Summary

| Action   | Method     | Who can do it | Additional check                          |
|----------|------------|---------------|-------------------------------------------|
| List     | `viewAny`  | Admin only    | —                                         |
| View one | `view`     | Admin only    | Target user must have `role === 'owner'`  |
| Create   | `create`   | Admin only    | —                                         |
| Update   | `update`   | Admin only    | Target user must have `role === 'owner'`  |
| Delete   | `delete`   | Admin only    | Target user must have `role === 'owner'`  |

Non-admin users (including owners, customers, delivery) receive **403 Forbidden** when calling any of these actions. Targeting a user that is not an owner (e.g. by ID of a customer) also results in **403** for view/update/delete, because the route binding resolves only owner users and the policy denies non-owner targets.

---

## Method Rules

### `viewAny(User $user): bool`

- **Used for:** `GET /owners` (index).
- **Rule:** `$user->role === 'admin'`.
- **Effect:** Only admins can list owners. Owners and other roles get 403.

### `view(User $user, User $owner): bool`

- **Used for:** `GET /owners/{owner}` (show).
- **Rule:** `$user->role === 'admin'` **and** `$owner->role === 'owner'`.
- **Effect:** Only admins can view an owner; the target must be an owner (prevents viewing other roles’ data).

### `create(User $user): bool`

- **Used for:** `POST /owners` (store).
- **Rule:** `$user->role === 'admin'`.
- **Effect:** Only admins can create new owner users.

### `update(User $user, User $owner): bool`

- **Used for:** `PUT/PATCH /owners/{owner}` (update).
- **Rule:** `$user->role === 'admin'` **and** `$owner->role === 'owner'`.
- **Effect:** Only admins can update an owner; the target must be an owner (prevents updating other roles’ data).

### `delete(User $user, User $owner): bool`

- **Used for:** `DELETE /owners/{owner}` (destroy).
- **Rule:** `$user->role === 'admin'` **and** `$owner->role === 'owner'`.
- **Effect:** Only admins can soft-delete an owner; the target must be an owner (prevents deleting other roles’ data).

---

## Integration

1. **Routes**  
   Owner routes use the `{owner}` parameter and middleware `auth:sanctum`, `role:admin`. Route model binding (`RouteServiceProvider`) resolves `{owner}` to `User::where('role', 'owner')->findOrFail($value)`, so 404 is returned when the ID is not an owner.

2. **Controller**  
   `OwnerManagementController` calls `$this->authorizeResource(User::class, 'owner')` in its constructor. Laravel maps:
   - `index` → `viewAny`
   - `show` → `view` (with bound `User $owner`)
   - `store` → `create`
   - `update` → `update` (with bound `User $owner`)
   - `destroy` → `delete` (with bound `User $owner`)

3. **Form requests**  
   `StoreOwnerRequest` and `UpdateOwnerRequest` still enforce admin in `authorize()`. Policy and form requests together ensure admin-only access and that only owner users are manipulated.

---

## Related docs

- **Routes and responses:** [OWNER_MANAGEMENT_ROUTES.md](OWNER_MANAGEMENT_ROUTES.md)
- **Validation:** [VALIDATION_OWNER.md](VALIDATION_OWNER.md)
- **API behavior and errors:** [OWNER_API_BEHAVIOR_AND_ERRORS.md](OWNER_API_BEHAVIOR_AND_ERRORS.md)

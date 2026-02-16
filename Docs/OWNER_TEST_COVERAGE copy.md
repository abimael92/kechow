# Owner CRUD Test Coverage

This document describes the PHPUnit feature tests for the Owner management API (admin-only CRUD). Tests live in `kechow-server/tests/Feature/OwnerCrudTest.php` and assert success/failure cases, JSON shape matching **OwnerResource**, and unauthorized access by non-admins.

---

## Test Suite Overview

| Area | Tests | Purpose |
|------|-------|--------|
| **List owners** | 3 | Admin list, with_trashed, without trashed; JSON structure |
| **Show owner** | 3 | Admin show with restaurants, 404 invalid/customer ID; JSON structure |
| **Create owner** | 3 | Admin create 201, validation 422, duplicate email 422; JSON structure |
| **Update owner** | 4 | Admin PUT/PATCH 200, validation 422, 404; JSON structure |
| **Delete owner** | 2 | Admin delete 200 + soft delete, 404 |
| **Unauthorized (non-admin)** | 10 | Owner role and customer role get 403 on list/show/create/update/delete |
| **Unauthenticated** | 5 | No token returns 401 on all actions |
| **Total** | **30** | All passing with 107+ assertions |

**Run:** `php artisan test tests/Feature/OwnerCrudTest.php` (from `kechow-server`).

---

## JSON Response Assertions (OwnerResource)

Tests assert that successful responses match the **OwnerResource** shape and never expose sensitive data.

### List response (`GET /api/owners`)

- **Structure:** `data` (array of owner objects), `meta.total` (integer).
- **Each owner in `data`:** `id`, `name`, `email`, `phone`, `address`, `restaurants`, `created_at`, `updated_at`.
- **Never in response:** `password`, `remember_token`, or other sensitive fields.
- **Restaurants:** Each item has full restaurant fields (id, name, description, address, city, state, zip_code, phone, email, website, opening_time, closing_time, logo_url, is_active, is_open, latitude, longitude, delivery_radius, created_at, updated_at) as per **RestaurantResource**.

### Single owner response (`GET /api/owners/{id}`, `POST`, `PUT`/`PATCH`)

- **Structure:** `data` (single owner object) with same keys as above.
- **Assertions:** `assertOwnerResourceStructure($response, false)` checks `data.id`, `data.name`, `data.email`, `data.phone`, `data.address`, `data.restaurants`, `data.created_at`, `data.updated_at` and `assertJsonMissingPath('data.password')`.

---

## Test Cases by Category

### List owners (success)

| Test | Auth | Assertions |
|------|------|------------|
| `test_list_owners_as_admin_returns_success_and_owner_resource_structure` | Admin (Sanctum) | 200, `data` + `meta.total`, OwnerResource structure, no password |
| `test_list_owners_with_trashed_includes_soft_deleted` | Admin | 200, `meta.total` 1, `data.0.deleted_at` present |
| `test_list_owners_without_trashed_excludes_soft_deleted` | Admin | 200, `meta.total` 0 after soft-deleting only owner |

### Show owner (success / failure)

| Test | Auth | Assertions |
|------|------|------------|
| `test_show_owner_as_admin_returns_owner_with_restaurants_and_resource_structure` | Admin | 200, OwnerResource structure, `data.restaurants.0.id` and name match seeded restaurant |
| `test_show_owner_with_invalid_id_returns_404` | Admin | 404 for non-existent ID |
| `test_show_owner_with_customer_id_returns_404` | Admin | 404 (route binding resolves only users with role owner) |

### Create owner (success / failure)

| Test | Auth | Assertions |
|------|------|------------|
| `test_create_owner_as_admin_returns_201_and_owner_resource` | Admin | 201, OwnerResource structure, `data.name`/email/phone match payload, `data.restaurants` empty, DB has user with role owner |
| `test_create_owner_with_validation_failure_returns_422` | Admin | 422, validation errors for invalid email and weak password |
| `test_create_owner_with_duplicate_email_returns_422` | Admin | 422, validation error for `email` |

### Update owner (success / failure)

| Test | Auth | Assertions |
|------|------|------------|
| `test_update_owner_as_admin_returns_200_and_updated_owner_resource` | Admin | 200, OwnerResource structure, `data.name`/phone updated, email unchanged, no password in response; DB refreshed |
| `test_update_owner_with_patch_returns_200` | Admin | 200, partial update (e.g. address) |
| `test_update_owner_with_invalid_email_returns_422` | Admin | 422, validation error when email belongs to another owner |
| `test_update_owner_with_invalid_id_returns_404` | Admin | 404 |

### Delete owner (success / failure)

| Test | Auth | Assertions |
|------|------|------------|
| `test_delete_owner_as_admin_returns_200_and_soft_deletes` | Admin | 200, `message` = "Owner soft deleted.", `assertSoftDeleted('users', ['id' => $id])` |
| `test_delete_owner_with_invalid_id_returns_404` | Admin | 404 |

### Unauthorized: non-admin roles

| Test | Auth | Assertions |
|------|------|------------|
| `test_list_owners_as_owner_role_returns_403` | Owner | 403 |
| `test_list_owners_as_customer_returns_403` | Customer | 403 |
| `test_show_owner_as_owner_role_returns_403` | Owner | 403 |
| `test_show_owner_as_customer_returns_403` | Customer | 403 |
| `test_create_owner_as_owner_role_returns_403` | Owner | 403 |
| `test_create_owner_as_customer_returns_403` | Customer | 403 |
| `test_update_owner_as_owner_role_returns_403` | Owner | 403 |
| `test_update_owner_as_customer_returns_403` | Customer | 403 |
| `test_delete_owner_as_owner_role_returns_403` | Owner | 403 |
| `test_delete_owner_as_customer_returns_403` | Customer | 403 |

### Unauthenticated

| Test | Auth | Assertions |
|------|------|------------|
| `test_list_owners_unauthenticated_returns_401` | None | 401 |
| `test_show_owner_unauthenticated_returns_401` | None | 401 |
| `test_create_owner_unauthenticated_returns_401` | None | 401 |
| `test_update_owner_unauthenticated_returns_401` | None | 401 |
| `test_delete_owner_unauthenticated_returns_401` | None | 401 |

---

## Setup and Helpers

- **RefreshDatabase:** Each test runs with a fresh in-memory SQLite DB (phpunit.xml: `DB_CONNECTION=sqlite`, `DB_DATABASE=:memory:`).
- **Users:** `setUp()` creates one user per role: `admin`, `owner`, `customer` via `User::factory()->create(['role' => …])`.
- **Auth:** `Sanctum::actingAs($user)` for authenticated requests; no token for 401 tests.
- **OwnerResource shape:** `assertOwnerResourceStructure($response, $isList)` checks list vs single-owner JSON and `assertJsonMissingPath('data.password')` (and `data.0.password` for list).
- **Valid create payload:** `validOwnerPayload()` returns name, email, password (strong + confirmed), role owner, phone, address.

---

## Related Docs

- [OWNER_MANAGEMENT_ROUTES.md](OWNER_MANAGEMENT_ROUTES.md) – Route definitions and responses
- [OWNER_POLICY_RULES.md](OWNER_POLICY_RULES.md) – Policy rules (admin-only, target must be owner)
- [OWNER_RESOURCE_SCHEMA.md](OWNER_RESOURCE_SCHEMA.md) – OwnerResource and RestaurantResource schema

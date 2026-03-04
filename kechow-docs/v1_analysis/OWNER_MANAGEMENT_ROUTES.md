# Owner Management REST API

**Base URL:** `/api` (e.g. `https://example.com/api`)  
**Access:** Admin only. All routes require `Authorization: Bearer {token}` and user `role === 'admin'`.

**Behavior & errors:** **Docs/OWNER_API_BEHAVIOR_AND_ERRORS.md** (transactions, 404/403/422/500, exception handling).

---

## Route Grouping & Middleware

| Middleware     | Purpose                          |
|----------------|----------------------------------|
| `auth:sanctum` | Require authenticated user       |
| `role:admin`   | Restrict to users with role admin |

**Prefix:** `owners` → full path prefix is `/api/owners`.

---

## Routes Summary

| Method   | Path           | Action   | Description                          |
|----------|----------------|----------|--------------------------------------|
| GET      | /api/owners    | index    | List all owners                      |
| GET      | /api/owners/{id} | show   | Show owner with restaurants          |
| POST     | /api/owners    | store    | Create owner                         |
| PUT/PATCH| /api/owners/{id} | update | Update owner info                    |
| DELETE   | /api/owners/{id} | destroy | Soft delete owner                    |

---

## 1. GET /api/owners — List all owners

**Description:** Returns all users with `role = owner`. Excludes soft-deleted by default.

**Query parameters (optional):**

| Parameter     | Type    | Description                                |
|---------------|---------|--------------------------------------------|
| `with_trashed`| boolean | If `true`, include soft-deleted owners     |

**Response: 200 OK**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Jane Owner",
      "email": "jane@example.com",
      "role": "owner",
      "phone": null,
      "address": null,
      "latitude": null,
      "longitude": null,
      "created_at": "2025-01-28T12:00:00.000000Z",
      "updated_at": "2025-01-28T12:00:00.000000Z",
      "deleted_at": null,
      "restaurants": []
    }
  ],
  "meta": {
    "total": 1
  }
}
```

**Error responses:**

- **401 Unauthorized** — Missing or invalid token  
  `{ "message": "Unauthenticated." }`
- **403 Forbidden** — User is not admin  
  `{ "message": "Unauthorized." }`

---

## 2. GET /api/owners/{id} — Show owner with restaurants

**Description:** Returns a single owner (user with role owner) by id, with `restaurants` relation loaded.

**Response: 200 OK**

```json
{
  "data": {
    "id": 1,
    "name": "Jane Owner",
    "email": "jane@example.com",
    "role": "owner",
    "phone": "+52 123 456 7890",
    "address": "Calle Principal 1",
    "latitude": 28.5,
    "longitude": -106.0,
    "created_at": "2025-01-28T12:00:00.000000Z",
    "updated_at": "2025-01-28T12:00:00.000000Z",
    "deleted_at": null,
    "restaurants": [
      {
        "id": 1,
        "name": "Restaurant One",
        "description": "...",
        "address": "...",
        "city": "...",
        "state": null,
        "zip_code": null,
        "phone": null,
        "email": null,
        "website": null,
        "opening_time": "10:00",
        "closing_time": "22:00",
        "logo_url": null,
        "is_active": true,
        "is_open": true,
        "latitude": null,
        "longitude": null,
        "delivery_radius": null,
        "created_at": "...",
        "updated_at": "..."
      }
    ]
  }
}
```

**Error responses:**

- **401 Unauthorized** — Missing or invalid token  
  `{ "message": "Unauthenticated." }`
- **403 Forbidden** — User is not admin  
  `{ "message": "Unauthorized." }`
- **404 Not Found** — No user with that id, or user is not an owner  
  `{ "message": "No query results for model [App\\Models\\User] {id}." }` (or equivalent)

---

## 3. POST /api/owners — Create owner

**Description:** Creates a new user with `role = owner`.

**Request body (JSON):**  
Full validation rules: **Docs/VALIDATION_OWNER.md**.

| Field               | Type   | Required | Rules / Notes                          |
|---------------------|--------|----------|----------------------------------------|
| name                | string | yes      | max 255                                |
| email               | string | yes      | valid email, unique                    |
| password            | string | yes      | min 8, letters + numbers + mixed case, confirmed |
| password_confirmation | string | yes    | must match password                    |
| role                | string | yes      | must be `"owner"`                       |
| phone               | string | no       | nullable, max 50                       |
| address             | string | no       | nullable, max 500                      |
| latitude            | number | no       | nullable, -90 to 90                    |
| longitude           | number | no       | nullable, -180 to 180                  |

**Example:**

```json
{
  "name": "New Owner",
  "email": "owner@example.com",
  "password": "secret123",
  "password_confirmation": "secret123",
  "role": "owner",
  "phone": "+52 111 222 3333",
  "address": "Calle Secundaria 2"
}
```

**Response: 201 Created**

```json
{
  "data": {
    "id": 2,
    "name": "New Owner",
    "email": "owner@example.com",
    "role": "owner",
    "phone": "+52 111 222 3333",
    "address": "Calle Secundaria 2",
    "latitude": null,
    "longitude": null,
    "created_at": "2025-01-28T13:00:00.000000Z",
    "updated_at": "2025-01-28T13:00:00.000000Z",
    "deleted_at": null,
    "restaurants": []
  }
}
```

**Error responses:**

- **401 Unauthorized** — Missing or invalid token  
  `{ "message": "Unauthenticated." }`
- **403 Forbidden** — User is not admin  
  `{ "message": "Unauthorized." }`
- **422 Unprocessable Entity** — Validation errors  
  `{ "message": "The given data was invalid.", "errors": { "email": ["The email has already been taken."], ... } }`

---

## 4. PUT /api/owners/{id} or PATCH /api/owners/{id} — Update owner info

**Description:** Updates an existing owner (user with role owner). All fields are optional (partial update).

**Request body (JSON):** Same fields as create; all optional. See **Docs/VALIDATION_OWNER.md**. Omit `password` to leave unchanged.

| Field               | Type   | Required | Rules / Notes                          |
|---------------------|--------|----------|----------------------------------------|
| name                | string | no       | max 255                                |
| email               | string | no       | valid email, unique (excluding current)|
| password            | string | no       | min 8, letters + numbers + mixed case; omit to keep |
| password_confirmation | string | no     | required when password is present      |
| role                | string | no       | must be `"owner"`                       |
| phone               | string | no       | nullable, max 50                       |
| address             | string | no       | nullable, max 500                      |
| latitude            | number | no       | nullable, -90 to 90                    |
| longitude           | number | no       | nullable, -180 to 180                  |

**Response: 200 OK**

Same shape as **GET /api/owners/{id}** `data` (owner with restaurants).

**Error responses:**

- **401 Unauthorized** — Missing or invalid token  
- **403 Forbidden** — User is not admin  
- **404 Not Found** — No owner with that id  
- **422 Unprocessable Entity** — Validation errors  

---

## 5. DELETE /api/owners/{id} — Soft delete owner

**Description:** Soft deletes the owner (sets `deleted_at`). The user is not removed from the database; default queries exclude soft-deleted users. List with `?with_trashed=1` to include them.

**Response: 200 OK**

```json
{
  "message": "Owner soft deleted."
}
```

**Error responses:**

- **401 Unauthorized** — Missing or invalid token  
- **403 Forbidden** — User is not admin  
- **404 Not Found** — No owner with that id  

---

## Owner resource shape

All successful data responses use the **Owner** resource. Full interface and JSON schema: **Docs/OWNER_RESOURCE_SCHEMA.md**. Sensitive fields (password, remember_token) are never included.

- **id** (integer)
- **name** (string)
- **email** (string)
- **phone** (string | null)
- **address** (string | null)
- **restaurants** (array) — When loaded; each item is a Restaurant resource.
- **created_at** (ISO 8601)
- **updated_at** (ISO 8601)
- **deleted_at** (ISO 8601 | null; present only when soft-deleted)

---

**Document version:** 1.0  
**Branch:** feat/backend-owner-crud

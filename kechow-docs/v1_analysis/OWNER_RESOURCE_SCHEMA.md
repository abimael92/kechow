# Owner API Resource — Interface & JSON Schema

**Class:** `App\Modules\Owner\Resources\OwnerResource`  
**Purpose:** Serialize owner (User with role owner) responses consistently. Sensitive fields are never included.

---

## 1. Exposed fields (interface)

| Field         | Type     | Description                    |
|---------------|----------|--------------------------------|
| id            | integer  | Owner user id                  |
| name          | string   | Display name                   |
| email         | string   | Email address                  |
| phone         | string \| null | Phone number             |
| address       | string \| null | Address                   |
| restaurants   | array    | List of Restaurant resources (when loaded) |
| created_at    | string (ISO 8601) \| null | Created timestamp   |
| updated_at    | string (ISO 8601) \| null | Updated timestamp   |
| deleted_at    | string (ISO 8601) \| null | Present only when owner is soft-deleted |

---

## 2. Hidden / never exposed

The following are **never** included in the serialized response:

- `password`
- `remember_token`
- `email_verified_at` (optional: add to interface if needed for API)

---

## 3. JSON Schema (draft)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Owner",
  "type": "object",
  "required": ["id", "name", "email"],
  "properties": {
    "id": { "type": "integer", "description": "Owner user id" },
    "name": { "type": "string", "description": "Display name" },
    "email": { "type": "string", "format": "email", "description": "Email address" },
    "phone": { "type": ["string", "null"], "maxLength": 50, "description": "Phone number" },
    "address": { "type": ["string", "null"], "maxLength": 500, "description": "Address" },
    "restaurants": {
      "type": "array",
      "items": { "$ref": "#/definitions/Restaurant" },
      "description": "Restaurants owned by this owner (when relation loaded)"
    },
    "created_at": { "type": ["string", "null"], "format": "date-time" },
    "updated_at": { "type": ["string", "null"], "format": "date-time" },
    "deleted_at": { "type": ["string", "null"], "format": "date-time", "description": "Present only when soft-deleted" }
  },
  "definitions": {
    "Restaurant": {
      "type": "object",
      "description": "See RestaurantResource / Restaurant JSON schema for full shape"
    }
  }
}
```

---

## 4. Example response

**GET /api/owners/1** (with `restaurants` loaded):

```json
{
  "data": {
    "id": 1,
    "name": "Jane Owner",
    "email": "jane@example.com",
    "phone": "+52 123 456 7890",
    "address": "Calle Principal 1",
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
        "created_at": "2025-01-28T12:00:00.000000Z",
        "updated_at": "2025-01-28T12:00:00.000000Z"
      }
    ],
    "created_at": "2025-01-28T12:00:00.000000Z",
    "updated_at": "2025-01-28T12:00:00.000000Z",
    "deleted_at": null
  }
}
```

---

## 5. TypeScript interface

```ts
interface Owner {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  restaurants: Restaurant[];
  created_at: string | null;
  updated_at: string | null;
  deleted_at?: string | null;
}
```

---

## 6. Usage

- **Single owner:** `return response()->json(['data' => new OwnerResource($owner->load('restaurants'))]);`
- **Collection:** `return response()->json(['data' => OwnerResource::collection($owners)]);`
- Always load `restaurants` when the client needs them: `$owner->load('restaurants')` or `User::with('restaurants')->...`.

---

**Document version:** 1.0

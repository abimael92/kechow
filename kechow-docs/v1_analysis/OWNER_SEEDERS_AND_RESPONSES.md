# Owner Seeders and Example API Responses

This document describes the **OwnerSeeder** and related seeders that create mock owners with Spanish names, addresses, and phone numbers, plus sample restaurants. It also provides example JSON responses from the owner management API when using the seeded data.

---

## Seeders Overview

| Seeder           | Purpose |
|------------------|--------|
| **UserSeeder**   | Creates a test user (e.g. `test@example.com`). |
| **OwnerSeeder**  | Creates **3 mock owners** with password `123456` (hashed via `Hash::make('123456')`), Spanish names/addresses/phones, and **sample restaurants** per owner. |
| **RestaurantSeeder** | Creates 5 additional restaurants (via factory) for the first seeded owner. |
| **MenuItemSeeder**   | Creates 5 menu items per restaurant. |
| **OrderSeeder**      | Seeds orders (if applicable). |

**Run order** (in `DatabaseSeeder`): `UserSeeder` → `OwnerSeeder` → `RestaurantSeeder` → `MenuItemSeeder` → `OrderSeeder`.

---

## OwnerSeeder Details

- **Class:** `Database\Seeders\OwnerSeeder`
- **Password for all seeded owners:** `123456` (stored as `Hash::make('123456')`).
- **Role:** Every seeded user has `role = 'owner'`.
- **Data:** Spanish names, Spanish addresses, and Spanish-format phone numbers (`+34 ...`).

### Seeded Owners and Restaurants

1. **Carmen López García**
   - Email: `carmen.lopez@example.com`
   - Phone: `+34 912 345 678`
   - Address: `Calle Gran Vía 42, 28013 Madrid`
   - Restaurants:
     - **La Taberna de Carmen** – Cocina tradicional española y tapas (Madrid).
     - **El Rincón de Carmen** – Desayunos y brunch (Plaza Mayor 8, Madrid).

2. **Antonio Martínez Ruiz**
   - Email: `antonio.martinez@example.com`
   - Phone: `+34 934 567 890`
   - Address: `Passeig de Gràcia 92, 08008 Barcelona`
   - Restaurants:
     - **Casa Antonio** – Arroces y pescado fresco (Barcelona).

3. **Elena Fernández Sánchez**
   - Email: `elena.fernandez@example.com`
   - Phone: `+34 958 123 456`
   - Address: `Carrera del Darro 31, 18010 Granada`
   - Restaurants:
     - **La Alhambra Restaurante** – Vistas a la Alhambra, gastronomía granadina.
     - **Tetería Elena** – Tés y repostería árabe (Albayzín, Granada).

---

## How to Run Seeders

From the `kechow-server` directory:

```bash
# Run all seeders (after migrations)
php artisan db:seed

# Reset DB and run all migrations + seeders
php artisan migrate:fresh --seed

# Run only OwnerSeeder
php artisan db:seed --class=OwnerSeeder
```

**Prerequisites:** Migrations must be run first. The `add_location_to_users_table` migration adds `phone`, `address`, `latitude`, and `longitude` to the `users` table so owner records can store Spanish addresses and phones.

---

## Example JSON Responses (Owner API)

The owner management API is **admin-only** (`GET/POST/PUT/PATCH/DELETE /api/owners`). Authenticate as an admin and use the seeded owner IDs (from `php artisan db:seed` or `migrate:fresh --seed`) in the examples below.

### 1. List all owners – `GET /api/owners`

**Response (200 OK)** – structure with seeded data:

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
        },
        {
          "id": 2,
          "name": "El Rincón de Carmen",
          "description": "Desayunos y brunch con productos locales.",
          "address": "Plaza Mayor 8",
          "city": "Madrid",
          "state": "Madrid",
          "zip_code": "28012",
          "phone": "+34 913 100 200",
          "email": "rincon@latabernadecarmen.es",
          "website": null,
          "opening_time": "08:00:00",
          "closing_time": "15:00:00",
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
    },
    {
      "id": 3,
      "name": "Antonio Martínez Ruiz",
      "email": "antonio.martinez@example.com",
      "phone": "+34 934 567 890",
      "address": "Passeig de Gràcia 92, 08008 Barcelona",
      "restaurants": [
        {
          "id": 3,
          "name": "Casa Antonio",
          "description": "Arroces y pescado fresco junto a la Barceloneta.",
          "address": "Passeig de Gràcia 92",
          "city": "Barcelona",
          "state": "Barcelona",
          "zip_code": "08008",
          "phone": "+34 934 567 890",
          "email": "contacto@casaantonio.es",
          "website": "https://casaantonio.example.com",
          "opening_time": "13:00:00",
          "closing_time": "23:30:00",
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
    },
    {
      "id": 4,
      "name": "Elena Fernández Sánchez",
      "email": "elena.fernandez@example.com",
      "phone": "+34 958 123 456",
      "address": "Carrera del Darro 31, 18010 Granada",
      "restaurants": [
        {
          "id": 4,
          "name": "La Alhambra Restaurante",
          "description": "Vistas a la Alhambra y gastronomía granadina.",
          "address": "Carrera del Darro 31",
          "city": "Granada",
          "state": "Granada",
          "zip_code": "18010",
          "phone": "+34 958 123 456",
          "email": "reservas@laalhambrarestaurante.es",
          "website": null,
          "opening_time": "12:30:00",
          "closing_time": "23:00:00",
          "logo_url": null,
          "is_active": true,
          "is_open": false,
          "latitude": null,
          "longitude": null,
          "delivery_radius": null,
          "created_at": "2025-01-28T12:00:00.000000Z",
          "updated_at": "2025-01-28T12:00:00.000000Z"
        },
        {
          "id": 5,
          "name": "Tetería Elena",
          "description": "Tés, repostería árabe y tapas en el Albayzín.",
          "address": "Calle Calderería Nueva 4",
          "city": "Granada",
          "state": "Granada",
          "zip_code": "18010",
          "phone": "+34 958 200 300",
          "email": "info@teteriaelena.es",
          "website": null,
          "opening_time": "10:00:00",
          "closing_time": "22:00:00",
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
  "meta": {
    "total": 3
  }
}
```

*(IDs and timestamps will match your local DB after seeding.)*

### 2. Show one owner – `GET /api/owners/{id}`

Use a seeded owner ID (e.g. `2` for Carmen López García).

**Response (200 OK)** – single owner with restaurants:

```json
{
  "data": {
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
      },
      {
        "id": 2,
        "name": "El Rincón de Carmen",
        "description": "Desayunos y brunch con productos locales.",
        "address": "Plaza Mayor 8",
        "city": "Madrid",
        "state": "Madrid",
        "zip_code": "28012",
        "phone": "+34 913 100 200",
        "email": "rincon@latabernadecarmen.es",
        "website": null,
        "opening_time": "08:00:00",
        "closing_time": "15:00:00",
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
}
```

### 3. Create owner – `POST /api/owners`

**Request body (example):**

```json
{
  "name": "Nuevo Propietario",
  "email": "nuevo@example.com",
  "password": "SecurePass123",
  "password_confirmation": "SecurePass123",
  "role": "owner",
  "phone": "+34 600 111 222",
  "address": "Calle Nueva 1, 28001 Madrid"
}
```

**Response (201 Created)** – same shape as a single owner in “Show one owner” (with `data` containing the new owner and empty `restaurants` if none created).

### 4. Update owner – `PUT /api/owners/{id}` or `PATCH /api/owners/{id}`

**Request body (example, partial):**

```json
{
  "name": "Carmen López García (actualizado)",
  "phone": "+34 912 999 888"
}
```

**Response (200 OK)** – same shape as “Show one owner” with the updated owner and its restaurants.

### 5. Delete owner – `DELETE /api/owners/{id}`

**Response (200 OK):**

```json
{
  "message": "Owner soft deleted."
}
```

---

## Ensuring API Endpoints Return Seeded Data Correctly

- **Authentication:** Use an **admin** user (e.g. create one or promote the test user to `role = 'admin'`) and send the Sanctum token in the `Authorization` header for all owner endpoints.
- **IDs:** After `php artisan migrate:fresh --seed`, owner IDs depend on whether `UserSeeder` creates a user first (e.g. owner IDs may start at 2, 3, 4). Use `GET /api/owners` to see the actual IDs and use them for `GET/PUT/PATCH/DELETE /api/owners/{id}`.
- **List with soft-deleted:** `GET /api/owners?with_trashed=1` returns owners including soft-deleted ones; the seeded owners appear in the list until they are soft-deleted.

---

## Related Docs

- [OWNER_MANAGEMENT_ROUTES.md](OWNER_MANAGEMENT_ROUTES.md) – Route definitions and expected responses
- [OWNER_RESOURCE_SCHEMA.md](OWNER_RESOURCE_SCHEMA.md) – Owner and restaurant resource schema
- [VALIDATION_OWNER.md](VALIDATION_OWNER.md) – Validation rules for create/update owner

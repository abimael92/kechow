# Kechow – Backend & Frontend Integration Guide

**Version:** 1.0  
**Last updated:** February 2025  
**Scope:** Vue 3 client (`kechow-client`) ↔ Laravel API (`kechow-server`)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Environment & Configuration](#2-environment--configuration)
3. [API Base URL & Route Mapping](#3-api-base-url--route-mapping)
4. [Authentication Flow](#4-authentication-flow)
5. [Resource-by-Resource Integration](#5-resource-by-resource-integration)
6. [Request/Response Format Alignment](#6-requestresponse-format-alignment)
7. [Missing Backend Implementations](#7-missing-backend-implementations)
8. [Recommended Migration Steps](#8-recommended-migration-steps)

---

## 1. Overview

### Architecture

```
┌─────────────────────────────┐         ┌─────────────────────────────┐
│   kechow-client (Vue 3)     │         │   kechow-server (Laravel)    │
│   - Vite                    │  HTTP   │   - Sanctum auth             │
│   - Vue Router              │ ──────► │   - REST API under /api      │
│   - Pinia                   │         │   - MySQL                    │
│   - Axios (api lib)         │         │   - Order, Restaurant, Auth  │
└─────────────────────────────┘         └─────────────────────────────┘
```

### Current State

| Area | Status |
|------|--------|
| **Auth** | ✅ Login/Register work; frontend uses `/api/login`, `/api/register` |
| **Restaurants** | ⚠️ Partial – frontend expects `/restaurants` but must call `/api/restaurants` |
| **Menu** | ⚠️ Path mismatch: frontend `/menu`, backend `/menu-items` |
| **Orders** | ⚠️ Path mismatch: frontend `/customer/orders`, backend `/api/orders`; field names differ |
| **Profile** | ❌ Backend has no `/customer/profile` or `/customer/addresses` |
| **Reviews** | ❌ Backend has no review endpoints |

---

## 2. Environment & Configuration

### Frontend (kechow-client)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Base URL for API requests | `http://127.0.0.1:8000` |

**Axios config** (`src/app/lib/axios.ts`):

- `baseURL`: from `VITE_API_URL`
- `withCredentials: true` (for Sanctum cookies)
- `Authorization: Bearer <token>` from `localStorage.getItem('token')`
- 401 handling: clears token and redirects to `/login`

### Backend (kechow-server)

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_URL` | Shown in .env.example for frontend | `http://127.0.0.1:8000` |
| `FRONTEND_URL` | CORS / redirects | `http://localhost:3000` |

**Route prefix:** All API routes are under `api` (see `RouteServiceProvider`).

**CORS:** `config/cors.php` allows `api/*`, `login`, `register`, `sanctum/csrf-cookie`, `user`.

---

## 3. API Base URL & Route Mapping

### URL Construction

| Layer | Value | Example |
|-------|-------|---------|
| `VITE_API_URL` | `http://127.0.0.1:8000` | - |
| Axios `baseURL` | Same as above | - |
| Backend API prefix | `/api` | - |
| **Final URL** | `baseURL` + path | `http://127.0.0.1:8000` + `/api/orders` |

Frontend must call paths that include `/api`, e.g. `/api/orders`, not `/orders`. The axios `baseURL` is the origin only (`http://127.0.0.1:8000`), so every API path in `customer.service.ts` must start with `/api/`.

### Route Mapping Table

| Frontend Call (customer.service) | Current Backend Route | Status |
|----------------------------------|------------------------|--------|
| `GET /restaurants` | `GET /api/restaurants` | ⚠️ Use `/api/restaurants` |
| `GET /restaurants/:id` | `GET /api/restaurants/:id` | ⚠️ Use `/api/restaurants/:id` |
| `GET /restaurants/:id/menu` | `GET /api/restaurants/:id/menu-items` | ⚠️ Path differs |
| `GET /customer/orders` | `GET /api/orders` | ⚠️ Path differs; must scope by user |
| `GET /customer/orders/:id` | `GET /api/orders/:id` | ⚠️ Path differs |
| `GET /customer/orders/:id/track` | (same as show) | ⚠️ Use `GET /api/orders/:id` |
| `POST /customer/orders` | `POST /api/orders` | ⚠️ Path + body format differ |
| `GET /customer/profile` | - | ❌ Not implemented |
| `PUT /customer/profile` | - | ❌ Not implemented |
| `POST /customer/addresses` | - | ❌ Not implemented |
| `PUT /customer/addresses/:id` | - | ❌ Not implemented |
| `DELETE /customer/addresses/:id` | - | ❌ Not implemented |
| `GET /restaurants/:id/reviews` | - | ❌ Not implemented |
| `POST /customer/reviews` | - | ❌ Not implemented |

---

## 4. Authentication Flow

### Login

1. Frontend: `GET /sanctum/csrf-cookie` (optional, for cookie-based auth)
2. Frontend: `POST /api/login` with `{ email, password }`
3. Backend: returns `{ user, token }`
4. Frontend: saves token in `localStorage`, sets `Authorization: Bearer <token>`

**Auth service** (`auth.service.ts`) uses its own axios instance; it calls `/api/login` so full URL is correct.

### Protected Routes

- Order create, status update, cancel: `auth:sanctum`
- Profile/addresses/reviews: would require auth when implemented

### Token Usage

- `api` (from `@app/lib/axios`) attaches `Authorization: Bearer <token>` from `localStorage`
- 401 responses trigger logout and redirect to `/login`

---

## 5. Resource-by-Resource Integration

### 5.1 Restaurants

**Backend:**

- `GET /api/restaurants` – list (with filters via query params)
- `GET /api/restaurants/:id` – single restaurant
- Response: `RestaurantResource` (includes `id`, `name`, `description`, `address`, `logo_url`, etc.)
- Collection: wrapped in `RestaurantCollection` with `data` + `meta`

**Frontend expects (e.g. Restaurant interface):**

```ts
{ id, name, description, image?, rating?, deliveryTime?, deliveryFee?, cuisine? }
```

**Action:** Update `customer.service.ts` to call `/api/restaurants`. Map backend `logo_url` → `image`, add defaults for `rating`, `deliveryTime`, `deliveryFee` if missing.

---

### 5.2 Menu Items

**Backend:**

- `GET /api/restaurants/:id/menu-items`
- Response: `MenuItemResource[]` with `id`, `name`, `description`, `price`, `image_url`, `is_available`, `category`

**Frontend expects (MenuItem):**

```ts
{ id, name, description, price, stock?, category, available, image, createdAt, updatedAt }
```

**Action:** Call `/api/restaurants/:id/menu-items`, map `is_available` → `available`, `image_url` → `image`. `id` should be numeric on backend; frontend often uses string – ensure compatibility.

---

### 5.3 Orders

**Backend:**

- `GET /api/orders` – **⚠️ Currently returns all orders; should filter by `user_id` when customer is authenticated**
- `GET /api/orders/:id` – single order
- `POST /api/orders` – create (auth required)

**Create order – backend expects (OrderService):**

```php
[
  'user_id' => $request->user()->id,  // from auth
  'restaurant_id' => int,
  'items' => [
    ['menu_item_id' => int, 'quantity' => int],
    ...
  ],
  'delivery_address' => string,
  'delivery_notes' => string | null,
]
```

**Create order – frontend sends (CreateOrderRequest):**

```ts
{
  restaurantId: number,
  items: [{ menuItemId: string, quantity: number, notes?: string }],
  deliveryAddress: string,
  specialInstructions?: string,
  paymentMethod: 'cash' | 'card' | 'online',
}
```

**Mappings:**

| Frontend | Backend |
|----------|---------|
| `restaurantId` | `restaurant_id` |
| `menuItemId` | `menu_item_id` (and must be `int`) |
| `deliveryAddress` | `delivery_address` |
| `specialInstructions` | `delivery_notes` |
| - | `paymentMethod` not stored (backend has no payment_method) |

**Order response – backend (OrderResource):**

- `id`, `user_id`, `restaurant_id`, `total`, `totalAmount`, `status`, `delivery_address`, `delivery_notes`
- `customerName` (from user), `address` (from delivery_address), `phone` (from user)
- `items` (OrderItemResource), `user`, `restaurant`, `driver`
- Status: backend uses `pending`; resource maps to `new` for frontend

**Action:** Add `CreateOrderRequest` validation on backend. Update frontend to send `restaurant_id`, `menu_item_id` (int), `delivery_address`, `delivery_notes`. Use `/api/orders` for list/create/show. Ensure `GET /api/orders` filters by authenticated user when role is customer.

---

### 5.4 Customer Profile & Addresses

**Frontend expects:**

- `GET /customer/profile` → `{ id, name, email, phone, addresses: Address[] }`
- `PUT /customer/profile` → update name, email, phone
- `POST /customer/addresses` → add address
- `PUT /customer/addresses/:id` → update address
- `DELETE /customer/addresses/:id` → delete address

**Backend:** No `customers` or `addresses` tables. User model has `phone`, `address` (single string). No profile/addresses endpoints.

**Action:** Implement Customer module:

1. Migration: `addresses` table (user_id, label, street, city, state, zip_code, is_default)
2. Routes: `GET/PUT /api/customer/profile`, `POST/PUT/DELETE /api/customer/addresses`
3. Or: proxy profile from User resource and addresses from new Address model

---

### 5.5 Reviews

**Frontend expects:**

- `GET /restaurants/:id/reviews` → list reviews
- `POST /customer/reviews` → create review

**Backend:** No `reviews` table or endpoints.

**Action:** Implement Review module (migration, model, controller, routes).

---

## 6. Request/Response Format Alignment

### Order Create Payload

**Recommended frontend payload (aligned with backend):**

```json
{
  "restaurant_id": 1,
  "items": [
    { "menu_item_id": 1, "quantity": 2 },
    { "menu_item_id": 3, "quantity": 1 }
  ],
  "delivery_address": "Calle Principal 123, Ciudad, Estado 12345",
  "delivery_notes": "Llamar antes de llegar"
}
```

Backend ignores `paymentMethod` for now; it can be added to orders table later.

### Order Response (Backend → Frontend)

OrderResource already exposes `customerName`, `address`, `totalAmount`, `status` (mapped `pending` → `new`). Frontend `Order` type is largely compatible. Ensure `items` array uses `name`, `quantity`, `price` (OrderItemResource provides these).

### Restaurant Response

Backend does not expose `rating`, `deliveryTime`, `deliveryFee` in RestaurantResource. Either:

- Add these columns and compute/return them, or
- Frontend uses defaults when absent.

### Menu Item Response

| Backend | Frontend |
|---------|----------|
| `id` (int) | `id` (string – convert) |
| `is_available` | `available` |
| `image_url` | `image` |
| - | `stock` (optional, not in backend) |

---

## 7. Missing Backend Implementations

| Component | Description |
|-----------|-------------|
| **CreateOrderRequest** | `OrderController::store` references `CreateOrderRequest` but file is missing. Add validation for `restaurant_id`, `items`, `delivery_address`, `delivery_notes`. |
| **Order index scoping** | `GET /api/orders` returns all orders. When `auth:sanctum` and user is customer, filter by `user_id`. |
| **Customer profile** | Endpoints and logic for `GET/PUT /api/customer/profile` using User model. |
| **Addresses** | Migration, model, controller, routes for customer addresses. |
| **Reviews** | Migration, model, controller, routes for restaurant reviews. |
| **Menu path alias** | Optional: add `GET /api/restaurants/:id/menu` that proxies to `menu-items` for frontend compatibility. |
| **Customer order path** | Optional: add `/api/customer/orders` route group that proxies to `/api/orders` with user scoping. |

---

## 8. Recommended Migration Steps

### Phase 1: Quick wins (frontend)

1. **Base URL:** Ensure `VITE_API_URL` ends without `/api`; all API paths in `customer.service.ts` should include `/api` (e.g. `/api/restaurants`, `/api/orders`).
2. **Menu path:** Change `GET /restaurants/:id/menu` to `GET /api/restaurants/:id/menu-items` in `customer.service.ts`.
3. **Orders:** Change `/customer/orders` to `/api/orders`; add transformer for create payload (`restaurant_id`, `menu_item_id`, `delivery_address`, `delivery_notes`).
4. **Response mapping:** Add adapters for Restaurant (e.g. `logo_url` → `image`) and MenuItem (`is_available` → `available`).

### Phase 2: Backend fixes

1. **CreateOrderRequest:** Create `CreateOrderRequest` with rules for `restaurant_id`, `items`, `delivery_address`, `delivery_notes`.
2. **Order index:** When request is authenticated and user role is `customer`, pass `user_id` to `getAllOrders`.
3. **Optional route aliases:** Add `GET /api/restaurants/:id/menu` → `MenuItemController::index` for compatibility.

### Phase 3: Profile & addresses

1. Create `addresses` migration (user_id, label, street, city, state, zip_code, is_default).
2. Create `Address` model, `AddressController`, routes under `/api/customer`.
3. Implement `GET/PUT /api/customer/profile` (from User + addresses).

### Phase 4: Reviews

1. Create `reviews` migration (user_id, restaurant_id, order_id, rating, comment, etc.).
2. Create `Review` model, `ReviewController`, routes.
3. Wire frontend to new endpoints.

---

## 9. Cart → Checkout → Order Flow

```
RestaurantDetailView (add to cart)
        ↓
   CartStore (Pinia)
        ↓
   CheckoutPage (address, payment, special instructions)
        ↓
   createOrder() → POST /api/orders
        ↓
   OrderTrackingPage (poll GET /api/orders/:id)
```

**Cart data:** Stored in `useCartStore()` (Pinia). Items have `id` (menu item id), `name`, `price`, `quantity`. The store is the single source of truth between RestaurantDetailView and CheckoutPage.

**Checkout:** Fetches `getCustomerProfile()` for addresses. On submit, maps cart items to `{ menu_item_id, quantity }` and sends with `restaurant_id`, `delivery_address`, `delivery_notes`. Ensure `restaurantId` comes from the cart (currently hardcoded as `1` in CheckoutPage – should be fixed).

---

## Quick Reference: File Locations

| Purpose | Path |
|---------|------|
| Frontend API client | `kechow-client/src/app/lib/axios.ts` |
| Customer API calls | `kechow-client/src/features/customer/services/customer.service.ts` |
| Auth API calls | `kechow-client/src/app/store/auth/auth.service.ts` |
| Backend API routes | `kechow-server/routes/api.php` (loads modules) |
| Order routes | `kechow-server/app/Modules/Order/routes.php` |
| Restaurant routes | `kechow-server/app/Modules/Restaurant/routes.php` |
| Order service | `kechow-server/app/Modules/Order/Services/OrderService.php` |
| Order resource | `kechow-server/app/Modules/Order/Resources/OrderResource.php` |
| Cart store | `kechow-client/src/features/customer/cart/cart.store.ts` |
| Checkout page | `kechow-client/src/pages/customer/CheckoutPage.vue` |

# Phase 5 — Database Final Design

**Project:** Kechow  
**RDBMS:** MySQL (or PostgreSQL). All naming and types compatible with both.

---

## 1. Design Principles

- **Normalized** schema; avoid redundant storage where consistency can be derived.
- **Indexes** on foreign keys, status, and date columns used in filters and reporting.
- **Foreign keys** with appropriate ON DELETE (cascade or restrict) for referential integrity.
- **Soft deletes** where business requires audit or recovery (e.g. users, restaurants). Use `deleted_at`.
- **Audit fields** where required: `created_at`, `updated_at`; optional `created_by`, `updated_by` for admin actions.
- **Single source of truth** for driver identity: recommend `orders.driver_id` as FK to `drivers.id` (and driver belongs to user). Delivery record links order and driver for lifecycle.

---

## 2. Core Tables (Final)

### 2.1 users

- `id` (PK), `name`, `email`, `email_verified_at`, `password`, `role` (enum or string: customer, owner, delivery, admin), `phone` (nullable), `avatar` (nullable), `location` (nullable, for customer/address), `remember_token`, `created_at`, `updated_at`, `deleted_at` (nullable, soft delete).
- **Indexes:** `email` (unique), `role`, `deleted_at`.

### 2.2 user_addresses

- `id` (PK), `user_id` (FK users), `label`, `street`, `city`, `state`, `postal_code`, `country`, `latitude`, `longitude`, `is_default`, `created_at`, `updated_at`.
- **Indexes:** `user_id`, (`user_id`, `is_default`).

### 2.3 restaurants

- `id` (PK), `user_id` (FK users, owner), `name`, `slug`, `description`, `address`, `phone`, `logo_path`, `is_active`, `avg_prep_time` (minutes), `schedule` (JSON or separate table), `exceptional_dates` (JSON), `created_at`, `updated_at`, `deleted_at`.
- **Indexes:** `user_id`, `slug` (unique), `is_active`, `deleted_at`.

### 2.4 menu_items

- `id` (PK), `restaurant_id` (FK restaurants), `name`, `description`, `price`, `image_path`, `category`, `is_available`, `stock` (optional), `sort_order`, `created_at`, `updated_at`.
- **Indexes:** `restaurant_id`, (`restaurant_id`, `is_available`), (`restaurant_id`, `category`).

### 2.5 orders

- `id` (PK), `user_id` (FK users, customer), `restaurant_id` (FK restaurants), `driver_id` (nullable, FK drivers.id — recommended for single source of truth), `total` (decimal 10,2), `status` (pending, accepted, preparing, ready, out_for_delivery, delivered, cancelled), `delivery_address`, `delivery_notes`, `estimated_delivery_time`, `actual_delivery_time`, `created_at`, `updated_at`.
- **Indexes:** `user_id`, `restaurant_id`, `driver_id`, `status`, `created_at`, (`restaurant_id`, `status`), (`driver_id`, `status`).

### 2.6 order_items

- `id` (PK), `order_id` (FK orders), `menu_item_id` (FK menu_items), `quantity`, `unit_price`, `notes` (nullable), `created_at`, `updated_at`.
- **Indexes:** `order_id`, `menu_item_id`.

### 2.7 drivers

- `id` (PK), `user_id` (FK users, unique), `status` (offline, online, busy), `vehicle_type`, `is_online`, `rating`, `total_deliveries`, `current_latitude`, `current_longitude`, `created_at`, `updated_at`.
- **Indexes:** `user_id` (unique), `is_online`, `status`.

### 2.8 deliveries

- `id` (PK), `order_id` (FK orders, unique), `driver_id` (FK drivers), `status` (assigned, picked_up, in_transit, delivered, cancelled), `assigned_at`, `picked_up_at`, `delivered_at`, `cancelled_at`, `cancellation_reason`, `notes`, `created_at`, `updated_at`.
- **Indexes:** `order_id` (unique), `driver_id`, `status`, `delivered_at`, (`driver_id`, `status`).

**Note:** If `orders.driver_id` is kept as user_id for display only, retain it as nullable and sync from `drivers.user_id` when a delivery is assigned. Prefer FKs to `drivers.id` for consistency.

### 2.9 carts

- `id` (PK), `user_id` (FK users), `restaurant_id` (FK restaurants), `created_at`, `updated_at`.
- **Indexes:** `user_id`, (`user_id`, `restaurant_id`).

### 2.10 cart_items

- `id` (PK), `cart_id` (FK carts), `menu_item_id` (FK menu_items), `quantity`, `created_at`, `updated_at`.
- **Indexes:** `cart_id`, `menu_item_id`.

### 2.11 driver_locations (optional, for tracking)

- `id` (PK), `driver_id` (FK drivers), `latitude`, `longitude`, `recorded_at`, `created_at`.
- **Indexes:** `driver_id`, `recorded_at`.

### 2.12 personal_access_tokens (Laravel Sanctum)

- Standard Sanctum migration.

### 2.13 cache, jobs (Laravel)

- Standard framework migrations.

---

## 3. Relationships (Summary)

- User hasMany UserAddress, hasMany Restaurant (as owner), hasOne Driver, hasMany Order (as customer).
- Restaurant belongsTo User; hasMany MenuItem, Order; hasMany Cart (via restaurant_id).
- Order belongsTo User (customer), Restaurant, Driver (optional); hasMany OrderItem; hasOne Delivery.
- Delivery belongsTo Order, Driver.
- Driver belongsTo User; hasMany Delivery; hasMany DriverLocation (optional).
- Cart belongsTo User, Restaurant; hasMany CartItem.
- CartItem belongsTo Cart, MenuItem.
- OrderItem belongsTo Order, MenuItem.

---

## 4. Migration Strategy

1. **Existing migrations:** Keep and run in order. Fix any that are no-ops (e.g. add_delivery_fields that only add columns).
2. **Missing deliveries table:** Add migration `create_deliveries_table` with columns and indexes above. Ensure order_id unique so one delivery per order.
3. **orders.driver_id:** If currently storing user_id, add migration to add or rename column and optionally backfill from deliveries (driver_id → drivers.user_id). Prefer storing drivers.id and add FK to drivers.
4. **Soft deletes:** Add `deleted_at` to users and restaurants if not present; update models to use SoftDeletes.
5. **Indexes:** Add migrations for any missing indexes listed above; avoid duplicate indexes.

---

## 5. Seeder Strategy

- **Roles:** Ensure users can be seeded with roles (customer, owner, delivery, admin).
- **Owner/Admin:** Seed at least one admin and one owner with restaurant and menu for testing.
- **Driver:** Seed driver users and corresponding drivers table rows for delivery testing.
- **Orders/Deliveries:** Optional demo orders in various statuses for each role.
- **Idempotency:** Seeders should use firstOrCreate or updateOrCreate so they can run repeatedly (e.g. in staging).

---

## 6. Performance Considerations

- **Pagination:** All list endpoints (orders by restaurant, by driver, completed deliveries) must use pagination (limit/offset or cursor). Index on (driver_id, status, delivered_at) for driver completed list.
- **Reporting:** Aggregations (earnings by period, count by status) should use indexed columns (created_at, delivered_at, status) and avoid full table scans.
- **N+1:** Use `with()` in Eloquent for order → restaurant, order → items, delivery → order → restaurant when returning lists.
- **Concurrency:** Accept order: use transaction and check order still pending and has no delivery before insert; unique index on deliveries.order_id enforces one delivery per order.

---

## 7. Schema Explanation (Final)

The schema supports: (1) multi-role users (customer, owner, delivery, admin); (2) restaurants and menus with availability; (3) orders with line items and delivery address; (4) driver availability and assignment via deliveries table; (5) cart per user per restaurant; (6) optional driver location history. Driver identity is unified via `drivers` table; orders can reference `drivers.id` for the assigned driver. Deliveries table tracks the lifecycle (assigned → picked_up → in_transit → delivered) and timestamps for earnings and stats. This design is normalized, index-friendly, and ready for production and reporting.

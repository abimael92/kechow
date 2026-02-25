# Phase 3 — Backend Final Structure (Laravel)

**Target:** Feature-based, modular, production-ready API for Kechow (Ciudad Jiménez, Chihuahua, México).

---

## 1. Principles

- **Feature-based modules** under `app/Modules/<Feature>`.
- **Single API prefix:** `/api/v1`.
- **Laravel Sanctum** for authentication; role-based middleware for admin, owner, delivery, customer.
- **Consistent API responses:** envelope (data, message, errors); use Resources and optional DTOs.
- **Form Requests** for all mutable endpoints; **Policies** for authorization on resources.
- **Services** for business logic; **Repositories** for data access where beneficial.
- **Structured logging** and **rate limiting** on API and auth.

---

## 2. Final Folder Structure

```
kechow-server/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   └── Api/
│   │   │       └── V1/                    # Versioned API controllers (optional thin layer)
│   │   │           └── ...
│   │   ├── Middleware/
│   │   │   ├── EnsureUserRole.php         # role:admin, role:owner, role:delivery, role:customer
│   │   │   ├── ForceJsonApi.php           # Accept: application/json
│   │   │   └── ...
│   │   ├── Requests/
│   │   │   └── ...                        # Shared or legacy requests
│   │   └── Resources/
│   │       └── ...                        # Shared API resources if any
│   ├── Modules/
│   │   ├── Auth/
│   │   │   ├── Controllers/
│   │   │   │   └── AuthController.php
│   │   │   ├── Requests/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── ForgotPasswordRequest.php
│   │   │   ├── Services/
│   │   │   │   └── AuthService.php
│   │   │   ├── routes.php
│   │   │   └── ...
│   │   ├── Owner/
│   │   │   ├── Controllers/
│   │   │   │   ├── OwnerManagementController.php
│   │   │   │   ├── OwnerDashboardController.php
│   │   │   │   └── OwnerAnalyticsController.php
│   │   │   ├── Policies/
│   │   │   │   └── OwnerPolicy.php
│   │   │   ├── Requests/
│   │   │   ├── Resources/
│   │   │   ├── Services/
│   │   │   ├── routes.php
│   │   │   └── routes_owner.php           # Optional; if used, require in api.php
│   │   ├── Restaurant/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   ├── Requests/
│   │   │   ├── Resources/
│   │   │   ├── Services/
│   │   │   └── routes.php
│   │   ├── Order/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   ├── Requests/
│   │   │   ├── Resources/
│   │   │   ├── Services/
│   │   │   ├── State/
│   │   │   │   └── OrderStateMachine.php
│   │   │   └── routes.php
│   │   ├── Cart/
│   │   │   ├── Controllers/
│   │   │   ├── Models/
│   │   │   └── routes.php
│   │   ├── Delivery/                       # NEW: single delivery feature (merge Driver + delivery API)
│   │   │   ├── Controllers/
│   │   │   │   └── DeliveryController.php  # availability, jobs, accept, reject, active, completed, status, stats, earnings, settings
│   │   │   ├── Models/
│   │   │   │   └── (use App\Models\Delivery + Modules\Driver\Models\Driver or unified)
│   │   │   ├── Policies/
│   │   │   │   └── DeliveryPolicy.php      # driver owns delivery for status update
│   │   │   ├── Requests/
│   │   │   │   ├── UpdateAvailabilityRequest.php
│   │   │   │   ├── UpdateDeliveryStatusRequest.php
│   │   │   │   └── UpdateSettingsRequest.php
│   │   │   ├── Resources/
│   │   │   │   ├── DeliveryJobResource.php
│   │   │   │   ├── DeliveryOrderResource.php
│   │   │   │   └── EarningsSummaryResource.php
│   │   │   ├── Services/
│   │   │   │   └── DeliveryService.php
│   │   │   ├── Repositories/
│   │   │   │   └── DeliveryRepository.php
│   │   │   ├── DTOs/                      # Optional
│   │   │   │   └── EarningsSummaryDto.php
│   │   │   └── routes.php
│   │   └── Driver/                        # DEPRECATE or remove; logic moved to Delivery
│   │       └── (minimal or removed)
│   ├── Models/                             # Shared / non-module models only
│   │   ├── User.php
│   │   ├── UserAddress.php
│   │   ├── Delivery.php                   # Keep; used by Delivery module
│   │   └── Driver.php                     # Keep; used by Delivery + Delivery model relationship
│   │   # REMOVE: app/Models/Order.php (use Modules/Order/Models/Order only)
│   ├── Exceptions/
│   │   ├── Handler.php                    # If Laravel 11+ uses bootstrap/app.php only, keep exception render in bootstrap
│   │   └── Api/
│   │       ├── ApiException.php
│   │       └── UnauthorizedResourceException.php
│   ├── Traits/
│   │   └── ApiResponder.php               # success(), error(), validationErrors()
│   └── Providers/
├── bootstrap/
│   └── app.php                            # Middleware, exception handling, rate limiting
├── config/
│   ├── auth.php
│   ├── cors.php                           # Allowed origins from env; no hardcoded override
│   ├── sanctum.php
│   └── ...
├── database/
│   ├── migrations/
│   │   ├── 0001_01_01_000000_create_users_table.php
│   │   ├── ..._create_restaurants_table.php
│   │   ├── ..._create_orders_table.php
│   │   ├── ..._create_order_items_table.php
│   │   ├── ..._create_drivers_table.php
│   │   ├── ..._create_deliveries_table.php   # ADD if missing
│   │   ├── ..._create_carts_table.php
│   │   ├── ..._create_cart_items_table.php
│   │   └── ...
│   ├── seeders/
│   └── factories/
├── routes/
│   ├── api.php                            # Prefix v1; require module routes; throttle
│   └── web.php
└── ...
```

---

## 3. API Route Layout (api.php)

```php
// routes/api.php
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:60,1'])->prefix('v1')->group(function () {
    require app_path('Modules/Auth/routes.php');           // login, register, logout, user, forgot/reset password
    require app_path('Modules/Owner/routes.php');          // owners (admin)
    require app_path('Modules/Restaurant/routes.php');     // restaurants, menu
    require app_path('Modules/Order/routes.php');          // customer/orders, owner/restaurant/orders, driver (if kept)
    require app_path('Modules/Cart/routes.php');           // carts
    require app_path('Modules/Delivery/routes.php');       // delivery/* (availability, jobs, orders, stats, earnings, settings)
    // require app_path('Modules/Driver/routes.php');      // DEPRECATED or removed
});
```

- Base URL for clients: `https://api.example.com/api/v1/...` (or same domain with /api/v1).
- Auth routes: public for login/register; `auth:sanctum` for logout, user.
- Owner: `auth:sanctum`, `role:admin`.
- Restaurant: mixed public and `auth:sanctum`.
- Order: `auth:sanctum` with role-specific prefixes (customer, owner, driver if any).
- Cart: `auth:sanctum`.
- Delivery: `auth:sanctum`, `role:delivery` (middleware EnsureUserRole).

---

## 4. Delivery Module Routes (Target)

```php
// app/Modules/Delivery/routes.php
Route::prefix('delivery')->middleware(['auth:sanctum', 'role:delivery'])->group(function () {
    Route::get('/availability', [DeliveryController::class, 'getAvailability']);
    Route::post('/availability', [DeliveryController::class, 'updateAvailability']);
    Route::get('/jobs/available', [DeliveryController::class, 'getAvailableJobs']);
    Route::post('/jobs/{orderId}/accept', [DeliveryController::class, 'acceptOrder']);
    Route::post('/jobs/{orderId}/reject', [DeliveryController::class, 'rejectOrder']);
    Route::get('/orders/active', [DeliveryController::class, 'getActiveOrder']);
    Route::get('/orders/completed', [DeliveryController::class, 'getCompletedOrders']);
    Route::get('/orders/{orderId}', [DeliveryController::class, 'getOrderDetail']);  // Optional: detail for modal/page
    Route::patch('/orders/{orderId}/status', [DeliveryController::class, 'updateOrderStatus'])
        ->middleware('can:update,delivery');  // Policy: delivery belongs to driver
    Route::get('/stats', [DeliveryController::class, 'getStats']);
    Route::get('/earnings', [DeliveryController::class, 'getEarnings']);
    Route::get('/settings', [DeliveryController::class, 'getSettings']);
    Route::patch('/settings', [DeliveryController::class, 'updateSettings']);
});
```

---

## 5. Key Conventions

- **Controllers:** Thin; delegate to Service and return Resource or ApiResponder.
- **Services:** Orchestrate Repositories and domain logic; transactions here.
- **Repositories:** Eloquent queries; return models or DTOs.
- **Form Requests:** Authorize + rules; used in controller `$request` type hint.
- **Policies:** Register in AuthServiceProvider; use `authorize()` or `can` middleware.
- **Resources:** Transform models to API JSON; use in controller responses.
- **Exception handling:** Render API exceptions as JSON with code and message; log.
- **Logging:** Log API errors and critical actions (e.g. order accepted, status change) with context.
- **No** business logic in routes; **no** raw request input for status/ids without validation.

---

## 6. Migration from Current State

1. Add `api/v1` prefix and update frontend base URL to include `/api/v1`.
2. Create `app/Modules/Delivery` and move delivery logic from `Http/Controllers/Api/Driver/DeliveryController` into `Modules/Delivery`; add role middleware and policies.
3. Add Form Requests and Resources for delivery; add getEarnings and getCompletedOrders (and getOrderDetail if needed).
4. Remove or deprecate `api/driver/*` and Driver module routes from main api.php.
5. Delete `app/Models/Order.php`; ensure all references use `App\Modules\Order\Models\Order`.
6. Add deliveries table migration if missing; add DeliveryPolicy and EnsureUserRole('delivery').
7. Switch CORS to config; add throttle to api group.
8. Introduce ApiResponder and optional central exception render for API.

This structure supports scalability, clear ownership per feature, and future mobile and third-party consumers.

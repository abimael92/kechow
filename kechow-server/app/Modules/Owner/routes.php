<?php

/**
 * Owner module routes.
 * - Admin-only owner management: GET/POST/PUT/PATCH/DELETE /owners
 * - Middleware: auth:sanctum, role:admin
 */

use App\Modules\Owner\Controllers\OwnerManagementController;
use Illuminate\Support\Facades\Route;

// Business Owner Dashboard Routes
Route::prefix('owner')->middleware(['auth:sanctum', 'role:owner'])->group(function () {

    // Order Stats - Map to 'orderStats' method
    Route::get('/orders/stats', [\App\Modules\Order\Controllers\OrderController::class, 'orderStats']);

    // Orders List - Map to 'restaurantOrders' method
    Route::get('/orders', [\App\Modules\Order\Controllers\OrderController::class, 'restaurantOrders']);

    // Menu Management
    Route::get('/menu', [\App\Modules\Restaurant\Controllers\RestaurantController::class, 'menu']);
});


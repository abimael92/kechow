<?php

use App\Modules\Order\Controllers\OrderController;
use App\Modules\Owner\Controllers\OwnerDashboardController;
use App\Modules\Owner\Controllers\OwnerAnalyticsController;

/*
 * Owner-facing routes (dashboard, analytics, orders).
 * Scoped to logged-in owner's restaurants via auth:sanctum.
 */
Route::middleware('auth:sanctum')->prefix('owner')->group(function () {
    Route::get('/orders', [OrderController::class, 'restaurantOrders']);
    Route::get('/orders/stats', [OrderController::class, 'orderStats']);
    Route::get('/orders/{order}', [OrderController::class, 'showOwnerOrder']);
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus']);

    Route::get('/dashboard/stats', [OwnerDashboardController::class, 'getStats']);
    Route::get('/analytics', [OwnerAnalyticsController::class, 'getAnalytics']);
});

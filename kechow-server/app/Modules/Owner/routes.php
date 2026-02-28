<?php

/**
 * Owner module routes.
 * - Admin-only owner management: GET/POST/PUT/PATCH/DELETE /owners
 * - Middleware: auth:sanctum, role:admin
 */

use App\Modules\Owner\Controllers\OwnerManagementController;
use App\Modules\Owner\Controllers\OwnerAnalyticsController;
use App\Modules\Order\Controllers\OrderController;
use Illuminate\Support\Facades\Route;

Route::prefix('owners')->middleware(['auth:sanctum', 'role:owner'])->group(function () {
    Route::get('/', [OwnerManagementController::class, 'index']);
    Route::get('analytics', [OwnerAnalyticsController::class, 'getAnalytics']);
    Route::get('analytics/export', [OwnerAnalyticsController::class, 'export']);
    Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/stats', [OrderController::class, 'stats']);

    Route::get('/{owner}', [OwnerManagementController::class, 'show']);
    Route::post('/', [OwnerManagementController::class, 'store']);
    Route::match(['put', 'patch'], '/{owner}', [OwnerManagementController::class, 'update']);
    Route::delete('/{owner}', [OwnerManagementController::class, 'destroy']);
});

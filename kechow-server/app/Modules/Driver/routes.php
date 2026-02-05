<?php

use App\Modules\Driver\Controllers\DriverController;
use App\Modules\Order\Controllers\OrderController;

Route::prefix('driver')->middleware('auth:sanctum')->group(function () {
    Route::get('available-orders', [DriverController::class, 'availableOrders']);
    Route::get('current-order', [DriverController::class, 'currentOrder']);
    Route::put('location', [DriverController::class, 'updateLocation']);
    Route::patch('status', [DriverController::class, 'toggleStatus']);
    Route::get('stats', [DriverController::class, 'stats']);
});

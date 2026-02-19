<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Driver\Controllers\DriverController;

Route::prefix('driver')->middleware('auth:sanctum')->group(function () {
    // These are missing the controller reference
    Route::get('/availability', [DriverController::class, 'getAvailability']);
    Route::post('/availability', [DriverController::class, 'updateAvailability']);
    Route::get('/order/active', [DriverController::class, 'currentOrder']);
    Route::get('/jobs/available', [DriverController::class, 'availableOrders']);
    Route::post('/jobs/{orderId}/accept', [DriverController::class, 'acceptJob']);
    Route::patch('/order/{orderId}/status', [DriverController::class, 'updateOrderStatus']);

    // Your existing routes
    Route::put('/location', [DriverController::class, 'updateLocation']);
    Route::patch('/status', [DriverController::class, 'toggleStatus']);
    Route::get('/stats', [DriverController::class, 'stats']);
});

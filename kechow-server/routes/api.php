<?php

use App\Http\Controllers\Api\Driver\DeliveryController;
use Illuminate\Support\Facades\Route;

// External Modules
require app_path('Modules/Auth/routes.php');
require app_path('Modules/Owner/routes.php');
require app_path('Modules/Restaurant/routes.php');
require app_path('Modules/Order/routes.php');
require app_path('Modules/Cart/routes.php');
require app_path('Modules/Driver/routes.php');

Route::prefix('delivery')->middleware('auth:sanctum')->group(function () {
    Route::get('/availability', [DeliveryController::class, 'getAvailability']);
    Route::post('/availability', [DeliveryController::class, 'updateAvailability']);
    Route::get('/jobs/available', [DeliveryController::class, 'getAvailableJobs']);
    Route::post('/jobs/{orderId}/accept', [DeliveryController::class, 'acceptOrder']);
    Route::post('/jobs/{orderId}/reject', [DeliveryController::class, 'rejectOrder']);
    Route::get('/orders/active', [DeliveryController::class, 'getActiveOrder']);
    Route::get('/orders/completed', [DeliveryController::class, 'getCompletedOrders']);
    Route::patch('/orders/{orderId}/status', [DeliveryController::class, 'updateOrderStatus']);
    Route::get('/stats', [DeliveryController::class, 'getStats']);
    Route::get('/settings', [DeliveryController::class, 'getSettings']);
    Route::patch('/settings', [DeliveryController::class, 'updateSettings']);
});

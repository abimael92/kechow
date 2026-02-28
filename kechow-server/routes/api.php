<?php

use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\Driver\DeliveryController;
use Illuminate\Support\Facades\Route;

Route::middleware(['throttle:60,1'])->prefix('v1')->group(function () {
    require app_path('Modules/Auth/routes.php');
    require app_path('Modules/Owner/routes.php');
    require app_path('Modules/Restaurant/routes.php');
    require app_path('Modules/Order/routes.php');
    require app_path('Modules/Cart/routes.php');

    Route::prefix('admin')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/ledger', [AdminController::class, 'ledger']);
        Route::get('/exceptions', [AdminController::class, 'exceptions']);
        Route::get('/deliveries/in-transit', [AdminController::class, 'inTransitDeliveries']);
    });

    Route::prefix('delivery')->middleware(['auth:sanctum', 'role:delivery'])->group(function () {
        Route::get('/availability', [DeliveryController::class, 'getAvailability']);
        Route::post('/availability', [DeliveryController::class, 'updateAvailability']);
        Route::get('/jobs/available', [DeliveryController::class, 'getAvailableJobs']);
        Route::post('/jobs/{orderId}/accept', [DeliveryController::class, 'acceptOrder']);
        Route::post('/jobs/{orderId}/reject', [DeliveryController::class, 'rejectOrder']);
        Route::get('/orders/active', [DeliveryController::class, 'getActiveOrder']);
        Route::get('/orders/completed', [DeliveryController::class, 'getCompletedOrders']);
        Route::get('/orders/{orderId}', [DeliveryController::class, 'getOrderDetail']);
        Route::patch('/orders/{orderId}/status', [DeliveryController::class, 'updateOrderStatus']);
        Route::get('/stats', [DeliveryController::class, 'getStats']);
        Route::get('/earnings', [DeliveryController::class, 'getEarnings']);
        Route::get('/settings', [DeliveryController::class, 'getSettings']);
        Route::patch('/settings', [DeliveryController::class, 'updateSettings']);
    });
});

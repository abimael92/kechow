<?php
// app/Modules/Order/routes.php
use Illuminate\Support\Facades\Route;
use App\Modules\Order\Controllers\OrderController;

Route::prefix('customer')
    ->middleware(['auth:sanctum', 'role:customer'])
    ->group(function () {

        Route::get('orders', [OrderController::class, 'index']);
        Route::post('orders', [OrderController::class, 'store']);
        Route::get('orders/{order}', [OrderController::class, 'show']);
        Route::post('orders/{order}/cancel', [OrderController::class, 'cancel']);
    });

Route::prefix('owner')
    ->middleware(['auth:sanctum', 'role:owner'])
    ->group(function () {

        Route::get('restaurant/orders', [OrderController::class, 'restaurantOrders']);
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus']);
    });

// Deprecated: use /delivery/* (DeliveryController) for driver flows. Kept for backward compatibility; role enforced.
Route::prefix('driver')
    ->middleware(['auth:sanctum', 'role:delivery'])
    ->group(function () {

        Route::get('orders/available', [OrderController::class, 'driverOrders']);
        Route::post('orders/{order}/accept', [OrderController::class, 'acceptOrder']);
        Route::post('orders/{order}/start-delivery', [OrderController::class, 'startDelivery']);
        Route::post('orders/{order}/complete-delivery', [OrderController::class, 'completeDelivery']);
    });

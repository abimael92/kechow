<?php
// app/Modules/Order/routes.php
use App\Modules\Order\Controllers\OrderController;

Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index']);
    Route::get('/{order}', [OrderController::class, 'show']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [OrderController::class, 'store']);
        Route::patch('/{order}/status', [OrderController::class, 'updateStatus']);
        Route::post('/{order}/cancel', [OrderController::class, 'cancel']);

        // Restaurant owner routes
        Route::get('/restaurant/orders', [OrderController::class, 'restaurantOrders']);

        // Driver routes
        Route::get('/driver/available', [OrderController::class, 'driverOrders']);
        Route::post('/{order}/accept', [OrderController::class, 'acceptOrder']);
    });
});

<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Restaurant\Controllers\RestaurantController;
use App\Modules\Restaurant\Controllers\MenuItemController;
use App\Modules\Restaurant\Controllers\OrderController;
use App\Docs\DocsController;
use App\Docs\FullDocsController;
use App\Http\Controllers\Api\AuthController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);

Route::apiResource('menu-items', MenuItemController::class);
Route::apiResource('orders', OrderController::class);

// If DocsController and FullDocsController are single-action (invokable)
Route::get('/docs', DocsController::class);
Route::get('/full-docs', FullDocsController::class);

// Auth routes
// Route::post('/login', [AuthController::class, 'login'])->middleware('cors');
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware(['auth:sanctum', 'business.owner'])->group(function () {
    Route::apiResource('menu-items', MenuItemController::class);
    Route::post('orders/{order}/status', [OrderStatusController::class, 'updateStatus']);
    Route::get('restaurants/{restaurant}/orders', [OrderController::class, 'restaurantOrders']);
});


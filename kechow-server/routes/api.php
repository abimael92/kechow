<?php

use Illuminate\Support\Facades\Route;
use App\Modules\Restaurant\Controllers\MenuItemController;
use App\Modules\Restaurant\Controllers\OrderController;
use App\Docs\DocsController;
use App\Docs\FullDocsController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);

Route::apiResource('menu-items', MenuItemController::class);
Route::apiResource('orders', OrderController::class);

Route::get('/docs', DocsController::class);
Route::get('/full-docs', FullDocsController::class);


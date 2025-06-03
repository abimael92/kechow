<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\MenuItemController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);

Route::apiResource('menu-items', MenuItemController::class);

Route::get('/docs', \App\Http\Controllers\Api\DocsController::class);

Route::get('/full-docs', \App\Http\Controllers\Api\FullDocsController::class);

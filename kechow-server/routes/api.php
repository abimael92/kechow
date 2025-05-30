<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\RestaurantController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{restaurant}', [RestaurantController::class, 'show']);
Route::post('/restaurants', [RestaurantController::class, 'store']);
Route::put('/restaurants/{restaurant}', [RestaurantController::class, 'update']);
Route::delete('/restaurants/{restaurant}', [RestaurantController::class, 'destroy']);


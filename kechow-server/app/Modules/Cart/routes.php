<?php

use App\Modules\Cart\Controllers\CartController;

Route::prefix('carts')->middleware('auth:sanctum')->group(function () {
    Route::get('current', [CartController::class, 'current']);
    Route::post('/', [CartController::class, 'store']);
    Route::put('{cart}/items', [CartController::class, 'updateItems']);
    Route::delete('{cart}/items/{cartItem}', [CartController::class, 'removeItem']);
});

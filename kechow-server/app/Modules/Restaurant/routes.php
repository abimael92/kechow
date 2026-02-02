<?php
// app/Modules/Restaurant/routes.php
use App\Modules\Restaurant\Controllers\RestaurantController;
use App\Modules\Restaurant\Controllers\MenuItemController;

Route::prefix('restaurants')->group(function () {
    // Public routes
    Route::get('/', [RestaurantController::class, 'index']);
    // Owner list must be before /{restaurant} so /owner/my-restaurants is not matched as id
    Route::get('/owner/my-restaurants', [RestaurantController::class, 'ownerRestaurants'])->middleware('auth:sanctum');
    Route::get('/{restaurant}', [RestaurantController::class, 'show']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/', [RestaurantController::class, 'store']);
        Route::put('/{restaurant}', [RestaurantController::class, 'update']);
        Route::delete('/{restaurant}', [RestaurantController::class, 'destroy']);
        Route::patch('/{restaurant}/toggle-status', [RestaurantController::class, 'toggleStatus']);

        // Menu items
        Route::prefix('/{restaurant}/menu-items')->group(function () {
            Route::get('/', [MenuItemController::class, 'index']);
            Route::get('/categories', [MenuItemController::class, 'getCategories']);
            Route::post('/', [MenuItemController::class, 'store']);
            Route::get('/{menuItem}', [MenuItemController::class, 'show']);
            Route::put('/{menuItem}', [MenuItemController::class, 'update']);
            Route::delete('/{menuItem}', [MenuItemController::class, 'destroy']);
            Route::patch('/{menuItem}/toggle-availability', [MenuItemController::class, 'toggleAvailability']);
        });
    });
});

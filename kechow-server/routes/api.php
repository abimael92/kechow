<?php

use App\Http\Controllers\Api\Customer\AddressController;
use App\Http\Controllers\Api\Customer\ProfileController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Artisan;

// Load Auth module routes
require app_path('Modules/Auth/routes.php');

// Customer: profile and saved addresses (auth:sanctum)
Route::prefix('customer')->middleware('auth:sanctum')->group(function () {
    Route::get('profile', [ProfileController::class, 'show']);
    Route::put('profile', [ProfileController::class, 'update']);
    Route::get('addresses', [AddressController::class, 'index']);
    Route::post('addresses', [AddressController::class, 'store']);
    Route::put('addresses/{address}', [AddressController::class, 'update']);
    Route::delete('addresses/{address}', [AddressController::class, 'destroy']);
    Route::patch('addresses/{address}/default', [AddressController::class, 'setDefault']);
});

// Load Owner module routes (admin-only owner management)
require app_path('Modules/Owner/routes.php');

// Load Restaurant module routes (owner CRUD, menu items)
require app_path('Modules/Restaurant/routes.php');

// Load Order module routes (customer orders, owner restaurant orders, delivery)
require app_path('Modules/Order/routes.php');

// Load Cart module routes (customer cart)
require app_path('Modules/Cart/routes.php');

// Load Driver module routes
require app_path('Modules/Driver/routes.php');

// Owner dashboard, analytics, orders (auth:sanctum, scoped to owner's restaurants)
require app_path('Modules/Owner/routes_owner.php');

// One-time setup route: sessions table + seed users
Route::get('/setup-backend/one-time-setup', function () {
    // Create sessions table
    Artisan::call('session:table');
    Artisan::call('migrate', ['--force' => true]);

    // Seed users
    $users = [
        [
            'name' => 'cliente',
            'email' => 'cliente@cliente.com',
            'password' => Hash::make('123456'),
            'role' => 'customer',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'name' => 'negocio',
            'email' => 'negocio@negocio.com',
            'password' => Hash::make('123456'),
            'role' => 'owner',
            'created_at' => now(),
            'updated_at' => now(),
        ],
        [
            'name' => 'entrega',
            'email' => 'entrega@entrega.com',
            'password' => Hash::make('123456'),
            'role' => 'delivery',
            'created_at' => now(),
            'updated_at' => now(),
        ],
    ];

    foreach ($users as $user) {
        DB::table('users')->updateOrInsert(
            ['email' => $user['email']],
            $user
        );
    }

    return ['message' => '✅ Sessions table created and users seeded'];
});

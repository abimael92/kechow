<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json(['message' => 'Kechow backend is working!']);
});

// Combined route: create sessions table + seed users
Route::get('/setup-backend', function () {
    // 1️⃣ Create sessions table
    Artisan::call('session:table');
    Artisan::call('migrate', ['--force' => true]);

    // 2️⃣ Seed initial users
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

    return '✅ Sessions table created and users seeded';
});

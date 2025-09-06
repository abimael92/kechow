<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController; // <-- missing import

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test', function () {
    return response()->json(['message' => 'Kechow backend is working!']);
});




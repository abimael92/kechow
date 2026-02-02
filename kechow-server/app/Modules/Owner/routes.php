<?php

/**
 * Owner module routes.
 * - Admin-only owner management: GET/POST/PUT/PATCH/DELETE /owners
 * - Middleware: auth:sanctum, role:admin
 */

use App\Modules\Owner\Controllers\OwnerManagementController;
use Illuminate\Support\Facades\Route;

Route::prefix('owners')->middleware(['auth:sanctum', 'role:admin'])->group(function () {
    Route::get('/', [OwnerManagementController::class, 'index']);
    Route::get('/{owner}', [OwnerManagementController::class, 'show']);
    Route::post('/', [OwnerManagementController::class, 'store']);
    Route::match(['put', 'patch'], '/{owner}', [OwnerManagementController::class, 'update']);
    Route::delete('/{owner}', [OwnerManagementController::class, 'destroy']);
});

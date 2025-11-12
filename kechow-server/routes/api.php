<?php
// routes/api.php
use Illuminate\Support\Facades\Route;

// Load module routes
Route::prefix('api')->group(function () {
    require app_path('Modules/Auth/routes.php');
    require app_path('Modules/Restaurant/routes.php');
    require app_path('Modules/Order/routes.php');
});

// Migration route
Route::get('/run-migrations', function () {
    try {
        Artisan::call('migrate', ['--force' => true]);
        return response()->json(['message' => 'Migrations completed successfully']);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'Migration failed',
            'error' => $e->getMessage()
        ], 500);
    }
});

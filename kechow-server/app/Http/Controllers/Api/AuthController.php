<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Handle user login - SUPER SIMPLE VERSION
     */
    public function login(Request $request)
    {
        try {
            // JUST RETURN A SIMPLE MESSAGE - NO DATABASE, NO MODELS
            return response()->json([
                'message' => 'Login endpoint is working! 🎉',
                'received_data' => $request->all(),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            // This will show us the exact error
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTrace()
            ], 500);
        }
    }

    /**
     * Handle user registration - SUPER SIMPLE VERSION
     */
    public function register(Request $request)
    {
        try {
            // JUST RETURN A SIMPLE MESSAGE - NO DATABASE, NO MODELS
            return response()->json([
                'message' => 'Register endpoint is working! 🎉',
                'received_data' => $request->all(),
                'status' => 'success'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ], 500);
        }
    }
}

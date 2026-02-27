<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    /**
     * SPA auth: session-based (HttpOnly cookie) when from stateful domain.
     * Returns user only; no token in response. Session cookie is set by Laravel.
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|string|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        Auth::login($user, $request->boolean('remember', true));

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Register and log in via session (HttpOnly cookie). Returns user only.
     */
    public function register(Request $request): JsonResponse
    {
        $rules = [
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:customer,owner,delivery',
        ];
        if ($request->role === 'owner') {
            $rules['restaurant_name'] = 'required|string|max:255';
        }
        $request->validate($rules);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        if ($request->role === 'owner' && $request->restaurant_name) {
            Restaurant::create([
                'name'         => $request->restaurant_name,
                'address'      => 'Por definir',
                'city'         => 'Por definir',
                'state'        => null,
                'zip_code'     => null,
                'phone'        => null,
                'email'        => $request->email,
                'opening_time' => '09:00',
                'closing_time' => '22:00',
                'owner_id'     => $user->id,
            ]);
        }

        Auth::login($user, false);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role'  => $user->role,
            ],
        ], 201);
    }

    /**
     * Return current authenticated user (session or Bearer token).
     */
    public function user(Request $request): JsonResponse
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    /**
     * Log out and invalidate session. Revoke current API token if request was token-based.
     */
    public function logout(Request $request): JsonResponse
    {
        $user = $request->user();
        if ($user) {
            try {
                $token = $user->currentAccessToken();
                if ($token) {
                    $token->delete();
                }
            } catch (\Throwable $e) {
                // Session-based auth: no token to revoke
            }
        }
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(null, 204);
    }
}

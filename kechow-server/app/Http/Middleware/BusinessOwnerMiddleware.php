<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class BusinessOwnerMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();
        $restaurant = $request->route('restaurant');

        if ($restaurant && $restaurant->owner_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return $next($request);
    }
}

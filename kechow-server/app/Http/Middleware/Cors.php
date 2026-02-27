<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Cors
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        $origins = config('cors.allowed_origins', []);
        $origin = $request->headers->get('Origin');
        if ($origin && in_array($origin, $origins, true)) {
            $response->headers->set('Access-Control-Allow-Origin', $origin);
        } elseif (!empty($origins)) {
            $response->headers->set('Access-Control-Allow-Origin', $origins[0]);
        }
        $response->headers->set('Access-Control-Allow-Methods', implode(', ', config('cors.allowed_methods', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'])));
        $response->headers->set('Access-Control-Allow-Headers', implode(', ', config('cors.allowed_headers', ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'])));
        $response->headers->set('Access-Control-Allow-Credentials', config('cors.supports_credentials', true) ? 'true' : 'false');

        return $response;
    }
}

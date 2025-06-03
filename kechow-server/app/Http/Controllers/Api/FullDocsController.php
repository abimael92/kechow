<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Artisan;

class FullDocsController extends Controller
{
    public function __invoke()
    {
        Artisan::call('route:list', ['--json' => true]);
        $routes = json_decode(Artisan::output(), true);

        $apiRoutes = [];

        foreach ($routes as $route) {
            // Filter only API routes with controllers
            if (
                str_starts_with($route['uri'], 'api/') &&
                isset($route['action']) &&
                is_string($route['action']) &&
                str_contains($route['action'], 'Controller@')
            ) {
                $controller = explode('@', $route['action'])[0];
                $method = explode('@', $route['action'])[1];
                $apiRoutes[$controller][$route['method'] . ' /' . $route['uri']] = $method;
            }
        }

        return response()->json($apiRoutes);
    }
}

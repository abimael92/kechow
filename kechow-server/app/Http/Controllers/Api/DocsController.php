<?php

namespace App\Http\Controllers\Api;

use Illuminate\Routing\Controller;

class DocsController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'RestaurantController' => [
                'GET /api/restaurants' => 'Get all restaurants',
                'POST /api/restaurants' => 'Create a new restaurant',
                'GET /api/restaurants/{id}' => 'Get a specific restaurant',
                'PUT /api/restaurants/{id}' => 'Update a restaurant',
                'DELETE /api/restaurants/{id}' => 'Delete a restaurant',
            ],
        ]);
    }
}

<?php

namespace App\Docs;

use Illuminate\Routing\Controller;

class DocsController extends Controller
{
    public function __invoke()
    {
        return response()->json([
            'RestaurantController' => [
                'GET /restaurants' => 'Get all restaurants',
                'POST /restaurants' => 'Create a new restaurant',
                'GET /restaurants/{id}' => 'Get a specific restaurant',
                'PUT /restaurants/{id}' => 'Update a restaurant',
                'DELETE /restaurants/{id}' => 'Delete a restaurant',
            ],
        ]);
    }
}

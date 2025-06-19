<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Restaurants",
 *     description="Restaurant operations"
 * )
 */
class RestaurantController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/restaurants",
     *     tags={"Restaurants"},
     *     summary="Get all restaurants",
     *     @OA\Response(response=200, description="List of restaurants")
     * )
     */
    public function index()
    {
        return Restaurant::all();
    }

    /**
     * @OA\Post(
     *     path="/api/restaurants",
     *     tags={"Restaurants"},
     *     summary="Create a new restaurant",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Restaurant created")
     * )
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $restaurant = Restaurant::create($data);
        return response()->json($restaurant, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/restaurants/{id}",
     *     tags={"Restaurants"},
     *     summary="Get a specific restaurant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Restaurant data"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show($id)
    {
        return Restaurant::findOrFail($id);
    }

    /**
     * @OA\Put(
     *     path="/api/restaurants/{id}",
     *     tags={"Restaurants"},
     *     summary="Update a restaurant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Restaurant updated")
     * )
     */
    public function update(Request $request, $id)
    {
        $restaurant = Restaurant::findOrFail($id);
        $restaurant->update($request->all());
        return response()->json($restaurant, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/restaurants/{id}",
     *     tags={"Restaurants"},
     *     summary="Delete a restaurant",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Deleted successfully")
     * )
     */
    public function destroy($id)
    {
        Restaurant::destroy($id);
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Restaurant;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Info(
 *     title="Kechow API",
 *     version="1.0.0"
 * )
 *
 * @OA\Server(
 *     url=L5_SWAGGER_CONST_HOST,
 *     description="Kechow API Server"
 * )
 */

/**
 * @OA\Tag(
 *     name="Restaurants",
 *     description="Restaurant API endpoints"
 * )
 */
class RestaurantController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/restaurants",
     *     tags={"Restaurants"},
     *     summary="Get all restaurants",
     *     @OA\Response(response=200, description="OK")
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
 *         @OA\JsonContent(ref="#/components/schemas/Restaurant")
 *     ),
 *     @OA\Response(
 *         response=201,
 *         description="Created"
 *     )
 * )
 */

    public function store(Request $request)
    {
        $restaurant = Restaurant::create($request->all());
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
     *     @OA\Response(response=200, description="OK")
     * )
     */
    public function show(Restaurant $restaurant)
    {
        return response()->json($restaurant);
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
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/Restaurant")
     *     ),
     *     @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, Restaurant $restaurant)
    {
        $restaurant->update($request->all());
        return response()->json($restaurant);
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
     *     @OA\Response(response=204, description="No Content")
     * )
     */
    public function destroy(Restaurant $restaurant)
    {
        $restaurant->delete();
        return response()->json(null, 204);
    }
}

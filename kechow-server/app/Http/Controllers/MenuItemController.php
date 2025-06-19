<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;
use OpenApi\Annotations as OA;

/**
 * @OA\Tag(
 *     name="Menu Items",
 *     description="Menu Item operations"
 * )
 */
class MenuItemController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/menu-items",
     *     tags={"Menu Items"},
     *     summary="Get all menu items",
     *     @OA\Response(
     *         response=200,
     *         description="List of menu items"
     *     )
     * )
     */
    public function index()
    {
        return MenuItem::all();
    }

    /**
     * @OA\Post(
     *     path="/api/menu-items",
     *     tags={"Menu Items"},
     *     summary="Create a new menu item",
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"restaurant_id", "name", "price"},
     *             @OA\Property(property="restaurant_id", type="integer"),
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="price", type="number"),
     *             @OA\Property(property="is_available", type="boolean")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Menu item created")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric',
            'is_available' => 'boolean',
        ]);

        $menuItem = MenuItem::create($validated);
        return response()->json($menuItem, 201);
    }

    /**
     * @OA\Get(
     *     path="/api/menu-items/{id}",
     *     tags={"Menu Items"},
     *     summary="Get a specific menu item",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Menu item details"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show($id)
    {
        return MenuItem::findOrFail($id);
    }

    /**
     * @OA\Put(
     *     path="/api/menu-items/{id}",
     *     tags={"Menu Items"},
     *     summary="Update a menu item",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="description", type="string"),
     *             @OA\Property(property="price", type="number"),
     *             @OA\Property(property="is_available", type="boolean")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Menu item updated"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function update(Request $request, $id)
    {
        $menuItem = MenuItem::findOrFail($id);
        $menuItem->update($request->all());
        return response()->json($menuItem, 200);
    }

    /**
     * @OA\Delete(
     *     path="/api/menu-items/{id}",
     *     tags={"Menu Items"},
     *     summary="Delete a menu item",
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=204, description="Deleted successfully"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function destroy($id)
    {
        MenuItem::destroy($id);
        return response()->json(null, 204);
    }
}

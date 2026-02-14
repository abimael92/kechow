<?php
// app/Modules/Restaurant/Controllers/RestaurantController.php

namespace App\Modules\Restaurant\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Models\Restaurant;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Requests\CreateRestaurantRequest;
use App\Modules\Restaurant\Requests\UpdateRestaurantRequest;
use App\Modules\Restaurant\Requests\UploadLogoRequest;
use Illuminate\Support\Facades\Storage;
use App\Modules\Restaurant\Resources\RestaurantResource;
use App\Modules\Restaurant\Resources\RestaurantCollection;
use App\Modules\Restaurant\Resources\MenuItemResource;
use App\Modules\Restaurant\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Illuminate\Support\Facades\File;

class RestaurantController extends Controller
{
    public function __construct(private RestaurantService $restaurantService)
    {}

    /**
     * Get all restaurants with optional filters
     */
    public function index(Request $request): JsonResponse
    {
        $restaurants = $this->restaurantService->getAllRestaurants($request->all());
        return response()->json(new RestaurantCollection($restaurants));
    }

    /**
     * Create a new restaurant (owner only)
     */
    public function store(CreateRestaurantRequest $request): JsonResponse
    {
        $data = array_merge($request->validated(), ['owner_id' => $request->user()->id]);
        $restaurant = $this->restaurantService->createRestaurant($data);
        return response()->json(new RestaurantResource($restaurant), 201);
    }

    /**
     * Get a specific restaurant by ID
     */
    public function show(int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        return response()->json(new RestaurantResource($restaurant));
    }

    /**
     * Get menu items for a specific restaurant
     */
    public function menu(int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        // Get menu items for this restaurant
        $menuItems = MenuItem::where('restaurant_id', $id)
            ->where('is_available', true)
            ->get();

        // Return as collection
        return response()->json($menuItems);
    }

    /**
     * Update a restaurant
     */
    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant): JsonResponse
    {
        // Check if user owns this restaurant
        if ($request->user()->id !== $restaurant->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $updatedRestaurant = $this->restaurantService->updateRestaurant($restaurant, $request->validated());
        return response()->json(new RestaurantResource($updatedRestaurant));
    }

    /**
     * Upload restaurant logo
     */
    public function uploadLogo(UploadLogoRequest $request, Restaurant $restaurant): JsonResponse
    {
        // Check if user owns this restaurant
        if ($request->user()->id !== $restaurant->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $file = $request->file('logo');
        $path = $file->store('restaurant-logos', 'public');
        $filename = basename($path);
        $fullUrl = url("/api/restaurants/logo/{$filename}"); // Use API route
        $restaurant->update(['logo_url' => $fullUrl]);

        return response()->json(['logo_url' => $fullUrl]);
    }

    /**
     * Serve logo file (public, no auth) - avoids 403 on direct storage URLs
     */
    public function serveLogo(string $filename): BinaryFileResponse|JsonResponse
    {
        if (str_contains($filename, '/') || str_contains($filename, '..')) {
            return response()->json(['message' => 'Invalid filename'], 400);
        }

        $path = 'restaurant-logos/' . $filename;

        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $filePath = Storage::disk('public')->path($path);
        $mimeType = File::mimeType($filePath) ?? 'application/octet-stream';

        return response()->file($filePath, [
            'Content-Type' => $mimeType,
            'Access-Control-Allow-Origin' => '*'
        ]);
    }

    /**
     * Delete a restaurant
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        // Check if user owns this restaurant
        if ($request->user()->id !== $restaurant->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->restaurantService->deleteRestaurant($restaurant);
        return response()->json(null, 204);
    }

    /**
     * Toggle restaurant open/closed status
     */
    public function toggleStatus(Request $request, int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);

        if (!$restaurant) {
            return response()->json(['message' => 'Restaurant not found'], 404);
        }

        // Check if user owns this restaurant
        if ($request->user()->id !== $restaurant->owner_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $updatedRestaurant = $this->restaurantService->toggleRestaurantStatus($restaurant);
        return response()->json(new RestaurantResource($updatedRestaurant));
    }

    /**
     * Get restaurants owned by the authenticated owner
     */
    public function ownerRestaurants(Request $request): JsonResponse
    {
        $restaurants = $this->restaurantService->getRestaurantsByOwner($request->user()->id);
        return response()->json(RestaurantResource::collection($restaurants));
    }

    /**
 * Get menu items for a restaurant (simplified endpoint)
 */
public function getMenu(int $restaurantId): JsonResponse
{
    $menuItems = MenuItem::where('restaurant_id', $restaurantId)
        ->where('is_available', true)
        ->get();

    return response()->json($menuItems);
}
}

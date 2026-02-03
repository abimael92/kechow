<?php
// app/Modules/Restaurant/Controllers/RestaurantController.php
namespace App\Modules\Restaurant\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Models\Restaurant;
use App\Modules\Restaurant\Requests\CreateRestaurantRequest;
use App\Modules\Restaurant\Requests\UpdateRestaurantRequest;
use App\Modules\Restaurant\Requests\UploadLogoRequest;
use Illuminate\Support\Facades\Storage;
use App\Modules\Restaurant\Resources\RestaurantResource;
use App\Modules\Restaurant\Resources\RestaurantCollection;
use App\Modules\Restaurant\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RestaurantController extends Controller
{
    public function __construct(private RestaurantService $restaurantService)
    {}

    public function index(Request $request): JsonResponse
    {
        $restaurants = $this->restaurantService->getAllRestaurants($request->all());
        return response()->json(new RestaurantCollection($restaurants));
    }

    public function store(CreateRestaurantRequest $request): JsonResponse
    {
        $data = array_merge($request->validated(), ['owner_id' => $request->user()->id]);
        $restaurant = $this->restaurantService->createRestaurant($data);
        return response()->json(new RestaurantResource($restaurant), 201);
    }

    public function show(int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);
        return response()->json(new RestaurantResource($restaurant));
    }

    public function update(UpdateRestaurantRequest $request, Restaurant $restaurant): JsonResponse
    {
        $updatedRestaurant = $this->restaurantService->updateRestaurant($restaurant, $request->validated());
        return response()->json(new RestaurantResource($updatedRestaurant));
    }

    public function uploadLogo(UploadLogoRequest $request, Restaurant $restaurant): JsonResponse
    {
        $file = $request->file('logo');
        $path = $file->store('restaurant-logos', 'public');
        $filename = basename($path);
        $fullUrl = url("/api/restaurants/logo/{$filename}");
        $restaurant->update(['logo_url' => $fullUrl]);
        return response()->json(['logo_url' => $fullUrl]);
    }

    /** Serve logo file (public, no auth) - avoids 403 on direct storage URLs. */
    public function serveLogo(string $filename): BinaryFileResponse|JsonResponse
    {
        if (str_contains($filename, '/') || str_contains($filename, '..')) {
            return response()->json(['message' => 'Invalid filename'], 400);
        }
        $path = 'restaurant-logos/' . $filename;
        if (!Storage::disk('public')->exists($path)) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->file(Storage::disk('public')->path($path), [
            'Content-Type' => Storage::disk('public')->mimeType($path),
        ]);
    }

    public function destroy(int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);
        $this->restaurantService->deleteRestaurant($restaurant);
        return response()->json(null, 204);
    }

    public function toggleStatus(int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);
        $updatedRestaurant = $this->restaurantService->toggleRestaurantStatus($restaurant);
        return response()->json(new RestaurantResource($updatedRestaurant));
    }

    public function ownerRestaurants(Request $request): JsonResponse
    {
        $restaurants = $this->restaurantService->getRestaurantsByOwner($request->user()->id);
        return response()->json(RestaurantResource::collection($restaurants));
    }
}

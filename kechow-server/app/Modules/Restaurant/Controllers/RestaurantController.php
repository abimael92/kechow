<?php
// app/Modules/Restaurant/Controllers/RestaurantController.php
namespace App\Modules\Restaurant\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Requests\CreateRestaurantRequest;
use App\Modules\Restaurant\Requests\UpdateRestaurantRequest;
use App\Modules\Restaurant\Resources\RestaurantResource;
use App\Modules\Restaurant\Resources\RestaurantCollection;
use App\Modules\Restaurant\Services\RestaurantService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

    public function update(UpdateRestaurantRequest $request, int $id): JsonResponse
    {
        $restaurant = $this->restaurantService->getRestaurantById($id);
        $updatedRestaurant = $this->restaurantService->updateRestaurant($restaurant, $request->validated());
        return response()->json(new RestaurantResource($updatedRestaurant));
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

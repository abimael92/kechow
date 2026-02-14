<?php
// app/Modules/Restaurant/Controllers/MenuItemController.php
namespace App\Modules\Restaurant\Controllers;  // ← FIX NAMESPACE

use App\Http\Controllers\Controller;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Requests\MenuItemRequest;
use App\Modules\Restaurant\Resources\MenuItemResource;
use App\Modules\Restaurant\Services\MenuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function __construct(private MenuService $menuService)
    {}

    public function index(Request $request, int $restaurant): JsonResponse
    {
        $menuItems = $this->menuService->getMenuItemsByRestaurant($restaurant, $request->all());
        return response()->json(MenuItemResource::collection($menuItems));
    }

    public function getCategories(int $restaurant): JsonResponse
    {
        $categories = $this->menuService->getCategoriesByRestaurant($restaurant);
        return response()->json(['categories' => $categories]);
    }

   public function store(MenuItemRequest $request, int $restaurant): JsonResponse
    {
        $data = $request->validated();
        $data['restaurant_id'] = $restaurant;

        $menuItem = $this->menuService->createMenuItem($data);
        return response()->json(new MenuItemResource($menuItem), 201);
    }

    public function show(int $restaurant, int $id): JsonResponse
    {
        $menuItem = $this->menuService->getMenuItemById($id);
        return response()->json(new MenuItemResource($menuItem));
    }

    public function update(MenuItemRequest $request, int $restaurant, int $id): JsonResponse
    {
        $menuItem = $this->menuService->getMenuItemById($id);
        $updatedMenuItem = $this->menuService->updateMenuItem($menuItem, $request->validated());
        return response()->json(new MenuItemResource($updatedMenuItem));
    }

    public function destroy(int $restaurant, int $id): JsonResponse
    {
        $menuItem = $this->menuService->getMenuItemById($id);
        $this->menuService->deleteMenuItem($menuItem);
        return response()->json(null, 204);
    }

    public function toggleAvailability(int $restaurant, int $id): JsonResponse
    {
        $menuItem = $this->menuService->getMenuItemById($id);
        $updatedItem = $this->menuService->toggleMenuItemAvailability($menuItem);
        return response()->json(new MenuItemResource($updatedItem));
    }
}

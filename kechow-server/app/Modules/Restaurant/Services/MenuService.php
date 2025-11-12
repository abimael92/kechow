<?php
// app/Modules/Restaurant/Services/MenuService.php
namespace App\Modules\Restaurant\Services;

use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class MenuService
{
    public function getMenuItemsByRestaurant(int $restaurantId, array $filters = []): LengthAwarePaginator
    {
        $query = MenuItem::where('restaurant_id', $restaurantId);

        if (isset($filters['is_available'])) {
            $query->where('is_available', $filters['is_available']);
        }

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['search'])) {
            $query->where('name', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
        }

        return $query->paginate($filters['per_page'] ?? 20);
    }

    public function getMenuItemById(int $id): MenuItem
    {
        return MenuItem::with('restaurant')->findOrFail($id);
    }

    public function createMenuItem(array $data): MenuItem
    {
        return MenuItem::create($data);
    }

    public function updateMenuItem(MenuItem $menuItem, array $data): MenuItem
    {
        $menuItem->update($data);
        return $menuItem->fresh('restaurant');
    }

    public function deleteMenuItem(MenuItem $menuItem): bool
    {
        return $menuItem->delete();
    }

    public function toggleMenuItemAvailability(MenuItem $menuItem): MenuItem
    {
        $menuItem->update(['is_available' => !$menuItem->is_available]);
        return $menuItem->fresh();
    }

    public function getCategoriesByRestaurant(int $restaurantId): array
    {
        return MenuItem::where('restaurant_id', $restaurantId)
            ->distinct()
            ->pluck('category')
            ->toArray();
    }
}

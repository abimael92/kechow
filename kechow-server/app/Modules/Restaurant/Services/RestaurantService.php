<?php
// app/Modules/Restaurant/Services/RestaurantService.php
namespace App\Modules\Restaurant\Services;

use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class RestaurantService
{
    public function getAllRestaurants(array $filters = []): LengthAwarePaginator
    {
        $query = Restaurant::with(['menuItems' => function($query) {
            $query->available();
        }]);

        // Apply filters
        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['city'])) {
            $query->where('city', 'like', "%{$filters['city']}%");
        }

        if (isset($filters['nearby'])) {
            $coordinates = explode(',', $filters['nearby']);
            if (count($coordinates) === 2) {
                $query->nearby($coordinates[0], $coordinates[1], $filters['radius'] ?? 10);
            }
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getRestaurantById(int $id): Restaurant
    {
        return Restaurant::with(['menuItems' => function($query) {
            $query->available();
        }, 'owner'])->findOrFail($id);
    }

    public function getRestaurantsByOwner(int $ownerId): Collection
    {
        return Restaurant::with('menuItems')
            ->where('owner_id', $ownerId)
            ->get();
    }

    public function createRestaurant(array $data): Restaurant
    {
        return Restaurant::create($data);
    }

    public function updateRestaurant(Restaurant $restaurant, array $data): Restaurant
    {
        $restaurant->update($data);
        return $restaurant->fresh(['menuItems', 'owner']);
    }

    public function deleteRestaurant(Restaurant $restaurant): bool
    {
        return $restaurant->delete();
    }

    public function toggleRestaurantStatus(Restaurant $restaurant): Restaurant
    {
        $restaurant->update(['is_active' => !$restaurant->is_active]);
        return $restaurant->fresh();
    }
}

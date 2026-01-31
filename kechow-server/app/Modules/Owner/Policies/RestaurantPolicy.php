<?php

namespace App\Modules\Owner\Policies;

use App\Models\User;
use App\Modules\Restaurant\Models\Restaurant;

/**
 * Policy for owner actions on Restaurant.
 * Ensures the authenticated user (owner) can only act on their own restaurants.
 * Register in AuthServiceProvider when enabling owner CRUD authorization.
 */
class RestaurantPolicy
{
    /**
     * Determine whether the user can view any restaurants (owner scope).
     */
    public function viewAny(User $user): bool
    {
        return $user->role === 'owner' || $user->role === 'admin';
    }

    /**
     * Determine whether the user can view the restaurant.
     */
    public function view(User $user, Restaurant $restaurant): bool
    {
        return $restaurant->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can create restaurants.
     */
    public function create(User $user): bool
    {
        return $user->role === 'owner' || $user->role === 'admin';
    }

    /**
     * Determine whether the user can update the restaurant.
     */
    public function update(User $user, Restaurant $restaurant): bool
    {
        return $restaurant->owner_id === $user->id || $user->role === 'admin';
    }

    /**
     * Determine whether the user can delete the restaurant.
     */
    public function delete(User $user, Restaurant $restaurant): bool
    {
        return $restaurant->owner_id === $user->id || $user->role === 'admin';
    }
}

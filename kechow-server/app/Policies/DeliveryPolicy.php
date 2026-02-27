<?php

namespace App\Policies;

use App\Models\Delivery;
use App\Models\User;

class DeliveryPolicy
{
    /**
     * Driver can update only their own delivery (status transitions).
     */
    public function update(User $user, Delivery $delivery): bool
    {
        if ($user->role !== 'delivery') {
            return false;
        }

        $driver = $delivery->driver;
        if (!$driver) {
            return false;
        }

        return (int) $driver->user_id === (int) $user->id;
    }

    /**
     * Driver can view only their own delivery.
     */
    public function view(User $user, Delivery $delivery): bool
    {
        return $this->update($user, $delivery);
    }
}

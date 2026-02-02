<?php
// app/Modules/Order/Services/OrderService.php
namespace App\Modules\Order\Services;

use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use App\Modules\Order\OrderStateMachine;
use App\Modules\Restaurant\Models\MenuItem;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class OrderService
{
    public function getAllOrders(array $filters = []): Collection
    {
        $query = Order::with('items.menuItem', 'restaurant', 'user', 'driver');

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        if (isset($filters['restaurant_id'])) {
            $query->where('restaurant_id', $filters['restaurant_id']);
        }

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get();
    }

    public function getOrderById(int $id): Order
    {
        return Order::with('items.menuItem', 'restaurant', 'user', 'driver')->findOrFail($id);
    }

    public function createOrder(array $data): Order
    {
        return DB::transaction(function () use ($data) {
            $total = 0;

            // Calculate total and validate menu items
            foreach ($data['items'] as $item) {
                $menuItem = MenuItem::available()->findOrFail($item['menu_item_id']);
                $total += $menuItem->price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $data['user_id'],
                'restaurant_id' => $data['restaurant_id'],
                'total' => $total,
                'status' => Order::STATUS_PENDING,
                'delivery_address' => $data['delivery_address'],
                'delivery_notes' => $data['delivery_notes'] ?? null,
            ]);

            // Create order items
            foreach ($data['items'] as $item) {
                $menuItem = MenuItem::findOrFail($item['menu_item_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $item['quantity'],
                    'price' => $menuItem->price,
                ]);
            }

            return $order->load('items.menuItem', 'restaurant');
        });
    }

    /**
     * Update order status only if the transition is valid for the given role.
     * @throws \InvalidArgumentException when transition is not allowed
     */
    public function updateOrderStatus(Order $order, string $status, ?string $role = null): Order
    {
        if (! OrderStateMachine::canTransition($order->status, $status, $role)) {
            throw new \InvalidArgumentException(
                "Invalid order state transition: {$order->status} → {$status}" .
                ($role ? " for role {$role}" : '')
            );
        }
        $order->update(['status' => $status]);
        return $order->fresh(['items.menuItem', 'restaurant', 'user', 'driver']);
    }

    public function assignDriver(Order $order, int $driverId): Order
    {
        if (! OrderStateMachine::canTransition($order->status, Order::STATUS_OUT_FOR_DELIVERY, 'owner')) {
            throw new \InvalidArgumentException(
                "Cannot assign driver: order status must be ready, current status is {$order->status}"
            );
        }
        $order->update([
            'driver_id' => $driverId,
            'status' => Order::STATUS_OUT_FOR_DELIVERY
        ]);

        return $order->fresh(['items.menuItem', 'restaurant', 'user', 'driver']);
    }

    public function getRestaurantOrders(int $restaurantId): Collection
    {
        return Order::with('items.menuItem', 'user')
            ->where('restaurant_id', $restaurantId)
            ->latest()
            ->get();
    }

    /** Get orders for multiple restaurants (e.g. owner's restaurants). */
    public function getOrdersByRestaurantIds(array $restaurantIds): Collection
    {
        return Order::with('items.menuItem', 'user')
            ->whereIn('restaurant_id', $restaurantIds)
            ->latest()
            ->get();
    }

    public function getAvailableDriverOrders(): Collection
    {
        return Order::with('restaurant')
            ->where('status', Order::STATUS_READY)
            ->whereNull('driver_id')
            ->get();
    }

    public function cancelOrder(Order $order): Order
    {
        if (!$order->canBeCancelled()) {
            throw new \Exception('Order cannot be cancelled at this stage.');
        }

        $order->update(['status' => Order::STATUS_CANCELLED]);
        return $order->fresh();
    }
}

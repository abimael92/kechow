<?php

namespace App\Http\Controllers\Api\Driver;

use App\Http\Controllers\Controller;
use App\Models\Driver;
use App\Models\Delivery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class DeliveryController extends Controller
{
    /**
     * Get driver availability
     */
    public function getAvailability(): JsonResponse
    {
        try {
            $user = Auth::user();

            $driver = Driver::firstOrCreate(
                ['user_id' => $user->id],
                ['is_online' => false, 'status' => 'offline']
            );

            $hasActiveOrder = Delivery::where('driver_id', $driver->id)
                ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
                ->exists();

            return response()->json([
                'isOnline' => $driver->is_online,
                'totalOnlineHours' => 0,
                'currentSessionStart' => $driver->is_online ? $driver->updated_at?->toIso8601String() : null,
                'hasActiveOrder' => $hasActiveOrder
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update driver availability
     */
    public function updateAvailability(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'isOnline' => 'required|boolean'
            ]);

            $userId = $request->user()->id;

            if (!$userId) {
                return response()->json(['error' => 'User not authenticated'], 401);
            }

            $driver = Driver::firstOrCreate(
                ['user_id' => $userId],
                [
                    'status' => 'offline',
                    'is_online' => false,
                    'vehicle_type' => 'motorcycle',
                    'rating' => 5.0,
                    'total_deliveries' => 0
                ]
            );

            $driver->update([
                'is_online' => $request->isOnline,
                'status' => $request->isOnline ? 'online' : 'offline',
            ]);

            return response()->json([
                'isOnline' => $driver->is_online,
                'totalOnlineHours' => 0,
                'currentSessionStart' => $request->isOnline ? now()->toIso8601String() : null
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available jobs
     */
public function getAvailableJobs(): JsonResponse
{
    try {
        $user = Auth::user();
        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver || !$driver->is_online) {
            return response()->json(['jobs' => []]);
        }

        $orders = \App\Modules\Order\Models\Order::where('status', 'pending')
            ->whereDoesntHave('delivery')
            ->with('restaurant', 'items')
            ->take(10)
            ->get();

        $jobs = $orders->map(function ($order) {
            return [
                'id' => $order->id,
                'pickup' => $order->restaurant->address ?? 'Restaurante',
                'dropoff' => $order->delivery_address ?? 'Dirección',
                'distance' => 2.5,
                'estimatedTime' => 15,
                'amount' => (float) $order->total,
                'restaurant' => [
                    'name' => $order->restaurant->name ?? 'Restaurante'
                ],
                'items' => $order->items ?? []
            ];
        });

        return response()->json(['jobs' => $jobs]);

    } catch (\Exception $e) {
        // 🔥 ESTO MOSTRARÁ EL ERROR REAL
        return response()->json([
            'error' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine()
        ], 500);
    }
}

    /**
     * Accept order
     */
    public function acceptOrder($orderId): JsonResponse
    {
        try {
            $user = Auth::user();
            $driver = Driver::where('user_id', $user->id)->first();

            if (!$driver) {
                return response()->json(['error' => 'Driver not found'], 404);
            }

            // Check if order is already assigned
            $existingDelivery = Delivery::where('order_id', $orderId)->first();
            if ($existingDelivery) {
                return response()->json(['error' => 'Order already assigned'], 400);
            }

            $delivery = Delivery::create([
                'order_id' => $orderId,
                'driver_id' => $driver->id,
                'status' => 'assigned',
                'assigned_at' => now()
            ]);

            // Load the order with relations
            $delivery->load('order.restaurant', 'order.user');

            return response()->json([
                'id' => $delivery->order->id,
                'status' => 'accepted',
                'pickup' => $delivery->order->restaurant->address ?? 'Restaurante',
                'dropoff' => $delivery->order->delivery_address ?? 'Dirección',
                'amount' => (float) $delivery->order->total,
                'restaurant' => [
                    'name' => $delivery->order->restaurant->name ?? 'Restaurante'
                ],
                'items' => $delivery->order->items ?? []
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function rejectOrder($orderId): JsonResponse
    {
        return response()->json(['message' => 'Order rejected']);
    }

    public function getCompletedOrders(): JsonResponse
    {
        return response()->json([]);
    }

public function getActiveOrder(): JsonResponse
{
    try {
        $user = Auth::user();
        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver) {
            return response()->json(null);
        }

        $activeDelivery = Delivery::with('order.restaurant', 'order.user')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
            ->first();

        if (!$activeDelivery) {
            return response()->json(null); // 200 con null, no 404
        }

        $order = $activeDelivery->order;
        return response()->json([
            'id' => $order->id,
            'status' => $this->mapDeliveryStatus($activeDelivery->status),
            'pickup' => $order->restaurant->address ?? 'Restaurante',
            'dropoff' => $order->delivery_address ?? 'Dirección',
            'amount' => (float) $order->total,
            'restaurant' => [
                'name' => $order->restaurant->name ?? 'Restaurante'
            ],
            'items' => $order->items ?? []
        ]);

    } catch (\Exception $e) {
        return response()->json(null);
    }
}

    private function mapDeliveryStatus($status)
    {
        $map = [
            'assigned' => 'accepted',
            'picked_up' => 'picked_up',
            'in_transit' => 'on_the_way',
            'delivered' => 'delivered'
        ];
        return $map[$status] ?? $status;
    }

    public function getStats(): JsonResponse
    {
        return response()->json([
            'todayOrders' => 0,
            'earnings' => 0,
            'rating' => 5.0,
            'completed' => 0
        ]);
    }

    public function getSettings(): JsonResponse
    {
        return response()->json([
            'vehicleType' => 'motorcycle',
            'maxDistance' => 10,
            'autoAccept' => false,
            'notificationsEnabled' => true,
            'language' => 'es'
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $request->validate([
            'vehicleType' => 'sometimes|string',
            'maxDistance' => 'sometimes|numeric',
            'autoAccept' => 'sometimes|boolean',
            'notificationsEnabled' => 'sometimes|boolean'
        ]);

        return response()->json($request->all());
    }
}

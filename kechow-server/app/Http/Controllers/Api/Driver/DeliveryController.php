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

            // Return simple format without success/data wrapper
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

            // Check if user is authenticated
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

            // Return SIMPLE format that frontend expects (no success/data wrapper)
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

    public function acceptOrder($orderId)
    {
        $user = Auth::user();
        $driver = Driver::where('user_id', $user->id)->first();

        if (!$driver) {
            return response()->json(['success' => false, 'message' => 'Driver not found'], 404);
        }

        Delivery::create([
            'order_id' => $orderId,
            'driver_id' => $driver->id,
            'status' => 'assigned',
            'assigned_at' => now()
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order accepted'
        ]);
    }

    public function rejectOrder($orderId)
    {
        return response()->json([
            'success' => true,
            'message' => 'Order rejected'
        ]);
    }

    public function getCompletedOrders()
    {
        return response()->json([
            'success' => true,
            'data' => ['orders' => []]
        ]);
    }

    public function getActiveOrder(): JsonResponse
    {
        try {
            $user = Auth::user();
            $driver = Driver::where('user_id', $user->id)->first();

            if (!$driver) {
                return response()->json(null); // Return null, not wrapped
            }

            $activeDelivery = Delivery::with('order.restaurant', 'order.user')
                ->where('driver_id', $driver->id)
                ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
                ->first();

            if (!$activeDelivery) {
                return response()->json(null);
            }

            // Format the order data to match what frontend expects
            $order = $activeDelivery->order;
            return response()->json([
                'id' => $order->id,
                'status' => $this->mapDeliveryStatus($activeDelivery->status),
                'restaurant' => [
                    'id' => $order->restaurant->id,
                    'name' => $order->restaurant->name,
                    'address' => $order->restaurant->address,
                ],
                'customer' => [
                    'id' => $order->user->id,
                    'name' => $order->user->name,
                    'address' => $order->delivery_address,
                ],
                'amount' => (float) $order->total,
                'fee' => 30.0,
                'items' => [] // Add items if needed
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Helper method to map delivery status
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

    public function getStats()
    {
        return response()->json([
            'success' => true,
            'data' => [
                'today_deliveries' => 0,
                'today_earnings' => 0,
                'rating' => 5.0
            ]
        ]);
    }

    public function getSettings(): JsonResponse
    {
        try {
            // Return simple format without success/data wrapper
            return response()->json([
                'vehicleType' => 'motorcycle',
                'maxDistance' => 10,
                'autoAccept' => false,
                'notificationsEnabled' => true,
                'language' => 'es'
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateSettings(Request $request)
    {
        $request->validate([
            'vehicleType' => 'sometimes|string',
            'maxDistance' => 'sometimes|numeric',
            'autoAccept' => 'sometimes|boolean',
            'notificationsEnabled' => 'sometimes|boolean'
        ]);

        return response()->json([
            'success' => true,
            'data' => $request->all()
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api\Driver;

use App\Http\Controllers\Controller;
use App\Modules\Driver\Models\Driver;
use App\Models\Delivery;
use App\Modules\Order\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

class DeliveryController extends Controller
{
    public function getAvailability(): JsonResponse
    {
        // Safely create the driver WITH the required database fields
        $driver = Driver::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'is_online' => false,
                'status' => 'offline',
                'vehicle_type' => 'motorcycle',
                'rating' => 5.0,
                'total_deliveries' => 0,
                'current_latitude' => 0.00000000,
                'current_longitude' => 0.00000000,
            ]
        );

        $hasActiveOrder = Delivery::where('driver_id', $driver->id)
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
            ->exists();

        return response()->json([
            'isOnline' => (bool)$driver->is_online,
            'totalOnlineHours' => 0,
            'currentSessionStart' => $driver->is_online ? $driver->updated_at?->toIso8601String() : null,
            'hasActiveOrder' => $hasActiveOrder
        ]);
    }

    public function updateAvailability(Request $request): JsonResponse
    {
        $isOnline = filter_var($request->input('isOnline', false), FILTER_VALIDATE_BOOLEAN);

        // Safely create the driver WITH the required database fields
        $driver = Driver::firstOrCreate(
            ['user_id' => Auth::id()],
            [
                'vehicle_type' => 'motorcycle',
                'rating' => 5.0,
                'total_deliveries' => 0,
                'current_latitude' => 0.00000000,
                'current_longitude' => 0.00000000,
            ]
        );

        $driver->is_online = $isOnline;
        $driver->status = $isOnline ? 'online' : 'offline';
        $driver->save();

        return response()->json([
            'isOnline' => (bool)$driver->is_online,
            'status' => $driver->status,
            'currentSessionStart' => $driver->is_online ? now()->toIso8601String() : null
        ]);
    }

    public function getAvailableJobs(): JsonResponse
    {
        $orders = Order::where('status', 'pending')->whereDoesntHave('delivery')->with('restaurant', 'items')->get();
        $jobs = $orders->map(function($o) {
            return [
                'id' => $o->id,
                'pickup' => $o->restaurant->address ?? 'Restaurante',
                'dropoff' => $o->delivery_address ?? 'Dirección',
                'amount' => (float)$o->total,
                'restaurant' => ['name' => $o->restaurant->name ?? 'Restaurante'],
                'items' => $o->items ?? []
            ];
        });
        return response()->json(['jobs' => $jobs]);
    }

    public function getActiveOrder(): JsonResponse
    {
        $driver = Driver::where('user_id', Auth::id())->first();
        if (!$driver) return response()->json(null);

        $active = Delivery::with('order.restaurant', 'order.user')
            ->where('driver_id', $driver->id)
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
            ->first();

        if (!$active) return response()->json(null);

        return response()->json([
            'id' => $active->order->id,
            'status' => $active->status,
            'pickup' => $active->order->restaurant->address,
            'dropoff' => $active->order->delivery_address,
            'amount' => (float)$active->order->total,
            'restaurant' => ['name' => $active->order->restaurant->name],
            'items' => $active->order->items ?? []
        ]);
    }

    public function acceptOrder($orderId): JsonResponse
    {
        $driver = Driver::where('user_id', Auth::id())->first();

        $delivery = new Delivery();
        $delivery->order_id = $orderId;
        $delivery->driver_id = $driver->id;
        $delivery->status = 'assigned';
        $delivery->save();

        return response()->json(['id' => $orderId, 'status' => 'accepted']);
    }

    public function updateOrderStatus(Request $request, $orderId): JsonResponse
    {
        $delivery = Delivery::where('order_id', $orderId)->firstOrFail();
        $delivery->status = $request->input('status');
        $delivery->save();
        return response()->json(['status' => $delivery->status]);
    }

    public function rejectOrder($orderId) { return response()->json(['ok' => true]); }
    public function getCompletedOrders() { return response()->json([]); }
    public function getStats() { return response()->json(['todayOrders' => 0, 'earnings' => 0]); }
    public function getSettings() { return response()->json(['language' => 'es']); }
    public function updateSettings(Request $request) { return response()->json($request->all()); }
}

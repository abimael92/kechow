<?php

namespace App\Http\Controllers\Api\Driver;

use App\Http\Controllers\Controller;
use App\Modules\Driver\Models\Driver;
use App\Models\Delivery;
use App\Modules\Order\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class DeliveryController extends Controller
{
    private const ALLOWED_STATUSES = ['assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled'];

    private function getDriver(): ?Driver
    {
        return Driver::where('user_id', Auth::id())->first();
    }
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
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        $order = Order::where('id', $orderId)->where('status', 'pending')->whereDoesntHave('delivery')->first();
        if (!$order) {
            return response()->json(['message' => 'Order not available for acceptance.'], 422);
        }

        DB::transaction(function () use ($orderId, $driver, $order) {
            Delivery::create([
                'order_id' => $orderId,
                'driver_id' => $driver->id,
                'status' => 'assigned',
                'assigned_at' => now(),
            ]);
            $order->update(['status' => Order::STATUS_ACCEPTED]);
        });

        return response()->json(['id' => (int) $orderId, 'status' => 'accepted']);
    }

    public function updateOrderStatus(Request $request, $orderId): JsonResponse
    {
        $status = $request->input('status');
        if (!in_array($status, self::ALLOWED_STATUSES, true)) {
            return response()->json(['message' => 'Invalid status.'], 422);
        }

        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['message' => 'Driver profile not found.'], 404);
        }

        $delivery = Delivery::where('order_id', $orderId)->where('driver_id', $driver->id)->first();
        if (!$delivery) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }

        $delivery->status = $status;
        if ($status === 'picked_up') {
            $delivery->picked_up_at = $delivery->picked_up_at ?? now();
        }
        if ($status === 'delivered') {
            $delivery->delivered_at = now();
            $delivery->order->update([
                'status' => Order::STATUS_DELIVERED,
                'actual_delivery_time' => now(),
            ]);
            $driver->increment('total_deliveries');
        }
        if ($status === 'cancelled') {
            $delivery->cancelled_at = now();
        }
        $delivery->save();

        return response()->json(['status' => $delivery->status]);
    }

    public function rejectOrder($orderId): JsonResponse
    {
        return response()->json(['ok' => true]);
    }

    public function getCompletedOrders(Request $request): JsonResponse
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return response()->json(['orders' => [], 'total' => 0]);
        }

        $perPage = max(1, min(50, (int) $request->input('per_page', 15)));
        $deliveries = Delivery::with('order.restaurant', 'order.items')
            ->where('driver_id', $driver->id)
            ->where('status', 'delivered')
            ->orderByDesc('delivered_at')
            ->paginate($perPage);

        $orders = $deliveries->getCollection()->map(function (Delivery $d) {
            $o = $d->order;
            return [
                'id' => $o->id,
                'status' => 'delivered',
                'pickup' => $o->restaurant->address ?? '',
                'dropoff' => $o->delivery_address ?? '',
                'amount' => (float) $o->total,
                'restaurant' => ['name' => $o->restaurant->name ?? ''],
                'items' => $o->items ?? [],
                'delivered_at' => $d->delivered_at?->toIso8601String(),
            ];
        });

        return response()->json([
            'orders' => $orders,
            'total' => $deliveries->total(),
            'current_page' => $deliveries->currentPage(),
            'per_page' => $deliveries->perPage(),
        ]);
    }

    public function getStats(): JsonResponse
    {
        $driver = $this->getDriver();
        $todayStart = now()->startOfDay();

        $todayOrders = 0;
        $earnings = 0.0;
        if ($driver) {
            $todayOrders = Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->where('delivered_at', '>=', $todayStart)
                ->count();
            $earnings = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->where('delivered_at', '>=', $todayStart)
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
        }

        return response()->json([
            'todayOrders' => $todayOrders,
            'earnings' => round($earnings, 2),
            'completed_deliveries' => $driver ? $driver->total_deliveries : 0,
            'rating' => $driver ? (float) $driver->rating : 0,
        ]);
    }

    public function getEarnings(Request $request): JsonResponse
    {
        $driver = $this->getDriver();
        $period = $request->input('period', 'week');

        $today = 0.0;
        $week = 0.0;
        $month = 0.0;
        $total = 0.0;
        if ($driver) {
            $today = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->whereDate('delivered_at', today())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $week = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->where('delivered_at', '>=', now()->startOfWeek())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $month = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->where('delivered_at', '>=', now()->startOfMonth())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $total = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', 'delivered')
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
        }

        return response()->json([
            'today' => round($today, 2),
            'week' => round($week, 2),
            'month' => round($month, 2),
            'total' => round($total, 2),
        ]);
    }

    public function getSettings(): JsonResponse
    {
        return response()->json(['language' => 'es']);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        return response()->json($request->all());
    }
}

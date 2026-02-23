<?php

namespace App\Modules\Driver\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Driver\Models\Driver;
use App\Modules\Driver\Models\DriverLocation;
use App\Modules\Order\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DriverController extends Controller
{
    /**
     * Get orders available for delivery (status=ready, no driver).
     */
    public function availableOrders(Request $request): JsonResponse
    {
        $orders = Order::with(['items.menuItem', 'restaurant', 'user'])
            ->where('status', Order::STATUS_READY)
            ->whereNull('driver_id')
            ->latest()
            ->limit(50)
            ->get();

        $data = $orders->map(function (Order $o) {
            $restaurant = $o->restaurant;
            $restLat = $restaurant->latitude ?? 19.4326;
            $restLng = $restaurant->longitude ?? -99.1332;
            $dist = 0; // Would compute from driver location
            return [
                'id' => (string) $o->id,
                'orderNumber' => '#' . $o->id,
                'status' => 'available',
                'restaurant' => [
                    'id' => (string) $restaurant->id,
                    'name' => $restaurant->name,
                    'address' => $restaurant->address . ', ' . ($restaurant->city ?? '') . ', ' . ($restaurant->state ?? ''),
                    'phone' => $restaurant->phone,
                    'location' => ['latitude' => (float) $restLat, 'longitude' => (float) $restLng],
                ],
                'customer' => [
                    'id' => (string) $o->user_id,
                    'name' => $o->user?->name ?? 'Cliente',
                    'address' => $o->delivery_address,
                    'phone' => $o->user?->phone ?? '',
                    'location' => ['latitude' => 19.43, 'longitude' => -99.13],
                ],
                'items' => $o->items->map(fn ($i) => [
                    'id' => (string) $i->id,
                    'name' => $i->menuItem?->name ?? 'Item',
                    'quantity' => $i->quantity,
                ]),
                'paymentMethod' => 'Card',
                'amount' => (float) $o->total,
                'fee' => 30.0,
                'distance' => round($dist, 1),
                'estimatedTime' => 15,
                'createdAt' => $o->created_at?->toIso8601String(),
            ];
        });

     // En DriverController -> availableOrders
return response()->json([
    'jobs' => $data->map(fn($item) => ['order' => $item])
]);
    }

    /**
     * Get driver's current active order.
     */
    public function currentOrder(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $order = Order::with(['items.menuItem', 'restaurant', 'user'])
            ->where('driver_id', $userId)
            ->where('status', Order::STATUS_OUT_FOR_DELIVERY)
            ->first();

        if (!$order) {
            return response()->json(['order' => null]);
        }

        return response()->json(['order' => $this->formatOrderForDriver($order)]);
    }

    /**
     * Update driver location (GPS).
     */
    public function updateLocation(Request $request): JsonResponse
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $userId = $request->user()->id;
        $driver = Driver::firstOrCreate(
            ['user_id' => $userId],
            ['status' => 'offline', 'is_online' => false, 'vehicle_type' => 'motorcycle']
        );

        $driver->update([
            'current_latitude' => $request->latitude,
            'current_longitude' => $request->longitude,
        ]);

        DriverLocation::create([
            'driver_id' => $driver->id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json(['ok' => true]);
    }

    /**
     * Toggle driver online/offline.
     */
    public function toggleStatus(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $driver = Driver::firstOrCreate(
            ['user_id' => $userId],
            ['status' => 'offline', 'is_online' => false]
        );

        $driver->update([
            'is_online' => !$driver->is_online,
            'status' => $driver->is_online ? 'online' : 'offline',
        ]);

        return response()->json([
            'isOnline' => $driver->is_online,
            'status' => $driver->status,
        ]);
    }

    /**
     * Get driver stats (earnings, ratings, metrics).
     */
    public function stats(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $driver = Driver::where('user_id', $userId)->first();

        $todayStart = now()->startOfDay();
        $weekStart = now()->startOfWeek();
        $monthStart = now()->startOfMonth();

        $deliveriesQuery = Order::where('driver_id', $userId)->where('status', Order::STATUS_DELIVERED);
        $todayCount = (clone $deliveriesQuery)->where('actual_delivery_time', '>=', $todayStart)->count();
        $weekCount = (clone $deliveriesQuery)->where('actual_delivery_time', '>=', $weekStart)->count();
        $monthCount = (clone $deliveriesQuery)->where('actual_delivery_time', '>=', $monthStart)->count();

        $totalRevenue = (float) Order::where('driver_id', $userId)->where('status', Order::STATUS_DELIVERED)->sum('total');
        $feePerOrder = 30.0;
        $todayEarnings = $todayCount * $feePerOrder;
        $weekEarnings = $weekCount * $feePerOrder;
        $monthEarnings = $monthCount * $feePerOrder;

        return response()->json([
            'isOnline' => $driver?->is_online ?? false,
            'today' => [
                'deliveries' => $todayCount,
                'earnings' => $todayEarnings,
                'distance' => $todayCount * 2.5,
                'hours' => $todayCount * 0.5,
            ],
            'week' => [
                'deliveries' => $weekCount,
                'earnings' => $weekEarnings,
                'distance' => $weekCount * 2.5,
                'hours' => $weekCount * 0.5,
            ],
            'month' => [
                'deliveries' => $monthCount,
                'earnings' => $monthEarnings,
                'distance' => $monthCount * 2.5,
                'hours' => $monthCount * 0.5,
            ],
            'totalEarnings' => $monthCount * $feePerOrder,
            'averagePerDelivery' => $feePerOrder,
            'rating' => $driver?->rating ?? 4.5,
            'totalDeliveries' => $driver?->total_deliveries ?? 0,
        ]);
    }

    /**
 * Get driver availability status
 */
public function getAvailability(Request $request): JsonResponse
{
    $userId = $request->user()->id;
    $driver = Driver::where('user_id', $userId)->first();

    return response()->json([
        'isOnline' => $driver?->is_online ?? false,
        'totalOnlineHours' => 0,
        'currentSessionStart' => null
    ]);
}

/**
 * Update driver availability
 */
public function updateAvailability(Request $request): JsonResponse
{
    try {
        // Validation will fail if you send a raw boolean instead of {isOnline: true}
        $validated = $request->validate([
            'isOnline' => 'required|boolean'
        ]);

        $userId = Auth::id(); // Use Auth facade for safety

        $driver = Driver::updateOrCreate(
            ['user_id' => $userId],
            [
                'is_online' => $request->isOnline,
                'status' => $request->isOnline ? 'online' : 'offline',
            ]
        );

        return response()->json([
            'isOnline' => (bool)$driver->is_online,
            'status' => $driver->status,
            'totalOnlineHours' => 0,
            'currentSessionStart' => $driver->is_online ? now()->toIso8601String() : null
        ]);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json(['errors' => $e->errors()], 422); // Return 422 for validation issues
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString() // Temporary: remove in production
        ], 500);
    }
}


/**
 * Accept a job/order
 */
public function acceptJob(Request $request, $orderId): JsonResponse
{
    $userId = $request->user()->id;

    $order = Order::findOrFail($orderId);

    if ($order->driver_id) {
        return response()->json(['error' => 'Order already accepted'], 400);
    }

    $order->update([
        'driver_id' => $userId,
        'status' => Order::STATUS_OUT_FOR_DELIVERY
    ]);

    $order->load(['items.menuItem', 'restaurant', 'user']);

    // if ($request->status === 'delivered') {
    //     $order->update(['actual_delivery_time' => now()]);

    //     $driver = Driver::where('user_id', $userId)->first();
    //     if ($driver) {
    //         $driver->increment('total_deliveries');
    //     }
    // }

    return response()->json($this->formatOrderForDriver($order->fresh(['items.menuItem', 'restaurant', 'user'])));
}

/**
 * Update the status of an active order (picked_up, delivered, etc.)
 */
public function updateOrderStatus(Request $request, $orderId): JsonResponse
{
    try {
        $request->validate([
            'status' => 'required|string'
        ]);

        $userId = $request->user()->id;

        // Buscamos la orden que le pertenece a este repartidor
        $order = Order::where('id', $orderId)
            ->where('driver_id', $userId)
            ->firstOrFail();

        // Mapeamos el estado que viene del frontend a los estados de tu BD
        // Ajusta Order::STATUS_... según las constantes de tu modelo
        $newStatus = match ($request->status) {
            'picked_up'  => Order::STATUS_OUT_FOR_DELIVERY,
            'delivered'  => Order::STATUS_DELIVERED,
            default      => $request->status,
        };

        $updateData = ['status' => $newStatus];

        // Si se entrega, registramos el tiempo y sumamos al contador del repartidor
        if ($newStatus === Order::STATUS_DELIVERED) {
            $updateData['actual_delivery_time'] = now();

            $driver = Driver::where('user_id', $userId)->first();
            if ($driver) {
                $driver->increment('total_deliveries');
            }
        }

        $order->update($updateData);

        return response()->json(
            $this->formatOrderForDriver($order->fresh(['items.menuItem', 'restaurant', 'user']))
        );

    } catch (\Exception $e) {
        Log::error("Error actualizando estado de orden: " . $e->getMessage());
        return response()->json(['error' => 'No se pudo actualizar el estado'], 500);
    }
}


/**
 * Format order for driver response
 */
private function formatOrderForDriver(Order $order): array
{
    $restaurant = $order->restaurant;
    $restLat = $restaurant->latitude ?? 19.4326;
    $restLng = $restaurant->longitude ?? -99.1332;

    return [
        'id' => (string) $order->id,
        'orderNumber' => '#' . $order->id,
        'status' => $order->status,
        'restaurant' => [
            'id' => (string) $restaurant->id,
            'name' => $restaurant->name,
            'address' => $restaurant->address . ', ' . ($restaurant->city ?? '') . ', ' . ($restaurant->state ?? ''),
            'phone' => $restaurant->phone,
            'location' => ['latitude' => (float) $restLat, 'longitude' => (float) $restLng],
        ],
        'customer' => [
            'id' => (string) $order->user_id,
            'name' => $order->user?->name ?? 'Cliente',
            'address' => $order->delivery_address,
            'phone' => $order->user?->phone ?? '',
            'location' => ['latitude' => 19.43, 'longitude' => -99.13],
        ],
        'items' => $order->items->map(fn ($i) => [
            'id' => (string) $i->id,
            'name' => $i->menuItem?->name ?? 'Item',
            'quantity' => $i->quantity,
        ]),
        'paymentMethod' => 'Card',
        'amount' => (float) $order->total,
        'fee' => 30.0,
        'distance' => 2.5,
        'estimatedTime' => 15,
        'createdAt' => $order->created_at?->toIso8601String(),
        'delivery_notes' => $order->delivery_notes,
    ];
}
}

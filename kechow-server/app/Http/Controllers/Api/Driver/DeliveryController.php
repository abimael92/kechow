<?php

namespace App\Http\Controllers\Api\Driver;

use App\Http\Controllers\Controller;
use App\Http\Requests\Delivery\UpdateAvailabilityRequest;
use App\Http\Requests\Delivery\UpdateDeliverySettingsRequest;
use App\Http\Requests\Delivery\UpdateDeliveryStatusRequest;
use App\Models\Delivery;
use App\Models\DeliveryRejection;
use App\Models\Driver;
use App\Modules\Order\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Delivery API for drivers (auth:sanctum, role:delivery).
 * Delivery log: do not log PII (addresses, names, phone numbers). Log only IDs and status.
 *
 * @OA\Tag(name="Delivery", description="Driver delivery API - availability, jobs, accept/reject, earnings, settings")
 */
class DeliveryController extends Controller
{
    use ApiResponse;

    private function getDriver(): ?Driver
    {
        return Driver::where('user_id', Auth::id())->first();
    }

    /**
     * @OA\Get(path="/api/v1/delivery/availability", tags={"Delivery"}, security={{"sanctum":{}}},
     *   @OA\Response(response=200, description="Current availability and hasActiveOrder")
     * )
     */
    public function getAvailability()
    {
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
            ->whereIn('status', [Delivery::STATUS_ASSIGNED, Delivery::STATUS_PICKED_UP, Delivery::STATUS_IN_TRANSIT])
            ->exists();

        return $this->success([
            'isOnline' => (bool) $driver->is_online,
            'totalOnlineHours' => 0,
            'currentSessionStart' => $driver->is_online ? $driver->updated_at?->toIso8601String() : null,
            'hasActiveOrder' => $hasActiveOrder,
        ]);
    }

    public function updateAvailability(UpdateAvailabilityRequest $request)
    {
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

        $driver->is_online = $request->boolean('isOnline');
        $driver->status = $driver->is_online ? 'online' : 'offline';
        $driver->save();

        return $this->success([
            'isOnline' => (bool) $driver->is_online,
            'status' => $driver->status,
            'currentSessionStart' => $driver->is_online ? now()->toIso8601String() : null,
        ]);
    }

    public function getAvailableJobs()
    {
        $driver = $this->getDriver();
        $query = Order::where('status', 'pending')->whereDoesntHave('delivery');
        if ($driver) {
            $query->whereDoesntHave('deliveryRejections', function ($q) use ($driver) {
                $q->where('driver_id', $driver->id);
            });
        }
        $orders = $query->with('restaurant', 'items')->get();
        $jobs = $orders->map(fn ($o) => [
            'id' => $o->id,
            'pickup' => $o->restaurant->address ?? 'Restaurante',
            'dropoff' => $o->delivery_address ?? 'Dirección',
            'amount' => (float) $o->total,
            'restaurant' => ['name' => $o->restaurant->name ?? 'Restaurante'],
            'items' => $o->items ?? [],
        ]);

        return $this->success(['jobs' => $jobs]);
    }

    public function getActiveOrder()
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->success(null);
        }

        $active = Delivery::with('order.restaurant', 'order.user')
            ->where('driver_id', $driver->id)
            ->whereIn('status', [Delivery::STATUS_ASSIGNED, Delivery::STATUS_PICKED_UP, Delivery::STATUS_IN_TRANSIT])
            ->first();

        if (!$active) {
            return $this->success(null);
        }

        $o = $active->order;
        $restaurant = $o->restaurant;
        $customer = $o->user;
        $fee = (float) config('delivery.delivery_fee_fixed', 0);

        return $this->success([
            'id' => $o->id,
            'orderNumber' => '#' . $o->id,
            'status' => $active->status,
            'pickup' => $restaurant->address ?? '',
            'dropoff' => $o->delivery_address ?? '',
            'amount' => (float) $o->total,
            'fee' => $fee,
            'paymentMethod' => 'Card',
            'restaurant' => [
                'name' => $restaurant->name ?? '',
                'address' => $restaurant->address ?? '',
                'phone' => $restaurant->phone ?? '',
            ],
            'customer' => [
                'name' => $customer->name ?? 'Cliente',
                'address' => $o->delivery_address ?? '',
                'phone' => $customer->phone ?? '',
            ],
            'items' => $o->items ?? [],
            'distance' => null,
            'estimatedTime' => 15,
        ]);
    }

    public function acceptOrder($orderId)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->error('Driver profile not found.', 404);
        }

        $order = Order::where('id', $orderId)->where('status', 'pending')->whereDoesntHave('delivery')->first();
        if (!$order) {
            return $this->error('Order not available for acceptance.', 422);
        }

        DB::transaction(function () use ($orderId, $driver, $order) {
            Delivery::create([
                'order_id' => $orderId,
                'driver_id' => $driver->id,
                'status' => Delivery::STATUS_ASSIGNED,
                'assigned_at' => now(),
            ]);
            $order->update(['status' => Order::STATUS_ACCEPTED]);
        });

        Log::channel('delivery')->info('Delivery accepted', ['order_id' => $orderId, 'driver_id' => $driver->id]);

        return $this->success(['id' => (int) $orderId, 'status' => 'accepted']);
    }

    public function getOrderDetail($orderId)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->error('Driver profile not found.', 404);
        }

        $delivery = Delivery::with('order.restaurant', 'order.items', 'order.user')
            ->where('order_id', $orderId)
            ->where('driver_id', $driver->id)
            ->first();

        if (!$delivery) {
            return $this->error('Order not found or unauthorized.', 404);
        }

        $this->authorize('view', $delivery);

        $o = $delivery->order;
        $restaurant = $o->restaurant;
        $customer = $o->user;
        $fee = (float) config('delivery.delivery_fee_fixed', 0);

        return $this->success([
            'id' => $o->id,
            'orderNumber' => '#' . $o->id,
            'status' => $delivery->status,
            'pickup' => $restaurant->address ?? '',
            'dropoff' => $o->delivery_address ?? '',
            'amount' => (float) $o->total,
            'fee' => $fee,
            'paymentMethod' => 'Card',
            'restaurant' => [
                'name' => $restaurant->name ?? '',
                'address' => $restaurant->address ?? '',
                'phone' => $restaurant->phone ?? '',
            ],
            'customer' => [
                'name' => $customer->name ?? 'Cliente',
                'address' => $o->delivery_address ?? '',
                'phone' => $customer->phone ?? '',
            ],
            'items' => $o->items ?? [],
            'delivery_notes' => $o->delivery_notes ?? '',
            'assigned_at' => $delivery->assigned_at?->toIso8601String(),
            'picked_up_at' => $delivery->picked_up_at?->toIso8601String(),
            'delivered_at' => $delivery->delivered_at?->toIso8601String(),
        ]);
    }

    public function updateOrderStatus(UpdateDeliveryStatusRequest $request, $orderId)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->error('Driver profile not found.', 404);
        }

        $delivery = Delivery::where('order_id', $orderId)->where('driver_id', $driver->id)->first();
        if (!$delivery) {
            return $this->error('Unauthorized.', 403);
        }

        $this->authorize('update', $delivery);

        $status = $request->validated('status');

        $delivery->status = $status;
        if ($status === Delivery::STATUS_PICKED_UP) {
            $delivery->picked_up_at = $delivery->picked_up_at ?? now();
        }
        if ($status === Delivery::STATUS_DELIVERED) {
            $delivery->delivered_at = now();
            $delivery->order->update([
                'status' => Order::STATUS_DELIVERED,
                'actual_delivery_time' => now(),
            ]);
            $driver->increment('total_deliveries');
        }
        if ($status === Delivery::STATUS_CANCELLED) {
            $delivery->cancelled_at = now();
        }
        $delivery->save();

        Log::channel('delivery')->info('Delivery status updated', ['delivery_id' => $delivery->id, 'status' => $status]);

        return $this->success(['status' => $delivery->status]);
    }

    public function rejectOrder(Request $request, $orderId)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->error('Driver profile not found.', 404);
        }

        $order = Order::where('id', $orderId)->where('status', 'pending')->whereDoesntHave('delivery')->first();
        if (!$order) {
            return $this->error('Order not available for rejection.', 422);
        }

        DeliveryRejection::firstOrCreate(
            [
                'driver_id' => $driver->id,
                'order_id' => $orderId,
            ],
            [
                'reason' => $request->input('reason'),
            ]
        );

        Log::channel('delivery')->info('Order rejected by driver', [
            'order_id' => (int) $orderId,
            'driver_id' => $driver->id,
        ]);

        return $this->success(['ok' => true]);
    }

    public function getCompletedOrders(Request $request)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->success(['orders' => [], 'total' => 0, 'current_page' => 1, 'per_page' => 15]);
        }

        $perPage = max(1, min(50, (int) $request->input('per_page', 15)));
        $deliveries = Delivery::with('order.restaurant', 'order.items')
            ->where('driver_id', $driver->id)
            ->where('status', Delivery::STATUS_DELIVERED)
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

        return $this->success([
            'orders' => $orders,
            'total' => $deliveries->total(),
            'current_page' => $deliveries->currentPage(),
            'per_page' => $deliveries->perPage(),
        ]);
    }

    public function getStats()
    {
        $driver = $this->getDriver();
        $todayStart = now()->startOfDay();

        $todayOrders = 0;
        $earnings = 0.0;
        if ($driver) {
            $todayOrders = Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', $todayStart)
                ->count();
            $orderTotals = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', $todayStart)
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $rate = (float) config('delivery.driver_commission_rate', 1.0);
            $fixed = (float) config('delivery.delivery_fee_fixed', 0);
            $earnings = $orderTotals * $rate + $todayOrders * $fixed;
        }

        return $this->success([
            'todayOrders' => $todayOrders,
            'earnings' => round($earnings, 2),
            'completed_deliveries' => $driver ? $driver->total_deliveries : 0,
            'rating' => $driver ? (float) $driver->rating : 0,
        ]);
    }

    public function getEarnings(Request $request)
    {
        $driver = $this->getDriver();
        $rate = (float) config('delivery.driver_commission_rate', 1.0);
        $fixed = (float) config('delivery.delivery_fee_fixed', 0);
        $today = 0.0;
        $week = 0.0;
        $month = 0.0;
        $total = 0.0;
        $todayCount = 0;
        $weekCount = 0;
        $monthCount = 0;
        $totalCount = 0;
        if ($driver) {
            $todaySum = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->whereDate('delivered_at', today())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $todayCount = (int) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->whereDate('delivered_at', today())->count();
            $today = $todaySum * $rate + $todayCount * $fixed;

            $weekSum = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', now()->startOfWeek())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $weekCount = (int) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', now()->startOfWeek())->count();
            $week = $weekSum * $rate + $weekCount * $fixed;

            $monthSum = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', now()->startOfMonth())
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $monthCount = (int) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->where('delivered_at', '>=', now()->startOfMonth())->count();
            $month = $monthSum * $rate + $monthCount * $fixed;

            $totalSum = (float) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)
                ->join('orders', 'deliveries.order_id', '=', 'orders.id')
                ->sum('orders.total');
            $totalCount = (int) Delivery::where('driver_id', $driver->id)
                ->where('status', Delivery::STATUS_DELIVERED)->count();
            $total = $totalSum * $rate + $totalCount * $fixed;
        }

        return $this->success([
            'today' => round($today, 2),
            'week' => round($week, 2),
            'month' => round($month, 2),
            'total' => round($total, 2),
        ]);
    }

    public function getSettings()
    {
        $driver = $this->getDriver();
        $language = $driver ? ($driver->preferred_language ?? 'es') : 'es';
        return $this->success(['language' => $language]);
    }

    public function updateSettings(UpdateDeliverySettingsRequest $request)
    {
        $driver = $this->getDriver();
        if (!$driver) {
            return $this->error('Driver profile not found.', 404);
        }

        $validated = $request->validated();
        if (array_key_exists('language', $validated)) {
            $driver->preferred_language = $validated['language'];
            $driver->save();
        }

        return $this->success(['language' => $driver->preferred_language ?? 'es']);
    }
}

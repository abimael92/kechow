<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Modules\Order\Models\Order;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Super Admin Command Center API.
 * All routes must be protected with middleware auth:sanctum, role:admin.
 */
class AdminController extends Controller
{
    use ApiResponse;

    /**
     * Platform overview: revenue, active deliveries, system health.
     */
    public function stats(Request $request): JsonResponse
    {
        $todayStart = now()->startOfDay();
        $platformRevenue = (float) Order::where('status', 'delivered')->where('created_at', '>=', $todayStart)->sum('total');
        $activeDeliveries = Delivery::whereIn('status', ['assigned', 'picked_up', 'in_transit'])->count();

        return $this->success([
            'platformRevenue' => round($platformRevenue, 2),
            'activeDeliveries' => $activeDeliveries,
            'systemHealth' => 'ok',
        ]);
    }

    /**
     * Financial ledger: pending/paid for drivers and owners (placeholder structure).
     */
    public function ledger(Request $request): JsonResponse
    {
        $driversPaid = (float) Delivery::where('status', 'delivered')
            ->join('orders', 'deliveries.order_id', '=', 'orders.id')
            ->sum('orders.total');
        $driversPending = 0.0;
        $ownersPending = 0.0;
        $ownersPaid = (float) Order::where('status', 'delivered')->sum('total');

        return $this->success([
            'drivers' => ['pending' => $driversPending, 'paid' => round($driversPaid, 2)],
            'owners' => ['pending' => $ownersPending, 'paid' => round($ownersPaid, 2)],
        ]);
    }

    /**
     * Last N system exceptions (placeholder: empty until Spatie Activity Log or Sentry buffer).
     */
    public function exceptions(Request $request): JsonResponse
    {
        $limit = min(50, max(1, (int) $request->input('limit', 50)));
        $list = [];
        // TODO: integrate Spatie Activity Log or Sentry to return last N exceptions
        return $this->success(['exceptions' => $list]);
    }

    /**
     * In-transit deliveries for dispatch map (driver + order + location placeholder).
     */
    public function inTransitDeliveries(Request $request): JsonResponse
    {
        $deliveries = Delivery::with(['order.restaurant', 'order.user', 'driver'])
            ->whereIn('status', ['assigned', 'picked_up', 'in_transit'])
            ->get()
            ->map(function ($d) {
                $driver = $d->driver;
                return [
                    'id' => $d->id,
                    'order_id' => $d->order_id,
                    'status' => $d->status,
                    'driver' => $driver ? ['id' => $driver->id, 'user_id' => $driver->user_id] : null,
                    'latitude' => $driver ? $driver->current_latitude : null,
                    'longitude' => $driver ? $driver->current_longitude : null,
                    'restaurant' => $d->order->restaurant ? ['name' => $d->order->restaurant->name] : null,
                ];
            });

        return $this->success(['deliveries' => $deliveries]);
    }
}

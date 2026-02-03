<?php

namespace App\Modules\Owner\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Models\Order;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerDashboardController extends Controller
{
    /**
     * Dashboard stats for the owner's restaurants.
     */
    public function getStats(Request $request): JsonResponse
    {
        $restaurantIds = $request->user()->restaurants()->pluck('id')->toArray();
        if (empty($restaurantIds)) {
            return response()->json([
                'totalOrders' => 0,
                'totalRevenue' => 0,
                'averageOrderValue' => 0,
                'pendingOrders' => 0,
                'completedOrders' => 0,
                'popularItems' => [],
            ]);
        }

        $orders = Order::whereIn('restaurant_id', $restaurantIds)->get();
        $totalOrders = $orders->count();
        $totalRevenue = (float) $orders->sum('total');
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        $pendingStatuses = [Order::STATUS_PENDING, Order::STATUS_ACCEPTED, Order::STATUS_PREPARING, Order::STATUS_READY];
        $pendingOrders = $orders->whereIn('status', $pendingStatuses)->count();
        $completedOrders = $orders->where('status', Order::STATUS_DELIVERED)->count();

        $popularItems = $this->getPopularItems($restaurantIds);

        return response()->json([
            'totalOrders' => $totalOrders,
            'totalRevenue' => $totalRevenue,
            'averageOrderValue' => $avgOrderValue,
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders,
            'popularItems' => $popularItems,
        ]);
    }

    private function getPopularItems(array $restaurantIds): array
    {
        $items = \App\Modules\Order\Models\OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->whereIn('orders.restaurant_id', $restaurantIds)
            ->selectRaw('order_items.menu_item_id, SUM(order_items.quantity) as total_qty, SUM(order_items.quantity * order_items.price) as revenue')
            ->groupBy('order_items.menu_item_id')
            ->orderByDesc('total_qty')
            ->limit(5)
            ->get();

        $result = [];
        foreach ($items as $item) {
            $menuItem = \App\Modules\Restaurant\Models\MenuItem::find($item->menu_item_id);
            $result[] = [
                'name' => $menuItem?->name ?? 'Unknown',
                'count' => (int) $item->total_qty,
                'revenue' => (float) $item->revenue,
            ];
        }
        return $result;
    }
}

<?php

namespace App\Modules\Owner\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OwnerAnalyticsController extends Controller
{
    /**
     * Analytics data for the owner's restaurants.
     */
    public function getAnalytics(Request $request): JsonResponse
    {
        $restaurantIds = $request->user()->restaurants()->pluck('id')->toArray();
        if (empty($restaurantIds)) {
            return response()->json($this->emptyAnalytics($request->get('period', '30days')));
        }

        $period = $request->get('period', '30days');
        $days = match ($period) {
            '7days' => 7,
            '90days' => 90,
            'year' => 365,
            default => 30,
        };

        $orders = Order::whereIn('restaurant_id', $restaurantIds)
            ->where('created_at', '>=', now()->subDays($days))
            ->with('items.menuItem')
            ->get();

        $revenueTrend = $this->buildRevenueTrend($orders, $days);
        $chartData = array_map(fn ($p) => [
            'date' => $p['date'],
            'value' => $p['revenue'],
            'label' => '$' . number_format($p['revenue'], 0),
        ], $revenueTrend);

        $totalRevenue = array_sum(array_column($revenueTrend, 'revenue'));
        $totalOrders = $orders->count();
        $avgOrderValue = $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0;

        $ordersByHour = $this->buildOrdersByHour($orders);
        $topSellingItems = $this->buildTopSellingItems($restaurantIds, $days);
        $peakHours = $this->buildPeakHours($ordersByHour);

        $salesByCategory = $this->buildSalesByCategory($restaurantIds, $days);

        return response()->json([
            'revenue' => [
                'total' => $totalRevenue,
                'change' => 0,
                'trend' => $revenueTrend,
                'chartData' => $chartData,
            ],
            'orders' => [
                'total' => $totalOrders,
                'change' => 0,
                'trend' => [],
                'byHour' => $ordersByHour,
            ],
            'avgOrderValue' => [
                'current' => $avgOrderValue,
                'change' => 0,
                'history' => [],
            ],
            'customerRating' => [
                'current' => 0,
                'change' => 0,
                'distribution' => [],
            ],
            'salesByCategory' => $salesByCategory,
            'topSellingItems' => $topSellingItems,
            'customerMetrics' => [
                'newCustomers' => 0,
                'returningCustomers' => 0,
                'retentionRate' => 0,
                'lifetimeValue' => 0,
            ],
            'peakHours' => $peakHours,
            'lastUpdated' => now()->toIso8601String(),
            'period' => $period,
        ]);
    }

    private function emptyAnalytics(string $period): array
    {
        return [
            'revenue' => ['total' => 0, 'change' => 0, 'trend' => [], 'chartData' => []],
            'orders' => ['total' => 0, 'change' => 0, 'trend' => [], 'byHour' => []],
            'avgOrderValue' => ['current' => 0, 'change' => 0, 'history' => []],
            'customerRating' => ['current' => 0, 'change' => 0, 'distribution' => []],
            'salesByCategory' => [],
            'topSellingItems' => [],
            'customerMetrics' => ['newCustomers' => 0, 'returningCustomers' => 0, 'retentionRate' => 0, 'lifetimeValue' => 0],
            'peakHours' => [],
            'lastUpdated' => now()->toIso8601String(),
            'period' => $period,
        ];
    }

    private function buildRevenueTrend($orders, int $days): array
    {
        $byDate = [];
        for ($i = $days - 1; $i >= 0; $i--) {
            $d = now()->subDays($i)->format('Y-m-d');
            $byDate[$d] = ['date' => $d, 'revenue' => 0, 'orders' => 0, 'averageOrderValue' => 0];
        }

        foreach ($orders as $order) {
            $d = $order->created_at->format('Y-m-d');
            if (isset($byDate[$d])) {
                $byDate[$d]['revenue'] += (float) $order->total;
                $byDate[$d]['orders'] += 1;
            }
        }

        foreach ($byDate as $d => $row) {
            if ($row['orders'] > 0) {
                $byDate[$d]['averageOrderValue'] = round($row['revenue'] / $row['orders'], 2);
            }
        }

        return array_values($byDate);
    }

    private function buildOrdersByHour($orders): array
    {
        $byHour = [];
        for ($h = 0; $h < 24; $h++) {
            $label = $h === 0 ? '12AM' : ($h < 12 ? $h . 'AM' : ($h === 12 ? '12PM' : ($h - 12) . 'PM'));
            $byHour[$h] = [
                'hour' => $h,
                'hourLabel' => $label,
                'orders' => 0,
                'averageOrderValue' => 0,
                'revenue' => 0,
                'day' => $h >= 6 && $h <= 22 ? 'weekday' : 'weekend',
            ];
        }

        foreach ($orders as $order) {
            $h = (int) $order->created_at->format('G');
            $byHour[$h]['orders'] += 1;
            $byHour[$h]['revenue'] += (float) $order->total;
        }

        foreach ($byHour as $h => $row) {
            if ($row['orders'] > 0) {
                $byHour[$h]['averageOrderValue'] = round($row['revenue'] / $row['orders'], 2);
            }
        }

        return array_values($byHour);
    }

    private function buildTopSellingItems(array $restaurantIds, int $days): array
    {
        $items = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->whereIn('orders.restaurant_id', $restaurantIds)
            ->where('orders.created_at', '>=', now()->subDays($days))
            ->selectRaw('menu_items.id, menu_items.name, menu_items.category, SUM(order_items.quantity) as quantity, SUM(order_items.quantity * order_items.price) as revenue')
            ->groupBy('menu_items.id', 'menu_items.name', 'menu_items.category')
            ->orderByDesc('quantity')
            ->limit(10)
            ->get();

        return $items->map(fn ($item, $i) => [
            'id' => (string) $item->id,
            'name' => $item->name,
            'category' => $item->category ?? '',
            'orders' => (int) $item->quantity,
            'revenue' => (float) $item->revenue,
            'quantity' => (int) $item->quantity,
            'averageRating' => 0,
            'trend' => 0,
            'profitMargin' => 0,
            'lastOrderDate' => now()->toIso8601String(),
        ])->toArray();
    }

    private function buildPeakHours(array $ordersByHour): array
    {
        $maxOrders = collect($ordersByHour)->max('orders') ?: 1;
        $colors = ['low', 'medium', 'high', 'peak'];
        return array_map(function ($row) use ($maxOrders, $colors) {
            $pct = $row['orders'] / $maxOrders;
            $level = $pct >= 0.75 ? 3 : ($pct >= 0.5 ? 2 : ($pct >= 0.25 ? 1 : 0));
            return [
                'hour' => $row['hour'],
                'hourLabel' => $row['hourLabel'],
                'orders' => $row['orders'],
                'revenue' => $row['revenue'],
                'busyLevel' => $colors[$level],
            ];
        }, $ordersByHour);
    }

    private function buildSalesByCategory(array $restaurantIds, int $days): array
    {
        $items = OrderItem::query()
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('menu_items', 'order_items.menu_item_id', '=', 'menu_items.id')
            ->whereIn('orders.restaurant_id', $restaurantIds)
            ->where('orders.created_at', '>=', now()->subDays($days))
            ->selectRaw('menu_items.category, SUM(order_items.quantity * order_items.price) as sales, SUM(order_items.quantity) as qty')
            ->groupBy('menu_items.category')
            ->get();

        $total = $items->sum('sales') ?: 1;
        $colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#EC4899'];
        return $items->map(fn ($item, $i) => [
            'id' => (string) ($i + 1),
            'category' => $item->category ?? 'Otros',
            'sales' => (float) $item->sales,
            'percentage' => round($item->sales / $total * 100, 1),
            'orders' => (int) $item->qty,
            'averagePrice' => $item->qty > 0 ? round($item->sales / $item->qty, 2) : 0,
            'color' => $colors[$i % count($colors)],
            'trend' => 0,
        ])->toArray();
    }
}

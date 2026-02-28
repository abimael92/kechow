<?php
// app/Modules/Order/Controllers/OrderController.php
namespace App\Modules\Order\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Requests\CreateOrderRequest;
use App\Modules\Order\Requests\UpdateOrderStatusRequest;
use App\Modules\Order\Resources\OrderResource;
use App\Modules\Order\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function __construct(private OrderService $orderService)
    {}

    public function index(Request $request): JsonResponse
    {
        $orders = $this->orderService->getAllOrders($request->all());
        return response()->json(OrderResource::collection($orders));
    }

    public function store(CreateOrderRequest $request): JsonResponse
{
    $validated = $request->validated();

    $orderData = [
        'user_id' => $request->user()->id,
        'restaurant_id' => $validated['restaurantId'],
        'delivery_address' => $validated['deliveryAddress'],
        'delivery_notes' => $validated['specialInstructions'] ?? null,
        'items' => $validated['items'],
    ];

    $order = $this->orderService->createOrder($orderData);

    return response()->json(new OrderResource($order), 201);
}

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->getOrderById($id);
        return response()->json(new OrderResource($order));
    }

    /** Show order for owner (must belong to owner's restaurants). */
    public function showOwnerOrder(Request $request, Order $order): JsonResponse
    {
        $restaurantIds = $request->user()->restaurants()->pluck('id')->toArray();
        if (!in_array($order->restaurant_id, $restaurantIds)) {
            abort(403, 'Unauthorized');
        }
        $order->load('items.menuItem', 'user', 'driver');
        return response()->json((new OrderResource($order))->resolve());
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $role = $request->user()->role ?? null;
        $updatedOrder = $this->orderService->updateOrderStatus($order, $request->status, $role);
        return response()->json(new OrderResource($updatedOrder));
    }

    public function cancel(Order $order): JsonResponse
    {
        $updatedOrder = $this->orderService->cancelOrder($order);
        return response()->json(new OrderResource($updatedOrder));
    }

    public function restaurantOrders(Request $request): JsonResponse
    {
        $restaurantIds = $request->user()->restaurants()->pluck('id')->toArray();
        if (empty($restaurantIds)) {
            return response()->json(['orders' => []]);
        }
        $orders = $this->orderService->getOrdersByRestaurantIds($restaurantIds, $this->mapStatusFilter($request->get('status')));
        return response()->json(['orders' => OrderResource::collection($orders)->resolve()]);
    }

    /** Map frontend status 'new' to backend 'pending'. */
    private function mapStatusFilter($status): ?array
    {
        if (!is_array($status) || empty($status)) {
            return null;
        }
        return array_map(fn ($s) => $s === 'new' ? 'pending' : $s, $status);
    }

    /** Order stats for owner dashboard (today, weekly, monthly). */
    public function stats(Request $request): JsonResponse
    {
        $restaurantIds = $request->user()->restaurants()->pluck('id')->toArray();
        if (empty($restaurantIds)) {
            return response()->json([
                'today' => ['orders' => 0, 'revenue' => 0, 'averageOrderValue' => 0],
                'weekly' => ['orders' => 0, 'revenue' => 0, 'trend' => 'stable'],
                'monthly' => ['orders' => 0, 'revenue' => 0, 'completionRate' => 0],
            ]);
        }

        $todayStart = now()->startOfDay();
        $weekStart = now()->startOfWeek();
        $monthStart = now()->startOfMonth();

        $orders = Order::whereIn('restaurant_id', $restaurantIds)->get();
        $todayOrders = $orders->filter(fn ($o) => $o->created_at->gte($todayStart));
        $weeklyOrders = $orders->filter(fn ($o) => $o->created_at->gte($weekStart));
        $monthlyOrders = $orders->filter(fn ($o) => $o->created_at->gte($monthStart));

        $todayRevenue = (float) $todayOrders->sum('total');
        $weeklyRevenue = (float) $weeklyOrders->sum('total');
        $monthlyRevenue = (float) $monthlyOrders->sum('total');

        $todayCount = $todayOrders->count();
        $monthlyCount = $monthlyOrders->count();
        $monthlyDelivered = $monthlyOrders->where('status', Order::STATUS_DELIVERED)->count();
        $completionRate = $monthlyCount > 0 ? round($monthlyDelivered / $monthlyCount * 100, 1) : 0;

        return response()->json([
            'today' => [
                'orders' => $todayCount,
                'revenue' => $todayRevenue,
                'averageOrderValue' => $todayCount > 0 ? round($todayRevenue / $todayCount, 2) : 0,
            ],
            'weekly' => [
                'orders' => $weeklyOrders->count(),
                'revenue' => $weeklyRevenue,
                'trend' => 'stable',
            ],
            'monthly' => [
                'orders' => $monthlyCount,
                'revenue' => $monthlyRevenue,
                'completionRate' => $completionRate,
            ],
        ]);
    }

    public function driverOrders(Request $request): JsonResponse
    {
        $orders = $this->orderService->getAvailableDriverOrders();
        return response()->json(OrderResource::collection($orders));
    }

    public function acceptOrder(Request $request, Order $order): JsonResponse
    {
        if ($order->driver_id !== null) {
            return response()->json(['message' => 'El pedido ya fue asignado.'], 422);
        }
        $updatedOrder = $this->orderService->assignDriver($order, $request->user()->id);
        return response()->json(new OrderResource($updatedOrder));
    }

    /** Driver starts delivery (no-op status-wise; order already out_for_delivery). */
    public function startDelivery(Request $request, Order $order): JsonResponse
    {
        if ($order->driver_id !== $request->user()->id) {
            abort(403, 'No autorizado');
        }
        if ($order->status !== Order::STATUS_OUT_FOR_DELIVERY) {
            return response()->json(['message' => 'El pedido no está en estado de entrega.'], 422);
        }
        return response()->json(new OrderResource($order->fresh(['items.menuItem', 'restaurant', 'user', 'driver'])));
    }

    /** Driver marks order as delivered. */
    public function completeDelivery(Request $request, Order $order): JsonResponse
    {
        if ($order->driver_id !== $request->user()->id) {
            abort(403, 'No autorizado');
        }
        $updatedOrder = $this->orderService->updateOrderStatus($order, Order::STATUS_DELIVERED, 'delivery');
        $updatedOrder->update(['actual_delivery_time' => now()]);
        return response()->json(new OrderResource($updatedOrder->fresh(['items.menuItem', 'restaurant', 'user', 'driver'])));
    }
}

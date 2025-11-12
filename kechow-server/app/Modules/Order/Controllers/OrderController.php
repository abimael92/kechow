<?php
// app/Modules/Order/Controllers/OrderController.php
namespace App\Modules\Order\Controllers;  // ← FIX NAMESPACE

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
        $data = $request->validated();
        $data['user_id'] = $request->user()->id;

        $order = $this->orderService->createOrder($data);
        return response()->json(new OrderResource($order), 201);
    }

    public function show(int $id): JsonResponse
    {
        $order = $this->orderService->getOrderById($id);
        return response()->json(new OrderResource($order));
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): JsonResponse
    {
        $updatedOrder = $this->orderService->updateOrderStatus($order, $request->status);
        return response()->json(new OrderResource($updatedOrder));
    }

    public function cancel(Order $order): JsonResponse
    {
        $updatedOrder = $this->orderService->cancelOrder($order);
        return response()->json(new OrderResource($updatedOrder));
    }

    public function restaurantOrders(Request $request): JsonResponse
    {
        $orders = $this->orderService->getRestaurantOrders($request->user()->restaurant_id);
        return response()->json(OrderResource::collection($orders));
    }

    public function driverOrders(Request $request): JsonResponse
    {
        $orders = $this->orderService->getAvailableDriverOrders();
        return response()->json(OrderResource::collection($orders));
    }

    public function acceptOrder(Request $request, Order $order): JsonResponse
    {
        $updatedOrder = $this->orderService->assignDriver($order, $request->user()->id);
        return response()->json(new OrderResource($updatedOrder));
    }
}

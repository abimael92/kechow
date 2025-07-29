<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    // List orders (optionally filter by user)
    public function index(Request $request)
    {
        $query = Order::with('items.menuItem');

        if ($request->user_id) {
            $query->where('user_id', $request->user_id);
        }

        return response()->json($query->get());
    }

    // Show single order
    public function show($id)
    {
        $order = Order::with('items.menuItem')->findOrFail($id);
        return response()->json($order);
    }

    // Store a new order
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'restaurant_id' => 'required|exists:restaurants,id',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated) {
            $total = 0;

            // Calculate total based on current menu item prices
            foreach ($validated['items'] as $item) {
                $menuItem = \App\Models\MenuItem::findOrFail($item['menu_item_id']);
                $total += $menuItem->price * $item['quantity'];
            }

            $order = Order::create([
                'user_id' => $validated['user_id'],
                'restaurant_id' => $validated['restaurant_id'],
                'total' => $total,
                'status' => 'pending',
            ]);

            foreach ($validated['items'] as $item) {
                $menuItem = \App\Models\MenuItem::findOrFail($item['menu_item_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $menuItem->id,
                    'quantity' => $item['quantity'],
                    'price' => $menuItem->price,
                ]);
            }

            return response()->json($order->load('items.menuItem'), 201);
        });
    }

    // Update order status
    public function update(Request $request, $id)
    {
        $order = Order::findOrFail($id);
        $request->validate([
            'status' => 'required|in:pending,accepted,delivered,cancelled',
        ]);
        $order->status = $request->input('status');
        $order->save();

        return response()->json($order);
    }

    // Delete order
    public function destroy($id)
    {
        Order::destroy($id);
        return response()->json(null, 204);
    }

    public function updateStatus(Request $request, Order $order)
{
    $request->validate(['status' => 'required|string|in:received,preparing,ready,out_for_delivery']);
    // Check ownership
    // Update order status and save
}

}

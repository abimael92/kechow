<?php

namespace App\Modules\Cart\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Cart\Models\Cart;
use App\Modules\Cart\Models\CartItem;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    /**
     * Create or retrieve cart for current user + restaurant.
     * POST /api/carts with { restaurant_id }
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'restaurant_id' => 'required|exists:restaurants,id',
        ]);

        $userId = $request->user()->id;
        $restaurantId = (int) $request->restaurant_id;

        // One cart per restaurant per user
        $cart = Cart::where('user_id', $userId)
            ->where('restaurant_id', $restaurantId)
            ->first();

        if (! $cart) {
            $cart = Cart::create([
                'user_id' => $userId,
                'restaurant_id' => $restaurantId,
                'expires_at' => now()->addMinutes(30),
            ]);
        } elseif ($cart->isExpired()) {
            $cart->items()->delete();
            $cart->touchExpiration();
        } else {
            $cart->touchExpiration();
        }

        $cart->load(['items.menuItem', 'restaurant']);
        return response()->json($this->cartResponse($cart));
    }

    /**
     * Get user's current/active cart.
     * GET /api/carts/current
     */
    public function current(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $cart = Cart::where('user_id', $userId)
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
            })
            ->with(['items.menuItem', 'restaurant'])
            ->latest()
            ->first();

        if (! $cart) {
            return response()->json(['cart' => null, 'items' => [], 'restaurant' => null]);
        }

        $cart->touchExpiration();
        return response()->json($this->cartResponse($cart));
    }

    /**
     * Add or update item in cart.
     * PUT /api/carts/{cart}/items with { menu_item_id, quantity?, notes? }
     */
    public function updateItems(Request $request, Cart $cart): JsonResponse
    {
        if ($cart->user_id !== $request->user()->id) {
            abort(403, 'No autorizado');
        }

        $request->validate([
            'menu_item_id' => 'required|exists:menu_items,id',
            'quantity' => 'sometimes|integer|min:0|max:20',
            'notes' => 'nullable|string|max:500',
        ]);

        $menuItemId = (int) $request->menu_item_id;
        $quantity = (int) ($request->quantity ?? 1);

        $menuItem = MenuItem::findOrFail($menuItemId);
        if ($menuItem->restaurant_id !== $cart->restaurant_id) {
            return response()->json(['message' => 'El artículo no pertenece al restaurante del carrito.'], 422);
        }
        if (! $menuItem->is_available) {
            return response()->json(['message' => 'El artículo ya no está disponible.'], 422);
        }
        $maxQty = $menuItem->stock === null ? 20 : min(20, $menuItem->stock);
        if ($quantity > $maxQty) {
            return response()->json([
                'message' => "Cantidad máxima: {$maxQty}. Stock limitado.",
            ], 422);
        }

        if ($quantity <= 0) {
            $cart->items()->where('menu_item_id', $menuItemId)->delete();
        } else {
            $cart->items()->updateOrCreate(
                ['menu_item_id' => $menuItemId],
                ['quantity' => $quantity, 'notes' => $request->notes]
            );
        }

        $cart->touchExpiration();
        $cart->load(['items.menuItem', 'restaurant']);
        return response()->json($this->cartResponse($cart));
    }

    /**
     * Remove item from cart.
     * DELETE /api/carts/{cart}/items/{item}
     */
    public function removeItem(Cart $cart, CartItem $cartItem): JsonResponse
    {
        if ($cart->user_id !== request()->user()->id) {
            abort(403, 'No autorizado');
        }
        if ($cartItem->cart_id !== $cart->id) {
            abort(404);
        }
        $cartItem->delete();
        $cart->touchExpiration();
        $cart->load(['items.menuItem', 'restaurant']);
        return response()->json($this->cartResponse($cart));
    }

    private function cartResponse(Cart $cart): array
    {
        $items = $cart->items->map(function (CartItem $ci) {
            $mi = $ci->menuItem;
            return [
                'id' => $ci->id,
                'menu_item_id' => $mi->id,
                'name' => $mi->name,
                'description' => $mi->description,
                'price' => (float) $mi->price,
                'image_url' => $mi->image_url,
                'quantity' => $ci->quantity,
                'notes' => $ci->notes,
                'stock' => $mi->stock,
                'is_available' => $mi->is_available,
            ];
        })->values()->all();

        return [
            'cart' => [
                'id' => $cart->id,
                'restaurant_id' => $cart->restaurant_id,
                'expires_at' => $cart->expires_at?->toIso8601String(),
            ],
            'restaurant' => $cart->restaurant ? [
                'id' => $cart->restaurant->id,
                'name' => $cart->restaurant->name,
            ] : null,
            'items' => $items,
        ];
    }
}

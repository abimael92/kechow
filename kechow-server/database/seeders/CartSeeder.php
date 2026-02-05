<?php

namespace Database\Seeders;

use App\Modules\Cart\Models\Cart;
use App\Modules\Cart\Models\CartItem;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\Restaurant;
use App\Models\User;
use Illuminate\Database\Seeder;

class CartSeeder extends Seeder
{
    public function run(): void
    {
        $customer = User::where('role', 'customer')->first();
        if (! $customer) {
            return;
        }

        $restaurant = Restaurant::first();
        if (! $restaurant) {
            return;
        }

        $menuItems = MenuItem::where('restaurant_id', $restaurant->id)->limit(3)->get();
        if ($menuItems->isEmpty()) {
            return;
        }

        $cart = Cart::firstOrCreate(
            [
                'user_id' => $customer->id,
                'restaurant_id' => $restaurant->id,
            ],
            [
                'expires_at' => now()->addMinutes(30),
            ]
        );

        foreach ($menuItems as $index => $mi) {
            CartItem::updateOrCreate(
                [
                    'cart_id' => $cart->id,
                    'menu_item_id' => $mi->id,
                ],
                [
                    'quantity' => $index + 1,
                    'notes' => null,
                ]
            );
        }
    }
}

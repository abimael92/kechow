<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Restaurant;
use App\Models\MenuItem;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $restaurants = Restaurant::all();

        foreach ($restaurants as $restaurant) {
            $menuItems = $restaurant->menuItems;

            foreach ($users as $user) {
                if ($menuItems->count() == 0) continue;

                $order = Order::create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurant->id,
                    'total' => 0,
                    'status' => 'pending',
                ]);

                $total = 0;

                // Add 1-3 random items per order
                $items = $menuItems->random(rand(1, min(3, $menuItems->count())));

                foreach ($items as $menuItem) {
                    $qty = rand(1, 3);
                    $total += $menuItem->price * $qty;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => $menuItem->id,
                        'quantity' => $qty,
                        'price' => $menuItem->price,
                    ]);
                }

                $order->total = $total;
                $order->save();
            }
        }
    }
}

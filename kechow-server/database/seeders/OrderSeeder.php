<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Modules\Order\Models\Order;
use App\Modules\Order\Models\OrderItem;
use App\Models\User;
use App\Modules\Restaurant\Models\Restaurant;
use App\Modules\Restaurant\Models\MenuItem;

class OrderSeeder extends Seeder
{
    public function run()
    {
        $users = User::all();
        $restaurants = Restaurant::all();

        if ($users->isEmpty() || $restaurants->isEmpty()) {
            return;
        }

        foreach ($restaurants as $restaurant) {
            $menuItems = MenuItem::where('restaurant_id', $restaurant->id)->get();

            if ($menuItems->isEmpty()) continue;

            foreach ($users->take(2) as $user) {
                $order = Order::create([
                    'user_id' => $user->id,
                    'restaurant_id' => $restaurant->id,
                    'total' => 0,
                    'status' => 'ready',
                    'delivery_address' => 'Av. Tecnologico 123, CD Jimenez',
                ]);

                $total = 0;
                $itemsToOrder = $menuItems->random(rand(1, min(3, $menuItems->count())));

                foreach ($itemsToOrder as $menuItem) {
                    $qty = rand(1, 2);
                    $total += $menuItem->price * $qty;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'menu_item_id' => $menuItem->id,
                        'quantity' => $qty,
                        'price' => $menuItem->price,
                    ]);
                }

                $order->update(['total' => $total]);
            }
        }
    }
}

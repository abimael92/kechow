<?php

namespace Database\Seeders;

use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Database\Seeder;

class MenuItemSeeder extends Seeder
{
    public function run(): void
    {
        Restaurant::all()->each(function (Restaurant $restaurant) {
            MenuItem::factory()->count(5)->create([
                'restaurant_id' => $restaurant->id,
            ]);
        });
    }
}

<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Database\Seeder;

class RestaurantSeeder extends Seeder
{
    public function run(): void
    {
        $owner = User::where('role', 'owner')->first();
        if (!$owner) {
            return;
        }
        Restaurant::factory()->count(5)->create(['owner_id' => $owner->id]);
    }
}

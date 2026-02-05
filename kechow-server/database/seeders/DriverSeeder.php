<?php

namespace Database\Seeders;

use App\Modules\Driver\Models\Driver;
use App\Models\User;
use Illuminate\Database\Seeder;

class DriverSeeder extends Seeder
{
    public function run(): void
    {
        $deliveryUser = User::where('role', 'delivery')->first();
        if (! $deliveryUser) {
            return;
        }

        Driver::updateOrCreate(
            ['user_id' => $deliveryUser->id],
            [
                'status' => 'offline',
                'vehicle_type' => 'motorcycle',
                'is_online' => false,
                'rating' => 4.5,
                'total_deliveries' => 0,
            ]
        );
    }
}

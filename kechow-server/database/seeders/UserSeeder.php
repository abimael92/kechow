<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run()
    {
        // CLIENTE
        User::updateOrCreate(
            ['email' => 'cliente@cliente.com'],
            [
                'name'     => 'Abimael Cliente',
                'password' => Hash::make('123456'),
                'role'     => 'customer'
            ]
        );

        // REPARTIDOR (delivery role for api/delivery/*)
        User::updateOrCreate(
            ['email' => 'entrega@entrega.com'],
            [
                'name'     => 'deliverboy',
                'password' => Hash::make('123456'),
                'role'     => 'delivery'
            ]
        );

        // NEGOCIO (OWNER)
        User::updateOrCreate(
            ['email' => 'negocio@negocio.com'],
            [
                'name'     => 'don negocio',
                'password' => Hash::make('123456'),
                'role'     => 'owner'
            ]
        );
    }
}

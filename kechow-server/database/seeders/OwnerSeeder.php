<?php

namespace Database\Seeders;

use App\Models\User;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

/**
 * Seeds mock owners (users with role owner) and sample restaurants.
 * Password for all seeded owners: 123456 (use Hash::make('123456')).
 * Spanish names, addresses, and phone numbers for demo/API testing.
 *
 * @see Docs/OWNER_SEEDERS_AND_RESPONSES.md
 */
class OwnerSeeder extends Seeder
{
    public function run(): void
    {
        $password = Hash::make('123456');

        $ownersData = [
            [
                'name' => 'Carmen López García',
                'email' => 'carmen.lopez@example.com',
                'phone' => '+34 912 345 678',
                'address' => 'Calle Gran Vía 42, 28013 Madrid',
                'latitude' => 40.416775,
                'longitude' => -3.703790,
                'restaurants' => [
                    [
                        'name' => 'La Taberna de Carmen',
                        'description' => 'Cocina tradicional española y tapas en el centro de Madrid.',
                        'address' => 'Calle Gran Vía 42',
                        'city' => 'Madrid',
                        'state' => 'Madrid',
                        'zip_code' => '28013',
                        'phone' => '+34 912 345 678',
                        'email' => 'info@latabernadecarmen.es',
                        'website' => 'https://latabernadecarmen.example.com',
                        'opening_time' => '12:00:00',
                        'closing_time' => '00:00:00',
                    ],
                    [
                        'name' => 'El Rincón de Carmen',
                        'description' => 'Desayunos y brunch con productos locales.',
                        'address' => 'Plaza Mayor 8',
                        'city' => 'Madrid',
                        'state' => 'Madrid',
                        'zip_code' => '28012',
                        'phone' => '+34 913 100 200',
                        'email' => 'rincon@latabernadecarmen.es',
                        'website' => null,
                        'opening_time' => '08:00:00',
                        'closing_time' => '15:00:00',
                    ],
                ],
            ],
            [
                'name' => 'Antonio Martínez Ruiz',
                'email' => 'antonio.martinez@example.com',
                'phone' => '+34 934 567 890',
                'address' => 'Passeig de Gràcia 92, 08008 Barcelona',
                'latitude' => 41.395347,
                'longitude' => 2.161930,
                'restaurants' => [
                    [
                        'name' => 'Casa Antonio',
                        'description' => 'Arroces y pescado fresco junto a la Barceloneta.',
                        'address' => 'Passeig de Gràcia 92',
                        'city' => 'Barcelona',
                        'state' => 'Barcelona',
                        'zip_code' => '08008',
                        'phone' => '+34 934 567 890',
                        'email' => 'contacto@casaantonio.es',
                        'website' => 'https://casaantonio.example.com',
                        'opening_time' => '13:00:00',
                        'closing_time' => '23:30:00',
                    ],
                ],
            ],
            [
                'name' => 'Elena Fernández Sánchez',
                'email' => 'elena.fernandez@example.com',
                'phone' => '+34 958 123 456',
                'address' => 'Carrera del Darro 31, 18010 Granada',
                'latitude' => 37.177336,
                'longitude' => -3.598557,
                'restaurants' => [
                    [
                        'name' => 'La Alhambra Restaurante',
                        'description' => 'Vistas a la Alhambra y gastronomía granadina.',
                        'address' => 'Carrera del Darro 31',
                        'city' => 'Granada',
                        'state' => 'Granada',
                        'zip_code' => '18010',
                        'phone' => '+34 958 123 456',
                        'email' => 'reservas@laalhambrarestaurante.es',
                        'website' => null,
                        'opening_time' => '12:30:00',
                        'closing_time' => '23:00:00',
                    ],
                    [
                        'name' => 'Tetería Elena',
                        'description' => 'Tés, repostería árabe y tapas en el Albayzín.',
                        'address' => 'Calle Calderería Nueva 4',
                        'city' => 'Granada',
                        'state' => 'Granada',
                        'zip_code' => '18010',
                        'phone' => '+34 958 200 300',
                        'email' => 'info@teteriaelena.es',
                        'website' => null,
                        'opening_time' => '10:00:00',
                        'closing_time' => '22:00:00',
                    ],
                ],
            ],
        ];

        foreach ($ownersData as $data) {
            $restaurants = $data['restaurants'];
            unset($data['restaurants']);

            $owner = User::create([
                'name' => $data['name'],
                'email' => $data['email'],
                'password' => $password,
                'role' => 'owner',
                'phone' => $data['phone'],
                'address' => $data['address'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
            ]);

            foreach ($restaurants as $restaurantData) {
                Restaurant::create(array_merge($restaurantData, [
                    'owner_id' => $owner->id,
                    'logo_url' => null,
                    'is_active' => true,
                ]));
            }
        }
    }
}

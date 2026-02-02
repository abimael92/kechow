<?php

namespace Database\Factories;

use App\Modules\Restaurant\Models\MenuItem;
use Illuminate\Database\Eloquent\Factories\Factory;

class MenuItemFactory extends Factory
{
    protected $model = MenuItem::class;

    public function definition()
    {
        return [
            'name' => $this->faker->word,
            'description' => $this->faker->sentence,
            'price' => $this->faker->randomFloat(2, 5, 50),
            'image_url' => null,
            'is_available' => $this->faker->boolean(90),
        ];
    }
}

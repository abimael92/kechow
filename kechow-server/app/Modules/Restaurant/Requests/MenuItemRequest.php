<?php
// app/Modules/Restaurant/Requests/MenuItemRequest.php
namespace App\Modules\Restaurant\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Check if user is authenticated first
        if (!$this->user()) {
            Log::warning('MenuItemRequest: User not authenticated');
            return false;
        }

        // Check if user has the correct role
        $hasValidRole = $this->user()->role === 'owner' || $this->user()->role === 'admin';

        if (!$hasValidRole) {
            Log::warning('MenuItemRequest: User has invalid role', [
                'user_id' => $this->user()->id,
                'role' => $this->user()->role
            ]);
        }

        // Also verify the user owns this restaurant (optional but recommended)
        if ($hasValidRole && $this->user()->role === 'owner') {
            $restaurantId = $this->route('restaurant'); // or 'restaurantId' depending on route param name
            $restaurant = \App\Modules\Restaurant\Models\Restaurant::find($restaurantId);

            if (!$restaurant || $restaurant->owner_id !== $this->user()->id) {
                Log::warning('MenuItemRequest: User does not own this restaurant', [
                    'user_id' => $this->user()->id,
                    'restaurant_id' => $restaurantId,
                    'restaurant_owner_id' => $restaurant?->owner_id
                ]);
                return false;
            }
        }

        return $hasValidRole;
    }

    public function rules(): array
    {
        $menuItemId = $this->route('id');

        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'is_available' => 'boolean',
            'category' => 'required|string|max:100',
            'preparation_time' => 'nullable|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre es obligatorio',
            'price.required' => 'El precio es obligatorio',
            'price.numeric' => 'El precio debe ser un número',
            'price.min' => 'El precio debe ser mayor a 0',
            'category.required' => 'La categoría es obligatoria',
        ];
    }
}

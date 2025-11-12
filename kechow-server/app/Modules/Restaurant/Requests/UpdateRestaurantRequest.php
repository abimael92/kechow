<?php
// app/Modules/Restaurant/Requests/UpdateRestaurantRequest.php
namespace App\Modules\Restaurant\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRestaurantRequest extends FormRequest
{
    public function authorize(): bool
    {
        $restaurant = $this->route('restaurant');
        return $this->user()->id === $restaurant->owner_id || $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        $restaurantId = $this->route('restaurant')->id;

        return [
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'address' => 'sometimes|string|max:500',
            'city' => 'sometimes|string|max:100',
            'state' => 'sometimes|string|max:100',
            'zip_code' => 'sometimes|string|max:20',
            'phone' => 'sometimes|string|max:20',
            'email' => [
                'sometimes',
                'email',
                Rule::unique('restaurants')->ignore($restaurantId)
            ],
            'website' => 'nullable|url',
            'opening_time' => 'sometimes|date_format:H:i',
            'closing_time' => 'sometimes|date_format:H:i|after:opening_time',
            'logo_url' => 'nullable|url',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'delivery_radius' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
        ];
    }
}

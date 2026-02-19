<?php

namespace App\Modules\Order\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CreateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'restaurantId' => 'required|exists:restaurants,id',
            'items' => 'required|array|min:1',
            'items.*.menuItemId' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'deliveryAddress' => 'required|string',
            'paymentMethod' => 'required|string',
            'specialInstructions' => 'nullable|string',
        ];
    }
}

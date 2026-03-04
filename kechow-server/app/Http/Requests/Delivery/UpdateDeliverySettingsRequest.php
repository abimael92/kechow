<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateDeliverySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'delivery';
    }

    public function rules(): array
    {
        return [
            'language' => ['sometimes', 'string', 'in:es,en'],
        ];
    }
}

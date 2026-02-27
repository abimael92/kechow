<?php

namespace App\Http\Requests\Delivery;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAvailabilityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->role === 'delivery';
    }

    public function rules(): array
    {
        return [
            'isOnline' => ['required', 'boolean'],
        ];
    }
}

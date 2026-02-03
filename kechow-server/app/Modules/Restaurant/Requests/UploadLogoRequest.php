<?php

namespace App\Modules\Restaurant\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UploadLogoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $restaurant = $this->route('restaurant');
        return $this->user()->id === $restaurant->owner_id || $this->user()->role === 'admin';
    }

    public function rules(): array
    {
        return [
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
        ];
    }
}

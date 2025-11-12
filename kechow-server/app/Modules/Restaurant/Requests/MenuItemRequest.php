<?php
// app/Modules/Restaurant/Requests/MenuItemRequest.php
namespace App\Modules\Restaurant\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuItemRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only restaurant owners or admins can manage menu items
        return $this->user()->role === 'owner' || $this->user()->role === 'admin';
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
}

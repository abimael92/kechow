<?php
// app/Modules/Order/Requests/UpdateOrderStatusRequest.php
namespace App\Modules\Order\Requests;

use App\Modules\Order\Models\Order;
use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        $order = $this->route('order');

        // Restaurant owners can update status for their orders
        if ($this->user()->role === 'owner') {
            return $order->restaurant->owner_id === $this->user()->id;
        }

        // Drivers can update status for orders they're assigned to
        if ($this->user()->role === 'delivery') {
            return $order->driver_id === $this->user()->id;
        }

        // Admins can update any order
        return $this->user()->role === 'admin';
    }

    protected function prepareForValidation(): void
    {
        $status = $this->input('status');
        if ($status === 'declined') {
            $this->merge(['status' => Order::STATUS_CANCELLED]);
        }
    }

    public function rules(): array
    {
        return [
            'status' => 'required|string|in:' . implode(',', [
                Order::STATUS_ACCEPTED,
                Order::STATUS_PREPARING,
                Order::STATUS_READY,
                Order::STATUS_OUT_FOR_DELIVERY,
                Order::STATUS_DELIVERED,
                Order::STATUS_CANCELLED,
            ]),
        ];
    }
}

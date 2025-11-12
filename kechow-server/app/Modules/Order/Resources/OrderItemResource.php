<?php
// app/Modules/Order/Resources/OrderItemResource.php
namespace App\Modules\Order\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'order_id' => $this->order_id,
            'menu_item_id' => $this->menu_item_id,
            'quantity' => $this->quantity,
            'price' => $this->price,
            'subtotal' => $this->subtotal,
            'menu_item' => new \App\Modules\Restaurant\Resources\MenuItemResource($this->whenLoaded('menuItem')),
        ];
    }
}

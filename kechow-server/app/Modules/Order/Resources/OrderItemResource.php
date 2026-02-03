<?php
// app/Modules/Order/Resources/OrderItemResource.php
namespace App\Modules\Order\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderItemResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => (string) $this->id,
            'order_id' => $this->order_id,
            'menu_item_id' => $this->menu_item_id,
            'name' => $this->menuItem?->name ?? 'Unknown',
            'quantity' => (int) $this->quantity,
            'price' => (float) $this->price,
            'subtotal' => (float) ($this->quantity * $this->price),
            'menu_item' => new \App\Modules\Restaurant\Resources\MenuItemResource($this->whenLoaded('menuItem')),
        ];
    }
}

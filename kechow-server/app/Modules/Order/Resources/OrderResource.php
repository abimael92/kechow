<?php
// app/Modules/Order/Resources/OrderResource.php
namespace App\Modules\Order\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'restaurant_id' => $this->restaurant_id,
            'total' => $this->total,
            'status' => $this->status,
            'delivery_address' => $this->delivery_address,
            'delivery_notes' => $this->delivery_notes,
            'driver_id' => $this->driver_id,
            'estimated_delivery_time' => $this->estimated_delivery_time,
            'actual_delivery_time' => $this->actual_delivery_time,
            'can_be_cancelled' => $this->canBeCancelled(),
            'is_completed' => $this->isCompleted(),
            'user' => new \App\Http\Resources\UserResource($this->whenLoaded('user')),
            'restaurant' => new \App\Modules\Restaurant\Resources\RestaurantResource($this->whenLoaded('restaurant')),
            'driver' => new \App\Http\Resources\UserResource($this->whenLoaded('driver')),
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

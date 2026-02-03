<?php
// app/Modules/Restaurant/Resources/RestaurantResource.php
namespace App\Modules\Restaurant\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class RestaurantResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'address' => $this->address,
            'city' => $this->city,
            'state' => $this->state,
            'zip_code' => $this->zip_code,
            'phone' => $this->phone,
            'email' => $this->email,
            'website' => $this->website,
            'opening_time' => $this->opening_time,
            'closing_time' => $this->closing_time,
            'schedule_json' => $this->schedule_json,
            'closed_dates' => $this->closed_dates ?? [],
            'exceptional_closed_dates' => $this->exceptional_closed_dates ?? [],
            'logo_url' => $this->logo_url,
            'avg_prep_time_minutes' => $this->avg_prep_time_minutes,
            'is_active' => $this->is_active,
            'is_open' => $this->isOpen(),
            'latitude' => $this->latitude,
            'longitude' => $this->longitude,
            'delivery_radius' => $this->delivery_radius,
            'owner' => new \App\Http\Resources\UserResource($this->whenLoaded('owner')),
            'menu_items' => MenuItemResource::collection($this->whenLoaded('menuItems')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}

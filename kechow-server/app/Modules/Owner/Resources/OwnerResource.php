<?php

namespace App\Modules\Owner\Resources;

use App\Modules\Restaurant\Resources\RestaurantResource;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * API Resource for owner (User with role owner) responses.
 *
 * Exposes: id, name, email, phone, address, restaurants[].
 * Never exposes: password, remember_token, or other sensitive attributes.
 *
 * @see Docs/OWNER_RESOURCE_SCHEMA.md for JSON schema and interface
 */
class OwnerResource extends JsonResource
{
    /**
     * Transform the resource into an array. Only safe, non-sensitive fields are included.
     * Sensitive fields (password, remember_token) are never serialized.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed>
     */
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'restaurants' => RestaurantResource::collection($this->whenLoaded('restaurants')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->when($this->deleted_at !== null, $this->deleted_at),
        ];
    }
}

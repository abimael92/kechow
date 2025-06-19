<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Restaurant;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="MenuItem",
 *     description="Menu Item model",
 *     required={"restaurant_id", "name", "price"},
 *     @OA\Xml(name="MenuItem"),
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="restaurant_id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Cheeseburger"),
 *     @OA\Property(property="description", type="string", nullable=true, example="Juicy beef patty with cheese"),
 *     @OA\Property(property="price", type="number", format="float", example=8.99),
 *     @OA\Property(property="image_url", type="string", nullable=true, example="https://example.com/image.jpg"),
 *     @OA\Property(property="is_available", type="boolean", example=true),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class MenuItem extends Model
{
    protected $fillable = [
        'restaurant_id',
        'name',
        'description',
        'price',
        'image_url',
        'is_available',
    ];

    public function restaurant()
    {
        return $this->belongsTo(Restaurant::class);
    }
}

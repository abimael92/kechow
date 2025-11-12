<?php
// app/Modules/Restaurant/Models/Restaurant.php
namespace App\Modules\Restaurant\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Restaurant",
 *     description="Restaurant model",
 *     required={"name", "address", "city"},
 *     @OA\Xml(name="Restaurant"),
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="name", type="string", example="Burger Palace"),
 *     @OA\Property(property="description", type="string", example="Best burgers in town"),
 *     @OA\Property(property="address", type="string", example="123 Main St"),
 *     @OA\Property(property="city", type="string", example="New York"),
 *     @OA\Property(property="state", type="string", example="NY"),
 *     @OA\Property(property="zip_code", type="string", example="10001"),
 *     @OA\Property(property="phone", type="string", example="+1-212-555-1234"),
 *     @OA\Property(property="email", type="string", format="email", example="info@burgerpalace.com"),
 *     @OA\Property(property="website", type="string", example="https://burgerpalace.com"),
 *     @OA\Property(property="opening_time", type="string", example="10:00"),
 *     @OA\Property(property="closing_time", type="string", example="22:00"),
 *     @OA\Property(property="logo_url", type="string", example="https://example.com/logo.png"),
 *     @OA\Property(property="is_active", type="boolean", example=true),
 *     @OA\Property(property="latitude", type="number", format="float", example=40.7128),
 *     @OA\Property(property="longitude", type="number", format="float", example=-74.0060),
 *     @OA\Property(property="delivery_radius", type="number", format="float", example=5.0),
 *     @OA\Property(property="owner_id", type="integer", example=1),
 *     @OA\Property(property="created_at", type="string", format="date-time"),
 *     @OA\Property(property="updated_at", type="string", format="date-time")
 * )
 */
class Restaurant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'description', 'address', 'city', 'state', 'zip_code',
        'phone', 'email', 'website', 'opening_time', 'closing_time',
        'logo_url', 'is_active', 'latitude', 'longitude', 'delivery_radius', 'owner_id'
    ];

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    public function owner()
    {
        return $this->belongsTo(\App\Models\User::class, 'owner_id');
    }

    public function orders()
    {
        return $this->hasMany(\App\Modules\Order\Models\Order::class);
    }

    // Helper methods
    public function isOpen(): bool
    {
        if (!$this->is_active) {
            return false;
        }

        $currentTime = now()->format('H:i');
        return $currentTime >= $this->opening_time && $currentTime <= $this->closing_time;
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeNearby($query, $latitude, $longitude, $radius = 10)
    {
        // Basic distance calculation (you might want to use spatial extensions)
        return $query->whereRaw("
            (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * cos(radians(longitude) - radians(?)) + sin(radians(?)) * sin(radians(latitude)))) <= ?
        ", [$latitude, $longitude, $latitude, $radius]);
    }
}

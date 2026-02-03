<?php
// app/Modules/Restaurant/Models/Restaurant.php
namespace App\Modules\Restaurant\Models;

use Database\Factories\RestaurantFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Factories\Factory;
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

    /**
     * Create a new factory instance for the model (factory lives in Database\Factories).
     */
    protected static function newFactory(): Factory
    {
        return RestaurantFactory::new();
    }

    protected $fillable = [
        'name', 'description', 'address', 'city', 'state', 'zip_code',
        'phone', 'email', 'website', 'opening_time', 'closing_time',
        'schedule_json', 'closed_dates', 'exceptional_closed_dates',
        'logo_url', 'avg_prep_time_minutes', 'is_active', 'latitude', 'longitude', 'delivery_radius', 'owner_id'
    ];

    protected $casts = [
        'schedule_json' => 'array',
        'closed_dates' => 'array',
        'exceptional_closed_dates' => 'array',
    ];

    public function menuItems()
    {
        return $this->hasMany(MenuItem::class);
    }

    /**
     * Owner of the restaurant (User with role owner or admin).
     * Inverse of User::restaurants().
     */
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

        $today = now()->format('Y-m-d');
        if (is_array($this->closed_dates) && in_array($today, $this->closed_dates)) {
            return false;
        }
        if (is_array($this->exceptional_closed_dates) && in_array($today, $this->exceptional_closed_dates)) {
            return false;
        }

        $schedule = $this->schedule_json;
        $dayOfWeek = (int) now()->format('N') - 1; // 0=Mon, 6=Sun
        $currentTime = now()->format('H:i');

        if (is_array($schedule) && isset($schedule[(string) $dayOfWeek])) {
            $day = $schedule[(string) $dayOfWeek];
            $enabled = $day['enabled'] ?? true;
            if (!$enabled) {
                return false;
            }
            $open = $day['open'] ?? $this->opening_time ?? '09:00';
            $close = $day['close'] ?? $this->closing_time ?? '22:00';
            $open = substr((string) $open, 0, 5);
            $close = substr((string) $close, 0, 5);

            if ($currentTime < $open || $currentTime > $close) {
                return false;
            }

            $breakEnabled = $day['breakEnabled'] ?? false;
            if ($breakEnabled) {
                $breakStart = substr((string) ($day['breakStart'] ?? '14:00'), 0, 5);
                $breakEnd = substr((string) ($day['breakEnd'] ?? '16:00'), 0, 5);
                if ($currentTime >= $breakStart && $currentTime < $breakEnd) {
                    return false;
                }
            }

            return true;
        }

        $open = $this->opening_time ? substr((string) $this->opening_time, 0, 5) : '09:00';
        $close = $this->closing_time ? substr((string) $this->closing_time, 0, 5) : '22:00';
        return $currentTime >= $open && $currentTime <= $close;
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

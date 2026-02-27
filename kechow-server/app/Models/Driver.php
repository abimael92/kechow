<?php

namespace App\Models;

use App\Modules\Driver\Models\DriverLocation;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
    use HasFactory;

    protected $table = 'drivers';

    protected $fillable = [
        'user_id',
        'status',
        'current_latitude',
        'current_longitude',
        'vehicle_type',
        'is_online',
        'rating',
        'total_deliveries',
    ];

    protected $casts = [
        'is_online' => 'boolean',
        'rating' => 'decimal:2',
        'current_latitude' => 'decimal:8',
        'current_longitude' => 'decimal:8',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    public function locations(): HasMany
    {
        return $this->hasMany(DriverLocation::class)->orderByDesc('created_at');
    }
}

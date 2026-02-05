<?php

namespace App\Modules\Driver\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Driver extends Model
{
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

    public function locations(): HasMany
    {
        return $this->hasMany(DriverLocation::class)->orderByDesc('created_at');
    }
}

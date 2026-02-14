<?php

namespace App\Modules\Cart\Models;

use App\Models\User;
use App\Modules\Restaurant\Models\MenuItem;
use App\Modules\Restaurant\Models\Restaurant;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'restaurant_id',
        'expires_at',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
    ];

    public const CART_EXPIRY_MINUTES = 30; // ✅ Fixed

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function restaurant(): BelongsTo
    {
        return $this->belongsTo(Restaurant::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function touchExpiration(): void
    {
        $this->update(['expires_at' => now()->addMinutes(30)]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;
use App\Models\Delivery; // ADD THIS LINE

class Driver extends Model
{
    use HasFactory;

    protected $table = 'drivers';

    protected $fillable = [
        'user_id',
        'is_online',
        'status'
    ];

    protected $casts = [
        'is_online' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function deliveries()
    {
        return $this->hasMany(Delivery::class);
    }
}

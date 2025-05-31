<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Restaurant;

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

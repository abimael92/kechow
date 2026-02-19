<?php

namespace App\Modules\Order\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $fillable = [
        'order_number',
        'user_id',
        'restaurant_id',
        'driver_id',
        'status',
        'total_amount',
        'delivery_fee',
        'payment_method',
        'delivery_address',
        'special_instructions',
        'distance',
        'estimated_time',
        'priority',
        'reviewed'
    ];

    protected $casts = [
        'total_amount' => 'float',
        'delivery_fee' => 'float',
        'distance' => 'float',
        'priority' => 'boolean',
        'reviewed' => 'boolean'
    ];

    const STATUS_PENDING = 'pending';
    const STATUS_CONFIRMED = 'confirmed';
    const STATUS_PREPARING = 'preparing';
    const STATUS_READY_FOR_DELIVERY = 'ready_for_delivery';
    const STATUS_ASSIGNED_TO_DRIVER = 'assigned_to_driver';
    const STATUS_OUT_FOR_DELIVERY = 'out_for_delivery';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    public function restaurant()
    {
        return $this->belongsTo(\App\Modules\Restaurant\Models\Restaurant::class);
    }

    public function customer()
    {
        return $this->belongsTo(\App\Models\User::class, 'user_id');
    }

    public function driver()
    {
        return $this->belongsTo(\App\Models\Driver::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}

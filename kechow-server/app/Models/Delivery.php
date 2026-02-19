<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Driver;
use App\Modules\Order\Models\Order;

class Delivery extends Model
{
    use HasFactory;

    protected $table = 'deliveries';

    protected $fillable = [
        'order_id',
        'driver_id',
        'status',
        'assigned_at',
        'picked_up_at',
        'delivered_at',
        'cancelled_at',
        'cancellation_reason',
        'notes'
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'picked_up_at' => 'datetime',
        'delivered_at' => 'datetime',
        'cancelled_at' => 'datetime'
    ];

    const STATUS_ASSIGNED = 'assigned';
    const STATUS_PICKED_UP = 'picked_up';
    const STATUS_IN_TRANSIT = 'in_transit';
    const STATUS_DELIVERED = 'delivered';
    const STATUS_CANCELLED = 'cancelled';

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function driver()
    {
        return $this->belongsTo(Driver::class);
    }
}

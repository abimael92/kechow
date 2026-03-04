<?php

namespace App\Models;

use App\Modules\Order\Models\Order;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryRejection extends Model
{
    protected $table = 'delivery_rejections';

    public $timestamps = false;

    protected $fillable = ['driver_id', 'order_id', 'reason'];

    protected $casts = [
        'rejected_at' => 'datetime',
    ];

    public function driver(): BelongsTo
    {
        return $this->belongsTo(Driver::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}

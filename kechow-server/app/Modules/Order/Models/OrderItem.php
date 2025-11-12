<?php
// app/Modules/Order/Models/OrderItem.php
namespace App\Modules\Order\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class OrderItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'menu_item_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function menuItem()
    {
        return $this->belongsTo(\App\Modules\Restaurant\Models\MenuItem::class);
    }

    // Helper method to calculate subtotal
    public function getSubtotalAttribute()
    {
        return $this->price * $this->quantity;
    }
}

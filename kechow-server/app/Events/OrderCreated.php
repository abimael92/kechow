<?php

namespace App\Events;

use App\Modules\Order\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class OrderCreated implements ShouldBroadcast
{
    public function __construct(public Order $order)
    {}

    public function broadcastOn(): array
    {
        return [
            new Channel('restaurant.' . $this->order->restaurant_id . '.orders'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.created';
    }

    public function broadcastWith(): array
    {
        return [
            'order_id' => $this->order->id,
        ];
    }
}

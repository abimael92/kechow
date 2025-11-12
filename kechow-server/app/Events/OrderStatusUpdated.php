
class OrderStatusUpdated implements ShouldBroadcast
{
    public $order;

    public function broadcastOn()
    {
        return new Channel('order.' . $this->order->id);
    }
}

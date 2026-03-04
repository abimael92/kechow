<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_rejections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('driver_id')->constrained('drivers')->onDelete('cascade');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->timestamp('rejected_at')->useCurrent();
            $table->text('reason')->nullable();

            $table->index(['driver_id', 'order_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_rejections');
    }
};

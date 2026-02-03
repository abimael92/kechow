<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->json('schedule_json')->nullable()->after('closing_time')->comment('Per-day schedule: {0:{enabled,open,close,breakEnabled,breakStart,breakEnd},...}');
            $table->json('closed_dates')->nullable()->after('schedule_json')->comment('Holiday/closed dates: ["2025-12-25",...]');
            $table->boolean('override_closed')->default(false)->after('closed_dates')->comment('Manual override: restaurant closed today');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn(['schedule_json', 'closed_dates', 'override_closed']);
        });
    }
};

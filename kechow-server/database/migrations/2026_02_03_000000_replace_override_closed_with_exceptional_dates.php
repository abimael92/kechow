<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->json('exceptional_closed_dates')->nullable()->after('closed_dates')
                ->comment('Exceptional/override closed dates: ["2026-02-03",...]');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn('override_closed');
        });
    }

    public function down(): void
    {
        Schema::table('restaurants', function (Blueprint $table) {
            $table->boolean('override_closed')->default(false)->after('closed_dates');
        });

        Schema::table('restaurants', function (Blueprint $table) {
            $table->dropColumn('exceptional_closed_dates');
        });
    }
};

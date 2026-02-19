<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up(): void
{
    Schema::table('drivers', function (Blueprint $table) {
        // Agregamos las columnas que le faltan a tu tabla física
        if (!Schema::hasColumn('drivers', 'is_online')) {
            $table->boolean('is_online')->default(false)->after('status');
        }
        if (!Schema::hasColumn('drivers', 'total_deliveries')) {
            $table->integer('total_deliveries')->default(0)->after('is_online');
        }
        if (!Schema::hasColumn('drivers', 'rating')) {
            $table->decimal('rating', 3, 2)->default(5.00)->after('total_deliveries');
        }
    });
}

public function down(): void
{
    Schema::table('drivers', function (Blueprint $table) {
        $table->dropColumn(['is_online', 'total_deliveries', 'rating']);
    });
}
};

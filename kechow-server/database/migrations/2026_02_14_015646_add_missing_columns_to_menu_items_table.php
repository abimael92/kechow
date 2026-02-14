<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('menu_items', function (Blueprint $table) {
            // Check if columns exist before adding
            if (!Schema::hasColumn('menu_items', 'category')) {
                $table->string('category')->nullable()->after('image_url');
            }

            if (!Schema::hasColumn('menu_items', 'preparation_time')) {
                $table->integer('preparation_time')->nullable()->after('category');
            }

            // 'stock' already exists, so don't add it
        });
    }

    public function down()
    {
        Schema::table('menu_items', function (Blueprint $table) {
            $columns = [];
            if (Schema::hasColumn('menu_items', 'category')) {
                $columns[] = 'category';
            }
            if (Schema::hasColumn('menu_items', 'preparation_time')) {
                $columns[] = 'preparation_time';
            }
            // Don't drop stock since it existed before

            if (!empty($columns)) {
                $table->dropColumn($columns);
            }
        });
    }
};

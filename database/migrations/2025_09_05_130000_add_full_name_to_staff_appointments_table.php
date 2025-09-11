<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('staff_appointments', function (Blueprint $table) {
            if (!Schema::hasColumn('staff_appointments', 'full_name')) {
                $table->string('full_name')->after('end_time');
            }
        });
    }

    public function down(): void
    {
        Schema::table('staff_appointments', function (Blueprint $table) {
            if (Schema::hasColumn('staff_appointments', 'full_name')) {
                $table->dropColumn('full_name');
            }
        });
    }
};



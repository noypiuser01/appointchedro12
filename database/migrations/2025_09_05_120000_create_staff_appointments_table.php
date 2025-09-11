<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('staff_appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('supervisor_id');
            $table->date('date');
            $table->time('time');
            $table->time('end_time');
            $table->string('full_name');
            $table->string('title');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('supervisor_id')->references('id')->on('supervisors')->onDelete('cascade');
            $table->unique(['supervisor_id', 'date', 'time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staff_appointments');
    }
};



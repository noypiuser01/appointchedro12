<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('appointment_requests', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('client_id');
            $table->string('client_name');
            $table->string('client_email');
            $table->unsignedBigInteger('supervisor_id');
            $table->string('supervisor_name');
            $table->string('supervisor_email');
            $table->unsignedBigInteger('staff_appointment_id');
            $table->date('preferred_date');
            $table->time('preferred_time');
            $table->time('preferred_end_time');
            $table->text('message')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('staff_notes')->nullable();
            $table->timestamps();

            // Foreign key constraints
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('id')->on('supervisors')->onDelete('cascade');
            $table->foreign('staff_appointment_id')->references('id')->on('staff_appointments')->onDelete('cascade');

            // Indexes for better performance
            $table->index(['client_id', 'status']);
            $table->index(['supervisor_id', 'status']);
            $table->index(['preferred_date', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appointment_requests');
    }
};
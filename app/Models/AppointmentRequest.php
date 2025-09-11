<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppointmentRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'client_name',
        'client_email',
        'supervisor_id',
        'supervisor_name',
        'supervisor_email',
        'staff_appointment_id',
        'preferred_date',
        'preferred_time',
        'preferred_end_time',
        'message',
        'status',
        'approved_at',
        'rejected_at',
        'staff_notes',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'preferred_time' => 'datetime:H:i',
        'preferred_end_time' => 'datetime:H:i',
        'approved_at' => 'datetime',
        'rejected_at' => 'datetime',
    ];

    /**
     * Get the client that owns the appointment request.
     */
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    /**
     * Get the supervisor that owns the appointment request.
     */
    public function supervisor()
    {
        return $this->belongsTo(Supervisor::class);
    }

    /**
     * Get the staff appointment that this request is for.
     */
    public function staffAppointment()
    {
        return $this->belongsTo(StaffAppointment::class);
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to only include approved requests.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope a query to only include rejected requests.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }
}
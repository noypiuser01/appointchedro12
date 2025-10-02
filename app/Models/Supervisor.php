<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Supervisor extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'full_name',
        'email',
        'password',
        'department',
        'jobs',
        'role',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get the staff appointments for the supervisor.
     */
    public function staffAppointments()
    {
        return $this->hasMany(StaffAppointment::class);
    }
}

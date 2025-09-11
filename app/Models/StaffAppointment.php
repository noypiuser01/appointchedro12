<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StaffAppointment extends Model
{
    use HasFactory;

    protected $fillable = [
        'supervisor_id',
        'date',
        'time',
        'end_time',
        'full_name',
        'title',
        'notes',
    ];

    protected $casts = [
        'date' => 'date',
    ];
}



<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeder.
     */
    public function run(): void
    {
        Admin::create([
            'name' => 'AppointChed Admin',
            'email' => 'adminchedro12@gov.ph',
            'password' => Hash::make('admin123'),
            'role' => 'super_admin',
            'status' => 'active',
        ]);
    }
}
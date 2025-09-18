<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/appoint', function () {
    $technical = \App\Models\Supervisor::select('id','full_name','email','department','role','status')
        ->where('department', 'Technical')
        ->orderBy('full_name')
        ->get();
    $administrator = \App\Models\Supervisor::select('id','full_name','email','department','role','status')
        ->where('department', 'Administrator')
        ->orderBy('full_name')
        ->get();
    $clientAuthenticated = \Illuminate\Support\Facades\Auth::guard('client')->check();
    return Inertia::render('Welcome/appoint', [
        'supervisorsTechnical' => $technical,
        'supervisorsAdministrator' => $administrator,
        'clientAuthenticated' => $clientAuthenticated,
    ]);
})->name('appoint');

// Client Registration Routes
Route::get('/client/register', [App\Http\Controllers\ClientController::class, 'showRegistrationForm'])->name('client.register.form');
Route::post('/client/register', [App\Http\Controllers\ClientController::class, 'register'])->name('client.register');

// Client Login Routes
Route::get('/client/login', [App\Http\Controllers\ClientController::class, 'showLoginForm'])->name('client.login.form');
Route::post('/client/login', [App\Http\Controllers\ClientController::class, 'login'])->name('client.login');

// Client Dashboard Routes
Route::middleware(['auth:client'])->group(function () {
    Route::get('/client/dashboard', [App\Http\Controllers\ClientController::class, 'dashboard'])->name('client.dashboard');
    Route::post('/client/logout', [App\Http\Controllers\ClientController::class, 'logout'])->name('client.logout');
    Route::get('/client/appointments', [App\Http\Controllers\ClientController::class, 'appointments'])->name('client.appointments');
    Route::get('/client/appointments/list', [App\Http\Controllers\ClientController::class, 'appointmentList'])->name('client.appointments.list');
    Route::get('/client/notifications', [App\Http\Controllers\ClientController::class, 'notifications'])->name('client.notifications');
    Route::get('/client/api/notifications', function() {
        $client = Auth::guard('client')->user();
        $items = \App\Models\Notification::where('user_type', 'client')->where('user_id', $client->id)
            ->orderByDesc('created_at')->limit(50)->get();
        return response()->json($items);
    })->name('client.api.notifications');
    Route::post('/client/api/appointment-requests', [App\Http\Controllers\ClientController::class, 'createAppointmentRequest'])->name('client.api.appointment-requests.store');
    Route::get('/client/api/staff-schedule/{supervisorId}', [App\Http\Controllers\ClientController::class, 'getStaffSchedule'])->name('client.api.staff-schedule');
    Route::get('/client/api/my-appointment-requests', [App\Http\Controllers\ClientController::class, 'getMyAppointmentRequests'])->name('client.api.my-appointment-requests');
});

// Admin Login Routes
Route::get('/admin/login', [App\Http\Controllers\AdminController::class, 'showLoginForm'])->name('admin.login.form');
Route::post('/admin/login', [App\Http\Controllers\AdminController::class, 'login'])->name('admin.login');

// Admin Dashboard Routes
Route::middleware(['auth:admin'])->group(function () {
    Route::get('/admin/dashboard', [App\Http\Controllers\AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::post('/admin/logout', [App\Http\Controllers\AdminController::class, 'logout'])->name('admin.logout');
    
    // Supervisor Management Routes
    Route::get('/admin/supervisors', [App\Http\Controllers\SupervisorController::class, 'index'])->name('admin.supervisors.index');
    Route::get('/admin/manage-supervisors', [App\Http\Controllers\AdminController::class, 'manageSupervisors'])->name('admin.manage-supervisors');
    Route::post('/admin/supervisors', [App\Http\Controllers\SupervisorController::class, 'store'])->name('admin.supervisors.store');
    Route::get('/admin/supervisors/{supervisor}', [App\Http\Controllers\SupervisorController::class, 'show'])->name('admin.supervisors.show');
    Route::put('/admin/supervisors/{supervisor}', [App\Http\Controllers\SupervisorController::class, 'update'])->name('admin.supervisors.update');
    Route::delete('/admin/supervisors/{supervisor}', [App\Http\Controllers\SupervisorController::class, 'destroy'])->name('admin.supervisors.destroy');
    
    // Client Monitoring Routes
    Route::get('/admin/monitor-clients', [App\Http\Controllers\AdminController::class, 'monitorClients'])->name('admin.monitor-clients');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

// Staff (Supervisor) auth and pages
Route::get('/staff/login', [App\Http\Controllers\StaffController::class, 'showLoginForm'])->name('staff.login.form');
Route::post('/staff/login', [App\Http\Controllers\StaffController::class, 'login'])->name('staff.login');
Route::middleware(['auth:supervisor'])->group(function () {
    Route::get('/staff/dashboard', [App\Http\Controllers\StaffController::class, 'dashboard'])->name('staff.dashboard');
    Route::post('/staff/logout', [App\Http\Controllers\StaffController::class, 'logout'])->name('staff.logout');
    Route::get('/staff/appointments', function () { return Inertia::render('Staff/AppointmentLis'); })->name('staff.appointments');
    Route::get('/staff/appointment-request', function () { return Inertia::render('Staff/AppointmentRequest'); })->name('staff.appointment-request');
    Route::get('/staff/notifications', function () { return Inertia::render('Staff/StaffNotifications'); })->name('staff.notifications');
    Route::get('/staff/api/notifications', function() {
        $supervisor = Auth::guard('supervisor')->user();
        $items = \App\Models\Notification::where('user_type', 'staff')->where('user_id', $supervisor->id)
            ->orderByDesc('created_at')->limit(50)->get();
        return response()->json($items);
    })->name('staff.api.notifications');
    Route::get('/staff/schedule', function () { return Inertia::render('Staff/ScheduleSettings'); })->name('staff.schedule');
    Route::get('/staff/api/appointments', [App\Http\Controllers\StaffController::class, 'getAppointments'])->name('staff.api.appointments.index');
    Route::get('/staff/api/staff-appointments', [App\Http\Controllers\StaffController::class, 'getStaffAppointments'])->name('staff.api.staff-appointments.index');
    Route::post('/staff/api/appointments', [App\Http\Controllers\StaffController::class, 'createAppointment'])->name('staff.api.appointments.store');
    Route::put('/staff/api/appointments/{id}', [App\Http\Controllers\StaffController::class, 'updateAppointment'])->name('staff.api.appointments.update');
    Route::delete('/staff/api/appointments/{id}', [App\Http\Controllers\StaffController::class, 'deleteAppointment'])->name('staff.api.appointments.delete');
    Route::get('/staff/api/appointment-requests', [App\Http\Controllers\StaffController::class, 'getAppointmentRequests'])->name('staff.api.appointment-requests.index');
    Route::post('/staff/api/appointment-requests/{id}/approve', [App\Http\Controllers\StaffController::class, 'approveAppointmentRequest'])->name('staff.api.appointment-requests.approve');
    Route::post('/staff/api/appointment-requests/{id}/reject', [App\Http\Controllers\StaffController::class, 'rejectAppointmentRequest'])->name('staff.api.appointment-requests.reject');
    
    // Debug route to test appointment data
    Route::get('/debug/appointments', function() {
        $supervisor = Auth::guard('supervisor')->user();
        if (!$supervisor) return response()->json(['error' => 'Not authenticated']);
        
        $allRequests = App\Models\AppointmentRequest::where('supervisor_id', $supervisor->id)->get();
        $approvedRequests = App\Models\AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'approved')
            ->with('client')
            ->get();
            
        return response()->json([
            'supervisor_id' => $supervisor->id,
            'all_requests' => $allRequests->map(function($req) {
                return [
                    'id' => $req->id,
                    'client_name' => $req->client_name,
                    'preferred_date' => $req->preferred_date,
                    'status' => $req->status
                ];
            }),
            'approved_requests' => $approvedRequests->map(function($req) {
                return [
                    'id' => $req->id,
                    'client_name' => $req->client_name,
                    'client_full_name' => $req->client ? $req->client->full_name : null,
                    'client_email' => $req->client_email,
                    'preferred_date' => $req->preferred_date,
                    'status' => $req->status
                ];
            })
        ]);
    });
});

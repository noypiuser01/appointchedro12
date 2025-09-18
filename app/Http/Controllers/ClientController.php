<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\AppointmentRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use App\Models\Notification;

class ClientController extends Controller
{
    public function showRegistrationForm()
    {
        return Inertia::render('Client/Register');
    }

    public function register(Request $request)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:clients',
                'password' => ['required', 'confirmed', Password::defaults()],
            ]);

            $client = Client::create([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'status' => 'active',
            ]);

            return redirect()->route('home')->with('success', 'Registration successful! You can now login to continue.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Registration failed: ' . $e->getMessage()])->withInput();
        }
    }

    public function showLoginForm()
    {
        return Inertia::render('Client/Login');
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (Auth::guard('client')->attempt($request->only('email', 'password'), $request->boolean('remember_me'))) {
                $request->session()->regenerate();
                $client = Auth::guard('client')->user();
                return redirect()->route('client.dashboard')->with('success', 'Login successful! Welcome back.');
            }

            return back()->withErrors(['error' => 'The provided credentials do not match our records.'])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Login failed: ' . $e->getMessage()])->withInput();
        }
    }

    public function dashboard()
    {
        $client = Auth::guard('client')->user();
        
        // Calculate statistics for the current client
        $totalRequests = AppointmentRequest::where('client_id', $client->id)->count();
        $pendingRequests = AppointmentRequest::where('client_id', $client->id)
            ->where('status', 'pending')
            ->count();
        $approvedRequests = AppointmentRequest::where('client_id', $client->id)
            ->where('status', 'approved')
            ->count();
        $rejectedRequests = AppointmentRequest::where('client_id', $client->id)
            ->where('status', 'rejected')
            ->count();
        
        // Recent appointment requests (last 7 days)
        $recentRequests = AppointmentRequest::where('client_id', $client->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // All time appointment requests for trends
        $allTimeRequests = AppointmentRequest::where('client_id', $client->id)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
        
        // Monthly request trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = AppointmentRequest::where('client_id', $client->id)
                ->whereMonth('created_at', $month->month)
                ->whereYear('created_at', $month->year)
                ->count();
            $monthlyTrends[] = [
                'month' => $month->format('M Y'),
                'count' => $count
            ];
        }
    
        // Get available supervisors count
        $availableSupervisors = \App\Models\Supervisor::where('status', 'active')->count();
    
        return Inertia::render('Client/Dashboard', [
            'client' => $client,
            'stats' => [
                'totalRequests' => $totalRequests,
                'pendingRequests' => $pendingRequests,
                'approvedRequests' => $approvedRequests,
                'rejectedRequests' => $rejectedRequests,
                'availableSupervisors' => $availableSupervisors,
            ],
            'recentRequests' => $recentRequests,
            'allTimeRequests' => $allTimeRequests,
            'monthlyTrends' => $monthlyTrends,
        ]);
    }

    public function appointments()
    {
        $client = Auth::guard('client')->user();
        
        // Fetch supervisors with their appointment counts for availability indication
        $technical = \App\Models\Supervisor::select('id','full_name','email','department','role','status')
            ->where('department', 'Technical')
            ->where('status', 'active')
            ->withCount(['staffAppointments as appointments_count' => function($query) {
                $query->where('date', '>=', now()->toDateString());
            }])
            ->orderBy('full_name')
            ->get();
            
        $administrator = \App\Models\Supervisor::select('id','full_name','email','department','role','status')
            ->where('department', 'Administrator')
            ->where('status', 'active')
            ->withCount(['staffAppointments as appointments_count' => function($query) {
                $query->where('date', '>=', now()->toDateString());
            }])
            ->orderBy('full_name')
            ->get();
            
        return Inertia::render('Client/Appointment', [
            'client' => $client,
            'supervisorsTechnical' => $technical,
            'supervisorsAdministrator' => $administrator,
        ]);
    }

    public function notifications()
    {
        $client = Auth::guard('client')->user();
        return Inertia::render('Client/Notifications', [
            'client' => $client,
        ]);
    }

    public function appointmentList()
    {
        $client = Auth::guard('client')->user();
        return Inertia::render('Client/ClientAppointmentlist', [
            'client' => $client,
        ]);
    }

    public function createAppointmentRequest(Request $request)
    {
        try {
            $client = Auth::guard('client')->user();
            
            $validated = $request->validate([
                'supervisor_id' => 'required|exists:supervisors,id',
                'staff_appointment_id' => 'required|exists:staff_appointments,id',
                'message' => 'nullable|string|max:1000',
                'client_name' => 'nullable|string|max:255',
            ]);

            // Get the staff appointment details
            $staffAppointment = \App\Models\StaffAppointment::find($validated['staff_appointment_id']);
            
            // Get supervisor details
            $supervisor = \App\Models\Supervisor::find($validated['supervisor_id']);

            // Create appointment request in database
            $appointmentRequest = AppointmentRequest::create([
                'client_id' => $client->id,
                'client_name' => $validated['client_name'] ?? $client->full_name,
                'client_email' => $client->email,
                'supervisor_id' => $validated['supervisor_id'],
                'supervisor_name' => $supervisor->full_name,
                'supervisor_email' => $supervisor->email,
                'staff_appointment_id' => $validated['staff_appointment_id'],
                'preferred_date' => $staffAppointment->date,
                'preferred_time' => $staffAppointment->time,
                'preferred_end_time' => $staffAppointment->end_time,
                'message' => $validated['message'] ?? '',
                'status' => 'pending',
            ]);

            // Notify staff (supervisor)
            Notification::create([
                'user_type' => 'staff',
                'user_id' => $validated['supervisor_id'],
                'title' => 'New Appointment Request',
                'message' => $client->full_name . ' requested an appointment.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'pending',
                    'date' => $staffAppointment->date,
                    'time' => $staffAppointment->time,
                    'end_time' => $staffAppointment->end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            // Notify client confirmation
            Notification::create([
                'user_type' => 'client',
                'user_id' => $client->id,
                'title' => 'Appointment Request Submitted',
                'message' => 'Your appointment request was submitted to ' . $supervisor->full_name . '.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'pending',
                    'date' => $staffAppointment->date,
                    'time' => $staffAppointment->time,
                    'end_time' => $staffAppointment->end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment request submitted successfully',
                'appointment_request' => $appointmentRequest
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit appointment request: ' . $e->getMessage()
            ], 422);
        }
    }

    public function getStaffSchedule(Request $request, $supervisorId)
    {
        try {
            // Get available appointment slots for the specific supervisor
            // These are pre-set by the staff in their schedule
            $availableAppointments = \App\Models\StaffAppointment::where('supervisor_id', $supervisorId)
                ->where('date', '>=', now()->toDateString())
                ->orderBy('date')
                ->orderBy('time')
                ->get(['id', 'date', 'time', 'end_time', 'title', 'notes']);

            // Only return actual appointments set by the staff
            // No sample data - if staff hasn't set appointments, show empty list

            return response()->json([
                'success' => true,
                'supervisor_id' => $supervisorId,
                'schedule' => $availableAppointments,
                'total_available' => $availableAppointments->count()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch staff schedule: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMyAppointmentRequests(Request $request)
    {
        try {
            $client = Auth::guard('client')->user();
            
            // Get appointment requests for this client from database
            $appointmentRequests = AppointmentRequest::where('client_id', $client->id)
                ->orderBy('created_at', 'desc')
                ->get([
                    'id',
                    'supervisor_name',
                    'supervisor_email',
                    'preferred_date',
                    'preferred_time',
                    'preferred_end_time',
                    'message',
                    'status',
                    'created_at',
                    'approved_at',
                    'rejected_at',
                    'staff_notes'
                ]);

            return response()->json($appointmentRequests);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch appointment requests: ' . $e->getMessage()
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        Auth::guard('client')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/')->with('success', 'You have been logged out successfully.');
    }
}

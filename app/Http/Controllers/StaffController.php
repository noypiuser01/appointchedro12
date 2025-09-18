<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Notification;
use Inertia\Inertia;
use App\Models\StaffAppointment;
use App\Models\AppointmentRequest;

class StaffController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Staff/Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('supervisor')->attempt($request->only('email', 'password'))) {
            $request->session()->regenerate();
            return redirect()->route('staff.dashboard');
        }

        return back()->withErrors(['error' => 'Invalid supervisor credentials.'])->withInput();
    }

    public function dashboard()
    {
        $supervisor = Auth::guard('supervisor')->user();
        
        // Calculate statistics for the current supervisor
        $totalAppointments = StaffAppointment::where('supervisor_id', $supervisor->id)->count();
        $todayAppointments = StaffAppointment::where('supervisor_id', $supervisor->id)
            ->whereDate('date', today())
            ->count();
        
        $thisWeekAppointments = StaffAppointment::where('supervisor_id', $supervisor->id)
            ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
            ->count();
        
        $thisMonthAppointments = StaffAppointment::where('supervisor_id', $supervisor->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->count();
        
        // Appointment requests statistics
        $totalRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)->count();
        $pendingRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'pending')
            ->count();
        $approvedRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'approved')
            ->count();
        $rejectedRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'rejected')
            ->count();
        
        // Recent appointments (last 7 days)
        $recentAppointments = StaffAppointment::where('supervisor_id', $supervisor->id)
            ->where('date', '>=', now()->subDays(7))
            ->orderBy('date', 'desc')
            ->orderBy('time', 'desc')
            ->limit(5)
            ->get();
        
        // Recent appointment requests (last 7 days)
        $recentRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('created_at', '>=', now()->subDays(7))
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();
        
        // Monthly appointment trends (last 6 months)
        $monthlyTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $count = StaffAppointment::where('supervisor_id', $supervisor->id)
                ->whereMonth('date', $month->month)
                ->whereYear('date', $month->year)
                ->count();
            $monthlyTrends[] = [
                'month' => $month->format('M Y'),
                'count' => $count
            ];
        }
        
        return Inertia::render('Staff/Dashboard', [
            'supervisor' => $supervisor,
            'stats' => [
                'totalAppointments' => $totalAppointments,
                'todayAppointments' => $todayAppointments,
                'thisWeekAppointments' => $thisWeekAppointments,
                'thisMonthAppointments' => $thisMonthAppointments,
                'totalRequests' => $totalRequests,
                'pendingRequests' => $pendingRequests,
                'approvedRequests' => $approvedRequests,
                'rejectedRequests' => $rejectedRequests,
            ],
            'recentAppointments' => $recentAppointments,
            'recentRequests' => $recentRequests,
            'monthlyTrends' => $monthlyTrends,
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('supervisor')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function getAppointments(Request $request)
    {
        $supervisor = Auth::guard('supervisor')->user();
        $from = $request->query('from');
        $to = $request->query('to');

        // Only get approved appointment requests with client information
        $appointmentRequestsQuery = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'approved')
            ->with('staffAppointment');
        
        if ($from) { $appointmentRequestsQuery->whereDate('preferred_date', '>=', $from); }
        if ($to) { $appointmentRequestsQuery->whereDate('preferred_date', '<=', $to); }
        
        $appointmentRequests = $appointmentRequestsQuery->orderBy('preferred_date')->orderBy('preferred_time')->get();

        // Transform appointment requests to match expected format
        $appointments = $appointmentRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'date' => $request->preferred_date,
                'time' => $request->preferred_time,
                'end_time' => $request->preferred_end_time,
                'title' => $request->staffAppointment->title ?? 'Appointment',
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
                'message' => $request->message,
                'status' => $request->status,
                'type' => 'client'
            ];
        });

        return response()->json($appointments);
    }

    public function getStaffAppointments(Request $request)
    {
        $supervisor = Auth::guard('supervisor')->user();
        $from = $request->query('from');
        $to = $request->query('to');

        // Get staff's own created appointments (from staff_appointments table)
        $staffAppointmentsQuery = StaffAppointment::where('supervisor_id', $supervisor->id);
        
        if ($from) { $staffAppointmentsQuery->whereDate('date', '>=', $from); }
        if ($to) { $staffAppointmentsQuery->whereDate('date', '<=', $to); }
        
        $staffAppointments = $staffAppointmentsQuery->orderBy('date')->orderBy('time')->get();

        // Get approved client appointment requests with client full_name
        $clientRequestsQuery = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->where('status', 'approved')
            ->with(['client', 'staffAppointment']);
        
        if ($from) { $clientRequestsQuery->whereDate('preferred_date', '>=', $from); }
        if ($to) { $clientRequestsQuery->whereDate('preferred_date', '<=', $to); }
        
        $clientRequests = $clientRequestsQuery->orderBy('preferred_date')->orderBy('preferred_time')->get();
        
        // Debug: Log the data being fetched
        \Log::info('Staff Appointments Debug', [
            'supervisor_id' => $supervisor->id,
            'from' => $from,
            'to' => $to,
            'client_requests_count' => $clientRequests->count(),
            'client_requests' => $clientRequests->map(function($req) {
                return [
                    'id' => $req->id,
                    'client_name' => $req->client_name,
                    'client_full_name' => $req->client ? $req->client->full_name : null,
                    'preferred_date' => $req->preferred_date,
                    'status' => $req->status
                ];
            }),
            'all_appointment_requests' => AppointmentRequest::where('supervisor_id', $supervisor->id)->get(['id', 'client_name', 'preferred_date', 'status'])
        ]);

        // Transform staff appointments
        $staffAppointmentsData = $staffAppointments->map(function ($appointment) {
            return [
                'id' => $appointment->id,
                'date' => $appointment->date,
                'time' => $appointment->time,
                'end_time' => $appointment->end_time,
                'title' => $appointment->title,
                'type' => 'staff',
                'client_full_name' => null,
                'client_name' => null,
                'client_email' => null,
            ];
        });

        // Transform client appointment requests
        $clientRequestsData = $clientRequests->map(function ($request) {
            return [
                'id' => $request->id,
                'date' => $request->preferred_date,
                'time' => $request->preferred_time,
                'end_time' => $request->preferred_end_time,
                'title' => $request->staffAppointment->title ?? 'Client Appointment',
                'type' => 'client',
                'client_full_name' => $request->client ? $request->client->full_name : $request->client_name,
                'client_name' => $request->client_name,
                'client_email' => $request->client_email,
            ];
        });

        // Combine and sort all appointments
        $allAppointments = $staffAppointmentsData->concat($clientRequestsData)
            ->sortBy(['date', 'time'])
            ->values();

        // Debug: Log final response
        \Log::info('Final Staff Appointments Response', [
            'total_appointments' => $allAppointments->count(),
            'staff_appointments' => $staffAppointmentsData->count(),
            'client_requests' => $clientRequestsData->count(),
            'sample_data' => $allAppointments->take(3)->toArray()
        ]);

        return response()->json($allAppointments);
    }

    public function createAppointment(Request $request)
    {
        $supervisor = Auth::guard('supervisor')->user();
        $validated = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        // Custom validation for end_time after time
        if (strtotime($validated['end_time']) <= strtotime($validated['time'])) {
            return response()->json(['errors' => ['end_time' => ['The end time must be after the start time.']]], 422);
        }

        $appointment = StaffAppointment::create([
            'supervisor_id' => $supervisor->id,
            'date' => $validated['date'],
            'time' => $validated['time'],
            'end_time' => $validated['end_time'],
            'full_name' => $supervisor->full_name ?? ($supervisor->name ?? 'Staff'),
            'title' => $validated['title'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['success' => true, 'appointment' => $appointment]);
    }

    public function updateAppointment(Request $request, $id)
    {
        $supervisor = Auth::guard('supervisor')->user();
        $appointment = StaffAppointment::where('id', $id)
            ->where('supervisor_id', $supervisor->id)
            ->firstOrFail();

        $validated = $request->validate([
            'date' => ['required', 'date'],
            'time' => ['required', 'date_format:H:i'],
            'end_time' => ['required', 'date_format:H:i'],
            'title' => ['required', 'string', 'max:255'],
            'notes' => ['nullable', 'string'],
        ]);

        // Custom validation for end_time after time
        if (strtotime($validated['end_time']) <= strtotime($validated['time'])) {
            return response()->json(['errors' => ['end_time' => ['The end time must be after the start time.']]], 422);
        }

        $appointment->update([
            'date' => $validated['date'],
            'time' => $validated['time'],
            'end_time' => $validated['end_time'],
            'title' => $validated['title'],
            'notes' => $validated['notes'] ?? null,
        ]);

        return response()->json(['success' => true, 'appointment' => $appointment]);
    }

    public function deleteAppointment($id)
    {
        $supervisor = Auth::guard('supervisor')->user();
        $appointment = StaffAppointment::where('id', $id)
            ->where('supervisor_id', $supervisor->id)
            ->firstOrFail();

        $appointment->delete();

        return response()->json(['success' => true]);
    }

    public function getAppointmentRequests(Request $request)
    {
        $supervisor = Auth::guard('supervisor')->user();
        
        // Get appointment requests for this supervisor from database
        $appointmentRequests = AppointmentRequest::where('supervisor_id', $supervisor->id)
            ->orderBy('created_at', 'desc')
            ->get([
                'id',
                'client_name',
                'client_email',
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
    }

    public function approveAppointmentRequest($id)
    {
        $supervisor = Auth::guard('supervisor')->user();
        
        try {
            $appointmentRequest = AppointmentRequest::where('id', $id)
                ->where('supervisor_id', $supervisor->id)
                ->first();

            if (!$appointmentRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment request not found or not authorized'
                ], 404);
            }

            $appointmentRequest->update([
                'status' => 'approved',
                'approved_at' => now(),
            ]);

            // Notify client
            Notification::create([
                'user_type' => 'client',
                'user_id' => $appointmentRequest->client_id,
                'title' => 'Appointment Approved',
                'message' => 'Your appointment with ' . ($supervisor->full_name ?? 'Staff') . ' has been approved.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'approved',
                    'date' => $appointmentRequest->preferred_date,
                    'time' => $appointmentRequest->preferred_time,
                    'end_time' => $appointmentRequest->preferred_end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            // Notify staff (self) for record
            Notification::create([
                'user_type' => 'staff',
                'user_id' => $supervisor->id,
                'title' => 'You approved an appointment',
                'message' => 'Approved appointment for ' . $appointmentRequest->client_name . '.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'approved',
                    'date' => $appointmentRequest->preferred_date,
                    'time' => $appointmentRequest->preferred_time,
                    'end_time' => $appointmentRequest->preferred_end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment request approved successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve appointment request: ' . $e->getMessage()
            ], 500);
        }
    }

    public function rejectAppointmentRequest($id)
    {
        $supervisor = Auth::guard('supervisor')->user();
        
        try {
            $appointmentRequest = AppointmentRequest::where('id', $id)
                ->where('supervisor_id', $supervisor->id)
                ->first();

            if (!$appointmentRequest) {
                return response()->json([
                    'success' => false,
                    'message' => 'Appointment request not found or not authorized'
                ], 404);
            }

            $appointmentRequest->update([
                'status' => 'rejected',
                'rejected_at' => now(),
            ]);

            // Notify client
            Notification::create([
                'user_type' => 'client',
                'user_id' => $appointmentRequest->client_id,
                'title' => 'Appointment Rejected',
                'message' => 'Your appointment with ' . ($supervisor->full_name ?? 'Staff') . ' has been rejected.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'rejected',
                    'date' => $appointmentRequest->preferred_date,
                    'time' => $appointmentRequest->preferred_time,
                    'end_time' => $appointmentRequest->preferred_end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            // Notify staff (self) for record
            Notification::create([
                'user_type' => 'staff',
                'user_id' => $supervisor->id,
                'title' => 'You rejected an appointment',
                'message' => 'Rejected appointment for ' . $appointmentRequest->client_name . '.',
                'data' => [
                    'appointment_request_id' => $appointmentRequest->id,
                    'status' => 'rejected',
                    'date' => $appointmentRequest->preferred_date,
                    'time' => $appointmentRequest->preferred_time,
                    'end_time' => $appointmentRequest->preferred_end_time,
                ],
                'appointment_request_id' => $appointmentRequest->id,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Appointment request rejected successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject appointment request: ' . $e->getMessage()
            ], 500);
        }
    }
}



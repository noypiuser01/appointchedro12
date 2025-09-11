<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        return Inertia::render('Staff/Dashboard', [
            'supervisor' => $supervisor,
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
        $query = StaffAppointment::where('supervisor_id', $supervisor->id);
        
        if ($from) { $query->whereDate('date', '>=', $from); }
        if ($to) { $query->whereDate('date', '<=', $to); }
        
        $appointments = $query->orderBy('date')->orderBy('time')->get();

        return response()->json($appointments);
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



<?php

namespace App\Http\Controllers;

use App\Models\Supervisor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class SupervisorController extends Controller
{
    /**
     * Display a listing of supervisors
     */
    public function index()
    {
        $supervisors = Supervisor::select('id', 'full_name', 'email', 'department', 'role', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return response()->json($supervisors);
    }

    /**
     * Store a newly created supervisor
     */
    public function store(Request $request)
    {
        $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:supervisors',
            // Relaxed password rule to allow simpler passwords (min 6 chars)
            'password' => ['required', 'string', 'min:6'],
            'department' => 'required|string|max:255',
            'role' => 'required|in:admin,users',
            'status' => 'required|in:active,inactive',
        ]);

        Supervisor::create([
            'full_name' => $request->full_name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'department' => $request->department,
            'role' => $request->role,
            'status' => $request->status,
        ]);

        return redirect()->route('admin.manage-supervisors')->with('success', 'Supervisor created successfully!');
    }

    /**
     * Display the specified supervisor
     */
    public function show(Supervisor $supervisor)
    {
        return response()->json($supervisor);
    }

    /**
     * Update the specified supervisor
     */
    public function update(Request $request, Supervisor $supervisor)
    {
        try {
            $request->validate([
                'full_name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:supervisors,email,' . $supervisor->id,
                'department' => 'required|string|max:255',
                'role' => 'required|in:admin,users',
                'status' => 'required|in:active,inactive',
            ]);

            $supervisor->update([
                'full_name' => $request->full_name,
                'email' => $request->email,
                'department' => $request->department,
                'role' => $request->role,
                'status' => $request->status,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Supervisor updated successfully!',
                'supervisor' => $supervisor
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update supervisor: ' . $e->getMessage()
            ], 400);
        }
    }

    /**
     * Remove the specified supervisor
     */
    public function destroy(Supervisor $supervisor)
    {
        try {
            $supervisor->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Supervisor deleted successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete supervisor: ' . $e->getMessage()
            ], 400);
        }
    }
}
<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function showLoginForm()
    {
        return Inertia::render('Admin/Login');
    }

    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (Auth::guard('admin')->attempt($request->only('email', 'password'), $request->boolean('remember_me'))) {
                $request->session()->regenerate();
                $admin = Auth::guard('admin')->user();
                return redirect()->route('admin.dashboard')->with('success', 'Login successful! Welcome back.');
            }

            return back()->withErrors(['error' => 'The provided credentials do not match our records.'])->withInput();
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Login failed: ' . $e->getMessage()])->withInput();
        }
    }

    public function dashboard()
    {
        $admin = Auth::guard('admin')->user();
        
        // Fetch clients data for monitoring
        $clients = \App\Models\Client::select('id', 'full_name', 'email', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Fetch supervisors data
        $supervisors = \App\Models\Supervisor::select('id', 'full_name', 'email', 'department', 'role', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Calculate statistics
        $totalClients = $clients->count();
        $activeClients = $clients->where('status', 'active')->count();
        $newRegistrations = $clients->where('created_at', '>=', now()->subDays(7))->count();
        $activeSupervisors = $supervisors->where('status', 'active')->count();
        
        return Inertia::render('Admin/Dashboard', [
            'admin' => $admin,
            'clients' => $clients,
            'supervisors' => $supervisors,
            'stats' => [
                'totalClients' => $totalClients,
                'activeClients' => $activeClients,
                'newRegistrations' => $newRegistrations,
                'activeSupervisors' => $activeSupervisors,
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function manageSupervisors()
    {
        $admin = Auth::guard('admin')->user();
        
        // Fetch supervisors data
        $supervisors = \App\Models\Supervisor::select('id', 'full_name', 'email', 'department', 'role', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/ManageSupervisor', [
            'admin' => $admin,
            'supervisors' => $supervisors,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function monitorClients()
    {
        $admin = Auth::guard('admin')->user();
        $clients = \App\Models\Client::select('id', 'full_name', 'email', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('Admin/MonitorClients', [
            'admin' => $admin,
            'clients' => $clients,
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ]
        ]);
    }

    public function logout(Request $request)
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/')->with('success', 'You have been logged out successfully.');
    }
}
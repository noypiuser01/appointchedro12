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
        $supervisors = \App\Models\Supervisor::select('id', 'full_name', 'email', 'department', 'jobs', 'role', 'status', 'created_at', 'updated_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Client Statistics
        $totalClients = $clients->count();
        $activeClients = $clients->where('status', 'active')->count();
        $inactiveClients = $clients->where('status', 'inactive')->count();
        $newClientRegistrations = $clients->where('created_at', '>=', now()->subDays(7))->count();
        $thisMonthClientRegistrations = $clients->where('created_at', '>=', now()->startOfMonth())->count();
        
        // Staff Statistics
        $totalSupervisors = $supervisors->count();
        $activeSupervisors = $supervisors->where('status', 'active')->count();
        $inactiveSupervisors = $supervisors->where('status', 'inactive')->count();
        $technicalSupervisors = $supervisors->where('department', 'Technical')->count();
        $administratorSupervisors = $supervisors->where('department', 'Administrator')->count();
        $newStaffRegistrations = $supervisors->where('created_at', '>=', now()->subDays(7))->count();
        $thisMonthStaffRegistrations = $supervisors->where('created_at', '>=', now()->startOfMonth())->count();
        
        // Recent activity for audit
        $recentClients = $clients->take(10);
        $recentSupervisors = $supervisors->take(10);
        
        // Monthly trends for user registrations
        $monthlyClientTrends = [];
        $monthlyStaffTrends = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            
            $clientCount = $clients->where('created_at', '>=', $month->startOfMonth())
                ->where('created_at', '<=', $month->endOfMonth())
                ->count();
            $monthlyClientTrends[] = [
                'month' => $month->format('M Y'),
                'count' => $clientCount
            ];
            
            $staffCount = $supervisors->where('created_at', '>=', $month->startOfMonth())
                ->where('created_at', '<=', $month->endOfMonth())
                ->count();
            $monthlyStaffTrends[] = [
                'month' => $month->format('M Y'),
                'count' => $staffCount
            ];
        }
        
        return Inertia::render('Admin/Dashboard', [
            'admin' => $admin,
            'clients' => $clients,
            'supervisors' => $supervisors,
            'stats' => [
                // Client Statistics
                'totalClients' => $totalClients,
                'activeClients' => $activeClients,
                'inactiveClients' => $inactiveClients,
                'newClientRegistrations' => $newClientRegistrations,
                'thisMonthClientRegistrations' => $thisMonthClientRegistrations,
                
                // Staff Statistics
                'totalSupervisors' => $totalSupervisors,
                'activeSupervisors' => $activeSupervisors,
                'inactiveSupervisors' => $inactiveSupervisors,
                'technicalSupervisors' => $technicalSupervisors,
                'administratorSupervisors' => $administratorSupervisors,
                'newStaffRegistrations' => $newStaffRegistrations,
                'thisMonthStaffRegistrations' => $thisMonthStaffRegistrations,
            ],
            'recentClients' => $recentClients,
            'recentSupervisors' => $recentSupervisors,
            'monthlyClientTrends' => $monthlyClientTrends,
            'monthlyStaffTrends' => $monthlyStaffTrends,
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
        $supervisors = \App\Models\Supervisor::select('id', 'full_name', 'email', 'department', 'jobs', 'role', 'status', 'created_at', 'updated_at')
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
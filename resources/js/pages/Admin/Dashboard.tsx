import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Admin {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Client {
    id: number;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}


interface Stats {
    // Client Statistics
    totalClients: number;
    activeClients: number;
    inactiveClients: number;
    newClientRegistrations: number;
    thisMonthClientRegistrations: number;
    
    // Staff Statistics
    totalSupervisors: number;
    activeSupervisors: number;
    inactiveSupervisors: number;
    technicalSupervisors: number;
    administratorSupervisors: number;
    newStaffRegistrations: number;
    thisMonthStaffRegistrations: number;
}

interface RecentClient {
    id: number;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface RecentSupervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface RecentAppointment {
    id: number;
    date: string;
    time: string;
    end_time?: string;
    title: string;
    notes?: string;
    supervisor?: {
        full_name: string;
        department: string;
    };
    created_at: string;
}

interface RecentRequest {
    id: number;
    client_name: string;
    client_email: string;
    supervisor_name: string;
    supervisor_email: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    created_at: string;
    client?: {
        full_name: string;
        email: string;
    };
    supervisor?: {
        full_name: string;
        department: string;
    };
}

interface MonthlyTrend {
    month: string;
    count: number;
}

interface AdminDashboardProps {
    admin: Admin;
    clients: Client[];
    supervisors: any[];
    stats: Stats;
    recentClients?: RecentClient[];
    recentSupervisors?: RecentSupervisor[];
    monthlyClientTrends?: MonthlyTrend[];
    monthlyStaffTrends?: MonthlyTrend[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AdminDashboard({ admin, clients, supervisors, stats, recentClients, recentSupervisors, monthlyClientTrends, monthlyStaffTrends, flash }: AdminDashboardProps) {
    const [activeSection, setActiveSection] = useState('overview');
    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        post('/admin/logout');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };


    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: '📊' },
        { id: 'supervisors', name: 'Manage Staff', icon: '👨‍💼', href: '/admin/manage-supervisors' },
        { id: 'clients', name: 'Monitor Clients', icon: '👥', href: '/admin/monitor-clients' },
    ];

    return (
        <>
            <Head title="Admin Dashboard - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="AppointChed - Commission on Higher Education Region XII Admin Dashboard" />
            </Head>
            
            {/* Header */}
            <header className="shadow-sm bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="w-full">
                    <div className="flex justify-between items-center h-12 pl-4 pr-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 text-white">
                                <img 
                                    src="/images/logo.png" 
                                    alt="AppointChed Logo" 
                                    className="h-8 w-auto"
                                />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-blue-100">AppointChed Admin</div>
                                </div>
                            </Link>
                        </div>
                        
                        {/* Admin Info & Logout Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{admin.name}</span>
                                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <Link
                                        href="/admin/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                            </svg>
                                            <span>Dashboard</span>
                                        </div>
                                    </Link>
                                    <div className="px-4 py-1 text-xs text-gray-500">{admin.role.replace('_', ' ').toUpperCase()}</div>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-white shadow-lg min-h-screen">
                        <div className="p-6">
                            {/* Welcome Section */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                                        <p className="text-sm text-gray-600">{admin.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="space-y-2">
                                {sidebarItems.map((item) => (
                                    item.href ? (
                                        <Link
                                            key={item.id}
                                            href={item.href}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.id}
                                            onClick={() => setActiveSection(item.id)}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                                activeSection === item.id
                                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.name}</span>
                                        </button>
                                    )
                                ))}
                            </nav>

                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Success Message */}
                        {flash?.success && (
                            <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{flash.success}</span>
                            </div>
                        )}
                        
                        {/* Error Message */}
                        {flash?.error && (
                            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{flash.error}</span>
                            </div>
                        )}
                        
                        {activeSection === 'overview' && (
                            <div className="space-y-6">
                                {/* Client Management Statistics */}
                                    <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Client Management</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Total Clients */}
                                        <div className="bg-blue-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Total Clients</p>
                                                <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
                                                </div>
                                        </div>
                                    </div>

                                        {/* Active Clients */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Active</p>
                                                <p className="text-2xl font-semibold text-gray-900">{stats.activeClients}</p>
                                            </div>
                                        </div>
                                    </div>

                                        {/* Inactive Clients */}
                                        <div className="bg-red-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Inactive</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.inactiveClients}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* New This Week */}
                                        <div className="bg-yellow-50 rounded-lg p-4">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">New This Week</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.newClientRegistrations}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Staff Management Statistics */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-6">Staff Management</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        {/* Total Staff */}
                                        <div className="bg-purple-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Total Staff</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.totalSupervisors}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Active Staff */}
                                        <div className="bg-green-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Active</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.activeSupervisors}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Technical Staff */}
                                        <div className="bg-indigo-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Technical</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.technicalSupervisors}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Administrator Staff */}
                                        <div className="bg-orange-50 rounded-lg p-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Administrator</p>
                                                    <p className="text-2xl font-semibold text-gray-900">{stats.administratorSupervisors}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* User Audit Trail */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Recent Client Activity */}
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Client Activity</h3>
                                        {recentClients && recentClients.length > 0 ? (
                                            <div className="space-y-3">
                                                {recentClients.map((client) => (
                                                    <div key={client.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                                                            <p className="text-xs text-gray-500">{client.email}</p>
                                                            <p className="text-xs text-gray-400">Registered: {formatDate(client.created_at)}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                client.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {client.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 text-4xl mb-2">👥</div>
                                                <p className="text-gray-500">No recent client activity</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Recent Staff Activity */}
                                    <div className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Staff Activity</h3>
                                        {recentSupervisors && recentSupervisors.length > 0 ? (
                                            <div className="space-y-3">
                                                {recentSupervisors.map((supervisor) => (
                                                    <div key={supervisor.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{supervisor.full_name}</p>
                                                            <p className="text-xs text-gray-500">{supervisor.email}</p>
                                                            <p className="text-xs text-gray-400">{supervisor.department} • {supervisor.role}</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                                supervisor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {supervisor.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400 text-4xl mb-2">👨‍💼</div>
                                                <p className="text-gray-500">No recent staff activity</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Link href="/admin/manage-supervisors" className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Manage Staff
                                        </Link>
                                        <Link href="/admin/monitor-clients" className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Monitor Clients
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'clients' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h1 className="text-2xl font-bold text-gray-900">Monitor Registered Clients</h1>
                                        <div className="flex space-x-2">
                                            <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                                                Export Data
                                            </button>
                                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                                                Refresh
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {/* Client Monitoring Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {clients.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No registered clients</h3>
                                                            <p className="mt-1 text-sm text-gray-500">No clients have registered yet.</p>
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    clients.map((client) => (
                                                        <tr key={client.id} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="flex items-center">
                                                                    <div className="h-10 w-10 flex-shrink-0">
                                                                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                                                            <span className="text-sm font-medium text-blue-600">
                                                                                {client.full_name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="ml-4">
                                                                        <div className="text-sm font-medium text-gray-900">{client.full_name}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">{client.email}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">{formatDate(client.created_at)}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                    client.status === 'active' 
                                                                        ? 'bg-green-100 text-green-800' 
                                                                        : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                    {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm text-gray-900">{formatDate(client.updated_at)}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                                <div className="flex space-x-2">
                                                                    <button className="text-blue-600 hover:text-blue-900">
                                                                        View
                                                                    </button>
                                                                    <button className="text-green-600 hover:text-green-900">
                                                                        Edit
                                                                    </button>
                                                                    <button className="text-red-600 hover:text-red-900">
                                                                        Deactivate
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </>
    );
}

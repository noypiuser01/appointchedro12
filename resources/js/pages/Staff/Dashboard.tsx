import { Head, Link } from '@inertiajs/react';
import AdminHeader from '../../components/Admin/Header';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import StaffSidebar from '../../components/Staff/StaffSidebar';

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
}

interface StaffDashboardProps {
    supervisor?: Supervisor;
}

export default function StaffDashboard(_props: StaffDashboardProps) {
    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleLogout = () => {
        post('/staff/logout');
    };
    return (
        <>
            <Head title="Staff Dashboard - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Dashboard - Commission on Higher Education Region XII" />
            </Head>

            {/* Top Header with Account Dropdown (similar to Client) */}
            <header className="shadow-sm border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="w-full">
                    <div className="flex justify-between items-center h-12 px-4">
                        {/* Brand */}
                        <div className="flex items-center">
                            <Link href="/staff/dashboard" className="flex items-center space-x-3 text-white">
                                <img src="/images/logo.png" alt="AppointChed Logo" className="h-8 w-auto" />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-indigo-100">AppointChed - Staff Portal</div>
                                </div>
                            </Link>
                        </div>

                        {/* Account Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 text-white hover:text-indigo-200 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Account</span>
                                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <Link
                                        href="/staff/dashboard"
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
                                    <Link
                                        href="/staff/appointments"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>Appointments</span>
                                        </div>
                                    </Link>
                                    <Link
                                        href="/staff/schedule"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                                            </svg>
                                            <span>Schedule</span>
                                        </div>
                                    </Link>
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
                    <StaffSidebar active="dashboard" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link href="/" className="text-gray-400 hover:text-gray-500">
                                        <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        <span className="sr-only">Home</span>
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-4 text-sm font-medium text-gray-500">Staff Dashboard</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Staff Dashboard</h1>
                            <p className="text-gray-600 mb-6">This page follows the same header/layout style as Admin.</p>

                            {(_props.supervisor) && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="border rounded-lg p-4">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Profile</h2>
                                        <div className="flex items-center space-x-4">
                                            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-700 font-semibold">
                                                    {_props.supervisor.full_name?.charAt(0)?.toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-900 font-medium">{_props.supervisor.full_name}</div>
                                                <div className="text-sm text-gray-600">{_props.supervisor.email}</div>
                                            </div>
                                        </div>
                                        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                            <div className="p-3 bg-gray-50 rounded">
                                                <div className="text-gray-500">Department</div>
                                                <div className="text-gray-900 font-medium">{_props.supervisor.department}</div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded">
                                                <div className="text-gray-500">Role</div>
                                                <div className="text-gray-900 font-medium capitalize">{_props.supervisor.role}</div>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded">
                                                <div className="text-gray-500">Status</div>
                                                <div className={`inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-full ${_props.supervisor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {_props.supervisor.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border rounded-lg p-4">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Link href="/staff/appointments" className="block p-4 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Appointments</Link>
                                            <Link href="/staff/schedule" className="block p-4 rounded bg-indigo-50 text-indigo-700 hover:bg-indigo-100">Schedule</Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}



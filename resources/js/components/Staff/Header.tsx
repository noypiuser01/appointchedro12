import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface StaffHeaderProps {
    title?: string;
}

export default function StaffHeader({ title = "Staff Portal" }: StaffHeaderProps) {
    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = () => post('/staff/logout');
    return (
        <>
            <Head title={`${title} - AppointChed | CHED Region XII`}>
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Portal - AppointChed Appointment System for Commission on Higher Education Region XII" />
            </Head>
            <header className="sticky top-0 z-50 shadow-sm border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
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
                                    <Link
                                        href="/staff/notifications"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                            </svg>
                                            <span>Notifications</span>
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
        </>
    );
}

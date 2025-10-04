import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

interface StaffInfo {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    jobs?: string;
    created_at: string;
    updated_at: string;
}

interface StaffInformationProps {
    staff?: StaffInfo;
}

export default function StaffInformation({ staff }: StaffInformationProps) {
    const [staffInfo, setStaffInfo] = useState<StaffInfo | null>(staff || null);
    const [availabilityStatus, setAvailabilityStatus] = useState<'active' | 'inactive'>('active');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<string | null>(null);

    // Fetch staff information on component mount
    useEffect(() => {
        // If staff data is already passed from the route, use it
        if (staff) {
            setStaffInfo(staff);
            setAvailabilityStatus((staff.status === 'active' || staff.status === 'inactive') ? staff.status : 'active');
        } else {
            // Otherwise fetch from API
            fetchStaffInfo();
        }
    }, [staff]);

    // Periodic refresh to ensure availability status accuracy
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                fetchStaffInfo();
            }
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [loading]);

    const fetchStaffInfo = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/staff/api/information', { 
                credentials: 'same-origin' 
            });
            if (!res.ok) throw new Error('Failed to load staff information');
            const data = await res.json();
            setStaffInfo(data);
            setAvailabilityStatus((data.status === 'active' || data.status === 'inactive') ? data.status : 'active');
            setLastUpdated(new Date().toLocaleString());
        } catch (e: any) {
            setError(e.message || 'Failed to load staff information');
        } finally {
            setLoading(false);
        }
    };

    const handleAvailabilityToggle = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            const newStatus = availabilityStatus === 'active' ? 'inactive' : 'active';
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const getCookie = (name: string) => {
                const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                return v ? decodeURIComponent(v.pop() as string) : '';
            };
            const xsrfToken = getCookie('XSRF-TOKEN');
            
            const res = await fetch('/staff/api/availability', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify({ status: newStatus }),
            });
            
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update availability status');
            }
            
            const responseData = await res.json();
            
            // Use the status from the server response for accuracy
            const serverStatus = responseData.status || newStatus;
            setAvailabilityStatus(serverStatus);
            setSuccess(`Availability status updated to ${serverStatus === 'active' ? 'Available' : 'Unavailable'}`);
            setLastUpdated(new Date().toLocaleString());
            
            // Update staff info with server response
            if (staffInfo) {
                setStaffInfo({ ...staffInfo, status: serverStatus });
            }
            
            // Refresh staff information to ensure accuracy
            setTimeout(() => {
                fetchStaffInfo();
            }, 1000);
            
        } catch (e: any) {
            setError(e.message || 'Failed to update availability status');
            // Revert status on error
            if (staffInfo) {
                setAvailabilityStatus(staffInfo.status === 'active' || staffInfo.status === 'inactive' ? staffInfo.status : 'active');
            }
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <Head title="Staff Information - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Information - Commission on Higher Education Region XII" />
            </Head>

            <StaffHeader title="Staff Information" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <StaffSidebar active="information" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-4">
                                    <li>
                                        <Link href="/staff/dashboard" className="text-gray-400 hover:text-gray-500">
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
                                            <span className="ml-4 text-sm font-medium text-gray-500">Staff Information</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold text-gray-900">Staff Information</h1>
                            <p className="text-gray-600 mt-1">View and manage your staff details and availability status</p>
                            {staffInfo && (
                                <div className="mt-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                                    <strong>Currently logged in as:</strong> {staffInfo.full_name} ({staffInfo.email})
                                </div>
                            )}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-red-700 text-sm font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span className="text-green-700 text-sm font-medium">{success}</span>
                                </div>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Staff Details Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Staff Details</h3>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>

                                {loading && !staffInfo ? (
                                    <div className="text-center py-8">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
                                        <p className="mt-4 text-gray-600">Loading staff information...</p>
                                    </div>
                                ) : staffInfo ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-center mb-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                    <span className="text-white text-2xl font-bold">
                                                        {staffInfo.full_name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="absolute -bottom-1 -right-1">
                                                    <div className={`w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${
                                                        availabilityStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                                                    }`}>
                                                        <div className={`w-2 h-2 rounded-full ${
                                                            availabilityStatus === 'active' ? 'bg-white' : 'bg-white'
                                                        }`}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Full Name</p>
                                                    <p className="text-lg font-semibold text-gray-900">{staffInfo.full_name}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Email Address</p>
                                                    <p className="text-lg font-semibold text-gray-900">{staffInfo.email}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Department</p>
                                                    <p className="text-lg font-semibold text-gray-900">{staffInfo.department}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                </svg>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Role</p>
                                                    <p className="text-lg font-semibold text-gray-900">{staffInfo.role}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                </svg>
                                            </div>

                                            {staffInfo.jobs && staffInfo.jobs.trim() !== '' && (
                                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-600">Job Responsibilities</p>
                                                        <p className="text-lg font-semibold text-gray-900">{staffInfo.jobs}</p>
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-600">Member Since</p>
                                                    <p className="text-lg font-semibold text-gray-900">{formatDate(staffInfo.created_at)}</p>
                                                </div>
                                                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="text-gray-300 text-5xl mb-4">👤</div>
                                        <p className="text-gray-500">No staff information available</p>
                                    </div>
                                )}
                            </div>

                            {/* Availability Status Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Availability Status</h3>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Current Status Display */}
                                    <div className="text-center">
                                        <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-semibold ${
                                            availabilityStatus === 'active' 
                                                ? 'bg-green-100 text-green-800 border-2 border-green-200' 
                                                : 'bg-red-100 text-red-800 border-2 border-red-200'
                                        }`}>
                                            <div className={`w-3 h-3 rounded-full mr-3 ${
                                                availabilityStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                            {availabilityStatus === 'active' ? 'Available' : 'Unavailable'}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            {availabilityStatus === 'active' 
                                                ? 'You are currently available for appointments' 
                                                : 'You are currently unavailable for appointments'
                                            }
                                        </p>
                                        {lastUpdated && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                Last updated: {lastUpdated}
                                            </p>
                                        )}
                                    </div>

                                    {/* Toggle Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={handleAvailabilityToggle}
                                            disabled={loading}
                                            className={`px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                                                availabilityStatus === 'active'
                                                    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                                    : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                            } disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2`}
                                        >
                                            {loading ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                    Updating...
                                                </div>
                                            ) : availabilityStatus === 'active' ? (
                                                'Set as Unavailable'
                                            ) : (
                                                'Set as Available'
                                            )}
                                        </button>
                                    </div>

                                    {/* Information Box */}
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="text-sm text-blue-800">
                                                <p className="font-medium mb-1">Availability Status Information:</p>
                                                <ul className="space-y-1 text-xs">
                                                    <li>• <strong>Available:</strong> Clients can book appointments with you</li>
                                                    <li>• <strong>Unavailable:</strong> No new appointments can be scheduled</li>
                                                    <li>• Existing appointments remain unaffected</li>
                                                    <li>• Status changes are reflected immediately</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Business Hours Info */}
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-start">
                                            <svg className="w-5 h-5 text-gray-600 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <div className="text-sm text-gray-700">
                                                <p className="font-medium mb-1">Business Hours:</p>
                                                <p className="text-xs">Monday - Friday: 8:00 AM - 5:00 PM</p>
                                                <p className="text-xs text-gray-500 mt-1">Your availability status works within these business hours.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

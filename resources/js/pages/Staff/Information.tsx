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

    useEffect(() => {
        if (staff) {
            setStaffInfo(staff);
            setAvailabilityStatus((staff.status === 'active' || staff.status === 'inactive') ? staff.status : 'active');
        } else {
            fetchStaffInfo();
        }
    }, [staff]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading) {
                fetchStaffInfo();
            }
        }, 30000);

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
            const serverStatus = responseData.status || newStatus;
            setAvailabilityStatus(serverStatus);
            setSuccess(`Status updated to ${serverStatus === 'active' ? 'Available' : 'Unavailable'}`);
            setLastUpdated(new Date().toLocaleString());
            
            if (staffInfo) {
                setStaffInfo({ ...staffInfo, status: serverStatus });
            }
            
            setTimeout(() => {
                fetchStaffInfo();
            }, 1000);
            
        } catch (e: any) {
            setError(e.message || 'Failed to update availability status');
            if (staffInfo) {
                setAvailabilityStatus(staffInfo.status === 'active' || staffInfo.status === 'inactive' ? staffInfo.status : 'active');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Head title="Staff Information - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Information - Commission on Higher Education Region XII" />
            </Head>

            <StaffHeader title="Staff Information" />

            <div className="min-h-screen bg-white">
                <div className="flex">
                    <StaffSidebar active="information" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        {/* Breadcrumb */}
                        <div className="mb-8">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-2 text-sm">
                                    <li>
                                        <Link href="/staff/dashboard" className="text-gray-400 hover:text-gray-900">
                                            Home
                                        </Link>
                                    </li>
                                    <li className="text-gray-300">/</li>
                                    <li className="text-gray-900">Staff Information</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Messages */}
                        {error && (
                            <div className="mb-6 px-4 py-3 bg-red-50 text-red-900 text-sm border-l-4 border-red-500">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="mb-6 px-4 py-3 bg-green-50 text-green-900 text-sm border-l-4 border-green-500">
                                {success}
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="max-w-3xl mx-auto">
                            <div className="border border-gray-200 bg-white">
                                {loading && !staffInfo ? (
                                    <div className="text-center py-16">
                                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-gray-900 border-t-transparent"></div>
                                    </div>
                                ) : staffInfo ? (
                                    <div className="p-12 space-y-12">
                                        {/* Profile Section */}
                                        <div className="text-center space-y-4">
                                            <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mx-auto text-3xl font-light">
                                                        {staffInfo.full_name.charAt(0).toUpperCase()}
                                        </div>
                                                <div>
                                                <h1 className="text-3xl font-light text-gray-900 mb-1">{staffInfo.full_name}</h1>
                                                <p className="text-gray-500">{staffInfo.email}</p>
                                    </div>
                                </div>

                                        {/* Availability Toggle */}
                                        <div className="text-center space-y-4">
                                            <div className="inline-flex items-center space-x-2 text-sm">
                                                <div className={`w-2 h-2 rounded-full ${
                                                availabilityStatus === 'active' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></div>
                                                <span className="text-gray-900">
                                            {availabilityStatus === 'active' ? 'Available' : 'Unavailable'}
                                                </span>
                                    </div>

                                            <div>
                                        <button
                                            onClick={handleAvailabilityToggle}
                                            disabled={loading}
                                                    className="px-8 py-2 border border-gray-900 text-gray-900 text-sm hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {loading ? 'Updating...' : availabilityStatus === 'active' ? 'Set Unavailable' : 'Set Available'}
                                        </button>
                                            </div>
                                    </div>

                                        {/* Details Grid */}
                                        <div className="border-t border-gray-200 pt-8">
                                            <div className="grid grid-cols-2 gap-8">
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Department</div>
                                                    <div className="text-gray-900">{staffInfo.department}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Role</div>
                                                    <div className="text-gray-900">{staffInfo.role}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Status</div>
                                                    <div className="text-gray-900 capitalize">{staffInfo.status}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-500 mb-1">Member Since</div>
                                                    <div className="text-gray-900">{new Date(staffInfo.created_at).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                    </div>

                                        {/* Job Responsibilities */}
                                        {staffInfo.jobs && staffInfo.jobs.trim() !== '' && (
                                            <div className="border-t border-gray-200 pt-8">
                                                <div className="text-xs text-gray-500 mb-3">Job Responsibilities</div>
                                                <p className="text-gray-900 leading-relaxed">{staffInfo.jobs}</p>
                                            </div>
                                        )}
                                        </div>
                                ) : (
                                    <div className="text-center py-16 text-gray-500">
                                        No staff information available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

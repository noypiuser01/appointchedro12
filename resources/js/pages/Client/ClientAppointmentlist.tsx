import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ClientHeader from '@/components/Client/Header';
import ClientSidebar from '@/components/Client/Sidebar';
import ClientFooter from '@/components/Client/Footer';

interface Client {
    id: number;
    full_name: string;
    email: string;
}

interface AppointmentRequest {
    id: number;
    supervisor_name: string;
    supervisor_email: string;
    preferred_date: string;
    preferred_time: string;
    preferred_end_time: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    approved_at?: string;
    rejected_at?: string;
    staff_notes?: string;
}

interface Props {
    client: Client;
}

export default function ClientAppointmentlist({ client }: Props) {
    const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAppointmentRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/client/api/my-appointment-requests', { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load appointment requests');
            const data = await res.json();
            setAppointmentRequests(data);
        } catch (e: any) {
            setError(e.message || 'Failed to load appointment requests');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointmentRequests();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'approved':
                return '✅';
            case 'rejected':
                return '❌';
            default:
                return '❓';
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <>
            <Head title="My Appointment Requests">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="My Appointment Requests - AppointChed" />
            </Head>
            <ClientHeader title="My Appointment Requests" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <ClientSidebar
                        client={client}
                        active={'appointmentList' as any}
                        onSelect={() => {}}
                    />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-4">
                                    <li>
                                        <a href="/client/dashboard" className="text-gray-400 hover:text-gray-500">
                                            <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                            <span className="sr-only">Dashboard</span>
                                        </a>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="ml-4 text-sm font-medium text-gray-500">My Appointment Requests</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">My Appointment Requests</h1>
                                <button
                                    onClick={fetchAppointmentRequests}
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md"
                                >
                                    Refresh
                                </button>
                            </div>

                            {loading && (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    <p className="mt-2 text-sm text-gray-600">Loading your appointment requests...</p>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
                                    <div className="flex items-start space-x-3">
                                        <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                </div>
                            )}

                            {!loading && appointmentRequests.length === 0 && (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">📅</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment requests</h3>
                                    <p className="text-gray-600">You haven't made any appointment requests yet.</p>
                                    <a 
                                        href="/client/appointments" 
                                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                                    >
                                        Book an Appointment
                                    </a>
                                </div>
                            )}

                            {!loading && appointmentRequests.length > 0 && (
                                <div className="space-y-4">
                                    {appointmentRequests.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-3">
                                                        <h3 className="text-lg font-semibold text-gray-900">
                                                            Appointment with {request.supervisor_name}
                                                        </h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                            <span className="mr-1">{getStatusIcon(request.status)}</span>
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <p><span className="font-medium">Date:</span> {formatDate(request.preferred_date)}</p>
                                                            <p><span className="font-medium">Time:</span> {formatTime(request.preferred_time)} - {formatTime(request.preferred_end_time)}</p>
                                                        </div>
                                                        <div>
                                                            <p><span className="font-medium">Staff:</span> {request.supervisor_name}</p>
                                                            <p><span className="font-medium">Email:</span> {request.supervisor_email}</p>
                                                        </div>
                                                    </div>

                                                    {request.message && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                                                <span className="font-medium">Your Message:</span> {request.message}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {request.staff_notes && (
                                                        <div className="mt-3">
                                                            <p className="text-sm text-gray-700 bg-emerald-50 p-3 rounded">
                                                                <span className="font-medium">Staff Notes:</span> {request.staff_notes}
                                                            </p>
                                                        </div>
                                                    )}

                                                    <div className="mt-3 text-xs text-gray-500">
                                                        <p>Requested: {new Date(request.created_at).toLocaleString()}</p>
                                                        {request.approved_at && (
                                                            <p>Approved: {new Date(request.approved_at).toLocaleString()}</p>
                                                        )}
                                                        {request.rejected_at && (
                                                            <p>Rejected: {new Date(request.rejected_at).toLocaleString()}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <ClientFooter />
        </>
    );
}



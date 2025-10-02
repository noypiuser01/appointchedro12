import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import ClientHeader from '@/components/Client/Header';
import ClientSidebar from '@/components/Client/Sidebar';

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
    const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

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

    const handleViewRequest = (request: AppointmentRequest) => {
        setSelectedRequest(request);
        setShowModal(true);
    };

    const getStatusBadge = (status: string) => {
        const baseClasses = "inline-flex items-center px-2 py-1 text-xs font-medium rounded-full";
        switch (status) {
            case 'pending':
                return `${baseClasses} bg-yellow-50 text-yellow-600 border border-yellow-200`;
            case 'approved':
                return `${baseClasses} bg-green-50 text-green-600 border border-green-200`;
            case 'rejected':
                return `${baseClasses} bg-red-50 text-red-600 border border-red-200`;
            default:
                return `${baseClasses} bg-gray-50 text-gray-600 border border-gray-200`;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (timeString: string) => {
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    // Sort requests: pending first, then approved, then rejected
    const sortedRequests = [...appointmentRequests].sort((a, b) => {
        const statusOrder = { 'pending': 0, 'approved': 1, 'rejected': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
    });
    
    const paginatedRequests = sortedRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedRequests.length / pageSize);

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

                    <div className="flex-1 px-6 py-8">
                        {/* Breadcrumb */}
                        <div className="mb-8">
                            <nav className="flex items-center space-x-2 text-sm text-gray-500">
                                <a href="/client/dashboard" className="hover:text-gray-700">Dashboard</a>
                                <span>/</span>
                                <span className="text-gray-900 font-medium">My Appointment Requests</span>
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">My Appointment Requests</h1>
                                <p className="text-gray-600 mt-1">{appointmentRequests.length} total requests</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <a 
                                    href="/client/appointments" 
                                    className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                                >
                                    Book New Appointment
                                </a>
                                <button
                                    onClick={fetchAppointmentRequests}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? 'Refreshing...' : 'Refresh'}
                                </button>
                            </div>
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

                        {/* Main Content */}
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {loading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-emerald-600 border-t-transparent"></div>
                                    <p className="mt-4 text-gray-600">Loading your appointment requests...</p>
                                </div>
                            ) : appointmentRequests.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3a4 4 0 118 0v4m-4 12v-2m-2 2h4m-2 0v-2m-2 2H6m8 0h2m-2 0v-2m2 2v-2m0 2h2" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No appointment requests</h3>
                                    <p className="text-gray-500 mb-4">You haven't made any appointment requests yet.</p>
                                    <a 
                                        href="/client/appointments" 
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                                    >
                                        Book an Appointment
                                    </a>
                                </div>
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {paginatedRequests.map((request) => (
                                                    <tr key={request.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{request.supervisor_name}</div>
                                                                <div className="text-sm text-gray-500">{request.supervisor_email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{formatDate(request.preferred_date)}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    {formatTime(request.preferred_time)} - {formatTime(request.preferred_end_time)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={getStatusBadge(request.status)}>
                                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {new Date(request.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => handleViewRequest(request)}
                                                                className="px-3 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors"
                                                                title="View Details"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                            <div className="text-sm text-gray-700">
                                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedRequests.length)} of {sortedRequests.length} results
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Previous
                                                </button>
                                                <span className="text-sm text-gray-700">
                                                    Page {currentPage} of {totalPages}
                                                </span>
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Request Details Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.supervisor_name}</p>
                                    <p className="text-sm text-gray-500">{selectedRequest.supervisor_email}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                        <p className="text-sm text-gray-900">
                                            {new Date(selectedRequest.preferred_date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                        <p className="text-sm text-gray-900">
                                            {formatTime(selectedRequest.preferred_time)} - {formatTime(selectedRequest.preferred_end_time)}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <span className={getStatusBadge(selectedRequest.status)}>
                                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                    </span>
                                </div>
                                {selectedRequest.message && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Your Message</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.message}</p>
                                    </div>
                                )}
                                {selectedRequest.staff_notes && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Staff Notes</label>
                                        <p className="text-sm text-gray-900 bg-emerald-50 p-3 rounded-lg">{selectedRequest.staff_notes}</p>
                                    </div>
                                )}
                                <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                                    <div>
                                        <span className="font-medium">Requested:</span> {new Date(selectedRequest.created_at).toLocaleString()}
                                    </div>
                                    {selectedRequest.approved_at && (
                                        <div>
                                            <span className="font-medium">Approved:</span> {new Date(selectedRequest.approved_at).toLocaleString()}
                                        </div>
                                    )}
                                    {selectedRequest.rejected_at && (
                                        <div>
                                            <span className="font-medium">Rejected:</span> {new Date(selectedRequest.rejected_at).toLocaleString()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
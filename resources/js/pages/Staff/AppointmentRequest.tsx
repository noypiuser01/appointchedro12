import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

interface AppointmentRequest {
    id: number;
    client_name: string;
    client_email: string;
    preferred_date: string;
    preferred_time: string;
    message: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}

export default function AppointmentRequest() {
    const { post } = useForm();
    const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedRequest, setSelectedRequest] = useState<AppointmentRequest | null>(null);
    const [showModal, setShowModal] = useState(false);

    const fetchAppointmentRequests = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetch('/staff/api/appointment-requests', { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load appointment requests');
            const data = await res.json();
            
            setAppointmentRequests(data);
        } catch (e: any) {
            setError(e.message || 'Failed to load appointment requests');
            setAppointmentRequests([]);
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

    const handleApproveRequest = async (requestId: number) => {
        try {
            setLoading(true);
            setError(null);
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const getCookie = (name: string) => {
                const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                return v ? decodeURIComponent(v.pop() as string) : '';
            };
            const xsrfToken = getCookie('XSRF-TOKEN');
            const res = await fetch(`/staff/api/appointment-requests/${requestId}/approve`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to approve request');
            }
            await fetchAppointmentRequests();
            setShowModal(false);
            alert('Appointment request approved successfully');
        } catch (e: any) {
            setError(e.message || 'Failed to approve request');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        try {
            setLoading(true);
            setError(null);
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const getCookie = (name: string) => {
                const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                return v ? decodeURIComponent(v.pop() as string) : '';
            };
            const xsrfToken = getCookie('XSRF-TOKEN');
            const res = await fetch(`/staff/api/appointment-requests/${requestId}/reject`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to reject request');
            }
            await fetchAppointmentRequests();
            setShowModal(false);
            alert('Appointment request rejected');
        } catch (e: any) {
            setError(e.message || 'Failed to reject request');
        } finally {
            setLoading(false);
        }
    };

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

    return (
        <>
            <Head title="Staff - Appointment Requests">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff - Appointment Requests" />
            </Head>

            <StaffHeader/>
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <StaffSidebar active="appointment-request" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-4">
                                    <li>
                                        <a href="/staff/dashboard" className="text-gray-400 hover:text-gray-500">
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
                                            <span className="ml-4 text-sm font-medium text-gray-500">Appointment Requests</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Appointment Requests</h1>
                                <button
                                    onClick={fetchAppointmentRequests}
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                                >
                                    Refresh
                                </button>
                            </div>

                            {loading && (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <p className="mt-2 text-sm text-gray-600">Loading appointment requests...</p>
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
                                    <div className="text-6xl mb-4">📋</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointment requests</h3>
                                    <p className="text-gray-600">There are no appointment requests at the moment.</p>
                                </div>
                            )}

                            {!loading && appointmentRequests.length > 0 && (
                                <div className="space-y-4">
                                    {appointmentRequests.map((request) => (
                                        <div key={request.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900">{request.client_name}</h3>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                                            <span className="mr-1">{getStatusIcon(request.status)}</span>
                                                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 space-y-1">
                                                        <p><span className="font-medium">Email:</span> {request.client_email}</p>
                                                        <p><span className="font-medium">Preferred Date:</span> {request.preferred_date}</p>
                                                        <p><span className="font-medium">Preferred Time:</span> {request.preferred_time}</p>
                                                        <p><span className="font-medium">Requested:</span> {new Date(request.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    {request.message && (
                                                        <div className="mt-2">
                                                            <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                                                                <span className="font-medium">Message:</span> {request.message}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex space-x-2 ml-4">
                                                    <button
                                                        onClick={() => handleViewRequest(request)}
                                                        className="px-3 py-1 text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100 rounded"
                                                    >
                                                        View Details
                                                    </button>
                                                    {request.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApproveRequest(request.id)}
                                                                className="px-3 py-1 text-sm text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleRejectRequest(request.id)}
                                                                className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
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

            {/* Request Details Modal */}
            {showModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Appointment Request Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Client Name</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.client_name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Email</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.client_email}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.preferred_date}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                                        <p className="mt-1 text-sm text-gray-900">{selectedRequest.preferred_time}</p>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Status</label>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRequest.status)}`}>
                                        <span className="mr-1">{getStatusIcon(selectedRequest.status)}</span>
                                        {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                                    </span>
                                </div>
                                {selectedRequest.message && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Message</label>
                                        <p className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded">{selectedRequest.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Close
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => handleApproveRequest(selectedRequest.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md"
                                    >
                                        Approve Request
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(selectedRequest.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                                    >
                                        Reject Request
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

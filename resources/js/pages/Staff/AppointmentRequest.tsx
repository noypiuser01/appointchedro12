import { Head, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Header from '../../components/Staff/Header';
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
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [approvedRequest, setApprovedRequest] = useState<AppointmentRequest | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 8;

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

    const handleShowConfirmation = (request: AppointmentRequest) => {
        setSelectedRequest(request);
        setShowConfirmationModal(true);
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
            setShowConfirmationModal(false);
            setApprovedRequest(selectedRequest);
            setShowSuccessModal(true);
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

    const statusPriority: Record<AppointmentRequest['status'], number> = {
        pending: 0,
        approved: 1,
        rejected: 2,
    };

    const sortedRequests = [...appointmentRequests].sort((a, b) => {
        const byStatus = statusPriority[a.status] - statusPriority[b.status];
        if (byStatus !== 0) return byStatus;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    const paginatedRequests = sortedRequests.slice((currentPage - 1) * pageSize, currentPage * pageSize);
    const totalPages = Math.ceil(sortedRequests.length / pageSize);

    return (
        <>
            <Head title="Staff - Appointment Requests">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff - Appointment Requests" />
            </Head>

            <Header />
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <StaffSidebar active="appointment-request" />
                    <div className="flex-1 px-6 py-8">
                        {/* Breadcrumb */}
                        <div className="mb-8">
                            <nav className="flex items-center space-x-2 text-sm text-gray-500">
                                <a href="/staff/dashboard" className="hover:text-gray-700">Dashboard</a>
                                <span>/</span>
                                <span className="text-gray-900 font-medium">Appointment Requests</span>
                            </nav>
                        </div>

                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">Appointment Requests</h1>
                                <p className="text-gray-600 mt-1">{appointmentRequests.length} total requests</p>
                            </div>
                            <button
                                onClick={fetchAppointmentRequests}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Refreshing...' : 'Refresh'}
                            </button>
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
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent"></div>
                                    <p className="mt-4 text-gray-600">Loading appointment requests...</p>
                                </div>
                            ) : appointmentRequests.length === 0 ? (
                                <div className="text-center py-16">
                                    <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <h3 className="text-lg font-medium text-gray-900 mb-1">No appointment requests</h3>
                                    <p className="text-gray-500">There are no appointment requests at the moment.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preferred Schedule</th>
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
                                                                <div className="text-sm font-medium text-gray-900">{request.client_name}</div>
                                                                <div className="text-sm text-gray-500">{request.client_email}</div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {new Date(request.preferred_date).toLocaleDateString('en-US', {
                                                                        month: 'short',
                                                                        day: 'numeric',
                                                                        year: 'numeric'
                                                                    })}
                                                                </div>
                                                                <div className="text-sm text-gray-500">{request.preferred_time}</div>
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
                                                            <div className="flex items-center justify-end space-x-2">
                                                                {request.status === 'pending' && (
                                                                    <>
                                                                        <button
                                                                            onClick={() => handleShowConfirmation(request)}
                                                                            className="px-3 py-1 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                                                                        >
                                                                            Approve
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleRejectRequest(request.id)}
                                                                            className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
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
                                                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, appointmentRequests.length)} of {appointmentRequests.length} results
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
                            <h3 className="text-lg font-semibold text-gray-900">Request Details</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                                    <p className="text-sm text-gray-900">{selectedRequest.client_name}</p>
                                    <p className="text-sm text-gray-500">{selectedRequest.client_email}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                                        <p className="text-sm text-gray-900">{selectedRequest.preferred_time}</p>
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
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                        <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRequest.message}</p>
                                    </div>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested On</label>
                                    <p className="text-sm text-gray-900">{new Date(selectedRequest.created_at).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</p>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Close
                            </button>
                            {selectedRequest.status === 'pending' && (
                                <>
                                    <button
                                        onClick={() => {
                                            setShowModal(false);
                                            setShowConfirmationModal(true);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => handleRejectRequest(selectedRequest.id)}
                                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                                    >
                                        Reject
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Confirmation Modal */}
            {showConfirmationModal && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowConfirmationModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Confirm Approval</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-4">
                                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Are you sure?</h4>
                                    <p className="text-sm text-gray-500">This action will approve the appointment request.</p>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="text-sm">
                                    <p className="font-medium text-gray-900">{selectedRequest.client_name}</p>
                                    <p className="text-gray-600">{selectedRequest.client_email}</p>
                                    <p className="text-gray-600 mt-1">
                                        {new Date(selectedRequest.preferred_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })} at {selectedRequest.preferred_time}
                                    </p>
                                    {selectedRequest.message && (
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <p className="text-xs font-medium text-gray-700 mb-1">Purpose:</p>
                                            <p className="text-gray-600 text-xs bg-white p-2 rounded border">
                                                {selectedRequest.message}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowConfirmationModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleApproveRequest(selectedRequest.id)}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Approving...' : 'Yes, Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && approvedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccessModal(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">Appointment Approved Successfully</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="ml-4">
                                    <h4 className="text-base font-medium text-gray-900">Request Approved</h4>
                                    <p className="text-sm text-gray-500">The appointment has been successfully approved.</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <h5 className="text-sm font-medium text-blue-900 mb-2">Client Information</h5>
                                    <div className="text-sm text-blue-800">
                                        <p><span className="font-medium">Name:</span> {approvedRequest.client_name}</p>
                                        <p><span className="font-medium">Email:</span> {approvedRequest.client_email}</p>
                                        <p><span className="font-medium">Preferred Date:</span> {new Date(approvedRequest.preferred_date).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}</p>
                                        <p><span className="font-medium">Preferred Time:</span> {approvedRequest.preferred_time}</p>
                                    </div>
                                </div>
                                
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <h5 className="text-sm font-medium text-green-900 mb-2">Staff Information</h5>
                                    <div className="text-sm text-green-800">
                                        <p><span className="font-medium">Approved by:</span> Staff Member</p>
                                        <p><span className="font-medium">Approved on:</span> {new Date().toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}</p>
                                        <p><span className="font-medium">Status:</span> <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">Approved</span></p>
                                    </div>
                                </div>
                                
                                {approvedRequest.message && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h5 className="text-sm font-medium text-gray-900 mb-2">Client Message</h5>
                                        <p className="text-sm text-gray-700">{approvedRequest.message}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
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
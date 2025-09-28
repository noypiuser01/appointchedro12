import { Head, Link, useForm } from '@inertiajs/react';
import ClientHeader from '@/components/Client/Header';
// import ClientFooter from '@/components/Client/Footer';
import ClientSidebar from '@/components/Client/Sidebar';
import { useState } from 'react';

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
    appointments_count?: number;
}

interface Props {
    client: { full_name: string };
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
}

export default function ClientAppointment({ client, supervisorsTechnical = [], supervisorsAdministrator = [] }: Props) {
    const { post } = useForm();
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [staffSchedule, setStaffSchedule] = useState<any[]>([]);

    const toggleAccordion = (type: string) => setExpandedAccordion(expandedAccordion === type ? null : type);

    const handleViewDetails = async (supervisor: Supervisor) => {
        setSelectedSupervisor(supervisor);
        setShowBookingModal(true);
        await fetchStaffSchedule(supervisor.id);
    };

    const fetchStaffSchedule = async (supervisorId: number) => {
        try {
            setLoading(true);
            const res = await fetch(`/client/api/staff-schedule/${supervisorId}`, { 
                credentials: 'same-origin' 
            });
            if (res.ok) {
                const data = await res.json();
                setStaffSchedule(data.schedule || []);
            } else {
                setStaffSchedule([]);
            }
        } catch (error) {
            console.error('Error fetching staff schedule:', error);
            setStaffSchedule([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBookAppointment = async () => {
        if (!selectedSupervisor || !selectedAppointment) return;
        
        try {
            setLoading(true);
            const requestData = {
                supervisor_id: selectedSupervisor.id,
                staff_appointment_id: selectedAppointment.id,
                message: message,
                client_name: client.full_name,
            };
            
            console.log('Sending appointment request:', requestData);
            
            const res = await fetch('/client/api/appointment-requests', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(requestData),
            });
            
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to book appointment');
            }
            
            alert('Appointment request submitted successfully!');
            setShowBookingModal(false);
            setSelectedSupervisor(null);
            setSelectedAppointment(null);
            setMessage('');
            setStaffSchedule([]);
        } catch (e: any) {
            alert('Failed to book appointment: ' + (e.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAppointment = (appointment: any) => {
        setSelectedAppointment(appointment);
    };

    return (
        <>
            <Head title="Book Appointment - Client">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Client Appointments - AppointChed" />
            </Head>
            <ClientHeader title="Client Appointments" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <ClientSidebar
                        client={{ full_name: client.full_name, email: '', id: 0 }}
                        active={'appointments'}
                        onSelect={(id) => {
                            if (id === 'appointments') return;
                            window.location.href = '/client/dashboard';
                        }}
                    />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Choose Appointment Type</h1>
                        <p className="text-gray-600">Select your appointment category</p>
                    </div>

                    <div className="space-y-4 max-w-2xl mx-auto">
                        {/* Administrator Accordion (match Welcome/Appoint) */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                            <button onClick={() => toggleAccordion('administrator')} className="w-full p-6 hover:bg-gray-50 transition-colors text-left">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">Administrator</h3>
                                        <p className="text-sm text-gray-600">Administrative appointments and meetings</p>
                                    </div>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedAccordion === 'administrator' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            {expandedAccordion === 'administrator' && (
                                <div className="border-t border-gray-200 p-6">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">List of Administrator</h4>
                                    {supervisorsAdministrator.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-gray-500">No administrator appointments available</div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {supervisorsAdministrator.map((sup) => (
                                                <li key={sup.id} className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                                                <span className="text-emerald-700 text-sm font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{sup.full_name}</div>
                                                                <div className="text-xs text-gray-400">
                                                                    {sup.appointments_count || 0} upcoming appointments
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleViewDetails(sup)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Technical Accordion (match Welcome/Appoint) */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                            <button onClick={() => toggleAccordion('technical')} className="w-full p-6 hover:bg-gray-50 transition-colors text-left">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">Technical</h3>
                                        <p className="text-sm text-gray-600">Technical consultations and support</p>
                                    </div>
                                    <svg className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expandedAccordion === 'technical' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            {expandedAccordion === 'technical' && (
                                <div className="border-t border-gray-200 p-6">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">List of Technical</h4>
                                    {supervisorsTechnical.length === 0 ? (
                                        <div className="text-center py-8 text-sm text-gray-500">No technical appointments available</div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {supervisorsTechnical.map((sup) => (
                                                <li key={sup.id} className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                                <span className="text-green-700 text-sm font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{sup.full_name}</div>
                                                                <div className="text-xs text-gray-400">
                                                                    {sup.appointments_count || 0} upcoming appointments
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleViewDetails(sup)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Link href="/client/dashboard" className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Dashboard
                        </Link>
                    </div>
                    </div>
                </div>
            </div>

            {/* Booking Modal */}
            {showBookingModal && selectedSupervisor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowBookingModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {/* Supervisor Details */}
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-medium text-gray-900 mb-2">Staff Details</h4>
                                    <div className="space-y-1 text-sm">
                                        <p><span className="font-medium">Name:</span> {selectedSupervisor.full_name}</p>
                                        <p><span className="font-medium">Department:</span> {selectedSupervisor.department}</p>
                                        <p><span className="font-medium">Upcoming Appointments:</span> {selectedSupervisor.appointments_count || 0}</p>
                                    </div>
                                </div>

                                {/* Available Appointments */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Available Appointments</label>
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <p className="mt-2 text-sm text-gray-600">Loading available appointments...</p>
                                        </div>
                                    ) : staffSchedule.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="text-4xl mb-2">📅</div>
                                            <p className="text-sm">No available appointments at the moment</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-60 overflow-y-auto">
                                            {staffSchedule.map((appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    onClick={() => handleSelectAppointment(appointment)}
                                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                                        selectedAppointment?.id === appointment.id
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <div className="font-medium text-sm text-gray-900">
                                                                {appointment.title || 'Appointment Slot'}
                                                            </div>
                                                            <div className="text-xs text-gray-600">
                                                                {new Date(appointment.date).toLocaleDateString('en-US', { 
                                                                    year: 'numeric', 
                                                                    month: 'short', 
                                                                    day: 'numeric' 
                                                                })} • {appointment.time} - {appointment.end_time}
                                                            </div>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {selectedAppointment?.id === appointment.id ? '✓ Selected' : 'Click to select'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full border rounded px-3 py-2 text-sm"
                                        rows={3}
                                        placeholder="Any additional information about your appointment..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                disabled={!selectedAppointment || loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50"
                            >
                                {loading ? 'Booking...' : 'Book Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <ClientFooter /> */}
        </>
    );
}



import { Head, Link, useForm } from '@inertiajs/react';
import ClientHeader from '@/components/Client/Header';
// import ClientFooter from '@/components/Client/Footer';
import ClientSidebar from '@/components/Client/Sidebar';
import { useMemo, useState } from 'react';

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    jobs?: string;
    role: string;
    status: string;
    appointments_count?: number;
}

interface Props {
    client: { full_name: string };
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
}

// Helper function to convert 24-hour time to 12-hour format
const formatTime12Hour = (time24: string): string => {
    if (!time24) return '';
    
    const [hours, minutes] = time24.split(':');
    const hour24 = parseInt(hours, 10);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    
    return `${hour12}:${minutes} ${ampm}`;
};

// Helper functions for calendar
const formatYmdFromParts = (year: number, monthZeroBased: number, day: number) => 
    `${year}-${String(monthZeroBased + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

const isToday = (year: number, month: number, day: number) => {
    const today = new Date();
    return formatYmdFromParts(year, month, day) === formatYmdFromParts(today.getFullYear(), today.getMonth(), today.getDate());
};

export default function ClientAppointment({ client, supervisorsTechnical = [], supervisorsAdministrator = [] }: Props) {
    const { post } = useForm();
    const [searchAdmin, setSearchAdmin] = useState('');
    const [searchTechnical, setSearchTechnical] = useState('');
    const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [staffSchedule, setStaffSchedule] = useState<any[]>([]);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [currentCalendarMonth, setCurrentCalendarMonth] = useState(() => new Date());
    const [showServiceCalendarModal, setShowServiceCalendarModal] = useState(false);
    const [selectedServiceForCalendar, setSelectedServiceForCalendar] = useState<any>(null);

    // Check if staff is available (8am-5:01pm)
    const isStaffAvailable = () => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Available from 8:00 AM to 5:01 PM
        if (currentHour < 8) return false; // Before 8 AM
        if (currentHour > 17) return false; // After 5 PM
        if (currentHour === 17 && currentMinute > 1) return false; // After 5:01 PM
        
        return true;
    };

    // Calendar calculations
    const startOfMonth = useMemo(() => new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), 1), [currentCalendarMonth]);
    const endOfMonth = useMemo(() => new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 0), [currentCalendarMonth]);
    const startWeekday = useMemo(() => startOfMonth.getDay(), [startOfMonth]);
    const daysInMonth = useMemo(() => endOfMonth.getDate(), [endOfMonth]);
    const monthLabel = useMemo(() => currentCalendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' }), [currentCalendarMonth]);

    const filteredAdmins = useMemo(() => {
        const q = searchAdmin.trim().toLowerCase();
        if (!q) return supervisorsAdministrator;
        return supervisorsAdministrator.filter((s) =>
            [s.full_name, s.email, s.department].some((v) => (v || '').toLowerCase().includes(q))
        );
    }, [supervisorsAdministrator, searchAdmin]);

    const filteredTechnical = useMemo(() => {
        const q = searchTechnical.trim().toLowerCase();
        if (!q) return supervisorsTechnical;
        return supervisorsTechnical.filter((s) =>
            [s.full_name, s.email, s.department].some((v) => (v || '').toLowerCase().includes(q))
        );
    }, [supervisorsTechnical, searchTechnical]);

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
            
            setShowBookingModal(false);
            setSelectedSupervisor(null);
            setSelectedAppointment(null);
            setMessage('');
            setStaffSchedule([]);
            setShowSuccessModal(true);
        } catch (e: any) {
            alert('Failed to book appointment: ' + (e.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAppointment = (appointment: any) => {
        setSelectedAppointment(appointment);
    };

    const handleViewServiceCalendar = (appointment: any) => {
        setSelectedServiceForCalendar(appointment);
        // Set calendar to the appointment's month
        const dateOnly = appointment.date ? appointment.date.split(' ')[0] : appointment.date;
        const appointmentDate = new Date(dateOnly);
        setCurrentCalendarMonth(new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), 1));
        setShowServiceCalendarModal(true);
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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Administrator List (Left) */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Administrator</h3>
                                </div>
                                <input
                                    value={searchAdmin}
                                    onChange={(e) => setSearchAdmin(e.target.value)}
                                    placeholder="Search administrators..."
                                    className="w-48 md:w-64 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                                />
                            </div>
                            {filteredAdmins.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500">No administrator appointments available</div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredAdmins.map((sup) => (
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
                                                        {sup.jobs && sup.jobs.trim() !== '' && (
                                                            <div className="mt-1 text-xs text-gray-600">
                                                                Jobs: {sup.jobs}
                                                            </div>
                                                        )}
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

                        {/* Technical List (Right) */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Technical</h3>
                                </div>
                                <input
                                    value={searchTechnical}
                                    onChange={(e) => setSearchTechnical(e.target.value)}
                                    placeholder="Search technical..."
                                    className="w-48 md:w-64 border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                                />
                            </div>
                            {filteredTechnical.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500">No technical appointments available</div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredTechnical.map((sup) => (
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
                                                        {sup.jobs && sup.jobs.trim() !== '' && (
                                                            <div className="mt-1 text-xs text-gray-600">
                                                                Jobs: {sup.jobs}
                                                            </div>
                                                        )}
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
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Book Appointment</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-3">
                                {/* Staff Information */}
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <div className="text-center">
                                        <div className="flex justify-center mb-2">
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>
                                                <div className="absolute -bottom-0.5 -right-0.5">
                                                    {isStaffAvailable() ? (
                                                        <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                    ) : (
                                                        <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold text-gray-900">{selectedSupervisor.full_name}</p>
                                            <p className="text-sm text-gray-600">{selectedSupervisor.department}</p>
                                            {!isStaffAvailable() && (
                                                <p className="text-sm font-medium text-red-700">Staff is not available for now</p>
                                            )}
                                            <p className="text-xs text-gray-500">Business Hours: 8:00 AM - 5:01 PM</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Services */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Services</label>
                                    {loading ? (
                                        <div className="text-center py-4">
                                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                            <p className="mt-2 text-sm text-gray-600">Loading available services...</p>
                                        </div>
                                    ) : staffSchedule.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <div className="text-4xl mb-2">📅</div>
                                            <p className="text-sm">No available services at the moment</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-2 max-h-48 overflow-y-auto">
                                            {staffSchedule.map((appointment) => (
                                                <div
                                                    key={appointment.id}
                                                    className={`p-2 border rounded-lg transition-colors ${
                                                        selectedAppointment?.id === appointment.id
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div 
                                                            onClick={() => handleSelectAppointment(appointment)}
                                                            className="flex-1 cursor-pointer"
                                                        >
                                                            <div className="font-medium text-sm text-gray-900">
                                                                {appointment.title || 'Service Slot'}
                                                            </div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {selectedAppointment?.id === appointment.id ? '✓ Selected' : 'Click to select'}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleViewServiceCalendar(appointment);
                                                            }}
                                                            className="ml-2 p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
                                                            title="View available dates"
                                                        >
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                        rows={2}
                                        placeholder="Any additional information about your appointment..."
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-4 py-3 border-t bg-gray-50 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-md transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBookAppointment}
                                disabled={!selectedAppointment || loading || !isStaffAvailable()}
                                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Booking...' : !isStaffAvailable() ? 'Staff Unavailable' : 'Book Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Service Calendar Modal */}
            {showServiceCalendarModal && selectedServiceForCalendar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowServiceCalendarModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Available Dates</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Service: {selectedServiceForCalendar.title || 'Service Slot'}
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="border border-gray-200 rounded-lg p-4">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <button 
                                        onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))} 
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h3 className="text-sm font-medium text-gray-900">{monthLabel}</h3>
                                    <button 
                                        onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))} 
                                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Calendar Grid */}
                                <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                                    <div className="py-2">Su</div><div className="py-2">Mo</div><div className="py-2">Tu</div><div className="py-2">We</div><div className="py-2">Th</div><div className="py-2">Fr</div><div className="py-2">Sa</div>
                                </div>
                                
                                <div className="grid grid-cols-7 gap-1">
                                    {Array.from({ length: startWeekday }).map((_, i) => (
                                        <div key={`empty-${i}`} className="h-8" />
                                    ))}
                                    {Array.from({ length: daysInMonth }).map((_, i) => {
                                        const day = i + 1;
                                        const iso = formatYmdFromParts(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
                                        
                                        // Handle different date formats
                                        let appointmentDateOnly = selectedServiceForCalendar.date;
                                        if (typeof appointmentDateOnly === 'string') {
                                            // Remove time part if present
                                            appointmentDateOnly = appointmentDateOnly.split(' ')[0];
                                            // Remove 'T' part if present (ISO format)
                                            appointmentDateOnly = appointmentDateOnly.split('T')[0];
                                        }
                                        
                                        const isAppointmentDate = appointmentDateOnly === iso;
                                        const today = isToday(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
                                        
                                        // Debug logging for the appointment date
                                        if (day === 6) {
                                            console.log('Day 6 Debug:', {
                                                day,
                                                iso,
                                                appointmentDateOnly,
                                                originalDate: selectedServiceForCalendar.date,
                                                isAppointmentDate,
                                                today
                                            });
                                        }
                                        
                                        return (
                                            <div
                                                key={day}
                                                className={`h-8 rounded text-xs font-medium flex items-center justify-center relative ${
                                                    isAppointmentDate
                                                        ? 'bg-emerald-500 text-white border-2 border-emerald-600 font-bold shadow-md'
                                                        : today 
                                                            ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                                            : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {day}
                                                {isAppointmentDate && (
                                                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full border border-white" />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Service Details */}
                                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="text-sm">
                                        <div className="font-medium text-gray-900 mb-1">
                                            {selectedServiceForCalendar.title || 'Service Slot'}
                                        </div>
                                        <div className="text-gray-600">
                                            <div>📅 {new Date(selectedServiceForCalendar.date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric',
                                                weekday: 'long'
                                            })}</div>
                                            <div className="mt-1">
                                                🕒 {formatTime12Hour(selectedServiceForCalendar.time)} 
                                                {selectedServiceForCalendar.end_time && ` - ${formatTime12Hour(selectedServiceForCalendar.end_time)}`}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Legend */}
                                <div className="mt-4 flex items-center justify-center space-x-4 text-xs">
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-emerald-100 border border-emerald-300 rounded"></div>
                                        <span className="text-gray-600">Appointment Date</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <div className="w-3 h-3 bg-blue-50 border border-blue-200 rounded"></div>
                                        <span className="text-gray-600">Today</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end">
                            <button
                                onClick={() => setShowServiceCalendarModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Success Modal */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowSuccessModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-6 text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Success!</h3>
                            <p className="text-sm text-gray-600 mb-6">Appointment request submitted successfully!</p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full bg-emerald-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-emerald-700 transition-colors"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* <ClientFooter /> */}
        </>
    );
}





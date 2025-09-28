import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

export default function AppointmentLis() {
    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);
    const [current, setCurrent] = useState(() => new Date());
    const [appointments, setAppointments] = useState<Array<{ id: number; date: string; time: string; end_time?: string; title: string; client_name?: string; client_full_name?: string; client_email?: string; type?: string; status?: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedDayIso, setSelectedDayIso] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);

    // Helpers (Asia/Manila safe y-m-d formatting)
    const formatYmdFromParts = (year: number, monthZeroBased: number, day: number) => `${year}-${String(monthZeroBased + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const manilaNow = useMemo(() => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })), []);
    const todayYmd = useMemo(() => formatYmdFromParts(manilaNow.getFullYear(), manilaNow.getMonth(), manilaNow.getDate()), [manilaNow]);
    const monthLabel = useMemo(() => current.toLocaleString('default', { month: 'long', year: 'numeric' }), [current]);
    const startOfMonth = useMemo(() => new Date(current.getFullYear(), current.getMonth(), 1), [current]);
    const endOfMonth = useMemo(() => new Date(current.getFullYear(), current.getMonth() + 1, 0), [current]);
    const startWeekday = useMemo(() => startOfMonth.getDay(), [startOfMonth]);
    const daysInMonth = useMemo(() => endOfMonth.getDate(), [endOfMonth]);

    const selectedDayAppointments = useMemo(() => {
        if (!selectedDayIso) return [] as typeof appointments;
        return appointments.filter(a => {
            const d = (a.date as unknown as string) || '';
            const ymd = d.length >= 10 ? d.slice(0, 10) : d;
            return ymd === selectedDayIso;
        });
    }, [appointments, selectedDayIso]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const from = formatYmdFromParts(current.getFullYear(), current.getMonth(), 1);
            const to = formatYmdFromParts(current.getFullYear(), current.getMonth(), new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate());
            const res = await fetch(`/staff/api/staff-appointments?from=${from}&to=${to}`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load appointments');
            const data = await res.json();
            console.log('Received appointments data:', data);
            console.log('Appointments with client names:', data.filter((appointment: any) => appointment.client_name || appointment.client_full_name));
            setAppointments(data);
        } catch (e: any) {
            setError(e.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [current]);
    const handleLogout = () => {
        post('/staff/logout');
    };
    return (
        <>
            <Head title="Staff - Appointment List">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff - Appointment List" />
            </Head>

            {/* Top Header with Account Dropdown (same as Staff Dashboard) */}
            <header className="sticky top-0 z-50 shadow-sm border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="w-full">
                    <div className="flex justify-between items-center h-12 px-4">
                        <div className="flex items-center">
                            <Link href="/staff/dashboard" className="flex items-center space-x-3 text-white">
                                <img src="/images/logo.png" alt="AppointChed Logo" className="h-8 w-auto" />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-indigo-100">AppointChed - Staff Portal</div>
                                </div>
                            </Link>
                        </div>

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
                    <StaffSidebar active="appointments" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-6">
                        <nav className="flex" aria-label="Breadcrumb">
                            <ol className="flex items-center space-x-4">
                                <li>
                                    <Link href="/staff/dashboard" className="text-gray-400 hover:text-gray-500">
                                        <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                        </svg>
                                        <span className="sr-only">Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <div className="flex items-center">
                                        <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="ml-4 text-sm font-medium text-gray-500">Appointment List</span>
                                    </div>
                                </li>
                            </ol>
                        </nav>
                    </div>

                        <div className="bg-white rounded-lg shadow p-6">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Appointment Calendar</h1>

                            <div className="flex items-center justify-between mb-4">
                                <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))} className="px-3 py-2 rounded hover:bg-gray-100">←</button>
                                <div className="text-lg font-semibold">{monthLabel}</div>
                                <button onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))} className="px-3 py-2 rounded hover:bg-gray-100">→</button>
                            </div>

                            <div className="grid grid-cols-7 gap-2 text-center text-sm text-gray-600 mb-2">
                                <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
                            </div>
                            <div className="grid grid-cols-7 gap-2">
                                {Array.from({ length: startWeekday }).map((_, i) => (
                                    <div key={`empty-${i}`} className="h-16" />
                                ))}
                                {Array.from({ length: daysInMonth }).map((_, i) => {
                                    const day = i + 1;
                                    const iso = formatYmdFromParts(current.getFullYear(), current.getMonth(), day);
                                    const dayAppointments = appointments.filter(a => {
                                        const d = (a.date as unknown as string) || '';
                                        const ymd = d.length >= 10 ? d.slice(0, 10) : d;
                                        return ymd === iso;
                                    });
                                    const hasAppt = dayAppointments.length > 0;
                                    const isToday = iso === todayYmd;
                                    return (
                                        <button
                                            key={day}
                                            className={`h-16 rounded border flex items-center justify-center flex-col text-sm ${
                                                hasAppt ? 'border-indigo-700 bg-indigo-600' : 'border-gray-200'
                                            }`}
                                            onClick={() => {
                                                if (!hasAppt) return;
                                                setSelectedDayIso(iso);
                                                setShowModal(true);
                                            }}
                                        >
                                            <span className={`font-medium ${hasAppt ? 'text-white' : 'text-black'}`}>{day}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6">
                                {loading && <div className="text-sm text-gray-500">Loading...</div>}
                                {error && <div className="text-sm text-red-600">{error}</div>}
                            </div>

                            
                        </div>

                        {showModal && selectedDayIso && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center">
                                <div className="absolute inset-0 bg-black/50" onClick={() => setShowModal(false)} />
                                <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                                    <div className="px-6 py-4 border-b bg-gradient-to-r from-indigo-600 to-purple-600">
                                        <h3 className="text-lg font-semibold text-white">
                                            {selectedDayAppointments.length > 0
                                                ? (selectedDayAppointments[0].title || 'Appointment')
                                                : `Appointments on ${selectedDayIso}`}
                                        </h3>
                                        <p className="text-indigo-100 text-sm mt-1">
                                            Appointments on {selectedDayIso}
                                        </p>
                                    </div>
                                    <div className="p-6 max-h-[60vh] overflow-auto">
                                        {(() => {
                                            const dayAppointments = selectedDayAppointments;
                                            if (dayAppointments.length === 0) {
                                                return (
                                                    <div className="text-center py-8">
                                                        <div className="text-gray-400 text-6xl mb-4">📅</div>
                                                        <p className="text-gray-500">No appointments scheduled for this day</p>
                                                    </div>
                                                );
                                            }
                                            
                                            return (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-sm font-medium text-gray-700">
                                                            {(() => {
                                                                const totalClientBookings = dayAppointments.filter(a => (a as any).type === 'client' || a.client_full_name || a.client_name).length;
                                                                return `Total Appointments: ${totalClientBookings}`;
                                                            })()}
                                                        </span>
                                                        <div className="h-px bg-gray-200 flex-1 mx-3"></div>
                                                    </div>
                                                    
                                                    <ul className="list-disc pl-5 space-y-2">
                                                        {dayAppointments
                                                            .filter((appointment) => (appointment.client_full_name || appointment.client_name))
                                                            .map((appointment) => (
                                                            <li key={`${appointment.date}-${appointment.time}-${appointment.title}`} className="marker:text-indigo-600">
                                                                <div className="text-base font-semibold text-gray-900">
                                                                    {appointment.client_full_name || appointment.client_name}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="px-6 py-4 border-t bg-gray-50 flex justify-end">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}



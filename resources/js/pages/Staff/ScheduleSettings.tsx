import { Head, Link, useForm } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

export default function ScheduleSettings() {
    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);
    const [current, setCurrent] = useState(() => new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>('10:00');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('14:00');
    const [title, setTitle] = useState('');
    const [appointments, setAppointments] = useState<Array<{ id: number; date: string; time: string; end_time?: string; title: string }>>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingAppointment, setEditingAppointment] = useState<{ id: number; date: string; time: string; end_time?: string; title: string } | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] = useState<{ id: number; title: string } | null>(null);

    // Philippines time (Asia/Manila)
    const manilaNow = useMemo(() => new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' })), []);
    const formatYmdFromParts = (year: number, monthZeroBased: number, day: number) => `${year}-${String(monthZeroBased + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const todayYmd = useMemo(() => formatYmdFromParts(manilaNow.getFullYear(), manilaNow.getMonth(), manilaNow.getDate()), [manilaNow]);

    const startOfMonth = useMemo(() => new Date(current.getFullYear(), current.getMonth(), 1), [current]);
    const endOfMonth = useMemo(() => new Date(current.getFullYear(), current.getMonth() + 1, 0), [current]);
    const startWeekday = useMemo(() => startOfMonth.getDay(), [startOfMonth]);
    const daysInMonth = useMemo(() => endOfMonth.getDate(), [endOfMonth]);
    const monthLabel = useMemo(() => current.toLocaleString('default', { month: 'long', year: 'numeric' }), [current]);

    const timeSlots = useMemo(() => [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00'
    ], []);

    const allowedWeekdays = useMemo(() => [1, 2, 3], []); // Mon(1), Tue(2), Wed(3)

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);
            const from = formatYmdFromParts(current.getFullYear(), current.getMonth(), 1);
            const to = formatYmdFromParts(current.getFullYear(), current.getMonth(), new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate());
            const res = await fetch(`/staff/api/staff-appointments?from=${from}&to=${to}`, { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load appointments');
            const data = await res.json();
            setAppointments(data);
        } catch (e:any) {
            setError(e.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAppointments(); }, [current]);

    const isToday = (y:number, m:number, d:number) => formatYmdFromParts(y, m, d) === todayYmd;

    const isAllowedDay = (date: Date) => true;

    const handleSelectDate = (day: number) => {
        const date = new Date(current.getFullYear(), current.getMonth(), day);
        setSelectedDate(date);
    };

    const handleSave = async () => {
        if (!selectedDate) return;
        try {
            setLoading(true);
            setError(null);
            const payload = {
                date: formatYmdFromParts(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()),
                time: selectedTime,
                end_time: selectedEndTime,
                title,
            };
            const res = await fetch('/staff/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to save appointment');
            }
            await fetchAppointments();
            try {
                localStorage.setItem('lastSavedAppointmentDate', selectedDate.toISOString().slice(0,10));
            } catch (_e) {}
            setTitle('');
            alert('Appointment saved');
        } catch (e:any) {
            setError(e.message || 'Failed to save');
        } finally {
            setLoading(false);
        }
    };

    const handleEditAppointment = (appointment: { id: number; date: string; time: string; end_time?: string; title: string }) => {
        setEditingAppointment(appointment);
        setSelectedTime(appointment.time);
        setSelectedEndTime(appointment.end_time || '14:00');
        setTitle(appointment.title);
        setShowEditModal(true);
    };

    const handleUpdateAppointment = async () => {
        if (!editingAppointment) return;
        try {
            setLoading(true);
            setError(null);
            const payload = {
                date: editingAppointment.date,
                time: selectedTime,
                end_time: selectedEndTime,
                title,
            };
            const res = await fetch(`/staff/api/appointments/${editingAppointment.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update appointment');
            }
            await fetchAppointments();
            setShowEditModal(false);
            setEditingAppointment(null);
            setTitle('');
            alert('Appointment updated successfully');
        } catch (e: any) {
            setError(e.message || 'Failed to update appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAppointment = (appointment: { id: number; title: string }) => {
        setAppointmentToDelete(appointment);
        setShowDeleteModal(true);
    };

    const handleInlineDeleteAppointment = async (appointmentId: number, title: string) => {
        const confirmed = window.confirm(`Delete appointment "${title}"? This action cannot be undone.`);
        if (!confirmed) return;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/staff/api/appointments/${appointmentId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to delete appointment');
            }
            await fetchAppointments();
            alert('Appointment deleted successfully');
        } catch (e: any) {
            setError(e.message || 'Failed to delete appointment');
        } finally {
            setLoading(false);
        }
    };

    const confirmDeleteAppointment = async () => {
        if (!appointmentToDelete) return;
        try {
            setLoading(true);
            setError(null);
            const res = await fetch(`/staff/api/appointments/${appointmentToDelete.id}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                },
                credentials: 'same-origin',
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to delete appointment');
            }
            await fetchAppointments();
            setShowDeleteModal(false);
            setAppointmentToDelete(null);
            alert('Appointment deleted successfully');
        } catch (e: any) {
            setError(e.message || 'Failed to delete appointment');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => post('/staff/logout');

    // Sort appointments by date and time for better display
    const sortedAppointments = useMemo(() => {
        return appointments
            .filter(a => a.date.slice(0,7) === `${current.getFullYear()}-${String(current.getMonth()+1).padStart(2,'0')}`)
            .sort((a, b) => {
                const dateCompare = new Date(a.date).getTime() - new Date(b.date).getTime();
                if (dateCompare !== 0) return dateCompare;
                return a.time.localeCompare(b.time);
            });
    }, [appointments, current]);

    return (
        <>
            <Head title="Staff - Schedule Settings">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff - Schedule Settings" />
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
                    <StaffSidebar active="schedule" />

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
                                            <span className="ml-4 text-sm font-medium text-gray-500">Schedule Settings</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        <div className="max-w-6xl mx-auto">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                                <h1 className="text-xl font-semibold text-gray-900 mb-6">Schedule Settings</h1>

                                {/* Main Content Grid */}
                                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                                    {/* Calendar Section - Smaller */}
                                    <div className="lg:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <button 
                                                onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))} 
                                                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>
                                            <h2 className="text-sm font-medium text-gray-900">{monthLabel}</h2>
                                            <button 
                                                onClick={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))} 
                                                className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                                            >
                                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-2">
                                            <div className="py-2">Su</div><div className="py-2">Mo</div><div className="py-2">Tu</div><div className="py-2">We</div><div className="py-2">Th</div><div className="py-2">Fr</div><div className="py-2">Sa</div>
                                        </div>
                                        
                                        <div className="grid grid-cols-7 gap-1">
                                            {Array.from({ length: startWeekday }).map((_, i) => (
                                                <div key={`empty-${i}`} className="h-8" />
                                            ))}
                                            {Array.from({ length: daysInMonth }).map((_, i) => {
                                                const day = i + 1;
                                                const d = new Date(current.getFullYear(), current.getMonth(), day);
                                                const iso = formatYmdFromParts(current.getFullYear(), current.getMonth(), day);
                                                const hasAppt = appointments.some(a => a.date === iso);
                                                const allowed = isAllowedDay(d);
                                                const selected = selectedDate && selectedDate.getDate() === day;
                                                const today = isToday(current.getFullYear(), current.getMonth(), day);
                                                
                                                return (
                                                    <button
                                                        key={day}
                                                        onClick={() => handleSelectDate(day)}
                                                        className={`h-8 rounded text-xs font-medium transition-colors flex items-center justify-center relative ${
                                                            today 
                                                                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                                                                : selected
                                                                    ? 'bg-indigo-600 text-white'
                                                                    : 'hover:bg-gray-100 text-gray-700'
                                                        } ${!allowed && 'opacity-40 cursor-not-allowed'}`}
                                                        disabled={!allowed}
                                                    >
                                                        {day}
                                                        {hasAppt && (
                                                            <div className="absolute bottom-0.5 right-0.5 w-1 h-1 bg-orange-500 rounded-full" />
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {loading && <div className="text-xs text-gray-500 mt-2">Loading...</div>}
                                        {error && <div className="text-xs text-red-600 mt-2">{error}</div>}
                                    </div>

                                    {/* Appointment Form */}
                                    <div className="lg:col-span-3">
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <h3 className="text-sm font-medium text-gray-900 mb-4">New Appointment</h3>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Selected Date</label>
                                                    <input 
                                                        type="text" 
                                                        readOnly 
                                                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 bg-white" 
                                                        value={selectedDate ? formatYmdFromParts(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate()) : ''} 
                                                        placeholder="Select a date from calendar"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Start Time</label>
                                                    <select 
                                                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2" 
                                                        value={selectedTime} 
                                                        onChange={(e) => setSelectedTime(e.target.value)}
                                                    >
                                                        {timeSlots.map(ts => (
                                                            <option key={ts} value={ts}>{ts}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">End Time</label>
                                                    <select 
                                                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2" 
                                                        value={selectedEndTime} 
                                                        onChange={(e) => setSelectedEndTime(e.target.value)}
                                                    >
                                                        {timeSlots.map(ts => (
                                                            <option key={ts} value={ts}>{ts}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                                    <input 
                                                        className="w-full text-sm border border-gray-300 rounded-md px-3 py-2" 
                                                        value={title} 
                                                        onChange={(e) => setTitle(e.target.value)} 
                                                        placeholder="Enter appointment title" 
                                                    />
                                                </div>
                                            </div>
                                            
                                            <button
                                                onClick={handleSave}
                                                disabled={!selectedDate || !title || loading}
                                                className="mt-4 w-full bg-indigo-600 text-white text-sm font-medium py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {loading ? 'Saving...' : 'Save Appointment'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Appointments List */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {monthLabel} Appointments
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        {sortedAppointments.length} appointment{sortedAppointments.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                {sortedAppointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">No appointments scheduled for {monthLabel}</p>
                                    </div>
                                ) : (
                                    <div className="max-h-96 overflow-y-auto space-y-2 pr-2">
                                        {sortedAppointments.map(appointment => {
                                            const appointmentDate = new Date(appointment.date);
                                            const dayName = appointmentDate.toLocaleDateString('en-US', { weekday: 'short' });
                                            const dayNumber = appointmentDate.getDate();
                                            
                                            return (
                                                <div key={`${appointment.id}-${appointment.date}`} className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                                    {/* Date Badge */}
                                                    <div className="flex-shrink-0 text-center mr-4">
                                                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex flex-col items-center justify-center">
                                                            <div className="text-xs font-medium text-indigo-600 uppercase">{dayName}</div>
                                                            <div className="text-sm font-bold text-indigo-700">{dayNumber}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Appointment Details */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-medium text-gray-900 truncate">{appointment.title}</h4>
                                                        <div className="flex items-center mt-1 text-xs text-gray-500">
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                            </svg>
                                                            {appointment.time}
                                                            {appointment.end_time && ` - ${appointment.end_time}`}
                                                        </div>
                                                    </div>
                                                    
                                                    {/* Action Buttons */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEditAppointment(appointment)}
                                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
                                                            title="Edit appointment"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleInlineDeleteAppointment(appointment.id, appointment.title)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                            title="Delete appointment"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Modal */}
            {showEditModal && editingAppointment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Edit Appointment</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input 
                                        type="text" 
                                        readOnly 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-50" 
                                        value={editingAppointment.date} 
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                        <select 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" 
                                            value={selectedTime} 
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                        >
                                            {timeSlots.map(ts => (
                                                <option key={ts} value={ts}>{ts}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                        <select 
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" 
                                            value={selectedEndTime} 
                                            onChange={(e) => setSelectedEndTime(e.target.value)}
                                        >
                                            {timeSlots.map(ts => (
                                                <option key={ts} value={ts}>{ts}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input 
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        placeholder="Appointment title" 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateAppointment}
                                disabled={!title || loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Updating...' : 'Update Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && appointmentToDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowDeleteModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Delete Appointment</h3>
                        </div>
                        <div className="p-6">
                            <p className="text-sm text-gray-600">
                                Are you sure you want to delete the appointment "<span className="font-medium">{appointmentToDelete.title}</span>"? 
                                This action cannot be undone.
                            </p>
                        </div>
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDeleteAppointment}
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {loading ? 'Deleting...' : 'Delete Appointment'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
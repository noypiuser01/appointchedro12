import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ClientHeader from '@/components/Client/Header';
// import ClientFooter from '@/components/Client/Footer';
import ClientSidebar from '@/components/Client/Sidebar';

interface Client {
    id: number;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
}

interface Stats {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
    availableSupervisors: number;
}

interface RecentRequest {
    id: number;
    supervisor_name: string;
    supervisor_email: string;
    preferred_date: string;
    preferred_time: string;
    preferred_end_time?: string;
    message?: string;
    status: string;
    created_at: string;
    approved_at?: string;
    rejected_at?: string;
    staff_notes?: string;
}

interface MonthlyTrend {
    month: string;
    count: number;
}

interface Props {
    client: Client;
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
    stats?: Stats;
    recentRequests?: RecentRequest[];
    allTimeRequests?: RecentRequest[];
    monthlyTrends?: MonthlyTrend[];
}

export default function Dashboard({ client, supervisorsTechnical = [], supervisorsAdministrator = [], stats, recentRequests, allTimeRequests, monthlyTrends }: Props) {
    const [activeSection, setActiveSection] = useState('profile');
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

    const toggleAccordion = (type: string) => {
        setExpandedAccordion(expandedAccordion === type ? null : type);
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

    // Custom tooltip for the chart
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                    <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
                    <p className="text-sm text-indigo-600">
                        {`Requests: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    const sidebarItems = [
        { id: 'profile', name: 'Profile Information', icon: '👤' },
        { id: 'appointments', name: 'My Appointments', icon: '📅' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
    ];

    return (
        <>
            <ClientHeader title="Client Dashboard" />
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    {/* Sidebar */}
                    <ClientSidebar
                        client={client}
                        active={activeSection as 'profile' | 'appointments' | 'appointment_list' | 'notifications'}
                        onSelect={(id) => setActiveSection(id)}
                    />

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {activeSection === 'profile' && (
                            <div className="space-y-6">
                                {/* Statistics Cards */}
                                {stats && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                        {/* Total Requests */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Pending Requests */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Pending</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Approved Requests */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Approved</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.approvedRequests}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Available Supervisors */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="ml-4">
                                                    <p className="text-sm font-medium text-gray-600">Available Staff</p>
                                                    <p className="text-2xl font-bold text-gray-900">{stats.availableSupervisors}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Request Status Overview */}
                                {stats && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Status</h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-gray-600">Approved</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{stats.approvedRequests}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-amber-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-gray-600">Pending</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{stats.pendingRequests}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                                                        <span className="text-sm text-gray-600">Rejected</span>
                                                    </div>
                                                    <span className="text-sm font-semibold text-gray-900">{stats.rejectedRequests}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Trends Area Chart */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
                                            <div className="h-40">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <AreaChart
                                                        data={monthlyTrends || []}
                                                        margin={{
                                                            top: 5,
                                                            right: 5,
                                                            left: 5,
                                                            bottom: 5,
                                                        }}
                                                    >
                                                        <defs>
                                                            <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                                            </linearGradient>
                                                        </defs>
                                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                                        <XAxis 
                                                            dataKey="month" 
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                                        />
                                                        <YAxis 
                                                            axisLine={false}
                                                            tickLine={false}
                                                            tick={{ fontSize: 12, fill: '#64748b' }}
                                                        />
                                                        <Tooltip content={<CustomTooltip />} />
                                                        <Area
                                                            type="monotone"
                                                            dataKey="count"
                                                            stroke="#6366f1"
                                                            strokeWidth={2}
                                                            fillOpacity={1}
                                                            fill="url(#colorRequests)"
                                                        />
                                                    </AreaChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                            <div className="space-y-3">
                                                <a href="/client/appointments" className="block w-full text-center px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">
                                                    Book Appointment
                                                </a>
                                                <a href="/client/appointment-list" className="block w-full text-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                                                    View My Requests
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        )}

                        {activeSection === 'appointments' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments moved</h1>
                                    <p className="text-gray-600">Please go to the Appointments page.</p>
                                    <div className="mt-6">
                                        <a href="/client/appointments" className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 font-medium transition-colors">Go to Appointments</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
                                    <p className="text-gray-600">No notifications to show.</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            {/* <ClientFooter /> */}
        </>
    );
}
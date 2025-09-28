import { Head, Link } from '@inertiajs/react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
}

interface Stats {
    totalAppointments: number;
    todayAppointments: number;
    thisWeekAppointments: number;
    thisMonthAppointments: number;
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
}

interface RecentAppointment {
    id: number;
    date: string;
    time: string;
    end_time?: string;
    title: string;
    notes?: string;
}

interface RecentRequest {
    id: number;
    client_name: string;
    client_email: string;
    preferred_date: string;
    preferred_time: string;
    status: string;
    message?: string;
    created_at: string;
}

interface MonthlyTrend {
    month: string;
    count: number;
}

interface StaffDashboardProps {
    supervisor?: Supervisor;
    stats?: Stats;
    recentAppointments?: RecentAppointment[];
    recentRequests?: RecentRequest[];
    monthlyTrends?: MonthlyTrend[];
}

export default function StaffDashboard(props: StaffDashboardProps) {

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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
                        {`Appointments: ${payload[0].value}`}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <>
            <Head title="Staff Dashboard - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Dashboard - Commission on Higher Education Region XII" />
            </Head>

            <StaffHeader title="Staff Dashboard" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <StaffSidebar active="dashboard" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-4">
                                    <li>
                                        <Link href="/" className="text-gray-400 hover:text-gray-500">
                                            <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                            <span className="sr-only">Home</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="ml-4 text-sm font-medium text-gray-500">Staff Dashboard</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>

                        {/* Statistics Cards */}
                        {props.stats && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                                {/* Today's Appointments */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                                            <p className="text-2xl font-bold text-gray-900">{props.stats.todayAppointments}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* This Week's Appointments */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">This Week</p>
                                            <p className="text-2xl font-bold text-gray-900">{props.stats.thisWeekAppointments}</p>
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
                                            <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                                            <p className="text-2xl font-bold text-gray-900">{props.stats.pendingRequests}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Appointments */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                                            <p className="text-2xl font-bold text-gray-900">{props.stats.totalAppointments}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Request Status Overview */}
                        {props.stats && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">Request Status</h3>
                                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-emerald-500 rounded-full mr-4"></div>
                                                <span className="text-base font-medium text-gray-700">Approved</span>
                                            </div>
                                            <span className="text-2xl font-bold text-emerald-600">{props.stats.approvedRequests}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-amber-500 rounded-full mr-4"></div>
                                                <span className="text-base font-medium text-gray-700">Pending</span>
                                            </div>
                                            <span className="text-2xl font-bold text-amber-600">{props.stats.pendingRequests}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                                            <div className="flex items-center">
                                                <div className="w-4 h-4 bg-red-500 rounded-full mr-4"></div>
                                                <span className="text-base font-medium text-gray-700">Rejected</span>
                                            </div>
                                            <span className="text-2xl font-bold text-red-600">{props.stats.rejectedRequests}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Monthly Trends Area Chart */}
                                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">Monthly Trends</h3>
                                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-56">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart
                                                data={props.monthlyTrends || []}
                                                margin={{
                                                    top: 10,
                                                    right: 10,
                                                    left: 10,
                                                    bottom: 10,
                                                }}
                                            >
                                                <defs>
                                                    <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
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
                                                    strokeWidth={3}
                                                    fillOpacity={1}
                                                    fill="url(#colorAppointments)"
                                                />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Recent Activity - Combined with Pie Chart */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Activity Overview Pie Chart */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Activity Overview</h3>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="h-72">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { 
                                                        name: 'Scheduled', 
                                                        value: (props.recentAppointments?.length || 0),
                                                        color: '#3b82f6'
                                                    },
                                                    { 
                                                        name: 'Approved', 
                                                        value: props.recentRequests?.filter(r => r.status === 'approved').length || 0,
                                                        color: '#10b981'
                                                    },
                                                    { 
                                                        name: 'Pending', 
                                                        value: props.recentRequests?.filter(r => r.status === 'pending').length || 0,
                                                        color: '#f59e0b'
                                                    },
                                                    { 
                                                        name: 'Rejected', 
                                                        value: props.recentRequests?.filter(r => r.status === 'rejected').length || 0,
                                                        color: '#ef4444'
                                                    }
                                                ].filter(item => item.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                            >
                                                {[
                                                    { name: 'Scheduled', color: '#3b82f6' },
                                                    { name: 'Approved', color: '#10b981' },
                                                    { name: 'Pending', color: '#f59e0b' },
                                                    { name: 'Rejected', color: '#ef4444' }
                                                ].map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip 
                                                formatter={(value, name) => [value, name]}
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: '1px solid #e5e7eb',
                                                    borderRadius: '12px',
                                                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                                    fontSize: '14px'
                                                }}
                                            />
                                            <Legend 
                                                verticalAlign="bottom" 
                                                height={40}
                                                iconType="circle"
                                                wrapperStyle={{
                                                    fontSize: '13px',
                                                    color: '#6b7280',
                                                    fontWeight: '500'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Recent Appointments */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Recent Appointments</h3>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                                {props.recentAppointments && props.recentAppointments.length > 0 ? (
                                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                        {props.recentAppointments.slice(0, 5).map((appointment) => (
                                            <div key={appointment.id} className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
                                                <div className="flex-shrink-0 w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4"></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-semibold text-gray-900 truncate mb-1">{appointment.title}</p>
                                                    <p className="text-sm text-gray-600 mb-2">{formatDate(appointment.date)} at {formatTime(appointment.time)}</p>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        Scheduled
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-300 text-5xl mb-4">📅</div>
                                        <p className="text-gray-500 text-base">No recent appointments</p>
                                    </div>
                                )}
                            </div>
                            {/* Recent Requests */}
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900">Recent Requests</h3>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                </div>
                                {props.recentRequests && props.recentRequests.length > 0 ? (
                                    <div className="space-y-4 max-h-72 overflow-y-auto pr-2">
                                        {props.recentRequests.slice(0, 5).map((request) => (
                                            <div key={request.id} className="flex items-start p-4 bg-gradient-to-r from-gray-50 to-slate-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
                                                <div className={`flex-shrink-0 w-3 h-3 rounded-full mt-2 mr-4 ${
                                                    request.status === 'approved' ? 'bg-emerald-500' :
                                                    request.status === 'pending' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-base font-semibold text-gray-900 truncate mb-1">{request.client_name}</p>
                                                    <p className="text-sm text-gray-600 mb-2">{formatDate(request.preferred_date)} at {formatTime(request.preferred_time)}</p>
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                        request.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                        request.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {request.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-300 text-5xl mb-4">📋</div>
                                        <p className="text-gray-500 text-base">No recent requests</p>
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
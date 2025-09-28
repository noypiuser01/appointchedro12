import { Link } from '@inertiajs/react';

interface Client {
    id: number;
    full_name: string;
    email: string;
}

interface ClientSidebarProps {
    client: Client;
    active: 'profile' | 'appointments' | 'appointment_list' | 'notifications';
    onSelect: (id: 'profile' | 'appointments' | 'appointment_list' | 'notifications') => void;
}

export default function ClientSidebar({ client, active, onSelect }: ClientSidebarProps) {
    const items: Array<{ id: 'profile' | 'appointments' | 'appointment_list' | 'notifications'; name: string; icon: string }> = [
        { id: 'profile', name: 'Dashboard', icon: '🏠' },
        { id: 'appointments', name: 'Appoint Now', icon: '📅' },
        { id: 'appointment_list', name: 'Appointment List', icon: '📋' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
    ];

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen">
            <div className="p-6">
                {/* Welcome Section (copied from Client/Dashboard) */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Welcome!</h2>
                            <p className="text-sm text-gray-600">{client.full_name}</p>
                        </div>
                    </div>
                </div>

                {/* Appoint Now is included in the main navigation list */}

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {items.map((item) => (
                        item.id === 'appointments' ? (
                            <Link
                                key={item.id}
                                href="/client/appointments"
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    active === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ) : item.id === 'profile' ? (
                            <Link
                                key={item.id}
                                href="/client/dashboard"
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    active === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ) : item.id === 'appointment_list' ? (
                            <Link
                                key={item.id}
                                href="/client/appointments/list"
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    active === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ) : item.id === 'notifications' ? (
                            <Link
                                key={item.id}
                                href="/client/notifications"
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    active === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium flex items-center">
                                    {item.name}
                                    {(() => {
                                        try {
                                            const latest = localStorage.getItem('client_notifications_latest') || '';
                                            const lastSeen = localStorage.getItem('client_notifications_last_seen') || '';
                                            const show = latest && (!lastSeen || new Date(latest).getTime() > new Date(lastSeen).getTime());
                                            return show ? <span className="ml-2 inline-block h-2 w-2 bg-red-500 rounded-full" aria-label="new" /> : null;
                                        } catch { return null; }
                                    })()}
                                </span>
                            </Link>
                        ) : null
                    ))}
                </nav>
            </div>
        </div>
    );
}



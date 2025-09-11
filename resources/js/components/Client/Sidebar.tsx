import { Link } from '@inertiajs/react';

interface Client {
    id: number;
    full_name: string;
    email: string;
}

interface ClientSidebarProps {
    client: Client;
    active: 'profile' | 'appointments' | 'appointment_list' | 'notifications' | 'settings';
    onSelect: (id: 'profile' | 'appointments' | 'appointment_list' | 'notifications' | 'settings') => void;
}

export default function ClientSidebar({ client, active, onSelect }: ClientSidebarProps) {
    const items: Array<{ id: 'profile' | 'appointments' | 'appointment_list' | 'notifications' | 'settings'; name: string; icon: string }> = [
        { id: 'profile', name: 'Dashboard', icon: '🏠' },
        { id: 'appointments', name: 'Appoint Now', icon: '📅' },
        { id: 'appointment_list', name: 'Appointment List', icon: '📋' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
        { id: 'settings', name: 'Settings', icon: '⚙️' },
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
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        ) : (
                            <button
                                key={item.id}
                                onClick={() => onSelect(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                    active === item.id
                                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <span className="font-medium">{item.name}</span>
                            </button>
                        )
                    ))}
                </nav>

                {/* Quick Actions (copied) */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
                    <div className="space-y-2">
                        <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            📝 Edit Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            🔒 Change Password
                        </button>
                        <button className="w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            📅 Book Appointment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}



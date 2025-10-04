import { Link } from '@inertiajs/react';

interface StaffSidebarProps {
    active?: 'dashboard' | 'appointments' | 'schedule' | 'appointment-request' | 'notifications' | 'reports' | 'information';
}

export default function StaffSidebar({ active }: StaffSidebarProps) {
    const items = [
        { id: 'dashboard', name: 'Dashboard', href: '/staff/dashboard', icon: '📊' },
        { id: 'appointments', name: 'Appointment Calendar', href: '/staff/appointments', icon: '🗓️' },
        { id: 'appointment-request', name: 'Appointment Request', href: '/staff/appointment-request', icon: '📋' },
        { id: 'schedule', name: 'Schedule Settings', href: '/staff/schedule', icon: '⚙️' },
        { id: 'notifications', name: 'Notifications', href: '/staff/notifications', icon: '🔔' },
        { id: 'information', name: 'Information', href: '/staff/information', icon: 'ℹ️' },
        { id: 'reports', name: 'Reports', href: '/staff/reports', icon: '📄' },
    ] as const;

    const latestIso = (() => { try { return localStorage.getItem('staff_notifications_latest') || ''; } catch { return ''; } })();
    const lastSeenIso = (() => { try { return localStorage.getItem('staff_notifications_last_seen') || ''; } catch { return ''; } })();
    const showDot = (() => {
        if (!latestIso) return false;
        if (!lastSeenIso) return true;
        return new Date(latestIso).getTime() > new Date(lastSeenIso).getTime();
    })();

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen">
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Staff Panel</h2>
                            <p className="text-sm text-gray-600">Supervisor</p>
                        </div>
                    </div>
                </div>

                <nav className="space-y-2">
                    {items.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                active === item.id
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium flex items-center">
                                {item.name}
                                {item.id === 'notifications' && showDot && (
                                    <span className="ml-2 inline-block h-2 w-2 bg-red-500 rounded-full" aria-label="new" />
                                )}
                            </span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}



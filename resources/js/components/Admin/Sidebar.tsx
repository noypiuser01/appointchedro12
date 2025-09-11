import { Link } from '@inertiajs/react';

interface Admin {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface SidebarProps {
    admin: Admin;
    currentPage?: string;
}

export default function Sidebar({ admin, currentPage = 'overview' }: SidebarProps) {
    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: '📊', href: '/admin/dashboard' },
        { id: 'supervisors', name: 'Manage Supervisors', icon: '👨‍💼', href: '/admin/manage-supervisors' },
        { id: 'clients', name: 'Monitor Clients', icon: '👥', href: '/admin/monitor-clients' },
    ];

    return (
        <div className="w-64 bg-white shadow-lg min-h-screen">
            <div className="p-6">
                {/* Welcome Section */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                            <p className="text-sm text-gray-600">{admin.name}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                currentPage === item.id
                                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}

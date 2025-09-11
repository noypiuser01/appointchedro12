import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import ClientHeader from '@/components/Client/Header';
import ClientFooter from '@/components/Client/Footer';
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

interface Props {
    client: Client;
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
}

export default function Dashboard({ client, supervisorsTechnical = [], supervisorsAdministrator = [] }: Props) {
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

    const sidebarItems = [
        { id: 'profile', name: 'Profile Information', icon: '👤' },
        { id: 'appointments', name: 'My Appointments', icon: '📅' },
        { id: 'notifications', name: 'Notifications', icon: '🔔' },
        { id: 'settings', name: 'Settings', icon: '⚙️' },
    ];

    return (
        <>
            <ClientHeader title="Client Dashboard" />
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    {/* Sidebar */}
                    <ClientSidebar
                        client={client}
                        active={activeSection as 'profile' | 'appointments' | 'appointment_list' | 'notifications' | 'settings'}
                        onSelect={(id) => setActiveSection(id)}
                    />

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {activeSection === 'profile' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900">Welcome to your Dashboard</h1>
                                    <p className="text-gray-600 mt-2">Use the sidebar to manage appointments and settings.</p>
                                </div>
                            </div>
                        )}

                        {activeSection === 'appointments' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointments moved</h1>
                                    <p className="text-gray-600">Please go to the Appointments page.</p>
                                    <div className="mt-6">
                                        <a href="/client/appointments" className="inline-flex items-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700">Go to Appointments</a>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeSection === 'notifications' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-lg p-6 text-center">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Notifications</h1>
                                    <p className="text-gray-600">No notifications to show.</p>
                                </div>
                            </div>
                        )}

                        {activeSection === 'settings' && (
                            <div className="space-y-6">
                                <div className="bg-white rounded-lg shadow-lg p-6">
                                    <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
                                    <div className="space-y-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Settings</h3>
                                            <p className="text-sm text-gray-600 mb-4">Manage your personal information and preferences.</p>
                                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                                                Edit Profile
                                            </button>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                                            <p className="text-sm text-gray-600 mb-4">Update your password and security preferences.</p>
                                            <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                                                Change Password
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ClientFooter />
        </>
    );
}
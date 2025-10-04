import { Link } from '@inertiajs/react';
import { useState } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';

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

interface AppointProps {
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
    clientAuthenticated?: boolean;
}

export default function Appoint({ supervisorsTechnical = [], supervisorsAdministrator = [], clientAuthenticated = false }: AppointProps) {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
    const [adminSearchTerm, setAdminSearchTerm] = useState('');
    const [technicalSearchTerm, setTechnicalSearchTerm] = useState('');

    // Check if staff is available (8am-5pm, Monday-Friday only)
    const isStaffAvailable = () => {
        const now = new Date();
        const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Not available on weekends (Saturday = 6, Sunday = 0)
        if (currentDay === 0 || currentDay === 6) return false;
        
        // Available from 8:00 AM to 5:00 PM (exactly)
        if (currentHour < 8) return false; // Before 8 AM
        if (currentHour > 17) return false; // After 5 PM
        if (currentHour === 17 && currentMinute > 0) return false; // After 5:00 PM
        
        return true;
    };

    // Filter supervisors based on search terms
    const filteredAdministrators = supervisorsAdministrator.filter(supervisor =>
        supervisor.full_name.toLowerCase().includes(adminSearchTerm.toLowerCase()) ||
        supervisor.email.toLowerCase().includes(adminSearchTerm.toLowerCase())
    );

    const filteredTechnical = supervisorsTechnical.filter(supervisor =>
        supervisor.full_name.toLowerCase().includes(technicalSearchTerm.toLowerCase()) ||
        supervisor.email.toLowerCase().includes(technicalSearchTerm.toLowerCase())
    );

    const handleViewClick = (supervisor: Supervisor) => {
        if (clientAuthenticated) {
            // If authenticated, redirect to dashboard
            window.location.href = '/client/dashboard';
        } else {
            // If not authenticated, show login modal
            setSelectedSupervisor(supervisor);
            setShowLoginModal(true);
        }
    };

    return (
        <>
            <WelcomeHeader title="Appoint" />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Choose Appointment Type
                        </h1>
                        <p className="text-gray-600">
                            Select your appointment category
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Administrator List (Left) */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Administrative</h3>
                                </div>
                                <input
                                    value={adminSearchTerm}
                                    onChange={(e) => setAdminSearchTerm(e.target.value)}
                                    placeholder="Search administrators..."
                                    className="w-56 md:w-72 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                />
                            </div>
                            {filteredAdministrators.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500">No administrator appointments available</div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredAdministrators.map((sup) => (
                                        <li key={sup.id} className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                                            <span className="text-emerald-700 text-base font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5">
                                                            {isStaffAvailable() ? (
                                                                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            ) : (
                                                                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-medium text-gray-900">{sup.full_name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {sup.appointments_count || 0} upcoming appointments
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Department: {sup.department}
                                                        </div>
                                                        {sup.jobs && sup.jobs.trim() !== '' && (
                                                            <div className="mt-1 text-sm text-gray-500">
                                                                <span className="font-medium">Jobs:</span> {sup.jobs}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleViewClick(sup)}
                                                    className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
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
                        <div className="bg-white rounded-lg border-2 border-gray-200 p-8 min-h-[500px]">
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900">Technical</h3>
                                </div>
                                <input
                                    value={technicalSearchTerm}
                                    onChange={(e) => setTechnicalSearchTerm(e.target.value)}
                                    placeholder="Search technical..."
                                    className="w-56 md:w-72 border border-gray-300 rounded-md px-4 py-2 text-sm"
                                />
                            </div>
                            {filteredTechnical.length === 0 ? (
                                <div className="text-center py-8 text-sm text-gray-500">No technical appointments available</div>
                            ) : (
                                <ul className="divide-y divide-gray-200">
                                    {filteredTechnical.map((sup) => (
                                        <li key={sup.id} className="py-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className="relative">
                                                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                                            <span className="text-green-700 text-base font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                        </div>
                                                        <div className="absolute -bottom-0.5 -right-0.5">
                                                            {isStaffAvailable() ? (
                                                                <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                                                            ) : (
                                                                <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-base font-medium text-gray-900">{sup.full_name}</div>
                                                        <div className="text-sm text-gray-500">
                                                            {sup.appointments_count || 0} upcoming appointments
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Department: {sup.department}
                                                        </div>
                                                        {sup.jobs && sup.jobs.trim() !== '' && (
                                                            <div className="mt-1 text-sm text-gray-500">
                                                                <span className="font-medium">Jobs:</span> {sup.jobs}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => handleViewClick(sup)}
                                                    className="inline-flex items-center px-4 py-2 text-sm rounded-md bg-emerald-600 text-white hover:bg-emerald-700"
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

                    {/* Back to Dashboard Button
                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            ← Back to Dashboard
                        </Link>
                    </div> */}
                </div>
            </div>

            {/* Login Required Modal */}
            {showLoginModal && selectedSupervisor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowLoginModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Login Required</h3>
                        </div>
                        <div className="p-6">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <h4 className="text-lg font-medium text-gray-900 mb-2">Login Required</h4>
                                 <p className="text-gray-600 mb-4">
                                     You need to login to view details and book appointments with <strong>{selectedSupervisor.full_name}</strong>.
                                 </p>
                            </div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end space-x-3">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                            >
                                Cancel
                            </button>
                            <Link
                                href="/client/login"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                            >
                                Login Now
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

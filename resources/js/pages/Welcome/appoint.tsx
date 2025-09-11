import { Link } from '@inertiajs/react';
import { useState } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    role: string;
    status: string;
}

interface AppointProps {
    supervisorsTechnical?: Supervisor[];
    supervisorsAdministrator?: Supervisor[];
    clientAuthenticated?: boolean;
}

export default function Appoint({ supervisorsTechnical = [], supervisorsAdministrator = [], clientAuthenticated = false }: AppointProps) {
    const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);

    const toggleAccordion = (type: string) => {
        setExpandedAccordion(expandedAccordion === type ? null : type);
    };

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
                <div className="max-w-2xl mx-auto px-4">
                    {/* Simple Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Choose Appointment Type
                        </h1>
                        <p className="text-gray-600">
                            Select your appointment category
                        </p>
                    </div>

                    {/* Accordion Options */}
                    <div className="space-y-4">
                        {/* Administrator Accordion */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => toggleAccordion('administrator')}
                                className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">Administrator</h3>
                                        <p className="text-sm text-gray-600">Administrative appointments and meetings</p>
                                    </div>
                                    <svg 
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                            expandedAccordion === 'administrator' ? 'rotate-180' : ''
                                        }`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            {/* Administrator Content */}
                            {expandedAccordion === 'administrator' && (
                                <div className="border-t border-gray-200 p-6">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">List of Administrator</h4>
                                    {supervisorsAdministrator.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-sm">No administrator appointments available</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {supervisorsAdministrator.map((sup) => (
                                                <li key={sup.id} className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                <span className="text-blue-700 text-sm font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{sup.full_name}</div>
                                                                <div className="text-xs text-gray-500">{sup.email}</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewClick(sup)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Technical Accordion */}
                        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
                            <button
                                onClick={() => toggleAccordion('technical')}
                                className="w-full p-6 hover:bg-gray-50 transition-colors text-left"
                            >
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900">Technical</h3>
                                        <p className="text-sm text-gray-600">Technical consultations and support</p>
                                    </div>
                                    <svg 
                                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                                            expandedAccordion === 'technical' ? 'rotate-180' : ''
                                        }`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </button>
                            
                            {/* Technical Content */}
                            {expandedAccordion === 'technical' && (
                                <div className="border-t border-gray-200 p-6">
                                    <h4 className="text-md font-semibold text-gray-900 mb-4">List of Technical</h4>
                                    {supervisorsTechnical.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                </svg>
                                            </div>
                                            <p className="text-gray-500 text-sm">No technical appointments available</p>
                                        </div>
                                    ) : (
                                        <ul className="divide-y divide-gray-200">
                                            {supervisorsTechnical.map((sup) => (
                                                <li key={sup.id} className="py-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                                <span className="text-green-700 text-sm font-semibold">{sup.full_name.charAt(0).toUpperCase()}</span>
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium text-gray-900">{sup.full_name}</div>
                                                                <div className="text-xs text-gray-500">{sup.email}</div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleViewClick(sup)}
                                                            className="inline-flex items-center px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
                                                        >
                                                            View Details
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to Home Button */}
                    <div className="text-center mt-8">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
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
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <h5 className="font-medium text-gray-900 mb-2">Staff Information:</h5>
                                    <p className="text-sm text-gray-600">
                                        <strong>Name:</strong> {selectedSupervisor.full_name}<br />
                                        <strong>Department:</strong> {selectedSupervisor.department}<br />
                                        <strong>Email:</strong> {selectedSupervisor.email}
                                    </p>
                                </div>
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

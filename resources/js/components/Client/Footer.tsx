import { Link } from '@inertiajs/react';

export default function ClientFooter() {
    return (
        <footer className="text-white" style={{ backgroundColor: '#2563eb' }}>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-2">
                            <img
                                src="/images/logo.png"
                                alt="AppointChed Logo"
                                className="h-6 w-auto"
                            />
                            <div>
                                <div className="text-sm font-bold">AppointChed</div>
                                <div className="text-xs text-blue-200">CHED Region XII</div>
                            </div>
                        </div>
                        <p className="text-blue-200 text-xs leading-relaxed">
                            Client portal for appointment management system.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/client/dashboard" className="text-blue-200 hover:text-white text-xs transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link href="/client/appointments" className="text-blue-200 hover:text-white text-xs transition-colors">
                                    My Appointments
                                </Link>
                            </li>
                            <li>
                                <Link href="/client/profile" className="text-blue-200 hover:text-white text-xs transition-colors">
                                    Profile Settings
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-1 md:col-span-1">
                        <h3 className="text-sm font-semibold mb-2">Support</h3>
                        <div className="space-y-1 text-xs text-blue-200">
                            <p>Email: support@chedregion12.gov.ph</p>
                            <p>Phone: (083) 228-8826</p>
                            <p>Hours: Mon-Fri 8AM-5PM</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-blue-600 mt-4 pt-3">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-xs text-blue-200">
                            © {new Date().getFullYear()} CHED Region XII. All rights reserved.
                        </div>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <Link href="/privacy" className="text-xs text-blue-200 hover:text-white transition-colors">Privacy</Link>
                            <Link href="/terms" className="text-xs text-blue-200 hover:text-white transition-colors">Terms</Link>
                            <Link href="/help" className="text-xs text-blue-200 hover:text-white transition-colors">Help</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

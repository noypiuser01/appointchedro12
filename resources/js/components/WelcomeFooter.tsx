import { Link } from '@inertiajs/react';

export default function WelcomeFooter() {
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
                                <div className="text-xs text-gray-300">CHED Region XII</div>
                            </div>
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed">
                            Appointment management system for CHED Region XII.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="/" className="text-gray-300 hover:text-white text-xs transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-300 hover:text-white text-xs transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/client" className="text-gray-300 hover:text-white text-xs transition-colors">
                                    Client
                                </Link>
                            </li>
                            <li>
                                <Link href="/supervisor" className="text-gray-300 hover:text-white text-xs transition-colors">
                                    Supervisor
                                </Link>
                            </li>
                            <li>
                                <Link href="/admin" className="text-gray-300 hover:text-white text-xs transition-colors">
                                    Admin
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-sm font-semibold mb-2">Contact</h3>
                        <div className="space-y-1 text-xs text-gray-300">
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Region XII, PH</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+63 XXX XXX XXXX</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@appointched.gov.ph</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 mt-4 pt-3">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="text-xs text-gray-400">
                            © {new Date().getFullYear()} CHED Region XII. All rights reserved.
                        </div>
                        <div className="flex space-x-4 mt-2 md:mt-0">
                            <Link href="/privacy" className="text-xs text-gray-400 hover:text-white transition-colors">
                                Privacy
                            </Link>
                            <Link href="/terms" className="text-xs text-gray-400 hover:text-white transition-colors">
                                Terms
                            </Link>
                            <Link href="/help" className="text-xs text-gray-400 hover:text-white transition-colors">
                                Help
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

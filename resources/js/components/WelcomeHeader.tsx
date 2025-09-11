import { Head, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    Home, 
    User, 
    Shield, 
    Settings, 
    UserPlus, 
    Menu, 
    X,
    ChevronDown
} from 'lucide-react';

interface WelcomeHeaderProps {
    title?: string;
}

export default function WelcomeHeader({ title = "AppointChed" }: WelcomeHeaderProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);

    // Handle scroll effect for header
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (isMobileMenuOpen && !(event.target as Element)?.closest('.mobile-menu')) {
                setIsMobileMenuOpen(false);
            }
            if (isLoginDropdownOpen && !(event.target as Element)?.closest('.login-dropdown')) {
                setIsLoginDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isMobileMenuOpen, isLoginDropdownOpen]);

    const navigationItems = [
        {
            name: 'Home',
            href: '/',
            icon: Home,
            description: 'Return to homepage'
        },
        {
            name: 'Book Appointment',
            href: '/appoint',
            icon: User,
            description: 'Schedule your appointment'
        }
    ];

    const loginItems = [
        {
            name: 'Client Portal',
            href: '/client/login',
            icon: User,
            description: 'Access your appointments',
            color: 'text-blue-600'
        },
        {
            name: 'Staff Portal',
            href: '/staff/login',
            icon: Shield,
            description: 'Supervisor access',
            color: 'text-green-600'
        },
        {
            name: 'Admin Portal',
            href: '/admin/login',
            icon: Settings,
            description: 'Administrative access',
            color: 'text-purple-600'
        }
    ];

    return (
        <>
            <Head title={`${title} - Commission on Higher Education Region XII`}>
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="AppointChed - Commission on Higher Education Region XII Appointment System" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            
            <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled 
                    ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
                    : 'bg-white/80 backdrop-blur-sm'
            }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo/Brand Section */}
                        <Link 
                            href="/" 
                            className="flex items-center space-x-3 group transition-transform duration-200 hover:scale-105"
                        >
                            <div className="relative">
                                <img 
                                    src="/images/logo.png" 
                                    alt="AppointChed Logo" 
                                    className="h-10 w-10 rounded-xl object-cover shadow-lg group-hover:shadow-xl transition-shadow duration-300"
                                />
                            </div>
                            <div className="hidden sm:block">
                                <div className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    AppointChed
                                </div>
                                <div className="text-xs text-gray-600 -mt-1">
                                    CHED Region XII
                                </div>
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <nav className="hidden lg:flex items-center space-x-1">
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="group relative flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200"
                                    >
                                        <IconComponent className="w-4 h-4" />
                                        <span className="font-medium">{item.name}</span>
                                        
                                        {/* Tooltip */}
                                        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                                            {item.description}
                                        </div>
                                    </Link>
                                );
                            })}

                            {/* Login Dropdown */}
                            <div className="relative login-dropdown">
                                <button
                                    onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200 font-medium"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Login</span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                                        isLoginDropdownOpen ? 'rotate-180' : ''
                                    }`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isLoginDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-5 duration-200">
                                        {loginItems.map((item) => {
                                            const IconComponent = item.icon;
                                            return (
                                                <Link
                                                    key={item.name}
                                                    href={item.href}
                                                    className="flex items-start space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 group"
                                                    onClick={() => setIsLoginDropdownOpen(false)}
                                                >
                                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                                                        <IconComponent className={`w-5 h-5 ${item.color}`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-medium text-gray-900 group-hover:text-blue-600">
                                                            {item.name}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {item.description}
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Register Button */}
                            <Link
                                href="/client/register"
                                className="group relative overflow-hidden flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 ml-4"
                            >
                                <UserPlus className="w-4 h-4" />
                                <span>Register</span>
                            </Link>
                        </nav>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden p-2 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {/* Mobile Navigation Menu */}
                    {isMobileMenuOpen && (
                        <div className="lg:hidden mobile-menu animate-in slide-in-from-top-5 duration-200">
                            <div className="border-t border-gray-100 py-4 space-y-2">
                                {/* Navigation Items */}
                                {navigationItems.map((item) => {
                                    const IconComponent = item.icon;
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <IconComponent className="w-5 h-5" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    );
                                })}

                                {/* Login Section */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <div className="px-4 py-2">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-2">Login Portals</h3>
                                    </div>
                                    {loginItems.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 transition-all duration-200"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                            >
                                                <IconComponent className={`w-5 h-5 ${item.color}`} />
                                                <div>
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-gray-600">{item.description}</div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Register Button Mobile */}
                                <div className="border-t border-gray-100 pt-4 mt-4">
                                    <Link
                                        href="/client/register"
                                        className="flex items-center justify-center space-x-2 mx-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <UserPlus className="w-5 h-5" />
                                        <span>Create Account</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </header>
            
            {/* Spacer to prevent content from hiding behind fixed header */}
            <div className="h-16"></div>
        </>
    );
}
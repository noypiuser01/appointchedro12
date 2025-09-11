import { useState, useEffect } from 'react';
import { Calendar, Bell, Shield, ArrowRight, Check } from 'lucide-react';
import WelcomeHeader from '@/components/WelcomeHeader';

export default function Welcome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    // Enhanced carousel data with better icons and content
    const carouselItems = [
        {
            id: 1,
            title: "Effortless Scheduling",
            description: "Schedule appointments in seconds with our intuitive interface",
            icon: Calendar,
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            title: "Notifications",
            description: "Stay informed with real-time updates and reminders",
            icon: Bell,
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            title: "Enterprise Security",
            description: "Bank-level encryption protects your sensitive data",
            icon: Shield,
            color: "from-emerald-500 to-teal-500"
        }
    ];


    // Auto-rotate carousel with pause on hover
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % carouselItems.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [carouselItems.length]);

    // Entrance animation
    useEffect(() => {
        setIsVisible(true);
    }, []);

    const handleBookAppointment = () => {
        // Simulate navigation - replace with actual routing
        console.log('Navigating to /appoint');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
            <WelcomeHeader title="AppointChed" />

            <main className="relative">
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Left Side - Hero Content */}
                            <div className={`space-y-8 transform transition-all duration-1000 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}>
                                <div className="space-y-6">
                                    <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full text-blue-700 text-sm font-medium">
                                        <Check className="w-4 h-4 mr-2" />
                                        Trusted by CHED Region XII
                                    </div>
                                    
                                    <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                        AppointChed
                                    </h1>
                                    
                                    <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                                        Experience the future of appointment scheduling with our intelligent platform designed for CHED Region XII's administrative excellence.
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={handleBookAppointment}
                                        className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/25 hover:scale-105"
                                    >
                                        <span className="relative z-10 flex items-center">
                                            Book Appointment
                                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </button>
                                    
                                    <button className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold text-lg hover:border-blue-300 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50">
                                        Learn More
                                    </button>
                                </div>

                            </div>

                            {/* Right Side - Enhanced Carousel */}
                            <div className={`relative transform transition-all duration-1000 delay-300 ${
                                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                            }`}>
                                <div className="relative">
                                    {/* Background decoration */}
                                    <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-3xl transform rotate-6 opacity-60"></div>
                                    <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl transform -rotate-6 opacity-60"></div>
                                    
                                    {/* Main carousel container */}
                                    <div className="relative bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 backdrop-blur-sm">
                                        <div className="text-center mb-8">
                                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Why Choose AppointChed?</h2>
                                            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mx-auto"></div>
                                        </div>

                                        {/* Carousel Content */}
                                        <div className="relative h-64 overflow-hidden rounded-2xl">
                                            {carouselItems.map((item, index) => {
                                                const IconComponent = item.icon;
                                                return (
                                                    <div
                                                        key={item.id}
                                                        className={`absolute inset-0 transition-all duration-700 transform ${
                                                            index === currentSlide 
                                                                ? 'translate-x-0 opacity-100 scale-100' 
                                                                : index < currentSlide 
                                                                    ? '-translate-x-full opacity-0 scale-95'
                                                                    : 'translate-x-full opacity-0 scale-95'
                                                        }`}
                                                    >
                                                        <div className="h-full flex flex-col justify-center items-center text-center p-6">
                                                            <div className={`w-20 h-20 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-transform duration-300 hover:scale-110`}>
                                                                <IconComponent className="w-10 h-10 text-white" />
                                                            </div>
                                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                                {item.title}
                                                            </h3>
                                                            <p className="text-gray-600 text-lg leading-relaxed max-w-sm">
                                                                {item.description}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Enhanced Carousel Indicators */}
                                        <div className="flex justify-center items-center space-x-3 mt-8">
                                            {carouselItems.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentSlide(index)}
                                                    className={`transition-all duration-300 ${
                                                        index === currentSlide 
                                                            ? 'w-8 h-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full' 
                                                            : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 rounded-full'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-20 bg-white/50 backdrop-blur-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Modern Workflows</h2>
                            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                Streamline your appointment management with features designed for efficiency and ease of use.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {carouselItems.map((feature, index) => {
                                const IconComponent = feature.icon;
                                return (
                                    <div key={feature.id} className="group relative p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                                        <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                            <IconComponent className="w-8 h-8 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                                        <p className="text-gray-600">{feature.description}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
                    </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">AppointChed</span>
                        </div>
                        <p className="text-gray-400">© 2025 AppointChed - CHED Region XII. All rights reserved.</p>
                    </div>
                </div>
            </footer>
            </div>
    );
}
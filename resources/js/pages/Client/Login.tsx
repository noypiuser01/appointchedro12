import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import WelcomeHeader from '@/components/WelcomeHeader';
import { Calendar, Eye, EyeOff, Mail, Lock, UserPlus, ArrowRight } from 'lucide-react';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/client/login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <>
            <Head title="Client Login - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="AppointChed - Commission on Higher Education Region XII Appointment System" />
            </Head>
            <WelcomeHeader title="Client Login" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-sm mx-auto">
                    <div className={`transform transition-all duration-1000 ${
                        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                        {/* Background decorations */}
                        <div className="relative">
                            <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl transform rotate-6 opacity-60"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl transform -rotate-6 opacity-60"></div>
                            
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl shadow-emerald-500/10 border border-white/20 overflow-hidden">
                                {/* Header with Logo */}
                                <div className="px-8 py-8 bg-gradient-to-r from-emerald-600 to-teal-600 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="relative flex items-center space-x-4">
                                        <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <img
                                                src="/images/logo.png"
                                                alt="AppointChed Logo"
                                                className="h-8 w-auto"
                                            />
                                        </div>
                                        <div>
                                            <h1 className="text-2xl font-bold text-white">Welcome Back</h1>
                                            <p className="text-emerald-100 text-sm mt-1 flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                Ready to book your appointment?
                                            </p>
                                        </div>
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full transform translate-x-10 -translate-y-10"></div>
                                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full transform -translate-x-8 translate-y-8"></div>
                                </div>
                                
                                {/* Form Content */}
                                <div className="p-8">
                                    {/* Success/Error Messages */}
                                    {(errors as any).error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start space-x-3 shadow-sm">
                                            <div className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0">
                                                <svg fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="text-sm font-medium">{(errors as any).error}</span>
                                        </div>
                                    )}

                                    <form onSubmit={submit} className="space-y-6">
                                        {/* Email */}
                                        <div className="group">
                                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                                                Email Address
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                </div>
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={data.email}
                                                    onChange={(e) => setData('email', e.target.value)}
                                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                                    placeholder="Enter your email address"
                                                    required
                                                />
                                            </div>
                                            {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
                                        </div>

                                        {/* Password */}
                                        <div className="group">
                                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                                                Password
                                            </label>
                                            <div className="relative">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                    <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                                </div>
                                                <input
                                                    id="password"
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 bg-gray-50 focus:bg-white group-hover:border-gray-300 text-gray-900 placeholder-gray-500 shadow-sm focus:shadow-md"
                                                    placeholder="Enter your password"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={togglePasswordVisibility}
                                                    className="absolute inset-y-0 right-0 pr-4 flex items-center hover:bg-emerald-50 rounded-r-xl transition-all duration-200 group"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors" />
                                                    ) : (
                                                        <Eye className="h-5 w-5 text-gray-400 hover:text-emerald-600 transition-colors" />
                                                    )}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
                                        </div>

                                        {/* Remember Me & Forgot Password */}
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    id="remember_me"
                                                    name="remember_me"
                                                    type="checkbox"
                                                    className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors shadow-sm"
                                                />
                                                <label htmlFor="remember_me" className="ml-3 block text-sm text-gray-700 font-medium">
                                                    Remember me
                                                </label>
                                            </div>
                                            <a 
                                                href="/client/forgot-password" 
                                                className="text-sm text-emerald-600 hover:text-emerald-800 font-medium transition-colors hover:underline"
                                            >
                                                Forgot password?
                                            </a>
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="group relative w-full overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/25 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                                        >
                                            <span className="relative z-10 flex items-center justify-center">
                                                {processing ? (
                                                    <>
                                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Signing in...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-5 h-5 mr-2" />
                                                        Sign In
                                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                                    </>
                                                )}
                                            </span>
                                            <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </button>
                                    </form>

                                    {/* Register Link */}
                                    <div className="mt-8">
                                        <div className="relative">
                                            <div className="absolute inset-0 flex items-center">
                                                <div className="w-full border-t border-gray-200"></div>
                                            </div>
                                            <div className="relative flex justify-center text-sm">
                                                <span className="px-4 bg-white text-gray-500 font-medium">New to AppointChed?</span>
                                            </div>
                                        </div>
                                        <div className="mt-6">
                                            <a 
                                                href="/client/register" 
                                                className="group relative w-full inline-flex items-center justify-center px-6 py-3 border-2 border-emerald-600 rounded-xl text-sm font-semibold text-emerald-600 bg-white hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10"
                                            >
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Create your account
                                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
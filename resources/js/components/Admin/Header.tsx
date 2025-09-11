import { Head, Link } from '@inertiajs/react';

interface AdminHeaderProps {
    title?: string;
}

export default function AdminHeader({ title = "Admin Dashboard" }: AdminHeaderProps) {
    return (
        <>
            <Head title={`${title} - AppointChed | CHED Region XII`}>
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Admin Dashboard - AppointChed Appointment System for Commission on Higher Education Region XII" />
            </Head>
            <header className="shadow-sm border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="w-full">
                    <div className="flex justify-start items-center h-12 pl-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link href="/admin" className="flex items-center space-x-3 text-white">
                                <img
                                    src="/images/logo.png"
                                    alt="AppointChed Logo"
                                    className="h-8 w-auto"
                                />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-blue-100">AppointChed - Admin Portal</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
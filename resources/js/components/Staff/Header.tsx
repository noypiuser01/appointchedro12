import { Head, Link } from '@inertiajs/react';

interface StaffHeaderProps {
    title?: string;
}

export default function StaffHeader({ title = "Staff Portal" }: StaffHeaderProps) {
    return (
        <>
            <Head title={`${title} - AppointChed | CHED Region XII`}>
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Portal - AppointChed Appointment System for Commission on Higher Education Region XII" />
            </Head>
            <header className="shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600">
                <div className="w-full">
                    <div className="flex justify-start items-center h-12 pl-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link href="/staff" className="flex items-center space-x-3 text-white">
                                <img 
                                    src="/images/logo.png" 
                                    alt="AppointChed Logo" 
                                    className="h-8 w-auto"
                                />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-indigo-100">AppointChed</div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}

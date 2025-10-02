import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Admin {
    id: number;
    name: string;
    email: string;
    role: string;
    status: string;
}

interface Supervisor {
    id: number;
    full_name: string;
    email: string;
    department: string;
    jobs?: string;
    role: string;
    status: string;
    created_at: string;
    updated_at: string;
}

interface ManageSupervisorProps {
    admin: Admin;
    supervisors: Supervisor[];
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function ManageSupervisor({ admin, supervisors, flash }: ManageSupervisorProps) {
    const [showSupervisorForm, setShowSupervisorForm] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedSupervisor, setSelectedSupervisor] = useState<Supervisor | null>(null);
    const [supervisorForm, setSupervisorForm] = useState({
        full_name: '',
        email: '',
        password: '',
        department: '',
        jobs: '',
        role: 'users',
        status: 'active'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSupervisorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post('/admin/supervisors', supervisorForm, {
            onSuccess: () => {
                alert('Staff member created successfully!');
                // Reload only the supervisors list so the new record appears immediately
                router.reload({ only: ['supervisors'] });
                setSupervisorForm({
                    full_name: '',
                    email: '',
                    password: '',
                    department: '',
                    jobs: '',
                    role: 'users',
                    status: 'active'
                });
                setShowSupervisorForm(false);
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                alert('Error creating staff member. Please check the form.');
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            }
        });
    };

    const openViewModal = (sup: Supervisor) => {
        setSelectedSupervisor(sup);
        setShowViewModal(true);
    };

    const openEditModal = (sup: Supervisor) => {
        setSelectedSupervisor(sup);
        setSupervisorForm({
            full_name: sup.full_name,
            email: sup.email,
            password: '',
            department: sup.department,
            jobs: (sup as any).jobs || '',
            role: sup.role,
            status: sup.status,
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedSupervisor) return;
        try {
            setIsSubmitting(true);
            const payload = { ...supervisorForm } as any;
            if (!payload.password) {
                delete payload.password;
            }
            const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '';
            const getCookie = (name: string) => {
                const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
                return v ? decodeURIComponent(v.pop() as string) : '';
            };
            const xsrfToken = getCookie('XSRF-TOKEN');
            const res = await fetch(`/admin/supervisors/${selectedSupervisor.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': csrfToken,
                    'X-XSRF-TOKEN': xsrfToken,
                },
                credentials: 'same-origin',
                body: JSON.stringify(payload),
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || 'Failed to update staff member');
            }
            // Optional: read JSON but do not render it
            // const data = await res.json();
            alert('Staff member updated successfully!');
            setShowEditModal(false);
            router.reload({ only: ['supervisors'] });
        } catch (err: any) {
            console.error('Update error:', err);
            alert('Error updating staff member. Please check the form.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = (sup: Supervisor) => {
        if (!confirm(`Are you sure you want to delete ${sup.full_name}?`)) return;
        setIsDeleting(true);
        router.delete(`/admin/supervisors/${sup.id}`, {
            onSuccess: () => {
                alert('Staff member deleted successfully');
                router.reload({ only: ['supervisors'] });
                setIsDeleting(false);
            },
            onError: (errors) => {
                console.error('Delete error:', errors);
                alert('Failed to delete staff member');
                setIsDeleting(false);
            },
            onFinish: () => setIsDeleting(false),
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLogout = () => {
        // Using Inertia's router for logout
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/admin/logout';
        
        const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (token) {
            const csrfInput = document.createElement('input');
            csrfInput.type = 'hidden';
            csrfInput.name = '_token';
            csrfInput.value = token;
            form.appendChild(csrfInput);
        }
        
        document.body.appendChild(form);
        form.submit();
    };

    const { post } = useForm();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleHeaderLogout = () => {
        post('/admin/logout');
    };

    const sidebarItems = [
        { id: 'overview', name: 'Overview', icon: '📊', href: '/admin/dashboard' },
        { id: 'supervisors', name: 'Manage Staff', icon: '👨‍💼', href: '/admin/manage-supervisors' },
        { id: 'clients', name: 'Monitor Clients', icon: '👥', href: '/admin/monitor-clients' },
    ];

    return (
        <>
            <Head title="Manage Staff - Commission on Higher Education Region XII">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Manage Staff - Commission on Higher Education Region XII" />
            </Head>
            
            {/* Header with Account Dropdown */}
            <header className="shadow-sm bg-gradient-to-r from-blue-600 to-cyan-600">
                <div className="w-full">
                    <div className="flex justify-between items-center h-12 pl-4 pr-4">
                        {/* Logo/Brand */}
                        <div className="flex items-center">
                            <Link href="/" className="flex items-center space-x-3 text-white">
                                <img 
                                    src="/images/logo.png" 
                                    alt="AppointChed Logo" 
                                    className="h-8 w-auto"
                                />
                                <div>
                                    <div className="text-sm font-bold text-white">Commission on Higher Education - Region XII</div>
                                    <div className="text-xs text-blue-100">AppointChed Admin</div>
                                </div>
                            </Link>
                        </div>

                        {/* Account Dropdown */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowDropdown(!showDropdown)}
                                className="flex items-center space-x-2 text-white hover:text-blue-200 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{admin.name}</span>
                                <svg className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {showDropdown && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                    <Link
                                        href="/admin/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        onClick={() => setShowDropdown(false)}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
                                            </svg>
                                            <span>Dashboard</span>
                                        </div>
                                    </Link>
                                    <div className="px-4 py-1 text-xs text-gray-500">{admin.role.replace('_', ' ').toUpperCase()}</div>
                                    <div className="border-t border-gray-100"></div>
                                    <button
                                        onClick={handleHeaderLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            <span>Logout</span>
                                        </div>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>
            
            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    {/* Sidebar */}
                    <div className="w-64 bg-white shadow-lg min-h-screen">
                        <div className="p-6">
                            {/* Welcome Section */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
                                        <p className="text-sm text-gray-600">{admin.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation Menu */}
                            <nav className="space-y-2">
                                {sidebarItems.map((item) => (
                                    item.href ? (
                                    <Link
                                        key={item.id}
                                        href={item.href}
                                            className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                                'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span className="text-lg">{item.icon}</span>
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            key={item.id}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                                            item.id === 'supervisors'
                                                ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                        }`}
                                    >
                                        <span className="text-lg">{item.icon}</span>
                                        <span className="font-medium">{item.name}</span>
                                        </button>
                                    )
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 p-8">
                        {/* Navigation Breadcrumb */}
                        <div className="mb-6">
                            <nav className="flex" aria-label="Breadcrumb">
                                <ol className="flex items-center space-x-4">
                                    <li>
                                        <Link href="/admin/dashboard" className="text-gray-400 hover:text-gray-500">
                                            <svg className="flex-shrink-0 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                            <span className="sr-only">Dashboard</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <div className="flex items-center">
                                            <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="ml-4 text-sm font-medium text-gray-500">Manage Staff</span>
                                        </div>
                                    </li>
                                </ol>
                            </nav>
                        </div>
                        
                        <div className="space-y-6">
                        {/* Success/Error Messages */}
                        {flash?.success && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{flash.success}</span>
                            </div>
                        )}
                        
                        {flash?.error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                <span className="block sm:inline">{flash.error}</span>
                            </div>
                        )}

                        {/* Add New Staff Button - Outside Container */}
                        <div className="flex justify-between items-center relative">
                            <h1 className="text-2xl font-bold text-gray-900">Manage Staff</h1>
                            <div className="relative">
                                <button 
                                    onClick={() => setShowSupervisorForm(true)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Add New Staff
                                </button>
                                
                                {/* Centered Modal */}
                                {showSupervisorForm && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                                        <div className="absolute inset-0 bg-black/50" onClick={() => setShowSupervisorForm(false)} />
                                        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                                            <div className="p-6">
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-lg font-semibold text-gray-900">Add New Staff</h3>
                                                    <button 
                                                        onClick={() => setShowSupervisorForm(false)}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <form onSubmit={handleSupervisorSubmit} className="space-y-4">
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                                            <input
                                                                type="text"
                                                                value={supervisorForm.full_name}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, full_name: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                placeholder="Enter full name"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                                            <input
                                                                type="email"
                                                                value={supervisorForm.email}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, email: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                placeholder="Enter email address"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                                                            <input
                                                                type="password"
                                                                value={supervisorForm.password}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, password: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                placeholder="Enter password"
                                                                required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                                            <select
                                                                value={supervisorForm.department}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, department: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                required
                                                            >
                                                                <option value="">Select Department</option>
                                                                <option value="Administrator">Administrator</option>
                                                                <option value="Technical">Technical</option>
                                                            </select>
                                                        </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Jobs *</label>
                                                        <input
                                                            type="text"
                                                            value={supervisorForm.jobs}
                                                            onChange={(e) => setSupervisorForm({...supervisorForm, jobs: e.target.value})}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                            placeholder="Enter job title or position"
                                                            required
                                                        />
                                                    </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                                            <select
                                                                value={supervisorForm.role}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, role: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                required
                                                            >
                                                                <option value="users">Staff</option>
                                                                <option value="admin">Admin</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                                            <select
                                                                value={supervisorForm.status}
                                                                onChange={(e) => setSupervisorForm({...supervisorForm, status: e.target.value})}
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                                                                required
                                                            >
                                                                <option value="active">Active</option>
                                                                <option value="inactive">Inactive</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="flex space-x-3 pt-4">
                                                        <button
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                            className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
                                                        >
                                                            {isSubmitting ? (
                                                                <span className="flex items-center justify-center">
                                                                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" fill="none" viewBox="0 0 24 24">
                                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                    </svg>
                                                                    Creating...
                                                                </span>
                                                            ) : (
                                                                'Create Supervisor'
                                                            )}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setShowSupervisorForm(false)}
                                                            className="flex-1 bg-gray-300 text-gray-700 py-2 px-3 rounded-md hover:bg-gray-400 transition-colors font-medium text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="bg-white rounded-lg shadow-lg p-6 relative">
                                
                                {/* Staff Management Table */}
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {supervisors.length === 0 ? (
                                                <tr>
                                                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <h3 className="mt-2 text-sm font-medium text-gray-900">No staff members</h3>
                                                        <p className="mt-1 text-sm text-gray-500">No staff members have been added yet.</p>
                                                    </td>
                                                </tr>
                                            ) : (
                                                supervisors.map((supervisor) => (
                                                    <tr key={supervisor.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 flex-shrink-0">
                                                                    <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                                                        <span className="text-sm font-medium text-purple-600">
                                                                            {supervisor.full_name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className="ml-4">
                                                                    <div className="text-sm font-medium text-gray-900">{supervisor.full_name}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{supervisor.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{supervisor.department}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{supervisor.jobs || '-'}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                supervisor.role === 'admin' 
                                                                    ? 'bg-red-100 text-red-800' 
                                                                    : 'bg-blue-100 text-blue-800'
                                                            }`}>
                                                                {supervisor.role.charAt(0).toUpperCase() + supervisor.role.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                supervisor.status === 'active' 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {supervisor.status.charAt(0).toUpperCase() + supervisor.status.slice(1)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{formatDate(supervisor.created_at)}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <div className="flex space-x-2 justify-end">
                                                                <button
                                                                    onClick={() => openViewModal(supervisor)}
                                                                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200"
                                                                >
                                                                    View
                                                                </button>
                                                                <button
                                                                    onClick={() => openEditModal(supervisor)}
                                                                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(supervisor)}
                                                                    disabled={isDeleting}
                                                                    className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 disabled:opacity-50"
                                                                >
                                                                    {isDeleting ? 'Deleting...' : 'Delete'}
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* View Modal */}
            {showViewModal && selectedSupervisor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Staff Details</h3>
                        </div>
                        <div className="p-6 space-y-3 text-sm">
                            <div><span className="font-medium">Full Name:</span> {selectedSupervisor.full_name}</div>
                            <div><span className="font-medium">Email:</span> {selectedSupervisor.email}</div>
                            <div><span className="font-medium">Department:</span> {selectedSupervisor.department}</div>
                            <div><span className="font-medium">Jobs:</span> {(selectedSupervisor as any).jobs || '-'}</div>
                            <div><span className="font-medium">Role:</span> {selectedSupervisor.role}</div>
                            <div><span className="font-medium">Status:</span> {selectedSupervisor.status}</div>
                            <div><span className="font-medium">Created:</span> {selectedSupervisor.created_at}</div>
                        </div>
                        <div className="px-6 py-4 border-t flex justify-end">
                            <button onClick={() => setShowViewModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Close</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && selectedSupervisor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setShowEditModal(false)} />
                    <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
                        <div className="px-6 py-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-900">Edit Staff</h3>
                        </div>
                        <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                <input
                                    type="text"
                                    value={supervisorForm.full_name}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, full_name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                <input
                                    type="email"
                                    value={supervisorForm.email}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, email: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password (leave blank to keep)</label>
                                <input
                                    type="password"
                                    value={supervisorForm.password}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, password: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                                <select
                                    value={supervisorForm.department}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, department: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                >
                                    <option value="Administrator">Administrator</option>
                                    <option value="Technical">Technical</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Jobs *</label>
                                <input
                                    type="text"
                                    value={supervisorForm.jobs}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, jobs: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    value={supervisorForm.role}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                >
                                    <option value="users">Staff</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
                                <select
                                    value={supervisorForm.status}
                                    onChange={(e) => setSupervisorForm({ ...supervisorForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-2">
                                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save Changes'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

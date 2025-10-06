import { useEffect, useMemo, useRef, useState } from 'react';
import { Head } from '@inertiajs/react';
import StaffHeader from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

export default function Report() {
    const [from, setFrom] = useState<string>('');
    const [to, setTo] = useState<string>('');
    const [preset, setPreset] = useState<'week' | 'month' | 'custom'>('month');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<{ from: string; to: string; count: number; items: any[] } | null>(null);
    const printRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        // Initialize to current month
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const f = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
        const t = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
        setFrom(f);
        setTo(t);
        setPreset('month');
    }, []);

    useEffect(() => {
        if (!from || !to) return;
        const controller = new AbortController();
        (async () => {
            try {
                setLoading(true);
                const res = await fetch(`/staff/api/reports/approvals?from=${from}&to=${to}`, { credentials: 'same-origin', signal: controller.signal });
                const json = await res.json();
                setData(json);
            } catch (e) {
                if ((e as any).name !== 'AbortError') {
                    console.error(e);
                }
            } finally {
                setLoading(false);
            }
        })();
        return () => controller.abort();
    }, [from, to]);

    const handlePrint = () => {
        const previousTitle = document.title;
        // Temporarily clear the document title to avoid printing it in header
        document.title = '';
        const restoreTitle = () => {
            document.title = previousTitle;
            window.removeEventListener('afterprint', restoreTitle as any);
        };
        window.addEventListener('afterprint', restoreTitle as any);
        window.print();
    };

    const title = useMemo(() => {
        const rangeLabel = preset === 'week' ? 'This Week' : preset === 'month' ? 'This Month' : 'Custom Range';
        return `Approved Appointments Report • ${rangeLabel} (${from || '—'} to ${to || '—'})`;
    }, [from, to]);

    const groupByDay = useMemo(() => {
        const result: Record<string, number> = {};
        if (!data?.items) return result;
        for (const item of data.items) {
            const day = new Date(item.approved_at).toISOString().split('T')[0];
            result[day] = (result[day] || 0) + 1;
        }
        return result;
    }, [data]);

    const applyThisWeek = () => {
        const now = new Date();
        // Treat Monday as start of week to match backend conventions
        const day = now.getDay(); // 0 Sun .. 6 Sat
        const diffToMonday = (day + 6) % 7; // 0 if Monday
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const f = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`;
        const t = `${sunday.getFullYear()}-${String(sunday.getMonth() + 1).padStart(2, '0')}-${String(sunday.getDate()).padStart(2, '0')}`;
        setFrom(f);
        setTo(t);
        setPreset('week');
    };

    const applyThisMonth = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const f = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`;
        const t = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`;
        setFrom(f);
        setTo(t);
        setPreset('month');
    };

    return (
        <>
            <Head title="Reports - Staff">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Staff Reports - AppointChed" />
            </Head>

            <StaffHeader title="Reports" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <StaffSidebar active="reports" />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
                                <p className="text-sm text-gray-600">Who approved clients this month</p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={handlePrint} className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md">Print</button>
                            </div>
                        </div>

                        <div className="bg-white border rounded-lg p-4 mb-6">
                            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Preset</label>
                                    <div className="flex items-center space-x-2">
                                        <button onClick={applyThisWeek} className={`px-3 py-2 rounded-md text-sm border ${preset === 'week' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>This Week</button>
                                        <button onClick={applyThisMonth} className={`px-3 py-2 rounded-md text-sm border ${preset === 'month' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>This Month</button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
                                </div>
                                <div className="text-sm text-gray-500">
                                    {loading ? 'Loading…' : data ? `${data.count} approvals` : '—'}
                                </div>
                            </div>
                        </div>

                        <div ref={printRef} id="print-area" className="bg-white border rounded-lg p-4 print:p-0 print:border-0">
                            <div className="text-center mb-4 print:mb-2">
                                <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                                <p className="text-xs text-gray-500">Generated on {new Date().toLocaleString()}</p>
                            </div>

                            <div className="overflow-x-auto">
                                {preset === 'week' && (
                                    <div className="mb-4 p-3 bg-gray-50 border rounded-md text-sm">
                                        <div className="font-medium text-gray-800 mb-2">Daily Summary</div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                            {Object.keys(groupByDay).sort().map(day => (
                                                <div key={day} className="flex items-center justify-between bg-white border rounded-md px-3 py-2">
                                                    <span className="text-gray-700">{new Date(day).toLocaleDateString()}</span>
                                                    <span className="font-semibold text-gray-900">{groupByDay[day]}</span>
                                                </div>
                                            ))}
                                            {Object.keys(groupByDay).length === 0 && (
                                                <div className="text-gray-500">No approvals this week.</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <table className="min-w-full divide-y divide-gray-200 text-sm">
                                    <thead className="bg-gray-50 print:bg-white">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Approved At</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Client</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Email</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Preferred Date</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Time</th>
                                            <th className="px-3 py-2 text-left font-medium text-gray-700">Approved By</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {data?.items?.length ? (
                                            data.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-3 py-2 text-gray-800">{new Date(item.approved_at).toLocaleString()}</td>
                                                    <td className="px-3 py-2 text-gray-800">{item.client_name}</td>
                                                    <td className="px-3 py-2 text-gray-800">{item.client_email}</td>
                                                    <td className="px-3 py-2 text-gray-800">{new Date(item.preferred_date).toLocaleDateString()}</td>
                                                    <td className="px-3 py-2 text-gray-800">{item.preferred_time} - {item.preferred_end_time}</td>
                                                    <td className="px-3 py-2 text-gray-800">{item.supervisor_name}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={6} className="px-3 py-8 text-center text-gray-500">No approvals found for the selected period.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                {`@media print {
                    body { -webkit-print-color-adjust: exact; }
                    /* Hide everything by default */
                    body * { visibility: hidden !important; }
                    /* Only show the report section */
                    #print-area, #print-area * { visibility: visible !important; }
                    #print-area { position: absolute; left: 0; top: 0; width: 100%; }
                    /* Remove container styles so only inner content prints */
                    #print-area { background: transparent !important; border: 0 !important; padding: 0 !important; box-shadow: none !important; }
                    #print-area .bg-white { background: transparent !important; }
                    #print-area .border { border: 0 !important; }
                    #print-area .p-4, #print-area .px-4, #print-area .py-4 { padding: 0 !important; }
                    #print-area .mb-4 { margin-bottom: 8px !important; }
                    .print\:p-0 { padding: 0 !important; }
                    .print\:border-0 { border: 0 !important; }
                }`}
            </style>
        </>
    );
}

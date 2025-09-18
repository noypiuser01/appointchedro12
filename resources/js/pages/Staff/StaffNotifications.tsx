import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Header from '../../components/Staff/Header';
import StaffSidebar from '../../components/Staff/StaffSidebar';

type StaffNotification = {
    id: number;
    title: string;
    message: string;
    data?: Record<string, unknown> | null;
    appointment_request_id?: number | null;
    read_at?: string | null;
    created_at: string;
};

export default function StaffNotifications() {
    const [items, setItems] = useState<StaffNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasNew, setHasNew] = useState(false);

    const cleanMessage = (message: string, title: string) => {
        let cleaned = message
            .replace(/\s+on\s+\d{4}-\d{2}-\d{2}[^]*?(?=\.$|\shas\sbeen\sapproved\.|\shas\sbeen\srejected\.)/i, '')
            .replace(/\s+for\s+\d{4}-\d{2}-\d{2}[^]*?\./i, '.');
        cleaned = cleaned.replace(/\s{2,}/g, ' ').trim();
        if (/approved/i.test(title)) {
            cleaned = cleaned.replace(/has been approved\.*$/i, 'has been approved.');
        } else if (/rejected/i.test(title)) {
            cleaned = cleaned.replace(/has been rejected\.*$/i, 'has been rejected.');
        }
        return cleaned;
    };

    const getLastSeen = () => {
        try { return localStorage.getItem('staff_notifications_last_seen') || ''; } catch { return ''; }
    };

    const setLastSeen = (iso: string) => {
        try { localStorage.setItem('staff_notifications_last_seen', iso); } catch {}
    };

    const computeHasNew = (list: StaffNotification[]) => {
        const lastSeenIso = getLastSeen();
        if (!lastSeenIso) return list.length > 0;
        const lastSeen = new Date(lastSeenIso).getTime();
        const newest = Math.max(...list.map(n => new Date(n.created_at).getTime()));
        return isFinite(newest) && newest > lastSeen;
    };

    const fetchNotifications = async (silent = false) => {
        try {
            if (!silent) setLoading(true);
            setError(null);
            const res = await fetch('/staff/api/notifications', { credentials: 'same-origin' });
            if (!res.ok) throw new Error('Failed to load notifications');
            const data = await res.json();
            setItems(data);
            const newest = data.length > 0 ? new Date(Math.max(...data.map((n: StaffNotification) => new Date(n.created_at).getTime()))).toISOString() : '';
            if (newest) {
                try { localStorage.setItem('staff_notifications_latest', newest); } catch {}
            }
            setHasNew(computeHasNew(data));
        } catch (e: any) {
            setError(e.message || 'Failed to load notifications');
        } finally {
            if (!silent) setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const id = setInterval(() => fetchNotifications(true), 30000);
        return () => clearInterval(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const markAllSeen = () => {
        setLastSeen(new Date().toISOString());
        setHasNew(false);
    };

    return (
        <>
            <Head title="Notifications">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Notifications - AppointChed" />
            </Head>
            <Header />
            
            <div className="min-h-screen bg-white">
                <div className="flex">
                    <StaffSidebar active="notifications" />

                    <div className="flex-1 p-8">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-medium text-gray-900">Notifications</h1>
                                {hasNew && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                            </div>
                            <div className="flex items-center gap-3">
                                {hasNew && (
                                    <button 
                                        onClick={markAllSeen} 
                                        className="text-sm text-gray-500 hover:text-gray-700"
                                    >
                                        Mark all as seen
                                    </button>
                                )}
                                <button
                                    onClick={() => fetchNotifications()}
                                    className="text-sm text-blue-600 hover:text-blue-700"
                                >
                                    Refresh
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {loading && (
                            <div className="text-sm text-gray-500">Loading...</div>
                        )}

                        {error && (
                            <div className="text-sm text-red-600 mb-4">{error}</div>
                        )}

                        {!loading && items.length === 0 && (
                            <div className="text-center py-16 text-gray-400">
                                <div className="text-sm">No notifications</div>
                            </div>
                        )}

                        {!loading && items.length > 0 && (
                            <div className="space-y-1">
                                {items.map((n) => (
                                    <div key={n.id} className="p-4 hover:bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900 text-sm mb-1">
                                                    {n.title}
                                                </div>
                                                <div className="text-sm text-gray-600 mb-2">
                                                    {cleanMessage(n.message, n.title)}
                                                </div>
                                                {n.data && (n.data as any).date && (
                                                    <div className="text-xs text-gray-500">
                                                        {new Date((n.data as any).date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                                                        {' '}
                                                        {((n.data as any).time || '').toString().slice(0,8)}
                                                        {((n.data as any).end_time || '') && ` - ${((n.data as any).end_time).toString().slice(0,8)}`}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-400 whitespace-nowrap">
                                                {new Date(n.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
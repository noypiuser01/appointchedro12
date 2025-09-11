import { Head } from '@inertiajs/react';
import ClientHeader from '@/components/Client/Header';
import ClientSidebar from '@/components/Client/Sidebar';
import ClientFooter from '@/components/Client/Footer';

interface Client {
    id: number;
    full_name: string;
    email: string;
}

interface Props {
    client: Client;
}

export default function ClientNotifications({ client }: Props) {
    return (
        <>
            <Head title="Client Notifications">
                <link rel="icon" href="/images/logo.png" />
                <meta name="description" content="Client Notifications - AppointChed" />
            </Head>
            <ClientHeader title="Client Notifications" />

            <div className="min-h-screen bg-gray-50">
                <div className="flex">
                    <ClientSidebar
                        client={client}
                        active={'notifications'}
                        onSelect={() => {}}
                    />

                    <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
                        <div className="bg-white rounded-lg shadow p-6 min-h-[200px]" />
                    </div>
                </div>
            </div>

            <ClientFooter />
        </>
    );
}



import SteamOrderPage from './steam-order-page';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Статус заказа',
    ...NO_INDEX_PAGE,
};

async function getSteamOrder(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/order-api/by-id-steam/${id}`,
            { cache: 'no-store' },
        );
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function SteamOrderPageHome({ params }: PageProps) {
    const { id } = await params;
    const initialOrder = await getSteamOrder(id);

    return <SteamOrderPage id={id} initialOrder={initialOrder} />;
}

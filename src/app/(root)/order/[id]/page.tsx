import OrderPage from './order-page';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Статус заказа',
    ...NO_INDEX_PAGE,
};

async function getOrder(id: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/order-api/by-id/${id}`,
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

export default async function OrderPageHome({ params }: PageProps) {
    const { id } = await params;
    const initialOrder = await getOrder(id);

    return <OrderPage id={id} initialOrder={initialOrder} />;
}

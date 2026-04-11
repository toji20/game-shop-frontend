'use client';

import './steam-order.css';
import { SteamOrderStatusBlock } from '@/components/order/steam-order-status';
import { orderApiService, orderService } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function OrderStatusSteamPage() {
    const params = useParams<{ id: string }>();

    const { data: order } = useQuery({
        queryKey: ['steam order', params.id],
        queryFn: () => orderApiService.getByIdSteamOrder(params.id),
        refetchInterval: 3000,
    });

    if (!order) return null;

    return (
        <div className='order-page'>
            <div className='order-page__bg-wrap'>
                <img
                    src={'/steam-bg.png'}
                    alt={'Steam'}
                    className='order-page__bg'
                />
                <div className='order-page__bg-overlay' />
            </div>

            <div className='order-page__grid'>
                <div className='order-page__left'>
                    <div className='order-page__info'>
                        <Link href='/' className='order-page__breadcrumb'>
                            Главная
                        </Link>

                        <h1 className='order-page__title'>Steam</h1>
                    </div>

                    <SteamOrderStatusBlock order={order} />
                </div>
            </div>
        </div>
    );
}

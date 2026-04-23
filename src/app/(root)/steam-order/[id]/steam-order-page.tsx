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
        <div className='steam-order-page'>
            <div className='steam-order-page__bg-wrap'>
                <img
                    src={'/steam-bg.png'}
                    alt={'Steam'}
                    className='.steam-steam-order-page__bg'
                />
                <div className='steam-order-page__bg-overlay' />
            </div>

            <div className='steam-order-page__grid'>
                <div className='steam-order-page__left'>
                    <div className='steam-order-page__info'>
                        <Link href='/' className='steam-order-page__breadcrumb'>
                            Главная
                        </Link>

                        <h1 className='steam-order-page__title'>Steam</h1>
                    </div>

                    <SteamOrderStatusBlock order={order} />
                </div>
            </div>
        </div>
    );
}

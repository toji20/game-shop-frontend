'use client';

import './steam-order.css';
import { SteamOrderStatusBlock } from '@/components/order/steam-order-status';
import { orderApiService } from '@/services/order.service';
import { ISteamOrder } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface SteamOrderPageProps {
    id: string;
    initialOrder: ISteamOrder | null;
}

export default function SteamOrderPage({
    id,
    initialOrder,
}: SteamOrderPageProps) {
    const { data: order } = useQuery({
        queryKey: ['steam order', id],
        queryFn: () => orderApiService.getByIdSteamOrder(id),
        initialData: initialOrder ?? undefined,
        refetchInterval: 3000,
    });

    if (!order) return null;

    return (
        <div className='steam-order-page'>
            <div className='steam-order-page__bg-wrap'>
                <img
                    src='https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/steam-bg.png'
                    alt='Steam'
                    className='steam-order-page__bg steam-order-page__bg--desktop'
                />
                <img
                    src='https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/steam-bg-mob.png'
                    alt='Steam'
                    className='steam-order-page__bg steam-order-page__bg--mobile'
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

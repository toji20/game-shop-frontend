'use client';

import './order.css';
import { OrderStatusBlock } from '@/components/order/order-status';
import { orderApiService, orderService } from '@/services/order.service';
import { IOrder } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';

interface OrderPageProps {
    id: string;
    initialOrder: IOrder | null;
}

export default function OrderPage({ id, initialOrder }: OrderPageProps) {
    const { data: order } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderApiService.getById(id),
        initialData: initialOrder ?? undefined,
        refetchInterval: 3000,
    });

    const item = order?.items?.[0];
    const game = item?.position?.game;

    if (!order || !game) return null;

    return (
        <div className='order-page'>
            <div className='order-page__bg-wrap'>
                <img
                    src={game.bgDesktop || ''}
                    alt={game.name}
                    className='order-page__bg order-page__bg--desktop'
                />
                <img
                    src={game.bgMobile || game.bgDesktop || ''}
                    alt={game.name}
                    className='order-page__bg order-page__bg--mobile'
                />
                <div className='order-page__bg-overlay' />
            </div>

            <div className='order-page__grid'>
                <div className='order-page__left'>
                    <div className='order-page__info'>
                        <Link href='/' className='order-page__breadcrumb'>
                            Главная
                        </Link>

                        <h1 className='order-page__title'>{game.name}</h1>

                        {game.description && (
                            <p className='order-page__desc'>
                                {game.description}
                            </p>
                        )}
                    </div>

                    <OrderStatusBlock
                        order={order}
                        onSendCode={(code) => {
                            orderService.provide2FA(order.id, { code });
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

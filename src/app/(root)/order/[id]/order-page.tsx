'use client';

import { OrderStatusBlock } from '@/components/order/order-status';
import { orderApiService, orderService } from '@/services/order.service';
import { IProvide2FA } from '@/shared/types';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';

export default function OrderPage() {
    const params = useParams<{ id: string }>();

    const { data: order } = useQuery({
        queryKey: ['order', params.id],
        queryFn: () => orderApiService.getById(params.id),
        refetchInterval: 3000,
    });

    if (!order) return null;

    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#000',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <OrderStatusBlock
                order={order}
                onSendCode={(code: string) => {
                    orderService.provide2FA(order.id, { code });
                }}
            />
        </div>
    );
}

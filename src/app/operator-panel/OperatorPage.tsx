'use client';

import { OrderCard } from './opeartor-panel-components/OrderCard';
import { OrderFilters } from './opeartor-panel-components/OrderFilters';
import './opeartor-panel-components/operator.css';
import { useManualOrders } from '@/hooks/queries/useOrder';
import { useOrderSocket } from '@/hooks/queries/useOrderSocket';
import { ManualStatus } from '@/shared/types';
import { useState, useMemo } from 'react';

export default function OperatorPage() {
    useOrderSocket();
    const [activeFilter, setActiveFilter] = useState<ManualStatus | 'ALL'>(
        'PENDING',
    );
    const { orders, isLoadingOrders } = useManualOrders();

    const filtered = useMemo(() => {
        if (!orders) return [];
        if (activeFilter === 'ALL') return orders;
        return orders.filter((o) => o.manualStatus === activeFilter);
    }, [orders, activeFilter]);

    const counts = useMemo(() => {
        if (!orders) return {};
        const result: Partial<Record<ManualStatus | 'ALL', number>> = {
            ALL: orders.length,
        };
        orders.forEach((o) => {
            if (o.manualStatus) {
                result[o.manualStatus as ManualStatus] =
                    (result[o.manualStatus as ManualStatus] ?? 0) + 1;
            }
        });
        return result;
    }, [orders]);

    return (
        <div className='operator'>
            <header className='operator__header'>
                <div>
                    <h1 className='operator__title'>Заказы</h1>
                    <p className='operator__subtitle'>
                        Панель оператора · real-time обновления
                    </p>
                </div>
                <div className='operator__live'>
                    <span className='operator__live-dot' />
                    live
                </div>
            </header>

            <OrderFilters
                active={activeFilter}
                onChange={setActiveFilter}
                counts={counts}
            />

            <div className='operator__list'>
                {isLoadingOrders ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className='order-skeleton' />
                    ))
                ) : filtered.length === 0 ? (
                    <div className='operator__empty'>
                        <span className='operator__empty-icon'>📭</span>
                        <p>Нет заказов</p>
                    </div>
                ) : (
                    filtered.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))
                )}
            </div>
        </div>
    );
}

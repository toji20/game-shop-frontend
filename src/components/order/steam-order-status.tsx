'use client';

import './order-status.css';
import { OrderStep } from './order-step';
import { OrderSuccess } from './order-success';
import { ISteamOrder } from '@/shared/types';
import { OrderStatus, DonateHubStatus } from '@/shared/types/order.interface';
import { useMemo } from 'react';

const STEPS = [
    { title: 'Покупка оформлена', desc: 'Оплата засчитана' },
    { title: 'Формирование заказа', desc: 'Запрос отправлен в Steam' },
    { title: 'Пополнение', desc: 'Средства зачисляются на аккаунт' },
    { title: 'Завершено', desc: 'Баланс пополнен' },
];

const STEP_HEIGHT = 72;

interface Props {
    order: ISteamOrder;
}

export function SteamOrderStatusBlock({ order }: Props) {
    const { progress, progressHeight, isCompleted } = useMemo(() => {
        const isCompleted =
            order.status === 'COMPLETED' || order.donateHubStatus === 'SUCCESS';

        let progress = 1;

        if (order.status === 'PAID') progress = 2;

        if (
            order.donateHubStatus === 'IN_QUEUE' ||
            order.donateHubStatus === 'PROGRESS' ||
            order.donateHubStatus === 'WAIT'
        )
            progress = 3;

        if (isCompleted) progress = 4;

        const progressHeight =
            Math.min(progress - 1, STEPS.length - 1) * STEP_HEIGHT;

        return { progress, progressHeight, isCompleted };
    }, [order]);
    const error = order.donateHubError;

    return (
        <div className='order-status'>
            <div className='order-status__steps'>
                <div
                    className='order-status__progress'
                    style={{ height: `${progressHeight}px` }}
                />
                {STEPS.map((step, i) => (
                    <OrderStep
                        key={i}
                        index={i + 1}
                        progress={progress}
                        title={step.title}
                        desc={step.desc}
                    />
                ))}
            </div>

            {error && (
                <div className='order-status__error'>Ошибка: {error}</div>
            )}

            {isCompleted ? (
                <OrderSuccess />
            ) : (
                <div className='order-status__total'>{order.total} ₽</div>
            )}
        </div>
    );
}

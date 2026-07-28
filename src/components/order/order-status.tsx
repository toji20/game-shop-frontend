'use client';

import { Order2FA } from './order-2fa';
import './order-status.css';
import { OrderStep } from './order-step';
import { OrderSuccess } from './order-success';
import { useOrderProgress } from './use-order-progress';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { IOrder } from '@/shared/types';
import { MailWarning } from 'lucide-react';

const STEPS = [
    { title: 'Покупка оформлена', desc: 'Оплата засчитана' },
    {
        title: 'Формирование заказа',
        desc: 'Заказ формируется и будет передан в доставку',
    },
    { title: 'Доставляем', desc: 'Заказ находится в очереди' },
    { title: 'Завершено', desc: 'Заказ отправлен' },
];

interface Props {
    order: IOrder;
    onSendCode?: (code: string) => void;
}

export function OrderStatusBlock({ order, onSendCode }: Props) {
    const item = order.items?.[0];
    const { progress, progressHeight, isCompleted, need2FA } = useOrderProgress(
        order,
        item,
    );

    const error = item?.donateHubError;

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

            {need2FA && (
                <>
                    <CheckoutWarning
                        icon={MailWarning}
                        title='Внимание:'
                        text='К вам на почту должен отправиться код.'
                        variant='danger'
                    />
                    {onSendCode && <Order2FA onSendCode={onSendCode} />}
                </>
            )}

            {isCompleted ? (
                <OrderSuccess />
            ) : (
                <div className='order-status__total'>
                    {order.total.toLocaleString('ru-RU', {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 2,
                    })}{' '}
                    ₽
                </div>
            )}
        </div>
    );
}

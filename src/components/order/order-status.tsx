'use client';

import './order-status.css';
import { IOrder } from '@/shared/types';
import { useState } from 'react';

interface Props {
    order: IOrder;
    onSendCode?: (code: string) => void;
}

export function OrderStatusBlock({ order, onSendCode }: Props) {
    const [code, setCode] = useState('');

    const getProgress = () => {
        if (order.type === 'AUTO') {
            if (order.status === 'PENDING') return 1;
            if (order.status === 'PAID') return 2;
            if (order.status === 'IN_PROCESS') return 2.5;
            if (order.status === 'COMPLETED') return 4;
        }

        if (order.type === 'MANUAL') {
            if (order.manualStatus === 'PENDING') return 1;
            if (order.manualStatus === 'ASSIGNED') return 2;
            if (order.manualStatus === 'AWAITING_2FA') return 2.5;
            if (order.manualStatus === 'IN_PROGRESS') return 3;
            if (order.manualStatus === 'COMPLETED') return 4;
        }

        return 1;
    };

    const progress = getProgress();

    const need2FA =
        order.type === 'MANUAL' && order.manualStatus === 'AWAITING_2FA';

    return (
        <div className='order-status'>
            <div className='order-status__steps'>
                <Step
                    index={1}
                    progress={progress}
                    title='Покупка оформлена'
                    desc='Оплата засчитана'
                />
                <Step
                    index={2}
                    progress={progress}
                    title='Формирование заказа'
                    desc='Оператор принял заказ'
                />
                <Step
                    index={3}
                    progress={progress}
                    title='Доставляем'
                    desc='Идёт выполнение'
                />
                <Step
                    index={4}
                    progress={progress}
                    title='Завершено'
                    desc='Заказ выполнен'
                />
            </div>

            {/* 2FA */}
            {need2FA && (
                <div className='order-status__2fa'>
                    <p>Введите код подтверждения</p>
                    <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder='123456'
                    />
                    <button onClick={() => onSendCode?.(code)}>
                        Отправить
                    </button>
                </div>
            )}

            {/* Код */}
            {progress >= 4 && (
                <div className='order-status__code'>
                    <p>Ваш код:</p>
                    <div className='order-status__code-box'>
                        {order.items?.[0]?.fields?.code || '—'}
                    </div>
                </div>
            )}

            <div className='order-status__total'>{order.total}₽</div>
        </div>
    );
}

function Step({
    index,
    progress,
    title,
    desc,
}: {
    index: number;
    progress: number;
    title: string;
    desc: string;
}) {
    const isActive = progress >= index;
    const isCurrent = Math.floor(progress) === index;

    return (
        <div className='order-step'>
            <div
                className={`circle 
                ${isActive ? 'active' : ''} 
                ${isCurrent ? 'current' : ''}`}
            >
                {index}
            </div>

            <div>
                <div className='step-title'>{title}</div>
                <div className='step-desc'>{desc}</div>
            </div>
        </div>
    );
}

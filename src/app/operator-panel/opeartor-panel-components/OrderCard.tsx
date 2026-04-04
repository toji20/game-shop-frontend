'use client';

import { DASHBOARD_URL } from '@/config/url.config';
import { useUpdateManualStatus } from '@/hooks/queries/useOrder';
import { IOrder, ManualStatus } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUS_LABELS: Record<ManualStatus, string> = {
    PENDING: 'Ожидает',
    ASSIGNED: 'Назначен',
    AWAITING_2FA: 'Ждёт 2FA',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершён',
    FAILED: 'Ошибка',
};

const STATUS_COLOR: Record<ManualStatus, string> = {
    PENDING: 'badge--yellow',
    ASSIGNED: 'badge--blue',
    AWAITING_2FA: 'badge--purple',
    IN_PROGRESS: 'badge--blue',
    COMPLETED: 'badge--green',
    FAILED: 'badge--red',
};

interface OrderCardProps {
    order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
    const { push } = useRouter();
    const [expanded, setExpanded] = useState(false);
    const { updateStatus, isLoadingUpdate } = useUpdateManualStatus(order.id);

    const manualStatus = order.manualStatus as ManualStatus;

    const handleTakeOrder = async () => {
        await updateStatus({ status: 'IN_PROGRESS' });
        push(DASHBOARD_URL.manualOrder(order.id));
    };

    // Если заказ уже в работе — просто переходим на страницу
    const handleOpenOrder = () => {
        push(DASHBOARD_URL.manualOrder(order.id));
    };

    const createdAt = new Date(order.createdAt).toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className={`order-card ${expanded ? 'order-card--expanded' : ''}`}>
            {/* Header */}
            <div
                className='order-card__header'
                onClick={() => setExpanded(!expanded)}
            >
                <div className='order-card__left'>
                    <span className='order-card__id'>
                        #{order.id.slice(-7).toUpperCase()}
                    </span>
                    <span className={`badge ${STATUS_COLOR[manualStatus]}`}>
                        {STATUS_LABELS[manualStatus]}
                    </span>
                    {manualStatus === 'AWAITING_2FA' && (
                        <span className='badge badge--pulse'>⚡ 2FA</span>
                    )}
                </div>
                <div className='order-card__right'>
                    <span className='order-card__total'>
                        {order.total.toLocaleString('ru-RU')} ₽
                    </span>
                    <span className='order-card__date'>{createdAt}</span>
                    <span
                        className={`order-card__chevron ${expanded ? 'order-card__chevron--up' : ''}`}
                    >
                        ›
                    </span>
                </div>
            </div>

            {/* Items preview */}
            <div className='order-card__items-preview'>
                {order.items.slice(0, 2).map((item) => (
                    <span key={item.id} className='order-card__item-chip'>
                        {item.game?.name ?? `Игра #${item.gameId}`} ×{' '}
                        {item.quantity}
                    </span>
                ))}
                {order.items.length > 2 && (
                    <span className='order-card__item-chip order-card__item-chip--more'>
                        +{order.items.length - 2}
                    </span>
                )}
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className='order-card__body'>
                    <div className='order-card__section'>
                        <p className='order-card__section-title'>
                            Пользователь
                        </p>
                        <p className='order-card__section-value'>
                            {order.user?.name ?? '—'} ·{' '}
                            {order.user?.email ?? '—'}
                        </p>
                    </div>

                    <div className='order-card__section'>
                        <p className='order-card__section-title'>Позиции</p>
                        {order.items.map((item) => (
                            <div key={item.id} className='order-card__item'>
                                <div className='order-card__item-info'>
                                    <span className='order-card__item-name'>
                                        {item.game?.name} —{' '}
                                        {item.position?.name}
                                    </span>
                                    <span className='order-card__item-qty'>
                                        × {item.quantity}
                                    </span>
                                </div>
                                {item.fields &&
                                    Object.keys(item.fields).length > 0 && (
                                        <div className='order-card__fields'>
                                            {Object.entries(item.fields).map(
                                                ([key, val]) => (
                                                    <div
                                                        key={key}
                                                        className='order-card__field'
                                                    >
                                                        <span className='order-card__field-key'>
                                                            {key}
                                                        </span>
                                                        <span className='order-card__field-val'>
                                                            {val}
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className='order-card__actions'>
                        {manualStatus === 'PENDING' && (
                            <button
                                className='btn btn--primary'
                                onClick={handleTakeOrder}
                                disabled={isLoadingUpdate}
                            >
                                {isLoadingUpdate
                                    ? 'Берём...'
                                    : 'Взять в работу'}
                            </button>
                        )}

                        {(manualStatus === 'IN_PROGRESS' ||
                            manualStatus === 'AWAITING_2FA') && (
                            <button
                                className='btn btn--ghost'
                                onClick={handleOpenOrder}
                            >
                                Открыть заказ →
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

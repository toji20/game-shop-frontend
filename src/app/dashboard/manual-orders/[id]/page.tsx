'use client';

import '../../../operator-panel/opeartor-panel-components/operator.css';
import {
    useManualOrder,
    useUpdateManualStatus,
    useRequest2FA,
} from '@/hooks/queries/useOrder';
import { useOrderSocket } from '@/hooks/queries/useOrderSocket';
import { ManualStatus } from '@/shared/types';
import { useParams, useRouter } from 'next/navigation';

const STATUS_LABELS: Record<ManualStatus, string> = {
    PENDING: 'Ожидает',
    ASSIGNED: 'Назначен',
    AWAITING_2FA: 'Ждёт 2FA',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершён',
    FAILED: 'Ошибка',
};

export default function ManualOrderPage() {
    const { id } = useParams<{ id: string }>();
    useOrderSocket();
    const { push } = useRouter();
    const { order, isLoadingOrder } = useManualOrder(id);
    const { updateStatus, isLoadingUpdate } = useUpdateManualStatus(id);
    const { request2FA, isLoadingRequest } = useRequest2FA(id);

    const handleComplete = async () => {
        await updateStatus({ status: 'COMPLETED' });
        push('/operator-panel');
    };

    const handleFail = async () => {
        await updateStatus({ status: 'FAILED' });
        push('/operator-panel');
    };

    if (isLoadingOrder)
        return (
            <div className='operator'>
                <div className='order-skeleton' style={{ height: 400 }} />
            </div>
        );
    if (!order)
        return (
            <div className='operator'>
                <p>Заказ не найден</p>
            </div>
        );

    const manualStatus = order.manualStatus as ManualStatus;

    return (
        <div className='operator'>
            <header className='operator__header'>
                <div>
                    <button
                        className='btn btn--ghost'
                        style={{ marginBottom: 12, fontSize: '0.8rem' }}
                        onClick={() => push('/operator-panel')}
                    >
                        ← Все заказы
                    </button>
                    <h1 className='operator__title'>#{order.id.slice(0, 8)}</h1>
                    <p className='operator__subtitle'>
                        {STATUS_LABELS[manualStatus]} ·{' '}
                        {new Date(order.createdAt).toLocaleString('ru-RU')}
                    </p>
                </div>
                <span
                    className='order-card__total'
                    style={{ fontSize: '1.5rem' }}
                >
                    {order.total.toLocaleString('ru-RU')} ₽
                </span>
            </header>

            {/* Пользователь */}
            <div className='order-card' style={{ marginBottom: 12 }}>
                <div className='order-card__body' style={{ display: 'flex' }}>
                    <div className='order-card__section'>
                        <p className='order-card__section-title'>
                            Пользователь
                        </p>
                        <p className='order-card__section-value'>
                            {order.user?.name ?? '—'} ·{' '}
                            {order.user?.email ?? '—'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Позиции */}
            <div className='order-card' style={{ marginBottom: 12 }}>
                <div className='order-card__body' style={{ display: 'flex' }}>
                    <div
                        className='order-card__section'
                        style={{ width: '100%' }}
                    >
                        <p className='order-card__section-title'>Позиции</p>
                        {order.items.map((item) => {
                            const productName =
                                item.giftapiProduct?.name ??
                                item.position?.name ??
                                'Товар';

                            const gameName =
                                item.game?.name ??
                                item.giftapiProduct?.game?.name;

                            return (
                                <div key={item.id} className='order-card__item'>
                                    <div className='order-card__item-info'>
                                        <span className='order-card__item-name'>
                                            {gameName
                                                ? `${gameName} — ${productName}`
                                                : productName}
                                        </span>
                                        <span className='order-card__item-qty'>
                                            × {item.quantity}
                                        </span>
                                    </div>
                                    {item.fields &&
                                        Object.keys(item.fields).length > 0 && (
                                            <div className='order-card__fields'>
                                                {Object.entries(
                                                    item.fields,
                                                ).map(([key, val]) => (
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
                                                ))}
                                            </div>
                                        )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 2FA блок */}
            {order.twoFaCode && (
                <div className='order-card' style={{ marginBottom: 12 }}>
                    <div
                        className='order-card__body'
                        style={{ display: 'flex' }}
                    >
                        <div
                            className='order-card__section order-card__section--2fa'
                            style={{ width: '100%' }}
                        >
                            <p className='order-card__section-title'>
                                2FA код от пользователя
                            </p>
                            <p className='order-card__2fa-code'>
                                {order.twoFaCode}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Действия */}
            <div className='order-card__actions' style={{ marginTop: 8 }}>
                {manualStatus === 'IN_PROGRESS' && (
                    <>
                        <button
                            className='btn btn--ghost'
                            onClick={() => request2FA()}
                            disabled={isLoadingRequest}
                        >
                            Запросить 2FA
                        </button>
                        <button
                            className='btn btn--primary'
                            onClick={handleComplete}
                            disabled={isLoadingUpdate}
                        >
                            Завершить
                        </button>
                        <button
                            className='btn btn--danger'
                            onClick={handleFail}
                            disabled={isLoadingUpdate}
                        >
                            Ошибка
                        </button>
                    </>
                )}
                {manualStatus === 'AWAITING_2FA' && (
                    <>
                        <p
                            style={{
                                fontSize: '0.82rem',
                                color: 'var(--text-muted)',
                                margin: 0,
                            }}
                        >
                            Ожидаем 2FA от пользователя...
                        </p>
                        <button
                            className='btn btn--primary'
                            onClick={handleComplete}
                            disabled={isLoadingUpdate}
                        >
                            Завершить
                        </button>
                        <button
                            className='btn btn--danger'
                            onClick={handleFail}
                            disabled={isLoadingUpdate}
                        >
                            Ошибка
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

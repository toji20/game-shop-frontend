import { PUBLIC_URL } from '@/config/url.config';
import { IOrderItem, IOrder } from '@/shared/types';
import {
    ManualStatus,
    DonateHubStatus,
    OrderStatus,
} from '@/shared/types/order.interface';
import {
    Check,
    Copy,
    Clock,
    Zap,
    Truck,
    XCircle,
    KeyRound,
    Loader2,
    CreditCard,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type StatusConfig = {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
};

const MANUAL_STATUS_CONFIG: Record<ManualStatus, StatusConfig> = {
    PENDING: {
        label: 'В очереди',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    ASSIGNED: {
        label: 'Назначен',
        color: '#fff',
        bg: '#2563eb',
        icon: <Zap size={10} />,
    },
    AWAITING_2FA: {
        label: 'Ждёт код',
        color: '#fff',
        bg: '#ea580c',
        icon: <KeyRound size={10} />,
    },
    IN_PROGRESS: {
        label: 'В процессе',
        color: '#fff',
        bg: '#7c3aed',
        icon: <Loader2 size={10} />,
    },
    COMPLETED: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
    },
    FAILED: {
        label: 'Ошибка',
        color: '#fff',
        bg: '#dc2626',
        icon: <XCircle size={10} />,
    },
};

const DONATEHUB_STATUS_CONFIG: Record<DonateHubStatus, StatusConfig> = {
    WAIT: {
        label: 'Ожидание',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    IN_QUEUE: {
        label: 'В очереди',
        color: '#fff',
        bg: '#2563eb',
        icon: <Loader2 size={10} />,
    },
    PROGRESS: {
        label: 'В процессе',
        color: '#fff',
        bg: '#7c3aed',
        icon: <Truck size={10} />,
    },
    SUCCESS: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
    },
    FAILED: {
        label: 'Ошибка',
        color: '#fff',
        bg: '#dc2626',
        icon: <XCircle size={10} />,
    },
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, StatusConfig> = {
    PENDING: {
        label: 'Ожидает оплаты',
        color: '#fff',
        bg: '#6b7280',
        icon: <CreditCard size={10} />,
    },
    PAID: {
        label: 'Оплачен, готовится к выполнению',
        color: '#fff',
        bg: '#2563eb',
        icon: <Loader2 size={10} />,
    },
    IN_PROCESS: {
        label: 'В обработке',
        color: '#fff',
        bg: '#7c3aed',
        icon: <Loader2 size={10} />,
    },
    COMPLETED: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
    },
    CANCELED: {
        label: 'Отменён',
        color: '#fff',
        bg: '#dc2626',
        icon: <XCircle size={10} />,
    },
};

function resolveStatus(order: IOrder): StatusConfig {
    // Терминальные/предварительные статусы заказа — не зависят от типа обработки
    if (
        order.status === 'PENDING' ||
        order.status === 'CANCELED' ||
        order.status === 'COMPLETED'
    ) {
        return ORDER_STATUS_CONFIG[order.status];
    }

    // order.status === 'PAID' | 'IN_PROCESS' — заказ оплачен и обрабатывается,
    // детализируем статус по типу заказа (MANUAL/AUTO)
    if (order.type === 'MANUAL') {
        return order.manualStatus
            ? MANUAL_STATUS_CONFIG[order.manualStatus]
            : ORDER_STATUS_CONFIG.PAID;
    }

    const donateHubStatus = order.items?.[0]?.donateHubStatus;
    return donateHubStatus
        ? DONATEHUB_STATUS_CONFIG[donateHubStatus]
        : ORDER_STATUS_CONFIG.PAID;
}

// Сумма заказа. Предпочитаем готовое поле order.total (см. IOrder в
// order.interface.ts), иначе считаем сами по items как защитный фолбэк.
function resolveOrderTotal(order: IOrder): number {
    const raw =
        typeof order.total === 'number' && order.total > 0
            ? order.total
            : (order.items ?? []).reduce(
                  (sum, i) => sum + i.price * i.quantity,
                  0,
              );

    return Math.round(raw * 100) / 100;
}

export function OrderCard({
    item,
    order,
}: {
    item: IOrderItem;
    order: IOrder;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const s = resolveStatus(order);
    const total = resolveOrderTotal(order);

    return (
        <Link href={PUBLIC_URL.order(order.id)} className='order-card'>
            <div className='order-card__img-wrap'>
                <img
                    src={item.giftapiProduct?.image || undefined}
                    alt={item.giftapiProduct?.name}
                    className='order-card__img'
                />
                <div
                    className='order-card__status'
                    style={{ color: s.color, background: s.bg }}
                >
                    {s.icon}
                    {s.label}
                </div>
            </div>

            <div className='order-card__info'>
                <p className='order-card__name'>{item.giftapiProduct?.name}</p>
                <p className='order-card__game'>{item.game?.name}</p>

                <div className='order-card__price-row'>
                    <span className='order-card__price'>
                        {total.toLocaleString('ru-RU')} ₽
                    </span>
                </div>

                <div className='order-card__bottom'>
                    <span className='order-card__date'>
                        {new Date(order.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                    <button
                        className='order-card__id-btn'
                        onClick={handleCopy}
                        title='Скопировать ID заказа'
                    >
                        <span className='order-card__id'>
                            №{order.id.slice(-7).toUpperCase()}
                        </span>
                        {copied ? (
                            <Check
                                size={12}
                                className='order-card__id-icon order-card__id-icon--success'
                            />
                        ) : (
                            <Copy size={12} className='order-card__id-icon' />
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
}

import { PUBLIC_URL } from '@/config/url.config';
import { IOrderItem, IOrder } from '@/shared/types';
import {
    ManualStatus,
    DonateHubStatus,
    OrderType,
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

const FALLBACK_CONFIG: StatusConfig = {
    label: 'Оплачен',
    color: '#fff',
    bg: '#2563eb',
    icon: <Zap size={10} />,
};
function resolveStatus(order: IOrder): StatusConfig {
    if (order.type === 'MANUAL') {
        return order.manualStatus
            ? MANUAL_STATUS_CONFIG[order.manualStatus]
            : MANUAL_STATUS_CONFIG.PENDING;
    }

    // AUTO — берём статус из первого item
    const donateHubStatus = order.items?.[0]?.donateHubStatus;
    return donateHubStatus
        ? DONATEHUB_STATUS_CONFIG[donateHubStatus]
        : FALLBACK_CONFIG;
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
    console.log(item.giftapiProduct?.image, item.giftapiProduct?.name);
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
                <p className='order-card__name'>{item.position?.name}</p>
                <p className='order-card__game'>{item.game?.name}</p>

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

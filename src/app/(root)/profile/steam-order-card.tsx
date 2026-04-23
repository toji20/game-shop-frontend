'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { ISteamOrder } from '@/shared/types';
import { Check, Copy, Clock, Zap, Truck, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type StatusConfig = {
    label: string;
    color: string;
    bg: string;
    icon: React.ReactNode;
};

const STEAM_STATUS_CONFIG: Record<string, StatusConfig> = {
    PENDING: {
        label: 'Ожидание',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    PAID: {
        label: 'Оплачен',
        color: '#fff',
        bg: '#2563eb',
        icon: <Zap size={10} />,
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
    WAIT: {
        label: 'Ожидание',
        color: '#fff',
        bg: '#d97706',
        icon: <Clock size={10} />,
    },
    SUCCESS: {
        label: 'Выполнен',
        color: '#fff',
        bg: '#16a34a',
        icon: <Check size={10} />,
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

function resolveStatus(order: ISteamOrder): StatusConfig {
    const donateStatus = order.donateHubStatus;
    if (donateStatus && STEAM_STATUS_CONFIG[donateStatus]) {
        return STEAM_STATUS_CONFIG[donateStatus];
    }
    return STEAM_STATUS_CONFIG[order.status] ?? STEAM_STATUS_CONFIG.PENDING;
}

export function SteamOrderCard({ order }: { order: ISteamOrder }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const s = resolveStatus(order);

    return (
        <Link href={PUBLIC_URL.steamOrder(order.id)} className='order-card'>
            <div className='order-card__img-wrap'>
                <img
                    src='/steam-icon.png'
                    alt='Steam'
                    className='order-card__img order-card__img--steam'
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
                <p className='order-card__name'>Пополнение Steam</p>
                <p className='order-card__game order-card__game--steam'>
                    {order.total} ₽
                </p>

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

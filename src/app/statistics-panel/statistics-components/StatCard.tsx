'use client';

import { IStatisticCard } from '@/shared/types';

const icons: Record<string, string> = {
    'Общая выручка': '💰',
    'Средняя выручка с заказа': '📊',
    'Всего заказов': '🛒',
    Пользователей: '👥',
    'Средний рейтинг игр': '⭐',
};

const formatValue = (name: string, value: number): string => {
    if (name.toLowerCase().includes('выручка')) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
        }).format(value);
    }
    if (name.toLowerCase().includes('рейтинг')) {
        return value.toFixed(1);
    }
    return new Intl.NumberFormat('ru-RU').format(value);
};

interface StatCardProps {
    card: IStatisticCard;
    index: number;
}

export function StatCard({ card, index }: StatCardProps) {
    return (
        <div
            className='stat-card'
            style={{ animationDelay: `${index * 80}ms` }}
        >
            <div className='stat-card__icon'>{icons[card.name] ?? '📌'}</div>
            <div className='stat-card__body'>
                <span className='stat-card__label'>{card.name}</span>
                <span className='stat-card__value'>
                    {formatValue(card.name, card.value)}
                </span>
            </div>
        </div>
    );
}

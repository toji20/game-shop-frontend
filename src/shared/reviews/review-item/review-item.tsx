/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import './review-item.css';
import { IReview } from '@/shared/types';
import { Star } from 'lucide-react';

interface ReviewItemProps {
    item: IReview;
}

function timeAgo(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days} дн. назад`;
    if (hours > 0) return `${hours} ч. назад`;
    if (mins > 0) return `${mins} мин. назад`;
    return 'только что';
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export function ReviewItem({ item }: ReviewItemProps) {
    const ratingColor =
        item.rating >= 7 ? '#f5c518' : item.rating >= 4 ? '#fb923c' : '#f87171';

    return (
        <div className='review-item'>
            <div className='review-item__left'>
                <img
                    src={item.user?.picture}
                    alt={item.user?.name}
                    className='review-item__avatar'
                />
                <div className='review-item__content'>
                    <div className='review-item__top'>
                        <div className='review-item__top-info'>
                            <span className='review-item__name'>
                                {item.user?.name}
                            </span>
                            <span className='review-item__meta'>
                                {(item.user as any)?.ordersCount
                                    ? `${(item.user as any).ordersCount} заказов`
                                    : ''}
                                {' | '}
                                {formatDate(item.createdAt)}
                            </span>
                        </div>
                    </div>
                    <p className='review-item__text'>{item.text}</p>
                </div>
            </div>
            <div className='review-item__rating-badge'>
                <Star size={12} fill={ratingColor} color={ratingColor} />
                <span>{item.rating}</span>
            </div>
        </div>
    );
}

'use client';

import './review-item.css';
import { IReview } from '@/shared/types';
import { Star } from 'lucide-react';

interface ReviewItemProps {
    review: IReview;
}

function getRatingClass(rating: number) {
    if (rating <= 4) return 'review-item__rating--bad';
    if (rating <= 7) return 'review-item__rating--medium';
    return 'review-item__rating--good';
}

function formatReviewDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    }).format(date);
}

export function ReviewItem({ review }: ReviewItemProps) {
    const authorName = review.user?.name || 'Пользователь';
    const ratingClass = getRatingClass(review.rating);
    const formattedDate = formatReviewDate(review.createdAt);

    return (
        <article className='review-item'>
            <div className='review-item__top'>
                <div className='review-item__user'>
                    <img
                        src={review.user?.picture || '/no-user-image.png'}
                        alt={authorName}
                        className='review-item__avatar'
                    />

                    <div className='review-item__content'>
                        <div className='review-item__name'>{authorName}</div>

                        <div className='review-item__meta'>
                            <span>{formattedDate}</span>
                        </div>
                    </div>
                </div>

                <div className={`review-item__rating ${ratingClass}`}>
                    <Star size={14} fill='currentColor' />
                    <span>{review.rating}</span>
                </div>
            </div>

            <div className='review-item__text'>{review.text}</div>
        </article>
    );
}

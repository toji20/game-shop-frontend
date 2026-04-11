'use client';

import { ReviewItem } from './review-item/review-item';
import './reviews.css';
import { PUBLIC_URL } from '@/config/url.config';
import {
    useAllReviewsPaginated,
    useReviewsPaginated,
    useCreateReview,
    useReviewStats,
} from '@/hooks/queries/useReview';
import { useProfile } from '@/hooks/queries/useUser';
import { useIntersection } from '@/hooks/useInterSection';
import { IGame } from '@/shared/types';
import { Star, LogIn, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ReviewsProps {
    game?: IGame;
}

export function Reviews({ game }: ReviewsProps) {
    const isGameMode = !!game;
    const { profile } = useProfile();
    const isAuth = !!profile;

    const gamePaginated = useReviewsPaginated(game?.id ?? 0, 10);
    const allPaginated = useAllReviewsPaginated(10);
    const active = isGameMode ? gamePaginated : allPaginated;
    const { reviews, total, hasMore, isLoading, isFetching, loadMore } = active;

    const { stats } = useReviewStats(game?.id);
    const { createReview, isLoadingCreate } = useCreateReview(game?.id ?? 0);

    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const { ref: sentinelRef, isVisible } = useIntersection([], {
        threshold: 0.1,
    });

    useEffect(() => {
        if (!isVisible || !hasMore || isFetching) return;
        loadMore();
    }, [isVisible, hasMore, isFetching]);

    const handleSubmit = () => {
        if (!text.trim() || rating === 0) return;
        createReview(
            { text, rating },
            {
                onSuccess: () => {
                    setText('');
                    setRating(0);
                    setSubmitted(true);
                    setTimeout(() => setSubmitted(false), 4000);
                },
            },
        );
    };

    const avgRating = stats?.avgRating ?? 0;

    return (
        <div className='reviews-wrapper'>
            {/* Статистика */}
            <div className='reviews-stats'>
                <div className='reviews-stats__score'>
                    <span className='reviews-stats__number'>
                        {avgRating > 0 ? avgRating.toFixed(1) : '—'}
                    </span>
                    <div className='reviews-stats__stars'>
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Star
                                key={i}
                                size={14}
                                className={`reviews-stats__star ${i < Math.round(avgRating) ? 'reviews-stats__star--filled' : ''}`}
                            />
                        ))}
                    </div>
                    <span className='reviews-stats__count'>
                        {total} отзывов
                    </span>
                </div>
            </div>

            {/* Форма / благодарность / блок авторизации */}
            {isGameMode &&
                (isAuth ? (
                    submitted ? (
                        <div className='review-thanks'>
                            <img
                                src={'/holiday.svg'}
                                className='review-thanks__emoji'
                            />
                            <div>
                                <p className='review-thanks__title'>
                                    Спасибо за отзыв!
                                </p>
                                <p className='review-thanks__desc'>
                                    Ваше мнение помогает другим игрокам
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className='review-form'>
                            <div className='review-form__rating'>
                                <span className='review-form__rating-label'>
                                    Ваша оценка
                                </span>
                                <div className='review-form__stars'>
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <button
                                            key={i}
                                            className={`review-form__star-btn ${i < (hovered || rating) ? 'review-form__star-btn--active' : ''}`}
                                            onMouseEnter={() =>
                                                setHovered(i + 1)
                                            }
                                            onMouseLeave={() => setHovered(0)}
                                            onClick={() => setRating(i + 1)}
                                            type='button'
                                        >
                                            <Star size={20} />
                                        </button>
                                    ))}
                                    {(hovered || rating) > 0 && (
                                        <span className='review-form__rating-value'>
                                            {hovered || rating} / 10
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className='review-form__input-row'>
                                <textarea
                                    className='review-form__textarea'
                                    placeholder='Поделитесь своим впечатлением...'
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    rows={3}
                                />
                                <button
                                    className='review-form__submit'
                                    onClick={handleSubmit}
                                    disabled={
                                        !text.trim() ||
                                        rating === 0 ||
                                        isLoadingCreate
                                    }
                                >
                                    <span>Отправить</span>
                                </button>
                            </div>
                        </div>
                    )
                ) : (
                    <div className='review-auth-block'>
                        <div className='review-auth-block__icon'>
                            <LogIn size={24} />
                        </div>
                        <div className='review-auth-block__text'>
                            <p className='review-auth-block__title'>
                                Хотите оставить отзыв?
                            </p>
                            <p className='review-auth-block__desc'>
                                Войдите в аккаунт чтобы поделиться своим мнением
                            </p>
                        </div>
                        <Link
                            href={PUBLIC_URL.auth()}
                            className='review-auth-block__btn'
                        >
                            Войти
                        </Link>
                    </div>
                ))}

            {/* Список отзывов */}
            <div className='reviews-list'>
                {isLoading ? (
                    <p className='reviews-empty'>Загрузка...</p>
                ) : reviews.length === 0 ? (
                    <p className='reviews-empty'>Отзывов пока нет</p>
                ) : (
                    reviews.map((item) => (
                        <ReviewItem key={item.id} item={item} />
                    ))
                )}

                <div ref={sentinelRef} className='reviews-sentinel'>
                    {isFetching && (
                        <p className='reviews-empty'>Загружаем...</p>
                    )}
                </div>
            </div>
        </div>
    );
}

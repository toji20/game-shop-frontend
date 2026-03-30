'use client';

import { RatingBlock } from './rating-block/rating-block';
import { ReviewItem } from './review-item/review-item';
import './reviews.css';
import {
    useAllReviewsPaginated,
    useReviewsPaginated,
    useReviewStats,
} from '@/hooks/queries/useReview';
import { useIntersection } from '@/hooks/useInterSection';
import { IGame, IReview } from '@/shared/types';
import { useEffect, useRef, useState } from 'react';

type Filter = 'all' | 'good' | 'average' | 'bad';

interface ReviewsProps {
    game?: IGame;
}

export function Reviews({ game }: ReviewsProps) {
    const [filter, setFilter] = useState<Filter>('all');
    const isGameMode = !!game;
    const { stats } = useReviewStats(isGameMode ? game.id : undefined);

    const gamePaginated = useReviewsPaginated(game?.id ?? 0, 10);
    const allPaginated = useAllReviewsPaginated(10);

    const active = isGameMode ? gamePaginated : allPaginated;

    const reviews = active.reviews;
    const total = active.total;
    const hasMore = active.hasMore;
    const isLoading = active.isLoading;
    const isFetching = active.isFetching;
    const loadMore = active.loadMore;

    const { ref: sentinelRef, isVisible } = useIntersection([filter], {
        threshold: 0.1,
    });

    useEffect(() => {
        if (filter !== 'all' || !isVisible || !hasMore || isFetching) return;
        loadMore();
    }, [isVisible, hasMore, isFetching, filter]);

    const goodReviews = reviews.filter((r) => r.rating >= 7);
    const averageReviews = reviews.filter((r) => r.rating >= 4 && r.rating < 7);
    const badReviews = reviews.filter((r) => r.rating < 4);

    const filtered =
        filter === 'good'
            ? goodReviews
            : filter === 'average'
              ? averageReviews
              : filter === 'bad'
                ? badReviews
                : reviews;

    const sourceReviews: IReview[] = isGameMode
        ? (game.reviews ?? reviews)
        : reviews;

    const allGood = sourceReviews.filter((r) => r.rating >= 7);
    const allAverage = sourceReviews.filter(
        (r) => r.rating >= 4 && r.rating < 7,
    );
    const allBad = sourceReviews.filter((r) => r.rating < 4);

    const avgRating = sourceReviews.length
        ? Math.round(
              (sourceReviews.reduce((acc, r) => acc + r.rating, 0) /
                  sourceReviews.length) *
                  10,
          ) / 10
        : null;

    const ratingGame = isGameMode
        ? game
        : { avgRating, reviews: sourceReviews };

    const FILTERS = [
        { key: 'all' as Filter, label: 'Все', count: total },
        {
            key: 'good' as Filter,
            label: 'Положительные',
            count: allGood.length,
        },
        {
            key: 'average' as Filter,
            label: 'Средние',
            count: allAverage.length,
        },
        { key: 'bad' as Filter, label: 'Отрицательные', count: allBad.length },
    ];

    return (
        <div className='reviews-wrapper'>
            <div className='reviews-header'>
                <span className='reviews-count'>{total} отзывов</span>
                <div className='reviews-filters'>
                    {FILTERS.map((f) => (
                        <button
                            key={f.key}
                            className={`reviews-filter-btn ${filter === f.key ? 'reviews-filter-btn--active' : ''}`}
                            onClick={() => setFilter(f.key)}
                        >
                            {f.label}
                            <span className='reviews-filter-count'>
                                {f.count}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            <div className='reviews-body'>
                <div className='reviews-list'>
                    {isLoading ? (
                        <p className='reviews-empty'>Загрузка...</p>
                    ) : filtered.length === 0 ? (
                        <p className='reviews-empty'>Отзывов нет</p>
                    ) : (
                        filtered.map((item) => (
                            <ReviewItem key={item.id} item={item} />
                        ))
                    )}

                    {filter === 'all' && (
                        <div ref={sentinelRef} className='reviews-sentinel'>
                            {isFetching && (
                                <p className='reviews-empty'>Загружаем...</p>
                            )}
                        </div>
                    )}
                </div>

                <div className='reviews-rating'>
                    <RatingBlock
                        avgRating={stats?.avgRating ?? null}
                        total={stats?.total ?? 0}
                        good={stats?.good ?? 0}
                        average={stats?.average ?? 0}
                        bad={stats?.bad ?? 0}
                    />
                </div>
            </div>
        </div>
    );
}

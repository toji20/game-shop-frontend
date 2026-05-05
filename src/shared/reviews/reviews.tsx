'use client';

import { ReviewAuthModal } from './review-auth-modal/review-auth-modal';
import { ReviewItem } from './review-item/review-item';
import { ReviewFormModal } from './review-modal/review-form-modal';
import './reviews.css';
import {
    useAllReviewsPaginated,
    useCreateReview,
    useReviewsPaginated,
    useReviewStats,
} from '@/hooks/queries/useReview';
import { useProfile } from '@/hooks/queries/useUser';
import { IGame, IReviewCreate } from '@/shared/types';
import { ChevronRight, Star } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface ReviewsProps {
    game?: IGame;
}

export function Reviews({ game }: ReviewsProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { profile, isLoadingProfile } = useProfile();

    const gameReviews = useReviewsPaginated(game?.id ?? 0, 10);
    const allReviews = useAllReviewsPaginated(10);
    const { stats } = useReviewStats();

    const { reviews, hasMore, loadMore, isLoading, isFetching, total } = game
        ? gameReviews
        : allReviews;

    const { createReview, isLoadingCreate } = useCreateReview(game?.id ?? 0);

    const handleOpenReview = () => {
        if (isLoadingProfile) return;

        if (!profile) {
            setIsAuthModalOpen(true);
            return;
        }

        setIsModalOpen(true);
    };

    const handleSubmitReview = async (payload: IReviewCreate) => {
        if (!game) return;

        createReview(payload, {
            onSuccess: () => {
                toast.success('Отзыв успешно отправлен');
                setIsModalOpen(false);
            },
            onError: () => {
                toast.error('Не удалось отправить отзыв');
            },
        });
    };

    const avgRating = stats?.avgRating || 0;

    return (
        <>
            <div className='reviews-summary'>
                <div className='reviews-summary__rating'>
                    <Star size={18} fill={'#facc15'} />
                    <span className='reviews-summary__value'>
                        {(game?.id && game?.avgRating?.toFixed(1)) ||
                            avgRating.toFixed(1)}
                    </span>
                </div>
                <span className='reviews-summary__count'>{total} отзывов</span>
            </div>

            <section className='reviews-block'>
                <div className='reviews-block__head'>
                    <div className='reviews-block__title-wrap'>
                        <h2 className='reviews-block__title'>Отзывы</h2>
                        <ChevronRight
                            size={16}
                            className='reviews-block__title-icon'
                        />
                    </div>

                    {game && (
                        <button
                            type='button'
                            className='reviews-block__add-btn'
                            onClick={handleOpenReview}
                            disabled={isLoadingProfile}
                        >
                            + Оставить отзыв
                        </button>
                    )}
                </div>

                <div className='reviews-block__list'>
                    {isLoading ? (
                        <div className='reviews-spinner'>
                            <div className='reviews-spinner__circle' />
                        </div>
                    ) : (
                        reviews?.map((review) => (
                            <ReviewItem key={review.id} review={review} />
                        ))
                    )}
                </div>

                {!isLoading && hasMore && (
                    <button
                        type='button'
                        className='reviews-block__more-btn'
                        onClick={loadMore}
                        disabled={isFetching}
                    >
                        {isFetching ? 'Загрузка...' : 'Показать еще'}
                        <ChevronRight
                            size={18}
                            className='reviews-block__more-icon'
                        />
                    </button>
                )}
            </section>

            {game && (
                <>
                    <ReviewFormModal
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        gameName={game.name}
                        gameCategory={game.category?.title || ''}
                        gameImage={
                            game.bgMobile || game.bgDesktop || game.icon || ''
                        }
                        onSubmit={handleSubmitReview}
                        isLoading={isLoadingCreate}
                    />

                    <ReviewAuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                    />
                </>
            )}
        </>
    );
}

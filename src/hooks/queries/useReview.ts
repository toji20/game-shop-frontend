import { reviewService } from '@/services/review.service';
import { IReviewCreate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useReviews(gameId: number) {
    const { data: reviews, isLoading: isLoadingReviews } = useQuery({
        queryKey: ['reviews', gameId],
        queryFn: () => reviewService.getByGameId(gameId),
        enabled: !!gameId,
    });

    return useMemo(
        () => ({ reviews, isLoadingReviews }),
        [reviews, isLoadingReviews],
    );
}

export function useAllReviews() {
    const { data: reviews, isLoading: isLoadingReviews } = useQuery({
        queryKey: ['all-reviews'],
        queryFn: () => reviewService.getAll(),
    });

    return useMemo(
        () => ({ reviews, isLoadingReviews }),
        [reviews, isLoadingReviews],
    );
}

export function useCreateReview(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: createReview, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create review', gameId],
        mutationFn: (dto: IReviewCreate) => reviewService.create(gameId, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['reviews', gameId] });
            toast.success('Отзыв оставлен');
        },
        onError() {
            toast.error('Ошибка при создании отзыва');
        },
    });

    return useMemo(
        () => ({ createReview, isLoadingCreate }),
        [createReview, isLoadingCreate],
    );
}

export function useDeleteReview(gameId?: number) {
    const queryClient = useQueryClient();

    const { mutate: deleteReview, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete review'],
        mutationFn: (id: string) => reviewService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['reviews', gameId] });
            queryClient.invalidateQueries({ queryKey: ['all-reviews'] });
            toast.success('Отзыв удалён');
        },
        onError() {
            toast.error('Ошибка при удалении отзыва');
        },
    });

    return useMemo(
        () => ({ deleteReview, isLoadingDelete }),
        [deleteReview, isLoadingDelete],
    );
}

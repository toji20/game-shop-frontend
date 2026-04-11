import { reviewService } from '@/services/review.service';
import { IReview, IReviewCreate } from '@/shared/types';
import {
    useMutation,
    useQueries,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useCallback, useMemo, useState } from 'react';
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

export function useAllReviewsPaginated(limit = 20) {
    const [maxPage, setMaxPage] = useState(1);

    const queries = useQueries({
        queries: Array.from({ length: maxPage }, (_, i) => ({
            queryKey: ['reviews-paginated-all', i + 1],
            queryFn: () => reviewService.getAllPaginated(i + 1, limit),
        })),
    });

    const allReviews = useMemo<IReview[]>(
        () => queries.flatMap((q) => q.data?.reviews ?? []),
        [queries],
    );

    const lastData = queries[queries.length - 1]?.data;
    const isLoading = queries[0]?.isLoading ?? false;
    const isFetching = queries.some((q) => q.isFetching);

    const loadMore = useCallback(() => {
        if (lastData?.hasMore && !isFetching) {
            setMaxPage((p) => p + 1);
        }
    }, [lastData?.hasMore, isFetching]);

    return useMemo(
        () => ({
            reviews: allReviews,
            total: lastData?.total ?? 0,
            hasMore: lastData?.hasMore ?? false,
            isLoading,
            isFetching,
            loadMore,
        }),
        [allReviews, lastData, isLoading, isFetching, loadMore],
    );
}

export function useReviewsPaginated(gameId: number, limit = 20) {
    const [maxPage, setMaxPage] = useState(1);

    const queries = useQueries({
        queries: Array.from({ length: maxPage }, (_, i) => ({
            queryKey: ['reviews-paginated', gameId, i + 1],
            queryFn: () => reviewService.getPaginated(gameId, i + 1, limit),
            enabled: !!gameId,
        })),
    });

    const allReviews = useMemo<IReview[]>(
        () => queries.flatMap((q) => q.data?.reviews ?? []),
        [queries],
    );

    const lastData = queries[queries.length - 1]?.data;
    const isLoading = queries[0]?.isLoading ?? false;
    const isFetching = queries.some((q) => q.isFetching);

    const loadMore = useCallback(() => {
        if (lastData?.hasMore && !isFetching) {
            setMaxPage((p) => p + 1);
        }
    }, [lastData?.hasMore, isFetching]);

    return useMemo(
        () => ({
            reviews: allReviews,
            total: lastData?.total ?? 0,
            hasMore: lastData?.hasMore ?? false,
            isLoading,
            isFetching,
            loadMore,
        }),
        [allReviews, lastData, isLoading, isFetching, loadMore],
    );
}

export function useReviewStats(gameId?: number) {
    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['review-stats', gameId],
        queryFn: () => reviewService.getStats(gameId),
    });

    return useMemo(() => ({ stats, isLoadingStats }), [stats, isLoadingStats]);
}

export function useCreateReview(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: createReview, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create review', gameId],
        mutationFn: (dto: IReviewCreate) => reviewService.create(gameId, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['reviews', gameId] });
            queryClient.invalidateQueries({
                queryKey: ['reviews-paginated', gameId],
            });
            queryClient.invalidateQueries({
                queryKey: ['review-stats', gameId],
            });
        },
        onError() {
            console.error('Ошибка при создании отзыва');
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

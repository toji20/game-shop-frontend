import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IReview, IReviewCreate, IReviewsPaginated } from '@/shared/types';

class ReviewService {
    async getAll() {
        const { data } = await axiosClassic<IReview[]>({
            url: API_URL.reviews('all-reviews'),
            method: 'GET',
        });
        return data;
    }

    async getAllPaginated(page: number, limit = 20) {
        const { data } = await axiosClassic<IReviewsPaginated>({
            url: API_URL.reviews(`paginated-all?page=${page}&limit=${limit}`),
            method: 'GET',
        });
        return data;
    }

    async getByGameId(gameId: number) {
        const { data } = await axiosClassic<IReview[]>({
            url: API_URL.reviews(`by-game/${gameId}`),
            method: 'GET',
        });
        return data;
    }

    async getPaginated(gameId: number, page: number, limit = 20) {
        const { data } = await axiosClassic<IReviewsPaginated>({
            url: API_URL.reviews(
                `paginated/${gameId}?page=${page}&limit=${limit}`,
            ),
            method: 'GET',
        });
        return data;
    }

    async getStats(gameId?: number) {
        const url = gameId
            ? API_URL.reviews(`stats?gameId=${gameId}`)
            : API_URL.reviews('stats');
        const { data } = await axiosClassic<{
            total: number;
            avgRating: number | null;
            good: number;
            average: number;
            bad: number;
        }>({ url, method: 'GET' });
        return data;
    }

    async create(gameId: number, dto: IReviewCreate) {
        const { data } = await axiosWithAuth<IReview>({
            url: API_URL.reviews(`${gameId}`),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async delete(id: string) {
        const { data } = await axiosWithAuth<IReview>({
            url: API_URL.reviews(id),
            method: 'DELETE',
        });
        return data;
    }
}

export const reviewService = new ReviewService();

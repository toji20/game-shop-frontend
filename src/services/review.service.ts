import { axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { IReview, IReviewCreate } from '@/shared/types'

class ReviewService {
  async getAll() {
    const { data } = await axiosWithAuth<IReview[]>({
      url: API_URL.reviews('all-reviews'),
      method: 'GET',
    })
    return data
  }

  async getByGameId(gameId: number) {
    const { data } = await axiosWithAuth<IReview[]>({
      url: API_URL.reviews(`by-game/${gameId}`),
      method: 'GET',
    })
    return data
  }

  async create(gameId: number, dto: IReviewCreate) {
    const { data } = await axiosWithAuth<IReview>({
      url: API_URL.reviews(`${gameId}`),
      method: 'POST',
      data: dto,
    })
    return data
  }

  async delete(id: string) {
    const { data } = await axiosWithAuth<IReview>({
      url: API_URL.reviews(id),
      method: 'DELETE',
    })
    return data
  }
}

export const reviewService = new ReviewService()

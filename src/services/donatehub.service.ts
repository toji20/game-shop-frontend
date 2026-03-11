import { IGame } from '@/shared/types'
import { axiosClassic, axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'

class DonateHubService {
  async getAllGames() {
    const { data } = await axiosClassic<IGame[]>({
      url: API_URL.donatehub('games'),
      method: 'GET',
    })
    return data
  }

  async getGameById(id: number) {
    const { data } = await axiosClassic<IGame>({
      url: API_URL.donatehub(`games/${id}`),
      method: 'GET',
    })
    return data
  }

  // Синхронизировать все игры с DonateHub (только ADMIN/MANAGER)
  async syncAll() {
    const { data } = await axiosWithAuth<{ message: string }>({
      url: API_URL.donatehub('sync'),
      method: 'POST',
    })
    return data
  }
}

export const donateHubService = new DonateHubService()

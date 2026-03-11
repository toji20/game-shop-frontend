import { axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { IStatisticCard, IDetailedStatistics } from '@/shared/types'

class StatisticsService {
  async getMain() {
    const { data } = await axiosWithAuth<IStatisticCard[]>({
      url: API_URL.statistics('main'),
      method: 'GET',
    })
    return data
  }

  async getDetailed() {
    const { data } = await axiosWithAuth<IDetailedStatistics>({
      url: API_URL.statistics('detailed'),
      method: 'GET',
    })
    return data
  }
}

export const statisticsService = new StatisticsService()

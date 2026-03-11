import { axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import {
  ISteamOrderCheck,
  ISteamOrderCreate,
  ISteamOrderCreateResponse,
} from '@/shared/types'

class SteamOrderService {
  // Шаг 1: проверить аккаунт и получить custom_id + итоговую сумму
  async check(account: string, amount: number) {
    const { data } = await axiosWithAuth<ISteamOrderCheck>({
      url: API_URL.steamOrders(`check?account=${encodeURIComponent(account)}&amount=${amount}`),
      method: 'GET',
    })
    return data
  }

  // Шаг 2: создать заказ и получить ссылку на оплату
  async place(dto: ISteamOrderCreate) {
    const { data } = await axiosWithAuth<ISteamOrderCreateResponse>({
      url: API_URL.steamOrders('place'),
      method: 'POST',
      data: dto,
    })
    return data
  }
}

export const steamOrderService = new SteamOrderService()

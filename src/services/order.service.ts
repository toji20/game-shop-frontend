import { axiosClassic, axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import {
  IOrder,
  IOrderCreate,
  IOrderCreateResponse,
  IUpdateManualStatus,
  IProvide2FA,
  ManualStatus,
} from '@/shared/types'

class OrderService {
  // ─── Пользователь: создать заказ ─────────────────────────────────────────────
  async place(dto: IOrderCreate) {
    const { data } = await axiosWithAuth<IOrderCreateResponse>({
      url: API_URL.orders('place'),
      method: 'POST',
      data: dto,
    })
    return data
  }

  // ─── Пользователь: ввести 2FA код ────────────────────────────────────────────
  async provide2FA(orderId: string, dto: IProvide2FA) {
    const { data } = await axiosWithAuth<{ message: string }>({
      url: API_URL.manualOrders(`${orderId}/provide-2fa`),
      method: 'POST',
      data: dto,
    })
    return data
  }

  // ─── Сотрудники: получить все ручные заказы ───────────────────────────────────
  async getAllManual(status?: ManualStatus) {
    const { data } = await axiosWithAuth<IOrder[]>({
      url: API_URL.manualOrders(status ? `?status=${status}` : ''),
      method: 'GET',
    })
    return data
  }

  // ─── Сотрудники: получить ручной заказ по id ─────────────────────────────────
  async getManualById(id: string) {
    const { data } = await axiosWithAuth<IOrder>({
      url: API_URL.manualOrders(id),
      method: 'GET',
    })
    return data
  }

  // ─── Сотрудники: обновить статус заказа ──────────────────────────────────────
  async updateManualStatus(id: string, dto: IUpdateManualStatus) {
    const { data } = await axiosWithAuth<IOrder>({
      url: API_URL.manualOrders(`${id}/status`),
      method: 'PATCH',
      data: dto,
    })
    return data
  }

  // ─── Сотрудники: запросить 2FA код ───────────────────────────────────────────
  async request2FA(id: string) {
    const { data } = await axiosWithAuth<IOrder>({
      url: API_URL.manualOrders(`${id}/request-2fa`),
      method: 'POST',
    })
    return data
  }
}

// ─── Для администраторов (orderApi) ──────────────────────────────────────────

class OrderApiService {
  async getAll() {
    const { data } = await axiosClassic<IOrder[]>({
      url: API_URL.orderApi(),
      method: 'GET',
    })
    return data
  }

  async getById(id: string) {
    const { data } = await axiosClassic<IOrder>({
      url: API_URL.orderApi(`by-id/${id}`),
      method: 'GET',
    })
    return data
  }

  async updateStatus(id: string, status: string) {
    const { data } = await axiosWithAuth<IOrder>({
      url: API_URL.orderApi(id),
      method: 'PUT',
      data: { status },
    })
    return data
  }

  async delete(id: string) {
    const { data } = await axiosWithAuth<IOrder>({
      url: API_URL.orderApi(id),
      method: 'DELETE',
    })
    return data
  }
}

export const orderService = new OrderService()
export const orderApiService = new OrderApiService()

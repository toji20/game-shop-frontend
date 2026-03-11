import { axiosClassic, axiosWithAuth } from '../api/api.interceptors'
import { API_URL } from '../config/api.config'
import { ICategory, ICategoryCreate, ICategoryUpdate } from '@/shared/types'

class CategoryService {
  async getAll() {
    const { data } = await axiosClassic<ICategory[]>({
      url: API_URL.categories(),
      method: 'GET',
    })
    return data
  }

  async getById(id: string) {
    const { data } = await axiosClassic<ICategory>({
      url: API_URL.categories(`by-id/${id}`),
      method: 'GET',
    })
    return data
  }

  async create(dto: ICategoryCreate) {
    const { data } = await axiosWithAuth<ICategory>({
      url: API_URL.categories(),
      method: 'POST',
      data: dto,
    })
    return data
  }

  async update(id: string, dto: ICategoryUpdate) {
    const { data } = await axiosWithAuth<ICategory>({
      url: API_URL.categories(id),
      method: 'PUT',
      data: dto,
    })
    return data
  }

  async delete(id: string) {
    const { data } = await axiosWithAuth<ICategory>({
      url: API_URL.categories(id),
      method: 'DELETE',
    })
    return data
  }
}

export const categoryService = new CategoryService()

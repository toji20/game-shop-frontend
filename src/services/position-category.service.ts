import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    IPositionCategory,
    IPositionCategoryCreate,
    IPositionCategoryUpdate,
} from '@/shared/types';

class PositionCategoryService {
    async getAll() {
        const { data } = await axiosClassic<IPositionCategory[]>({
            url: API_URL.positionCategory(),
            method: 'GET',
        });
        return data;
    }

    async getByGameId(gameId: number) {
        const { data } = await axiosClassic<IPositionCategory[]>({
            url: API_URL.positionCategory(`by-game/${gameId}`),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IPositionCategoryCreate) {
        const { data } = await axiosWithAuth<IPositionCategory>({
            url: API_URL.positionCategory(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: number, dto: IPositionCategoryUpdate) {
        const { data } = await axiosWithAuth<IPositionCategory>({
            url: API_URL.positionCategory(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IPositionCategory>({
            url: API_URL.positionCategory(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const positionCategoryService = new PositionCategoryService();

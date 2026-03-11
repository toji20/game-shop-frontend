import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IPosition, IPositionCreate, IPositionUpdate } from '@/shared/types';

class PositionService {
    async getByGameId(gameId: number) {
        const { data } = await axiosClassic<IPosition[]>({
            url: API_URL.position(`by-game/${gameId}`),
            method: 'GET',
        });
        return data;
    }

    async create(gameId: number, dto: IPositionCreate) {
        const { data } = await axiosWithAuth<IPosition>({
            url: API_URL.position(),
            method: 'POST',
            data: { ...dto, gameId: Number(gameId) },
        });
        return data;
    }

    async update(id: number, dto: IPositionUpdate) {
        const { data } = await axiosWithAuth<IPosition>({
            url: API_URL.position(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IPosition>({
            url: API_URL.position(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const positionService = new PositionService();

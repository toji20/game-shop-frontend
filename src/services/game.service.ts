import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IGame, IGameCreate, IGameUpdate } from '@/shared/types';

class GameService {
    async getAll() {
        const { data } = await axiosClassic<IGame[]>({
            url: API_URL.game(),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IGameCreate) {
        const { data } = await axiosWithAuth<IGame>({
            url: API_URL.game(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: number, dto: IGameUpdate) {
        const { data } = await axiosWithAuth<IGame>({
            url: API_URL.game(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IGame>({
            url: API_URL.game(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const gameService = new GameService();

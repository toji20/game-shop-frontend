import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IGameField, IGameFieldCreate } from '@/shared/types';

class GameFieldService {
    async getByGameId(gameId: number) {
        const { data } = await axiosClassic<IGameField[]>({
            url: API_URL.gameField(`by-game/${gameId}`),
            method: 'GET',
        });
        return data;
    }

    async create(gameId: number, dto: IGameFieldCreate) {
        const { data } = await axiosWithAuth<IGameField>({
            url: API_URL.gameField(),
            method: 'POST',
            data: { ...dto, gameId: Number(gameId) },
        });
        return data;
    }

    async update(id: number, dto: Partial<IGameFieldCreate>) {
        const { data } = await axiosWithAuth<IGameField>({
            url: API_URL.gameField(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IGameField>({
            url: API_URL.gameField(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const gameFieldService = new GameFieldService();

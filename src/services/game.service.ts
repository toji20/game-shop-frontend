import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IGame, IGameCreate, IGameUpdate } from '@/shared/types';

class GameService {
    async getById(id: number) {
        const { data } = await axiosClassic<IGame>({
            url: API_URL.game(`${id}`),
            method: 'GET',
        });
        return data;
    }

    async getBySlug(slug: string) {
        const { data } = await axiosClassic<IGame>({
            url: API_URL.game(`${slug}`),
            method: 'GET',
        });
        return data;
    }

    async getAll() {
        const { data } = await axiosClassic<IGame[]>({
            url: API_URL.game(),
            method: 'GET',
        });
        return data;
    }

    async getAllActive() {
        const { data } = await axiosClassic<IGame[]>({
            url: API_URL.game('active'),
            method: 'GET',
        });
        return data;
    }

    async getPopular(limit = 10) {
        const { data } = await axiosClassic<IGame[]>({
            url: API_URL.game(`popular?limit=${limit}`),
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

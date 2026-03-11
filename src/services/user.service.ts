import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IUser } from '@/shared/types';

class UserService {
    async getById(id: string) {
        const { data } = await axiosClassic<IUser>({
            url: API_URL.users(`id/${id}`),
            method: 'GET',
        });
        return data;
    }

    async getByEmail(email: string) {
        const { data } = await axiosClassic<IUser>({
            url: API_URL.users(`email/${email}`),
            method: 'GET',
        });
        return data;
    }

    async getProfile() {
        const { data } = await axiosWithAuth<IUser>({
            url: API_URL.users('profile'),
            method: 'GET',
        });
        return data;
    }

    async toggleFavorite(gameId: number) {
        const { data } = await axiosWithAuth<IUser>({
            url: API_URL.users(`profile/favorites/${gameId}`),
            method: 'PATCH',
        });
        return data;
    }
}

export const userService = new UserService();

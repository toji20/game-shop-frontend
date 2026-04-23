import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IUser, UserRole } from '@/shared/types';

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

    async search(query: string) {
        const { data } = await axiosWithAuth<IUser[]>({
            url: API_URL.users(`search?query=${encodeURIComponent(query)}`),
            method: 'GET',
        });
        return data;
    }

    async updateRole(id: string, role: UserRole) {
        const { data } = await axiosWithAuth<IUser>({
            url: API_URL.users(`${id}/role`),
            method: 'PUT',
            data: { role },
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

import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IAvatar, IAvatarCreate, IAvatarUpdate } from '@/shared/types';

class AvatarService {
    async getAll() {
        const { data } = await axiosClassic<IAvatar[]>({
            url: API_URL.avatar(),
            method: 'GET',
        });
        return data;
    }

    async getById(id: string) {
        const { data } = await axiosClassic<IAvatar>({
            url: API_URL.avatar(id),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IAvatarCreate) {
        const { data } = await axiosWithAuth<IAvatar>({
            url: API_URL.avatar(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: string, dto: IAvatarUpdate) {
        const { data } = await axiosWithAuth<IAvatar>({
            url: API_URL.avatar(id),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: string) {
        const { data } = await axiosWithAuth<IAvatar>({
            url: API_URL.avatar(id),
            method: 'DELETE',
        });
        return data;
    }
}

export const avatarService = new AvatarService();

import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IBanner, IBannerCreate, IBannerUpdate } from '@/shared/types';

class BannerService {
    async getAll() {
        const { data } = await axiosClassic<IBanner[]>({
            url: API_URL.banner(``),
            method: 'GET',
        });
        return data;
    }

    async getById(id: number) {
        const { data } = await axiosClassic<IBanner>({
            url: API_URL.banner(`by-id/${id}`),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IBannerCreate) {
        const { data } = await axiosWithAuth<IBanner>({
            url: API_URL.banner(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: number, dto: IBannerUpdate) {
        const { data } = await axiosWithAuth<IBanner>({
            url: API_URL.banner(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IBanner>({
            url: API_URL.banner(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const bannerService = new BannerService();

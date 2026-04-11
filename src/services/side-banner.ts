import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    ISideBanner,
    ISideBannerCreate,
    ISideBannerUpdate,
} from '@/shared/types';

class SideBannerService {
    async getAll() {
        const { data } = await axiosClassic<ISideBanner[]>({
            url: API_URL.sideBanner(``),
            method: 'GET',
        });
        return data;
    }

    async getById(id: number) {
        const { data } = await axiosClassic<ISideBanner>({
            url: API_URL.sideBanner(`by-id/${id}`),
            method: 'GET',
        });
        return data;
    }

    async create(dto: ISideBannerCreate) {
        const { data } = await axiosWithAuth<ISideBanner>({
            url: API_URL.sideBanner(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: number, dto: ISideBannerUpdate) {
        const { data } = await axiosWithAuth<ISideBanner>({
            url: API_URL.sideBanner(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<ISideBanner>({
            url: API_URL.sideBanner(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const sideBannerService = new SideBannerService();

import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import { IAdBanner, IAdBannerCreate, IAdBannerUpdate } from '@/shared/types';

class AdBannerService {
    async getAll() {
        const { data } = await axiosClassic<IAdBanner[]>({
            url: API_URL.adBanner(`active`),
            method: 'GET',
        });
        return data;
    }

    async getById(id: number) {
        const { data } = await axiosClassic<IAdBanner>({
            url: API_URL.adBanner(`by-id/${id}`),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IAdBannerCreate) {
        const { data } = await axiosWithAuth<IAdBanner>({
            url: API_URL.adBanner(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: number, dto: IAdBannerUpdate) {
        const { data } = await axiosWithAuth<IAdBanner>({
            url: API_URL.adBanner(`${id}`),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: number) {
        const { data } = await axiosWithAuth<IAdBanner>({
            url: API_URL.adBanner(`${id}`),
            method: 'DELETE',
        });
        return data;
    }
}

export const AdbannerService = new AdBannerService();

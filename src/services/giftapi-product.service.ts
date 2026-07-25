import { axiosClassic, axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    IGiftApiProduct,
    IGiftApiProductCreate,
    IGiftApiProductUpdate,
} from '@/shared/types/giftapi-product.interface';

interface IGiftApiCategoryResponse {
    success: boolean;
    data: IGiftApiProduct[];
}

class GiftApiProductService {
    async getAll() {
        const { data } = await axiosClassic<IGiftApiProduct[]>({
            url: API_URL.giftApiProducts(),
            method: 'GET',
        });

        return data;
    }

    async getById(id: string) {
        const { data } = await axiosClassic<IGiftApiProduct>({
            url: API_URL.giftApiProducts(id),
            method: 'GET',
        });

        return data;
    }

    /**
     * Получить все товары GiftAPI по названию категории,
     * например "Game Top-Ups"
     * GET /giftapi/category/:category
     */
    async getByCategory(category: string) {
        const { data } = await axiosClassic<IGiftApiCategoryResponse>({
            url: API_URL.giftApiCategory(category),
            method: 'GET',
        });

        return data.data;
    }

    async create(dto: IGiftApiProductCreate) {
        const { data } = await axiosWithAuth<IGiftApiProduct>({
            url: API_URL.giftApiProducts(),
            method: 'POST',
            data: dto,
        });

        return data;
    }

    async update(id: string, dto: IGiftApiProductUpdate) {
        const { data } = await axiosWithAuth<IGiftApiProduct>({
            url: API_URL.giftApiProducts(id),
            method: 'PUT',
            data: dto,
        });

        return data;
    }

    async delete(id: string) {
        const { data } = await axiosWithAuth({
            url: API_URL.giftApiProducts(id),
            method: 'DELETE',
        });

        return data;
    }
}

export const giftApiProductService = new GiftApiProductService();

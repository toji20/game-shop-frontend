import { axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    IPromoCode,
    IPromoCodeCreate,
    IPromoCodeUpdate,
} from '@/shared/types/promo.interface';

class PromoService {
    async getAll(): Promise<IPromoCode[]> {
        const { data } = await axiosWithAuth<IPromoCode[]>({
            url: API_URL.promo(),
            method: 'GET',
        });
        return data;
    }

    async getById(id: string): Promise<IPromoCode> {
        const { data } = await axiosWithAuth<IPromoCode>({
            url: API_URL.promo(id),
            method: 'GET',
        });
        return data;
    }

    async check(code: string) {
        const { data } = await axiosWithAuth<{
            code: string;
            discount: number;
        }>({
            url: API_URL.promo(`check/${code}`),
            method: 'GET',
        });
        return data;
    }

    async create(dto: IPromoCodeCreate): Promise<IPromoCode> {
        const { data } = await axiosWithAuth<IPromoCode>({
            url: API_URL.promo(),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async update(id: string, dto: IPromoCodeUpdate): Promise<IPromoCode> {
        const { data } = await axiosWithAuth<IPromoCode>({
            url: API_URL.promo(id),
            method: 'PUT',
            data: dto,
        });
        return data;
    }

    async delete(id: string): Promise<void> {
        await axiosWithAuth({
            url: API_URL.promo(id),
            method: 'DELETE',
        });
    }
}

export const promoService = new PromoService();

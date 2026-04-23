import { axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    IPromoCode,
    IPromoCodeCreate,
    IPromoCodeUpdate,
} from '@/shared/types/promo.interface';

export type PromoTarget = 'GAME' | 'STEAM';

export interface ICheckPromoResponse {
    code: string;
    discount: number;
    scope?: 'ALL' | 'GAMES_ONLY' | 'STEAM_ONLY';
}

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

    async check(
        code: string,
        target: PromoTarget,
    ): Promise<ICheckPromoResponse> {
        const { data } = await axiosWithAuth<ICheckPromoResponse>({
            url: API_URL.promo('check'),
            method: 'POST',
            data: {
                code,
                target,
            },
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

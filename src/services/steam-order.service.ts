import { axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    ISteamOrderCheck,
    ISteamOrderCreate,
    ISteamOrderCreateResponse,
} from '@/shared/types';

export type SteamCurrency = 'RUB' | 'USD' | 'KZT';

export interface ISteamOrderCheckResponse extends ISteamOrderCheck {
    currency: SteamCurrency;
    originalAmount: number;
}

class SteamOrderService {
    async check(
        account: string,
        amount: number,
        currency: SteamCurrency,
        promoCode?: string,
    ): Promise<ISteamOrderCheckResponse> {
        const { data } = await axiosWithAuth<ISteamOrderCheckResponse>({
            url: API_URL.steamOrders('check'),
            method: 'POST',
            data: {
                account,
                amount,
                currency,
                promoCode,
            },
        });

        return data;
    }

    async place(
        dto: ISteamOrderCreate & {
            currency: SteamCurrency;
            paymentMethod?: string;
            promoCode?: string;
        },
    ) {
        const { data } = await axiosWithAuth<ISteamOrderCreateResponse>({
            url: API_URL.steamOrders('place'),
            method: 'POST',
            data: {
                account: dto.account,
                amountRub: dto.amount,
                currency: dto.currency,
                paymentMethod: dto.paymentMethod,
                promoCode: dto.promoCode,
            },
        });

        return data;
    }
}

export const steamOrderService = new SteamOrderService();

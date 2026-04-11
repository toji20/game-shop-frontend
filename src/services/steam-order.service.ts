import { axiosWithAuth } from '../api/api.interceptors';
import { API_URL } from '../config/api.config';
import {
    ISteamOrderCheck,
    ISteamOrderCreate,
    ISteamOrderCreateResponse,
} from '@/shared/types';

export type SteamCurrency = 'RUB' | 'USD' | 'KZT';

class SteamOrderService {
    // Шаг 1: проверка аккаунта
    async check(account: string, amount: number, currency: SteamCurrency) {
        const { data } = await axiosWithAuth<ISteamOrderCheck>({
            url: API_URL.steamOrders(
                `check?account=${encodeURIComponent(account)}&amount=${amount}&currency=${currency}`,
            ),
            method: 'GET',
        });

        return data;
    }

    // Шаг 2: создание заказа
    async place(dto: ISteamOrderCreate & { currency: SteamCurrency }) {
        const { data } = await axiosWithAuth<ISteamOrderCreateResponse>({
            url: API_URL.steamOrders('place'),
            method: 'POST',
            data: {
                account: dto.account,
                amountRub: dto.amount, // важно: бэк ждёт amountRub
                currency: dto.currency,
                // customId можно убрать — он у тебя на бэке больше не используется
            },
        });

        return data;
    }
}

export const steamOrderService = new SteamOrderService();

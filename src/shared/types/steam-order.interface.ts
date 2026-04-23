import { OrderStatus, DonateHubStatus } from './order.interface';
import { IUser } from './user.interface';

// ─── Steam Order ──────────────────────────────────────────────────────────────

export interface ISteamOrder {
    id: string;
    account: string;
    amount: number;
    total: number;
    status: OrderStatus;
    donateHubCustomId: string | null;
    donateHubTransactionId: string | null;
    donateHubStatus: DonateHubStatus | null;
    donateHubError: string | null;
    userId: string;
    user?: IUser;
    createdAt: string;
    updatedAt: string;
}

// ─── Проверка аккаунта (GET /steam-orders/check) ─────────────────────────────
export interface ISteamOrderCheck {
    custom_id: string;
    total: number;
    totalRubBase: number;
    totalRubCard: number;
    totalRubSbp: number;
    rate: number;
    currency: string;
    originalAmount: number;
}
// ─── Создание заказа (POST /steam-orders/place) ───────────────────────────────

export interface ISteamOrderCreate {
    account: string;
    amount: number;
    customId: string;
}

export interface ISteamOrderCreateResponse {
    steamOrder: ISteamOrder;
    payment: {
        id: string;
        status: string;
        confirmation: {
            type: string;
            confirmation_url: string;
        };
    };
}

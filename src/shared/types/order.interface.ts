import { IGame } from './game.interface';
import { IPosition } from './game.interface';
import { IGiftApiProduct } from './giftapi-product.interface';
import { IUser } from './user.interface';

export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'IN_PROCESS'
    | 'COMPLETED'
    | 'CANCELED';
export type OrderType = 'AUTO' | 'MANUAL';
export type ManualStatus =
    | 'PENDING'
    | 'ASSIGNED'
    | 'AWAITING_2FA'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'FAILED';
export type DonateHubStatus =
    | 'SUCCESS'
    | 'FAILED'
    | 'IN_QUEUE'
    | 'PROGRESS'
    | 'WAIT';
export type PaymentMethod = 'bank_card' | 'sbp';

// ─── OrderItem ────────────────────────────────────────────────────────────────

export interface IOrderItem {
    id: string;
    orderId: string;
    gameId: number | null;
    positionId: number | null;
    giftapiProductId: string | null;
    quantity: number;
    price: number;
    fields: Record<string, string> | null;
    donateHubTransactionId: string | null;
    donateHubStatus: DonateHubStatus | null;
    donateHubError: string | null;
    game?: IGame;
    position?: IPosition;
    // GiftAPI-товар этой позиции заказа (бэкенд подгружает его через
    // include: { giftapiProduct: { include: { game: true } } }).
    // giftapiProduct.game — игра, к которой привязан товар (может быть null,
    // если товар ни к какой игре не привязан).
    giftapiProduct?: IGiftApiProduct;
    createdAt: string;
    updatedAt: string;
}

// Элемент заказа для создания. Поддерживает два варианта каталога:
// 1) старый — Position (gameId + positionId)
// 2) новый — GiftAPI (giftapiProductId)
// Оба варианта используют одинаковые quantity/price/fields.
export interface IOrderItemCreate {
    // ── legacy Position ──
    gameId?: number;
    positionId?: number;

    // ── GiftAPI ──
    giftapiProductId?: string;

    quantity: number;
    price: number;
    fields?: Record<string, string>;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export interface IOrder {
    id: string;
    status: OrderStatus;
    type: OrderType;
    total: number;
    manualStatus: ManualStatus | null;
    twoFaCode: string | null;
    twoFaRequestedAt: string | null;
    twoFaProvidedAt: string | null;
    userId: string;
    user?: IUser;
    items: IOrderItem[];
    createdAt: string;
    updatedAt: string;
}

export interface IOrderCreate {
    type?: OrderType;
    paymentMethod?: PaymentMethod;
    items: IOrderItemCreate[];
    promoCode?: string;
}

// ─── Ответ при создании заказа ────────────────────────────────────────────────

export interface IYooKassaConfirmation {
    type: string;
    confirmation_url: string;
}

export interface IYooKassaPayment {
    id: string;
    status: string;
    amount: { value: string; currency: string };
    confirmation: IYooKassaConfirmation;
    description: string;
    created_at: string;
}

export interface IOrderCreateResponse {
    order: IOrder;
    payment: IYooKassaPayment | null; // null для MANUAL заказов
}

// ─── Manual Order управление ──────────────────────────────────────────────────

export interface IUpdateManualStatus {
    status: ManualStatus;
    comment?: string;
}

export interface IProvide2FA {
    code: string;
}

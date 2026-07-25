/* eslint-disable @typescript-eslint/no-explicit-any */
import { IPositionCategory } from './position-category.interface';

export type GiftApiOrderType = 'AUTO' | 'MANUAL';

export interface IFaqItem {
    question: string;
    answer: string;
}

export interface IWarningItem {
    title: string;
    text: string;
    variant: 'danger' | 'alert';
}

export interface IGiftApiProduct {
    id: string;

    giftapiProductId: string;
    giftapiSkuId: string;

    gameId?: number | null;

    positionCategoryId?: number;
    positionCategory?: IPositionCategory;

    name: string;
    description?: string | null;
    slug?: string | null;

    discount?: number | null;

    icon?: string | null;
    iconWide?: string | null;

    bgDesktop?: string | null;
    bgMobile?: string | null;

    releaseDate?: string | null;
    ageLimit?: string | null;
    genre?: string | null;

    warnings?: IWarningItem[];
    faq?: IFaqItem[];

    instructions: string[];

    type: string;
    denominationType: string;

    category: string;

    price?: number | null;
    finalPrice: number;
    currency: string;

    stock: number;
    maxPerOrder: number;

    attributes?: Record<string, any>;

    image?: string | null;

    isActive: boolean;
    isPublic: boolean;

    orderType?: GiftApiOrderType;

    syncedAt: string;
    createdAt: string;
    updatedAt: string;

    deletedAt?: string | null;
}

export interface IGiftApiProductCreate {
    id: string;

    giftapiProductId: string;
    giftapiSkuId: string;

    gameId?: number;

    positionCategoryId?: number;
    positionCategory?: IPositionCategory;

    name: string;

    description?: string;

    slug?: string;

    discount?: number;

    icon?: string;
    iconWide?: string;

    bgDesktop?: string;
    bgMobile?: string;

    releaseDate?: string;
    ageLimit?: string;
    genre?: string;

    warnings?: IWarningItem[];

    faq?: IFaqItem[];

    instructions?: string[];

    type: string;

    denominationType: string;

    category: string;

    price?: number;

    currency: string;

    stock?: number;

    maxPerOrder?: number;

    attributes?: Record<string, any>;

    image?: string;

    isActive?: boolean;

    isPublic?: boolean;

    orderType?: GiftApiOrderType;
}

export type IGiftApiProductUpdate = Partial<
    Omit<IGiftApiProductCreate, 'gameId' | 'positionCategoryId'>
> & {
    gameId?: number | null;
    positionCategoryId?: number | null;
};

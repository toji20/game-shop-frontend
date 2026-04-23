export type PromoCodeScope = 'ALL' | 'GAMES_ONLY' | 'STEAM_ONLY';

export interface IPromoCode {
    id: string;
    code: string;
    discount: number;
    scope: PromoCodeScope;
    isActive: boolean;
    usageLimit: number | null;
    usageCount: number;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: { uses: number };
}

export interface IPromoCodeCreate {
    code: string;
    discount: number;
    scope?: PromoCodeScope;
    isActive?: boolean;
    usageLimit?: number;
    expiresAt?: string;
}

export type IPromoCodeUpdate = Partial<IPromoCodeCreate>;

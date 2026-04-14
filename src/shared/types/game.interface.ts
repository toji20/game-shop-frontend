import { ICategory } from './category.interface';
import { OrderType } from './order.interface';
import { IReview } from './review.interface';

export interface IGameField {
    id: number;
    label: string;
    required: boolean;
    gameId: number;
}

export interface IFaqItem {
    question: string;
    answer: string;
}

export interface IGameFieldCreate {
    label: string;
    required?: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface IGameServer {
    id: number;
    name: string;
    code: string | null;
    gameId: number;
}

// ─────────────────────────────────────────────────────────────────────────────

export interface IPosition {
    id: number;
    donateHubPositionId?: number;
    name: string;
    price?: number | null;
    myPrice: number;
    image: string | null;
    isActive: boolean;
    isPublic: boolean;
    gameId?: number;
    createdAt: string;
    updatedAt: string;
    discount?: number;
    finalPrice: number;
    game: IGame;
}

export interface IPositionCreate {
    name: string;
    price?: number | null;
    myPrice: number;
    image?: string;
    isActive?: boolean;
    isPublic?: boolean;
    discount?: number;
}

export type IPositionUpdate = Partial<IPositionCreate>;

// ─────────────────────────────────────────────────────────────────────────────

export type GameType = 'AUTO' | 'MANUAL';

export interface IGame {
    id: number;
    donateHubId: number;
    name: string;
    slug: string;
    description: string;
    discount: number | null;
    icon: string | null;
    iconWide: string | null;
    bgDesktop: string | null;
    bgMobile: string | null;
    isActive: boolean;
    isPublic: boolean;
    categoryId: string | null;
    category?: ICategory;
    fields?: IGameField[];
    servers?: IGameServer[];
    positions?: IPosition[];
    reviews?: IReview[];
    ageLimit: string;
    genre: string;
    releaseDate: string;
    instructions: string[];
    createdAt: string;
    updatedAt: string;
    type: GameType;
    avgRating: number | null;
    faq?: IFaqItem[];
}

export interface IGameUpdate {
    name?: string;
    description?: string;
    slug?: string;
    discount?: number;
    image?: string[];
    isActive?: boolean;
    isPublic?: boolean;
    categoryId?: string;
    ageLimit?: string;
    genre?: string;
    releaseDate?: string;
    instructions?: string[];
    type?: GameType;
}

export interface IGameCreate {
    name: string;
    description?: string;
    slug?: string;
    image?: string[];
    categoryId?: string;
    isActive?: boolean;
    isPublic?: boolean;
    donateHubId?: number;
    ageLimit?: string;
    genre?: string;
    releaseDate?: string;
    instructions?: string[];
    type?: GameType;
}

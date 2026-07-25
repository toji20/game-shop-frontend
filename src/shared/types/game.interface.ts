import { ICategory } from './category.interface';
import { IGiftApiProduct } from './giftapi-product.interface';
import { IPositionCategory } from './position-category.interface';
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

export interface IGameServer {
    id: number;
    name: string;
    code: string | null;
    gameId: number;
}

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
    categoryId?: number | null;
    category?: IPositionCategory | null;
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
    categoryId?: number | null;
}

export type IPositionUpdate = Partial<IPositionCreate>;

export type GameType = 'AUTO' | 'MANUAL';

export interface IWarningItem {
    title: string;
    text: string;
    variant: 'danger' | 'alert';
}

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
    positionCategories?: IPositionCategory[];
    fields?: IGameField[];
    servers?: IGameServer[];
    positions?: IPosition[];
    giftApiProducts?: IGiftApiProduct[];
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
    warnings?: IWarningItem[];
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
    warnings?: IWarningItem[];
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
    warnings?: IWarningItem[];
}

import { IGame } from './game.interface';
import { IUser } from './user.interface';

export interface IReview {
    id: string;
    text: string;
    rating: number;
    userId: string;
    gameId: number;
    user?: IUser;
    game?: IGame;
    createdAt: string;
    updatedAt: string;
}

export interface IReviewCreate {
    text: string;
    rating: number;
}
export interface IReviewsPaginated {
    reviews: IReview[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

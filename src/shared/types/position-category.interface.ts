export interface IPositionCategory {
    id: number;
    name: string;
    gameId: number;
    createdAt: string;
    updatedAt: string;
}

export interface IPositionCategoryCreate {
    name: string;
    gameId: number;
}

export type IPositionCategoryUpdate = Partial<IPositionCategoryCreate>;

export interface ICategory {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface ICategoryCreate {
    title: string;
    description: string;
}

export type ICategoryUpdate = Partial<ICategoryCreate>;

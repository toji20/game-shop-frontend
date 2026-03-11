export interface IBanner {
    id: number;
    title: string;
    description: string;
    images: string[];
    createdAt: string;
    updatedAt: string;
    link: string;
}

export interface IBannerCreate {
    title: string;
    description: string;
    images: string[];
    link: string;
}

export type IBannerUpdate = Partial<IBannerCreate>;

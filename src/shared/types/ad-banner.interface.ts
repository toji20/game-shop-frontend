export interface IAdBanner {
    id: number;
    title: string;
    description: string;
    image: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    link: string;
}

export interface IAdBannerCreate {
    title: string;
    description: string;
    image: string;
    link: string;
    isActive: boolean;
}

export type IAdBannerUpdate = Partial<IAdBannerCreate>;

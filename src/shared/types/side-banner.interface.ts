export interface ISideBanner {
    id: number;
    image: string;
    createdAt: string;
    updatedAt: string;
    link: string;
}

export interface ISideBannerCreate {
    image: string;
    link: string;
}

export type ISideBannerUpdate = Partial<ISideBannerCreate>;

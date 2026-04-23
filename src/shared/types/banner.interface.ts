export interface IBanner {
    id: number;
    title: string;
    description: string;
    desktopImage: string;
    mobileImage: string;
    createdAt: string;
    updatedAt: string;
    link: string;
}

export interface IBannerCreate {
    title: string;
    description: string;
    desktopImage: string;
    mobileImage: string;
    link: string;
}

export type IBannerUpdate = Partial<IBannerCreate>;

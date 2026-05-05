export interface IAvatar {
    id: string;
    image: string;
    createdAt: string;
    updatedAt: string;
}

export interface IAvatarCreate {
    image: string;
}

export type IAvatarUpdate = Partial<IAvatarCreate>;

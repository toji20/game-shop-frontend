export type UserRole = 'USER' | 'MANAGER' | 'OPERATOR' | 'ADMIN';

export interface IUser {
    id: string;
    email: string;
    name: string;
    picture: string;
    role: UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface IUserCreate {
    email: string;
    password: string;
}

export interface IUserUpdate {
    name?: string;
    picture?: string;
}

export interface IAuthDto {
    email: string;
    password: string;
}

export interface IAuthResponse {
    user: IUser;
    accessToken: string;
}

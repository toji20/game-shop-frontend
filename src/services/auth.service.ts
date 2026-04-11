import { axiosClassic } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { IAuthDto, IAuthResponse } from '@/shared/types';

class AuthService {
    async login(dto: IAuthDto) {
        const { data } = await axiosClassic<IAuthResponse>({
            url: API_URL.auth('login'),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async register(dto: IAuthDto) {
        const { data } = await axiosClassic<IAuthResponse>({
            url: API_URL.auth('register'),
            method: 'POST',
            data: dto,
        });
        return data;
    }

    async sendCode(email: string) {
        const { data } = await axiosClassic({
            url: API_URL.auth('send-code'),
            method: 'POST',
            data: { email },
        });
        return data;
    }

    async verifyCode(email: string, code: string) {
        const { data } = await axiosClassic<IAuthResponse>({
            url: API_URL.auth('verify-code'),
            method: 'POST',
            data: { email, code },
        });
        return data;
    }

    async getNewTokens() {
        const { data } = await axiosClassic<IAuthResponse>({
            url: API_URL.auth('login/access-token'),
            method: 'POST',
        });
        return data;
    }

    async logout() {
        const { data } = await axiosClassic<boolean>({
            url: API_URL.auth('logout'),
            method: 'POST',
        });
        return data;
    }
}

export const authService = new AuthService();

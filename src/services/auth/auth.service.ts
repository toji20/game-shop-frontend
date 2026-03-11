import { removeFromStorage, SaveTokenStorage } from './auth-token.service';
import { axiosClassic } from '@/api/api.interceptors';
import { API_URL } from '@/config/api.config';
import { IAuthDto, IAuthResponse } from '@/shared/types/user.interface';

class AuthService {
    async main(type: 'login' | 'register', data: IAuthDto) {
        const response = await axiosClassic<IAuthResponse>({
            url: API_URL.auth(`${type}`),
            method: 'POST',
            data,
        });

        if (response.data.accessToken)
            SaveTokenStorage(response.data.accessToken);

        return response.data;
    }

    async getNewTokens() {
        const response = await axiosClassic<IAuthResponse>({
            url: API_URL.auth('login/access-token'),
            method: 'POST',
        });

        if (response.data.accessToken)
            SaveTokenStorage(response.data.accessToken);

        return response.data;
    }

    async logout() {
        const response = await axiosClassic<boolean>({
            url: API_URL.auth('logout'),
            method: 'POST',
        });

        if (response.data) removeFromStorage();

        return response;
    }
}

export const authService = new AuthService();

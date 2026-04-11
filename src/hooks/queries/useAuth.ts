import { PUBLIC_URL } from '@/config/url.config';
import { authService } from '@/services/auth.service';
import { IAuthDto } from '@/shared/types';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useLogin() {
    const { push } = useRouter();

    const { mutate: login, isPending: isLoadingLogin } = useMutation({
        mutationKey: ['login'],
        mutationFn: (dto: IAuthDto) => authService.login(dto),
        onSuccess() {
            toast.success('Вы вошли в аккаунт');
            push(PUBLIC_URL.home());
        },
        onError() {
            toast.error('Неверный email или пароль');
        },
    });

    return useMemo(() => ({ login, isLoadingLogin }), [login, isLoadingLogin]);
}

export function useRegister() {
    const { push } = useRouter();

    const { mutate: register, isPending: isLoadingRegister } = useMutation({
        mutationKey: ['register'],
        mutationFn: (dto: IAuthDto) => authService.register(dto),
        onSuccess() {
            toast.success('Аккаунт создан');
            push(PUBLIC_URL.home());
        },
        onError() {
            toast.error('Ошибка при регистрации');
        },
    });

    return useMemo(
        () => ({ register, isLoadingRegister }),
        [register, isLoadingRegister],
    );
}

export function useSendCode() {
    const { mutate: sendCode, isPending } = useMutation({
        mutationKey: ['send-code'],
        mutationFn: (email: string) => authService.sendCode(email),
        onSuccess() {
            toast.success('Код отправлен на почту');
        },
        onError() {
            toast.error('Ошибка отправки кода');
        },
    });

    return { sendCode, isLoadingSendCode: isPending };
}

export function useVerifyCode() {
    const { push } = useRouter();

    const { mutate: verifyCode, isPending } = useMutation({
        mutationKey: ['verify-code'],
        mutationFn: ({ email, code }: { email: string; code: string }) =>
            authService.verifyCode(email, code),
        onSuccess() {
            toast.success('Вы вошли');
            push(PUBLIC_URL.home());
        },
        onError() {
            toast.error('Неверный код');
        },
    });

    return { verifyCode, isLoadingVerify: isPending };
}

export function useLogout() {
    const { push } = useRouter();

    const { mutate: logout, isPending: isLoadingLogout } = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => authService.logout(),
        onSuccess() {
            push(PUBLIC_URL.auth());
        },
        onError() {
            toast.error('Ошибка при выходе');
        },
    });

    return useMemo(
        () => ({ logout, isLoadingLogout }),
        [logout, isLoadingLogout],
    );
}

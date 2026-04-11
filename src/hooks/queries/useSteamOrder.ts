import { steamOrderService } from '@/services/steam-order.service';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function usePlaceSteamOrder() {
    const { mutate: placeSteamOrder, isPending: isLoadingPlace } = useMutation({
        mutationKey: ['place steam order'],
        mutationFn: async ({
            account,
            amount,
            currency,
        }: {
            account: string;
            amount: number;
            currency: 'RUB' | 'USD' | 'KZT';
        }) => {
            const { custom_id } = await steamOrderService.check(
                account,
                amount,
                currency,
            );

            return steamOrderService.place({
                account,
                amount,
                currency,
                customId: custom_id,
            });
        },
        onSuccess(data) {
            if (data.payment?.confirmation?.confirmation_url) {
                window.location.href =
                    data.payment.confirmation.confirmation_url;
            }
        },
        onError(
            error: AxiosError<{ error_message?: string; message?: string }>,
        ) {
            const message =
                error?.response?.data?.error_message ||
                error?.response?.data?.message ||
                'Ошибка при создании Steam заказа';
            toast.error(message);
        },
    });

    return useMemo(
        () => ({ placeSteamOrder, isLoadingPlace }),
        [placeSteamOrder, isLoadingPlace],
    );
}

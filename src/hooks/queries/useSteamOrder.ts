import { steamOrderService } from '@/services/steam-order.service';
import { useSteamStore } from '@/store/steam-store';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

type Currency = 'RUB' | 'USD' | 'KZT';
type SteamPaymentMethod = 'bank_card' | 'sbp';

interface PlaceSteamOrderParams {
    account: string;
    amount: number;
    currency: Currency;
    paymentMethod: SteamPaymentMethod;
    promoCode?: string;
}

export function usePlaceSteamOrder() {
    const { mutate: placeSteamOrder, isPending: isLoadingPlace } = useMutation({
        mutationKey: ['place steam order'],
        mutationFn: async ({
            account,
            amount,
            currency,
            paymentMethod,
            promoCode,
        }: PlaceSteamOrderParams) => {
            const checkResult = await steamOrderService.check(
                account,
                amount,
                currency,
                promoCode,
            );

            useSteamStore.getState().setCheckResult({
                totalRubBase: checkResult.totalRubBase,
                totalRubCard: checkResult.totalRubCard,
                totalRubSbp: checkResult.totalRubSbp,
                originalAmount: checkResult.originalAmount,
                currency: checkResult.currency,
            });

            return steamOrderService.place({
                account,
                amount,
                currency,
                customId: checkResult.custom_id,
                paymentMethod,
                promoCode,
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

export function useCheckSteam() {
    const { account, amount, currency, promoCode, setCheckResult } =
        useSteamStore();

    const { mutate: checkSteam, isPending: isChecking } = useMutation({
        mutationKey: ['check steam', account, amount, currency, promoCode],
        mutationFn: () =>
            steamOrderService.check(account, amount, currency, promoCode),
        onSuccess(data) {
            setCheckResult({
                totalRubBase: data.totalRubBase,
                totalRubCard: data.totalRubCard,
                totalRubSbp: data.totalRubSbp,
                originalAmount: data.originalAmount,
                currency: data.currency,
            });
        },
        onError() {
            setCheckResult(null);
        },
    });

    return { checkSteam, isChecking };
}

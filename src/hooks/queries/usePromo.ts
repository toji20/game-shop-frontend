/* eslint-disable @typescript-eslint/no-explicit-any */
import { promoService } from '@/services/promo.service';
import {
    IPromoCodeCreate,
    IPromoCodeUpdate,
} from '@/shared/types/promo.interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function usePromoCodes() {
    const { data: promoCodes, isLoading: isLoadingPromoCodes } = useQuery({
        queryKey: ['promoCodes'],
        queryFn: () => promoService.getAll(),
    });

    return useMemo(
        () => ({ promoCodes, isLoadingPromoCodes }),
        [promoCodes, isLoadingPromoCodes],
    );
}

export function useCheckPromo() {
    const {
        mutate: checkPromo,
        isPending: isCheckingPromo,
        data: promoData,
        reset: resetPromo,
        error,
    } = useMutation({
        mutationKey: ['check promo'],
        mutationFn: (code: string) => promoService.check(code),
    });

    const promoError = error
        ? ((error as any)?.response?.data?.message ?? 'Промокод недействителен')
        : null;

    return useMemo(
        () => ({
            checkPromo,
            isCheckingPromo,
            promoData,
            resetPromo,
            promoError,
        }),
        [checkPromo, isCheckingPromo, promoData, resetPromo, promoError],
    );
}

export function useCreatePromoCode() {
    const queryClient = useQueryClient();

    const { mutate: createPromoCode, isPending: isLoadingCreate } = useMutation(
        {
            mutationKey: ['create promoCode'],
            mutationFn: (dto: IPromoCodeCreate) => promoService.create(dto),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
                toast.success('Промокод создан');
            },
            onError() {
                toast.error('Ошибка при создании промокода');
            },
        },
    );

    return useMemo(
        () => ({ createPromoCode, isLoadingCreate }),
        [createPromoCode, isLoadingCreate],
    );
}

export function useUpdatePromoCode(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updatePromoCode, isPending: isLoadingUpdate } = useMutation(
        {
            mutationKey: ['update promoCode', id],
            mutationFn: (dto: IPromoCodeUpdate) => promoService.update(id, dto),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
                toast.success('Промокод обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении промокода');
            },
        },
    );

    return useMemo(
        () => ({ updatePromoCode, isLoadingUpdate }),
        [updatePromoCode, isLoadingUpdate],
    );
}

export function useDeletePromoCode() {
    const queryClient = useQueryClient();

    const { mutate: deletePromoCode, isPending: isLoadingDelete } = useMutation(
        {
            mutationKey: ['delete promoCode'],
            mutationFn: (id: string) => promoService.delete(id),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['promoCodes'] });
                toast.success('Промокод удалён');
            },
            onError() {
                toast.error('Ошибка при удалении промокода');
            },
        },
    );

    return useMemo(
        () => ({ deletePromoCode, isLoadingDelete }),
        [deletePromoCode, isLoadingDelete],
    );
}

import { sideBannerService } from '@/services/side-banner';
import { ISideBannerCreate, ISideBannerUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useSideBanner() {
    const { data: sideBanners, isLoading: isLoadingBanner } = useQuery({
        queryKey: ['sideBanners'],
        queryFn: () => sideBannerService.getAll(),
    });

    return useMemo(
        () => ({ sideBanners, isLoadingBanner }),
        [sideBanners, isLoadingBanner],
    );
}

export function useSideBannerId(id: number) {
    const { data: banner, isLoading: isLoadingBanner } = useQuery({
        queryKey: ['side banner', id],
        queryFn: () => sideBannerService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ banner, isLoadingBanner }),
        [banner, isLoadingBanner],
    );
}

export function useCreateSideBanner() {
    const queryClient = useQueryClient();

    const { mutate: createSideBanner, isPending: isLoadingCreate } =
        useMutation({
            mutationKey: ['create side banner'],
            mutationFn: (dto: ISideBannerCreate) =>
                sideBannerService.create(dto),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['sideBanners'] });
                toast.success('Баннер создан');
            },
            onError() {
                toast.error('Ошибка при создании баннера');
            },
        });

    return useMemo(
        () => ({ createSideBanner, isLoadingCreate }),
        [createSideBanner, isLoadingCreate],
    );
}

export function useUpdateSideBanner(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updateSideBanner, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update side banner', id],
            mutationFn: (dto: ISideBannerUpdate) =>
                sideBannerService.update(id, dto),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['sideBanners'] });
                queryClient.invalidateQueries({
                    queryKey: ['side banner', id],
                });
                toast.success('Баннер обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении баннера');
            },
        });

    return useMemo(
        () => ({ updateSideBanner, isLoadingUpdate }),
        [updateSideBanner, isLoadingUpdate],
    );
}

export function useDeleteSideBanner() {
    const queryClient = useQueryClient();

    const { mutate: deleteSideBanner, isPending: isLoadingDelete } =
        useMutation({
            mutationKey: ['delete side banner'],
            mutationFn: (id: number) => sideBannerService.delete(id),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['sideBanners'] });
                toast.success('Баннер удалён');
            },
            onError() {
                toast.error('Ошибка при удалении баннера');
            },
        });

    return useMemo(
        () => ({ deleteSideBanner, isLoadingDelete }),
        [deleteSideBanner, isLoadingDelete],
    );
}

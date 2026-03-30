import { AdbannerService } from '@/services/ad-banner.service';
import { IAdBannerCreate, IAdBannerUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useAdBanner() {
    const { data: adBanners, isLoading: isLoadingAdBanner } = useQuery({
        queryKey: ['AdBanners'],
        queryFn: () => AdbannerService.getAll(),
    });

    return useMemo(
        () => ({ adBanners, isLoadingAdBanner }),
        [adBanners, isLoadingAdBanner],
    );
}

export function useAdBannerId(id: number) {
    const { data: adBanner, isLoading: isLoadingAdBanner } = useQuery({
        queryKey: ['AdBanner', id],
        queryFn: () => AdbannerService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ adBanner, isLoadingAdBanner }),
        [adBanner, isLoadingAdBanner],
    );
}

export function useCreateAdBanner() {
    const queryClient = useQueryClient();

    const { mutate: createAdBanner, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create AdBanner'],
        mutationFn: (dto: IAdBannerCreate) => AdbannerService.create(dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['AdBanners'] });
            toast.success('Баннер создан');
        },
        onError() {
            toast.error('Ошибка при создании баннера');
        },
    });

    return useMemo(
        () => ({ createAdBanner, isLoadingCreate }),
        [createAdBanner, isLoadingCreate],
    );
}

export function useUpdateAdBanner(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updateAdBanner, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update AdBanner', id],
        mutationFn: (dto: IAdBannerUpdate) => AdbannerService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['AdBanners'] });
            queryClient.invalidateQueries({ queryKey: ['AdBanner', id] });
            toast.success('Баннер обновлён');
        },
        onError() {
            toast.error('Ошибка при обновлении баннера');
        },
    });

    return useMemo(
        () => ({ updateAdBanner, isLoadingUpdate }),
        [updateAdBanner, isLoadingUpdate],
    );
}

export function useDeleteAdBanner() {
    const queryClient = useQueryClient();

    const { mutate: deleteAdBanner, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete AdBanner'],
        mutationFn: (id: number) => AdbannerService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['AdBanners'] });
            toast.success('Баннер удалён');
        },
        onError() {
            toast.error('Ошибка при удалении баннера');
        },
    });

    return useMemo(
        () => ({ deleteAdBanner, isLoadingDelete }),
        [deleteAdBanner, isLoadingDelete],
    );
}

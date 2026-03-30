import { DASHBOARD_URL } from '@/config/url.config';
import { bannerService } from '@/services/banner.service';
import { IBannerCreate, IBannerUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useBanner() {
    const { data: banners, isLoading: isLoadingBanner } = useQuery({
        queryKey: ['banners'],
        queryFn: () => bannerService.getAll(),
    });

    return useMemo(
        () => ({ banners, isLoadingBanner }),
        [banners, isLoadingBanner],
    );
}

export function useBannerId(id: number) {
    const { data: banner, isLoading: isLoadingBanner } = useQuery({
        queryKey: ['banner', id],
        queryFn: () => bannerService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ banner, isLoadingBanner }),
        [banner, isLoadingBanner],
    );
}

export function useCreateBanner() {
    const queryClient = useQueryClient();

    const { mutate: createBanner, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create banner'],
        mutationFn: (dto: IBannerCreate) => bannerService.create(dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success('Баннер создан');
        },
        onError() {
            toast.error('Ошибка при создании баннера');
        },
    });

    return useMemo(
        () => ({ createBanner, isLoadingCreate }),
        [createBanner, isLoadingCreate],
    );
}

export function useUpdateBanner(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updateBanner, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update banner', id],
        mutationFn: (dto: IBannerUpdate) => bannerService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            queryClient.invalidateQueries({ queryKey: ['banner', id] });
            toast.success('Баннер обновлён');
        },
        onError() {
            toast.error('Ошибка при обновлении баннера');
        },
    });

    return useMemo(
        () => ({ updateBanner, isLoadingUpdate }),
        [updateBanner, isLoadingUpdate],
    );
}

export function useDeleteBanner() {
    const queryClient = useQueryClient();

    const { mutate: deleteBanner, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete banner'],
        mutationFn: (id: number) => bannerService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['banners'] });
            toast.success('Баннер удалён');
        },
        onError() {
            toast.error('Ошибка при удалении баннера');
        },
    });

    return useMemo(
        () => ({ deleteBanner, isLoadingDelete }),
        [deleteBanner, isLoadingDelete],
    );
}

import { avatarService } from '@/services/avatar.service';
import { IAvatarCreate, IAvatarUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useAvatars() {
    const { data: avatars, isLoading: isLoadingAvatars } = useQuery({
        queryKey: ['avatars'],
        queryFn: () => avatarService.getAll(),
    });

    return useMemo(
        () => ({ avatars, isLoadingAvatars }),
        [avatars, isLoadingAvatars],
    );
}

export function useAvatarById(id: string) {
    const { data: avatar, isLoading: isLoadingAvatar } = useQuery({
        queryKey: ['avatar', id],
        queryFn: () => avatarService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ avatar, isLoadingAvatar }),
        [avatar, isLoadingAvatar],
    );
}

export function useCreateAvatar() {
    const queryClient = useQueryClient();

    const { mutate: createAvatar, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create avatar'],
        mutationFn: (dto: IAvatarCreate) => avatarService.create(dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['avatars'] });
        },
        onError() {
            console.error('Ошибка при создании аватара');
        },
    });

    return useMemo(
        () => ({ createAvatar, isLoadingCreate }),
        [createAvatar, isLoadingCreate],
    );
}

export function useUpdateAvatar(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateAvatar, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update avatar', id],
        mutationFn: (dto: IAvatarUpdate) => avatarService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['avatars'] });
            queryClient.invalidateQueries({ queryKey: ['avatar', id] });
            console.log('Аватар обновлён');
        },
        onError() {
            console.error('Ошибка при обновлении аватара');
        },
    });

    return useMemo(
        () => ({ updateAvatar, isLoadingUpdate }),
        [updateAvatar, isLoadingUpdate],
    );
}

export function useDeleteAvatar() {
    const queryClient = useQueryClient();

    const { mutate: deleteAvatar, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete avatar'],
        mutationFn: (id: string) => avatarService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['avatars'] });
            console.log('Аватар удалён');
        },
        onError() {
            console.error('Ошибка при удалении аватара');
        },
    });

    return useMemo(
        () => ({ deleteAvatar, isLoadingDelete }),
        [deleteAvatar, isLoadingDelete],
    );
}

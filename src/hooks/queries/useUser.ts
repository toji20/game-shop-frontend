import { userService } from '@/services/user.service';
import { UserRole } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useProfile() {
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.getProfile(),
        retry: false,
        staleTime: 1000 * 60,
    });

    return useMemo(
        () => ({ profile, isLoadingProfile }),
        [profile, isLoadingProfile],
    );
}

export function useUserSearch(query: string) {
    const { data: users, isLoading } = useQuery({
        queryKey: ['user-search', query],
        queryFn: () => userService.search(query),
        enabled: query.trim().length > 0,
    });

    return useMemo(() => ({ users, isLoading }), [users, isLoading]);
}

export function useUpdateAvatar() {
    const queryClient = useQueryClient();

    const { mutate: updateAvatar, isPending: isLoadingAvatar } = useMutation({
        mutationKey: ['update avatar'],
        mutationFn: (avatarId: string | null) =>
            userService.updateAvatar(avatarId),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            console.log('Аватар обновлён');
        },
        onError() {
            console.error('Ошибка при обновлении аватара');
        },
    });

    return useMemo(
        () => ({ updateAvatar, isLoadingAvatar }),
        [updateAvatar, isLoadingAvatar],
    );
}

export function useUpdateUserRole() {
    const queryClient = useQueryClient();

    const { mutate: updateUserRole, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update user role'],
        mutationFn: ({ id, role }: { id: string; role: UserRole }) =>
            userService.updateRole(id, role),
        onSuccess(_, variables) {
            queryClient.invalidateQueries({ queryKey: ['user-search'] });
            queryClient.invalidateQueries({ queryKey: ['profile'] });
            queryClient.invalidateQueries({ queryKey: ['user', variables.id] });
            console.log('Роль пользователя обновлена');
        },
        onError() {
            console.error('Ошибка при обновлении роли');
        },
    });

    return useMemo(
        () => ({ updateUserRole, isLoadingUpdate }),
        [updateUserRole, isLoadingUpdate],
    );
}

export function useToggleFavorite() {
    const queryClient = useQueryClient();

    const { mutate: toggleFavorite, isPending: isLoadingFavorite } =
        useMutation({
            mutationKey: ['toggle favorite'],
            mutationFn: (gameId: number) => userService.toggleFavorite(gameId),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['profile'] });
            },
            onError() {
                console.error('Ошибка при обновлении избранного');
            },
        });

    return useMemo(
        () => ({ toggleFavorite, isLoadingFavorite }),
        [toggleFavorite, isLoadingFavorite],
    );
}

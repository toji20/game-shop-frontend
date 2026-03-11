import { userService } from '@/services/user.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useProfile() {
    const { data: profile, isLoading: isLoadingProfile } = useQuery({
        queryKey: ['profile'],
        queryFn: () => userService.getProfile(),
    });

    return useMemo(
        () => ({ profile, isLoadingProfile }),
        [profile, isLoadingProfile],
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
                toast.error('Ошибка при обновлении избранного');
            },
        });

    return useMemo(
        () => ({ toggleFavorite, isLoadingFavorite }),
        [toggleFavorite, isLoadingFavorite],
    );
}

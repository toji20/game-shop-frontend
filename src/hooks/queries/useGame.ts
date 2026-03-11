import { DASHBOARD_URL } from '@/config/url.config';
import { gameService } from '@/services/game.service';
import { IGameCreate, IGameUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useGames() {
    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['games'],
        queryFn: () => gameService.getAll(),
    });

    return useMemo(() => ({ games, isLoadingGames }), [games, isLoadingGames]);
}

export function useCreateGame() {
    const queryClient = useQueryClient();
    const { mutate: createGame, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create game'],
        mutationFn: (dto: IGameCreate) => gameService.create(dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            toast.success('Игра создана');
        },
        onError() {
            toast.error('Ошибка при создании игры');
        },
    });
    return { createGame, isLoadingCreate };
}

export function useUpdateGame(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updateGame, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update game', id],
        mutationFn: (dto: IGameUpdate) => gameService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            toast.success('Игра обновлена');
        },
        onError() {
            toast.error('Ошибка при обновлении игры');
        },
    });

    return useMemo(
        () => ({ updateGame, isLoadingUpdate }),
        [updateGame, isLoadingUpdate],
    );
}

export function useDeleteGame() {
    const queryClient = useQueryClient();

    const { mutate: deleteGame, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete game'],
        mutationFn: (id: number) => gameService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['games'] });
            toast.success('Игра удалена');
        },
        onError() {
            toast.error('Ошибка при удалении игры');
        },
    });

    return useMemo(
        () => ({ deleteGame, isLoadingDelete }),
        [deleteGame, isLoadingDelete],
    );
}

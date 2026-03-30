import { gameService } from '@/services/game.service';
import { IGameCreate, IGameUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useGame(id: number) {
    const { data: game, isLoading: isLoadingGame } = useQuery({
        queryKey: ['games', id],
        queryFn: () => gameService.getById(id),
        enabled: !!id,
    });

    return useMemo(() => ({ game, isLoadingGame }), [game, isLoadingGame]);
}

export function useGameBySlug(slug: string) {
    const { data: game, isLoading: isLoadingGame } = useQuery({
        queryKey: ['gamesSlug', slug],
        queryFn: () => gameService.getBySlug(slug),
        enabled: !!slug,
    });

    return useMemo(() => ({ game, isLoadingGame }), [game, isLoadingGame]);
}

export function useGames() {
    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['games'],
        queryFn: () => gameService.getAll(),
    });

    return useMemo(() => ({ games, isLoadingGames }), [games, isLoadingGames]);
}

export function useGamesActive() {
    const { data: activeGames, isLoading: isLoadingActiveGames } = useQuery({
        queryKey: ['ActiveGames'],
        queryFn: () => gameService.getAllActive(),
    });

    return useMemo(
        () => ({ activeGames, isLoadingActiveGames }),
        [activeGames, isLoadingActiveGames],
    );
}

export function useGamesPopular(limit: number) {
    const { data: popularGames, isLoading: isLoadingPopular } = useQuery({
        queryKey: ['popularGames', limit],
        queryFn: () => gameService.getPopular(limit),
    });

    return useMemo(
        () => ({ popularGames, isLoadingPopular }),
        [popularGames, isLoadingPopular],
    );
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

    return useMemo(
        () => ({ createGame, isLoadingCreate }),
        [createGame, isLoadingCreate],
    );
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

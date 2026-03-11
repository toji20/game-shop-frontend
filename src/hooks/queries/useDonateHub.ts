import { donateHubService } from '@/services/donatehub.service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useDonateHubGames() {
    const { data: games, isLoading: isLoadingGames } = useQuery({
        queryKey: ['donatehub-games'],
        queryFn: () => donateHubService.getAllGames(),
    });

    return useMemo(() => ({ games, isLoadingGames }), [games, isLoadingGames]);
}

export function useSyncDonateHub() {
    const queryClient = useQueryClient();

    const { mutate: syncAll, isPending: isLoadingSync } = useMutation({
        mutationKey: ['sync donatehub'],
        mutationFn: () => donateHubService.syncAll(),
        onSuccess() {
            // Обновляем список игр после синхронизации
            queryClient.invalidateQueries({ queryKey: ['games'] });
            queryClient.invalidateQueries({ queryKey: ['donatehub-games'] });
            toast.success('Игры синхронизированы с DonateHub');
        },
        onError() {
            toast.error('Ошибка при синхронизации');
        },
    });

    return useMemo(
        () => ({ syncAll, isLoadingSync }),
        [syncAll, isLoadingSync],
    );
}

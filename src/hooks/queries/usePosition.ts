import { positionService } from '@/services/position.service';
import { IPositionCreate, IPositionUpdate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function usePositions(gameId: number) {
    const { data: positions, isLoading: isLoadingPositions } = useQuery({
        queryKey: ['positions', gameId],
        queryFn: () => positionService.getByGameId(gameId),
        enabled: !!gameId,
    });

    return useMemo(
        () => ({ positions, isLoadingPositions }),
        [positions, isLoadingPositions],
    );
}

export function useCreatePosition(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: createPosition, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create position', gameId],
        mutationFn: (dto: IPositionCreate) =>
            positionService.create(gameId, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['positions', gameId] });
            toast.success('Позиция создана');
        },
        onError() {
            toast.error('Ошибка при создании позиции');
        },
    });

    return useMemo(
        () => ({ createPosition, isLoadingCreate }),
        [createPosition, isLoadingCreate],
    );
}

export function useUpdatePosition(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updatePosition, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update position', id],
        mutationFn: (dto: IPositionUpdate) => positionService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['positions'] });
            toast.success('Позиция обновлена');
        },
        onError() {
            toast.error('Ошибка при обновлении позиции');
        },
    });

    return useMemo(
        () => ({ updatePosition, isLoadingUpdate }),
        [updatePosition, isLoadingUpdate],
    );
}

export function useDeletePosition(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: deletePosition, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete position'],
        mutationFn: (id: number) => positionService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['positions', gameId] });
            toast.success('Позиция удалена');
        },
        onError() {
            toast.error('Ошибка при удалении позиции');
        },
    });

    return useMemo(
        () => ({ deletePosition, isLoadingDelete }),
        [deletePosition, isLoadingDelete],
    );
}

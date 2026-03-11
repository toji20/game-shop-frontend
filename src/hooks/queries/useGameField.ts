import { gameFieldService } from '@/services/game-field.service';
import { IGameFieldCreate } from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function useGameFields(gameId: number) {
    const { data: fields, isLoading: isLoadingFields } = useQuery({
        queryKey: ['game-fields', gameId],
        queryFn: () => gameFieldService.getByGameId(gameId),
        enabled: !!gameId,
    });

    return useMemo(
        () => ({ fields, isLoadingFields }),
        [fields, isLoadingFields],
    );
}

export function useCreateGameField(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: createField, isPending: isLoadingCreate } = useMutation({
        mutationKey: ['create game-field', gameId],
        mutationFn: (dto: IGameFieldCreate) =>
            gameFieldService.create(gameId, dto),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['game-fields', gameId],
            });
            toast.success('Поле создано');
        },
        onError() {
            toast.error('Ошибка при создании поля');
        },
    });

    return useMemo(
        () => ({ createField, isLoadingCreate }),
        [createField, isLoadingCreate],
    );
}

export function useUpdateGameField(id: number) {
    const queryClient = useQueryClient();

    const { mutate: updateField, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update game-field', id],
        mutationFn: (dto: Partial<IGameFieldCreate>) =>
            gameFieldService.update(id, dto),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['game-fields'],
            });
            toast.success('Поле обновлено');
        },
        onError() {
            toast.error('Ошибка при обновлении поля');
        },
    });

    return useMemo(
        () => ({ updateField, isLoadingUpdate }),
        [updateField, isLoadingUpdate],
    );
}

export function useDeleteGameField(gameId: number) {
    const queryClient = useQueryClient();

    const { mutate: deleteField, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete game-field'],
        mutationFn: (id: number) => gameFieldService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['game-fields', gameId],
            });
            toast.success('Поле удалено');
        },
        onError() {
            toast.error('Ошибка при удалении поля');
        },
    });

    return useMemo(
        () => ({ deleteField, isLoadingDelete }),
        [deleteField, isLoadingDelete],
    );
}

import { positionCategoryService } from '@/services/position-category.service';
import {
    IPositionCategoryCreate,
    IPositionCategoryUpdate,
} from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export function usePositionCategory() {
    const { data: positionCategories, isLoading: isLoadingPositionCategory } =
        useQuery({
            queryKey: ['PositionCategories'],
            queryFn: () => positionCategoryService.getAll(),
        });

    return useMemo(
        () => ({ positionCategories, isLoadingPositionCategory }),
        [positionCategories, isLoadingPositionCategory],
    );
}

export function usePositionCategoryByGame(gameId: number) {
    const { data: positionCategories, isLoading: isLoadingPositionCategory } =
        useQuery({
            queryKey: ['PositionCategories', gameId],
            queryFn: () => positionCategoryService.getByGameId(gameId),
            enabled: !!gameId,
        });

    return useMemo(
        () => ({ positionCategories, isLoadingPositionCategory }),
        [positionCategories, isLoadingPositionCategory],
    );
}

export function useCreatePositionCategory() {
    const queryClient = useQueryClient();

    const { mutate: createPositionCategory, isPending: isLoadingCreate } =
        useMutation({
            mutationKey: ['create PositionCategory'],
            mutationFn: (dto: IPositionCategoryCreate) =>
                positionCategoryService.create(dto),
            onSuccess(_, variables) {
                queryClient.invalidateQueries({
                    queryKey: ['PositionCategories'],
                });
                queryClient.invalidateQueries({
                    queryKey: ['PositionCategories', variables.gameId],
                });
                toast.success('Категория позиции создана');
            },
            onError() {
                toast.error('Ошибка при создании категории позиции');
            },
        });

    return useMemo(
        () => ({ createPositionCategory, isLoadingCreate }),
        [createPositionCategory, isLoadingCreate],
    );
}

export function useUpdatePositionCategory(id: number, gameId?: number) {
    const queryClient = useQueryClient();

    const { mutate: updatePositionCategory, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update PositionCategory', id],
            mutationFn: (dto: IPositionCategoryUpdate) =>
                positionCategoryService.update(id, dto),
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: ['PositionCategories'],
                });

                if (gameId) {
                    queryClient.invalidateQueries({
                        queryKey: ['PositionCategories', gameId],
                    });
                }

                toast.success('Категория позиции обновлена');
            },
            onError() {
                toast.error('Ошибка при обновлении категории позиции');
            },
        });

    return useMemo(
        () => ({ updatePositionCategory, isLoadingUpdate }),
        [updatePositionCategory, isLoadingUpdate],
    );
}

export function useDeletePositionCategory(gameId?: number) {
    const queryClient = useQueryClient();

    const { mutate: deletePositionCategory, isPending: isLoadingDelete } =
        useMutation({
            mutationKey: ['delete PositionCategory'],
            mutationFn: (id: number) => positionCategoryService.delete(id),
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: ['PositionCategories'],
                });

                if (gameId) {
                    queryClient.invalidateQueries({
                        queryKey: ['PositionCategories', gameId],
                    });
                }

                toast.success('Категория позиции удалена');
            },
            onError() {
                toast.error('Ошибка при удалении категории позиции');
            },
        });

    return useMemo(
        () => ({ deletePositionCategory, isLoadingDelete }),
        [deletePositionCategory, isLoadingDelete],
    );
}

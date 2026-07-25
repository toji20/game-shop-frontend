import { giftApiProductService } from '@/services/giftapi-product.service';
import {
    IGiftApiProductCreate,
    IGiftApiProductUpdate,
} from '@/shared/types/giftapi-product.interface';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

export const GAME_TOP_UPS_CATEGORY = 'Game Top-Ups';

export function useGiftApiProducts() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['giftapi-products'],
        queryFn: () => giftApiProductService.getAll(),
    });

    return useMemo(
        () => ({
            products,
            isLoading,
        }),
        [products, isLoading],
    );
}

export function useGiftApiProduct(id: string) {
    const { data: product, isLoading } = useQuery({
        queryKey: ['giftapi-product', id],
        queryFn: () => giftApiProductService.getById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({
            product,
            isLoading,
        }),
        [product, isLoading],
    );
}

/**
 * Получить все товары GiftAPI по категории (например "Game Top-Ups")
 */
export function useGiftApiProductsByCategory(
    category: string = GAME_TOP_UPS_CATEGORY,
) {
    const { data: products, isLoading } = useQuery({
        queryKey: ['giftapi-products-category', category],
        queryFn: () => giftApiProductService.getByCategory(category),
        enabled: !!category,
    });

    return useMemo(
        () => ({
            products,
            isLoading,
        }),
        [products, isLoading],
    );
}

/**
 * Товары GiftAPI, привязанные к конкретной игре (опционально — ещё и к категории).
 * Фильтрация выполняется на клиенте поверх общего списка товаров.
 */
export function useGiftApiProductsByGame(
    gameId: number,
    category: string = GAME_TOP_UPS_CATEGORY,
) {
    const { products, isLoading } = useGiftApiProducts();

    return useMemo(() => {
        const filtered = (products ?? []).filter((p) => {
            const matchesGame = p.gameId === gameId;
            const matchesCategory = category ? p.category === category : true;

            return matchesGame && matchesCategory;
        });

        return { products: filtered, isLoading };
    }, [products, isLoading, gameId, category]);
}

export function useCreateGiftApiProduct() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (dto: IGiftApiProductCreate) =>
            giftApiProductService.create(dto),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['giftapi-products'],
            });

            toast.success('Товар создан');
        },

        onError() {
            toast.error('Ошибка создания товара');
        },
    });

    return {
        createGiftApiProduct: mutate,
        isLoadingCreate: isPending,
    };
}

/**
 * Универсальная мутация обновления: id передаётся в момент вызова mutate(),
 * а не фиксируется при создании хука. Нужна для inline-действий в таблице
 * (например, привязка товара к игре прямо из строки, без открытия модалки),
 * где заранее неизвестно, какая строка будет изменена.
 */
export function useUpdateGiftApiProductById() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: ({ id, dto }: { id: string; dto: IGiftApiProductUpdate }) =>
            giftApiProductService.update(id, dto),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['giftapi-products'],
            });

            toast.success('Товар обновлен');
        },

        onError() {
            toast.error('Ошибка обновления');
        },
    });

    return {
        updateGiftApiProductById: mutate,
        isLoadingUpdateById: isPending,
    };
}

export function useUpdateGiftApiProduct(id: string) {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (dto: IGiftApiProductUpdate) =>
            giftApiProductService.update(id, dto),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['giftapi-products'],
            });

            toast.success('Товар обновлен');
        },

        onError() {
            toast.error('Ошибка обновления');
        },
    });

    return {
        updateGiftApiProduct: mutate,
        isLoadingUpdate: isPending,
    };
}

export function useDeleteGiftApiProduct() {
    const queryClient = useQueryClient();

    const { mutate, isPending } = useMutation({
        mutationFn: (id: string) => giftApiProductService.delete(id),

        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['giftapi-products'],
            });

            toast.success('Товар удален');
        },

        onError() {
            toast.error('Ошибка удаления');
        },
    });

    return {
        deleteGiftApiProduct: mutate,
        isLoadingDelete: isPending,
    };
}

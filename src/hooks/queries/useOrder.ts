import { DASHBOARD_URL } from '@/config/url.config';
import { orderService, orderApiService } from '@/services/order.service';
import {
    IOrderCreate,
    IUpdateManualStatus,
    IProvide2FA,
    ManualStatus,
} from '@/shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

// ─── Пользователь: создать заказ ─────────────────────────────────────────────

export function usePlaceOrder() {
    const queryClient = useQueryClient();
    const { mutate: placeOrder, isPending: isLoadingPlace } = useMutation({
        mutationKey: ['place order'],
        mutationFn: (dto: IOrderCreate) => orderService.place(dto),
        onSuccess(data) {
            queryClient.invalidateQueries({
                queryKey: ['manual-orders'],
            });
            if (data.payment?.confirmation?.confirmation_url) {
                // Редирект на оплату YooKassa
                window.location.href =
                    data.payment.confirmation.confirmation_url;
            }
        },
        onError() {
            toast.error('Ошибка при создании заказа');
        },
    });

    return useMemo(
        () => ({ placeOrder, isLoadingPlace }),
        [placeOrder, isLoadingPlace],
    );
}

// ─── Пользователь: ввести 2FA код ────────────────────────────────────────────

export function useProvide2FA(orderId: string) {
    const queryClient = useQueryClient();

    const { mutate: provide2FA, isPending: isLoadingProvide } = useMutation({
        mutationKey: ['provide 2fa', orderId],
        mutationFn: (dto: IProvide2FA) => orderService.provide2FA(orderId, dto),
        onSuccess() {
            queryClient.invalidateQueries({
                queryKey: ['manual-order', orderId],
            });
            toast.success('2FA код отправлен');
        },
        onError() {
            toast.error('Ошибка при отправке 2FA кода');
        },
    });

    return useMemo(
        () => ({ provide2FA, isLoadingProvide }),
        [provide2FA, isLoadingProvide],
    );
}

// ─── Сотрудники: получить все ручные заказы ───────────────────────────────────

export function useManualOrders(status?: ManualStatus) {
    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['manual-orders', status],
        queryFn: () => orderService.getAllManual(status),
        refetchInterval: 5_000,
    });

    return useMemo(
        () => ({ orders, isLoadingOrders }),
        [orders, isLoadingOrders],
    );
}

// ─── Сотрудники: получить один ручной заказ ───────────────────────────────────

export function useManualOrder(id: string) {
    const { data: order, isLoading: isLoadingOrder } = useQuery({
        queryKey: ['manual-order', id],
        queryFn: () => orderService.getManualById(id),
        refetchInterval: 10_000,
        enabled: !!id,
    });

    return useMemo(() => ({ order, isLoadingOrder }), [order, isLoadingOrder]);
}

// ─── Сотрудники: обновить статус заказа ──────────────────────────────────────

export function useUpdateManualStatus(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateStatus, isPending: isLoadingUpdate } = useMutation({
        mutationKey: ['update manual status', id],
        mutationFn: (dto: IUpdateManualStatus) =>
            orderService.updateManualStatus(id, dto),
        onSuccess() {
            // Обновляем список и конкретный заказ без перезагрузки страницы
            queryClient.invalidateQueries({ queryKey: ['manual-orders'] });
            queryClient.invalidateQueries({ queryKey: ['manual-order', id] });
            toast.success('Статус обновлён');
        },
        onError() {
            toast.error('Ошибка при обновлении статуса');
        },
    });

    return useMemo(
        () => ({ updateStatus, isLoadingUpdate }),
        [updateStatus, isLoadingUpdate],
    );
}

// ─── Сотрудники: запросить 2FA ────────────────────────────────────────────────

export function useRequest2FA(id: string) {
    const queryClient = useQueryClient();

    const { mutate: request2FA, isPending: isLoadingRequest } = useMutation({
        mutationKey: ['request 2fa', id],
        mutationFn: () => orderService.request2FA(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['manual-orders'] });
            queryClient.invalidateQueries({ queryKey: ['manual-order', id] });
            toast.success('2FA код запрошен у пользователя');
        },
        onError() {
            toast.error('Ошибка при запросе 2FA');
        },
    });

    return useMemo(
        () => ({ request2FA, isLoadingRequest }),
        [request2FA, isLoadingRequest],
    );
}

// ─── Администратор: все заказы ────────────────────────────────────────────────

export function useAllOrders() {
    const { data: orders, isLoading: isLoadingOrders } = useQuery({
        queryKey: ['all-orders'],
        queryFn: () => orderApiService.getAll(),
    });

    return useMemo(
        () => ({ orders, isLoadingOrders }),
        [orders, isLoadingOrders],
    );
}

export function useOrderById(id: string) {
    const { data: order, isLoading: isLoadingOrder } = useQuery({
        queryKey: ['order', id],
        queryFn: () => orderApiService.getById(id),
        enabled: !!id,
    });

    return useMemo(() => ({ order, isLoadingOrder }), [order, isLoadingOrder]);
}

export function useAnyOrderById(id: string) {
    const {
        data: order,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: ['any-order', id],
        queryFn: () => orderApiService.getAnyById(id),
        enabled: !!id,
    });

    return useMemo(
        () => ({ order, isLoading, refetch }),
        [order, isLoading, refetch],
    );
}

export function useUpdateSteamOrderStatus(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateSteamStatus, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update steam status', id],
            mutationFn: (status: string) =>
                orderApiService.updateSteamStatus(id, status),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['any-order', id] });
                toast.success('Статус обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении статуса');
            },
        });

    return useMemo(
        () => ({ updateSteamStatus, isLoadingUpdate }),
        [updateSteamStatus, isLoadingUpdate],
    );
}

export function useUpdateOrderItemDonateHubStatus(orderId: string) {
    const queryClient = useQueryClient();

    const { mutate: updateDonateHubStatus, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update order item donatehub status', orderId],
            mutationFn: ({
                itemId,
                status,
            }: {
                itemId: string;
                status: string;
            }) => orderApiService.updateItemDonateHubStatus(itemId, status),
            onSuccess() {
                queryClient.invalidateQueries({
                    queryKey: ['any-order', orderId],
                });
                queryClient.invalidateQueries({ queryKey: ['order', orderId] });
                toast.success('Статус DonateHub обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении статуса DonateHub');
            },
        });

    return useMemo(
        () => ({ updateDonateHubStatus, isLoadingUpdate }),
        [updateDonateHubStatus, isLoadingUpdate],
    );
}

export function useUpdateSteamDonateHubStatus(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateSteamDonateHubStatus, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update steam donatehub status', id],
            mutationFn: (status: string) =>
                orderApiService.updateSteamDonateHubStatus(id, status),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['any-order', id] });
                toast.success('Статус DonateHub обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении статуса DonateHub');
            },
        });

    return useMemo(
        () => ({ updateSteamDonateHubStatus, isLoadingUpdate }),
        [updateSteamDonateHubStatus, isLoadingUpdate],
    );
}

export function useUpdateOrderStatus(id: string) {
    const queryClient = useQueryClient();

    const { mutate: updateOrderStatus, isPending: isLoadingUpdate } =
        useMutation({
            mutationKey: ['update order status', id],
            mutationFn: (status: string) =>
                orderApiService.updateStatus(id, status),
            onSuccess() {
                queryClient.invalidateQueries({ queryKey: ['all-orders'] });
                queryClient.invalidateQueries({ queryKey: ['order', id] });
                toast.success('Статус заказа обновлён');
            },
            onError() {
                toast.error('Ошибка при обновлении статуса');
            },
        });

    return useMemo(
        () => ({ updateOrderStatus, isLoadingUpdate }),
        [updateOrderStatus, isLoadingUpdate],
    );
}

export function useDeleteOrder() {
    const { push } = useRouter();
    const queryClient = useQueryClient();

    const { mutate: deleteOrder, isPending: isLoadingDelete } = useMutation({
        mutationKey: ['delete order'],
        mutationFn: (id: string) => orderApiService.delete(id),
        onSuccess() {
            queryClient.invalidateQueries({ queryKey: ['all-orders'] });
            toast.success('Заказ удалён');
            push(DASHBOARD_URL.orders());
        },
        onError() {
            toast.error('Ошибка при удалении заказа');
        },
    });

    return useMemo(
        () => ({ deleteOrder, isLoadingDelete }),
        [deleteOrder, isLoadingDelete],
    );
}

import { IOrder, IOrderItem } from '@/shared/types';

export function useOrderProgress(order: IOrder, item?: IOrderItem) {
    const getProgress = (): number => {
        if (order.type === 'AUTO') {
            if (order.status === 'PENDING') return 1;

            // GiftAPI-специфичная логика (item.donateHubStatus для таких товаров не заполняется)
            if (item?.giftapiProduct) {
                if (order.status === 'COMPLETED') return 4;
                if (order.status === 'PAID') return 2; // деньги получены, заказ в процессе
                // при желании можно добавить промежуточный шаг 3, если бэкенд начнёт
                // прокидывать giftapiStatus во фронтовый IOrder/IOrderItem
            }

            if (item?.donateHubStatus === 'SUCCESS') return 4;
            if (item?.donateHubStatus === 'PROGRESS') return 3;
            if (item?.donateHubStatus === 'IN_QUEUE') return 2.5;
            if (item?.donateHubStatus === 'FAILED') return 3;
            if (order.status === 'COMPLETED') return 4;
            if (order.status === 'PAID') return 2;
        }

        return 1;
    };

    const progress = getProgress();

    const isCompleted =
        (order.type === 'AUTO' && progress >= 4) ||
        (order.type === 'MANUAL' && order.manualStatus === 'COMPLETED');

    const need2FA =
        order.type === 'MANUAL' && order.manualStatus === 'AWAITING_2FA';

    const progressHeight = (progress - 1) * 72;

    return { progress, progressHeight, isCompleted, need2FA };
}

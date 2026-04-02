import { IOrder, IOrderItem } from '@/shared/types';

export function useOrderProgress(order: IOrder, item?: IOrderItem) {
    const getProgress = (): number => {
        if (order.type === 'AUTO') {
            if (order.status === 'PENDING') return 1;
            if (item?.donateHubStatus === 'SUCCESS') return 4;
            if (item?.donateHubStatus === 'PROGRESS') return 3;
            if (item?.donateHubStatus === 'IN_QUEUE') return 2.5;
            if (item?.donateHubStatus === 'FAILED') return 3;
            if (order.status === 'COMPLETED') return 4;
            if (order.status === 'PAID') return 2;
        }

        if (order.type === 'MANUAL') {
            if (order.manualStatus === 'PENDING') return 1;
            if (order.manualStatus === 'ASSIGNED') return 2;
            if (order.manualStatus === 'AWAITING_2FA') return 2.5;
            if (order.manualStatus === 'IN_PROGRESS') return 3;
            if (order.manualStatus === 'COMPLETED') return 4;
            if (order.manualStatus === 'FAILED') return 3;
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

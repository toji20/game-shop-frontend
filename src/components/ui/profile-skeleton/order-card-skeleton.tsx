import { Skeleton } from '../skeleton/skeleton';

export function OrderCardSkeleton() {
    return (
        <div className='order-card order-card--skeleton'>
            <div className='order-card__img-wrap'>
                <Skeleton width='100%' height='100%' borderRadius='0' />
            </div>
            <div className='order-card__info' style={{ gap: 8 }}>
                <Skeleton width='80%' height='14px' borderRadius='4px' />
                <Skeleton width='55%' height='12px' borderRadius='4px' />
                <div className='order-card__bottom'>
                    <Skeleton width='52px' height='11px' borderRadius='4px' />
                    <Skeleton width='64px' height='11px' borderRadius='4px' />
                </div>
            </div>
        </div>
    );
}

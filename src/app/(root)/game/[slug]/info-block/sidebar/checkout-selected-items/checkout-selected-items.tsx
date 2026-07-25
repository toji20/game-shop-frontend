import './checkout-selected-items.css';
import { IGiftApiProduct } from '@/shared/types/giftapi-product.interface';

interface CheckoutSelectedItemsProps {
    items: IGiftApiProduct[];
}

export function CheckoutSelectedItems({ items }: CheckoutSelectedItemsProps) {
    return (
        <div className='checkout-selected-items'>
            <p className='checkout-selected-items__title'>Товар</p>

            <div className='checkout-selected-items__list'>
                {items.map((item) => {
                    const actualPrice = Number(item.finalPrice ?? item.price);
                    const oldPrice = Number(item.price);
                    const hasDiscount = Number(item.discount) > 0;

                    return (
                        <div
                            key={item.id}
                            className='checkout-selected-items__card'
                        >
                            <img
                                src={item.image || undefined}
                                alt={item.name}
                                className='checkout-selected-items__image'
                            />

                            <div className='checkout-selected-items__info'>
                                <span className='checkout-selected-items__name'>
                                    {item.name}
                                </span>

                                <div className='checkout-selected-items__prices'>
                                    <span className='checkout-selected-items__price'>
                                        {actualPrice.toLocaleString('ru-RU')} ₽
                                    </span>

                                    {hasDiscount && (
                                        <>
                                            <span className='checkout-selected-items__discount'>
                                                -{item.discount}%
                                            </span>
                                            <span className='checkout-selected-items__old-price'>
                                                {oldPrice.toLocaleString(
                                                    'ru-RU',
                                                )}{' '}
                                                ₽
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

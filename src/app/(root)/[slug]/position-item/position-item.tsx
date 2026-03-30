'use client';

import './position-item.css';
import { IPosition } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';

interface PositionItemProps {
    item: IPosition;
    gameId: number;
}

export function PositionItem({ item, gameId }: PositionItemProps) {
    const { toggle, isSelected } = useCartStore();
    const selected = isSelected(item.id);
    const hasDiscount = Number(item.discount) > 0;

    return (
        <div
            className={`position-item ${selected ? 'position-item--selected' : ''}`}
            onClick={() => toggle(item, gameId)}
        >
            <div className='position-item-img-wrapper'>
                <img
                    src={item.image || undefined}
                    alt={item.name}
                    className='position-item-img'
                />
                {selected && <div className='position-item-check'>✓</div>}
            </div>
            <div className='position-item-info'>
                <h4 className='position-item-info-title'>{item.name}</h4>
                <div className='position-item-info-prices'>
                    <span
                        className={`position-item-price-badge ${hasDiscount ? 'position-item-price-badge--gradient' : ''}`}
                    >
                        {hasDiscount ? item.finalPrice : item.myPrice} ₽
                    </span>
                    {hasDiscount && (
                        <span className='position-item-old-price'>
                            {item.myPrice} ₽
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

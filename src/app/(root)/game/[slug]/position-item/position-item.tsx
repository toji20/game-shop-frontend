'use client';

import './position-item.css';
import { IPosition } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';

interface PositionItemProps {
    item: IPosition;
    gameId: number;
    gameName?: string;
}

export function PositionItem({ item, gameId, gameName }: PositionItemProps) {
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
                {hasDiscount && (
                    <div className='position-item-discount-badge'>
                        -{item.discount}%
                    </div>
                )}
            </div>
            <div className='position-item-info'>
                <h4 className='position-item-info-title'>{item.name}</h4>
                <div className='position-item-info-sub'>
                    <div className='position-item-info-prices'>
                        {hasDiscount && (
                            <span className='position-item-old-price'>
                                {item.myPrice} ₽
                            </span>
                        )}
                        <span className='position-item-price'>
                            {hasDiscount ? item.finalPrice : item.myPrice} ₽
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

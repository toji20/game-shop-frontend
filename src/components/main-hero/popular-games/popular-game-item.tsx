'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { IGame } from '@/shared/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface PopularGameItemProps {
    item: IGame;
}

export function PopularGameItem({ item }: PopularGameItemProps) {
    return (
        <Link
            href={PUBLIC_URL.game(`${item.slug}`)}
            className='popular-game-item'
        >
            <div className='popular-game-item-img-wrapper'>
                {/* <div className='popular-game-item-rating'>
                    <Star className='popular-game-item-star' size={14} />
                    <span>{item.avgRating}</span>
                </div> */}
                <img
                    src={item.icon || ''}
                    alt={item.name}
                    className='popular-game-item-img'
                />
            </div>
            <div className='popular-game-item-info'>
                <h4 className='popular-game-item-info-title'>{item.name}</h4>
            </div>
        </Link>
    );
}

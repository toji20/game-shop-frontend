'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { IGame } from '@/shared/types';
import { Star } from 'lucide-react';
import Link from 'next/link';

interface CatalogItemProps {
    item: IGame;
}

export function CatalogItem({ item }: CatalogItemProps) {
    return (
        <Link href={PUBLIC_URL.game(`${item.slug}`)} className='catalog-item'>
            <div className='catalog-item-img-wrapper'>
                <img
                    src={item.iconWide || ''}
                    alt={item.name}
                    className='catalog-item-img'
                />

                <div className='catalog-item-overlay' />
            </div>

            <div className='catalog-item-info'>
                <h4 className='catalog-item-info-title'>{item.name}</h4>

                <div className='catalog-item-meta'>
                    <span className='catalog-item-rating-value'>
                        {item.avgRating ?? '—'}
                    </span>

                    <Star className='catalog-item-star-inline' size={16} />

                    <span className='catalog-item-meta-separator'>/</span>

                    <span className='catalog-item-info-genre'>
                        {item.genre || item.releaseDate || 'Без жанра'}
                    </span>
                </div>

                <div className='catalog-item-info-meta'>
                    <span className='catalog-item-rating-mobile'>
                        <Star size={12} />
                        {item.avgRating} / {item.releaseDate}
                    </span>
                </div>
            </div>
        </Link>
    );
}

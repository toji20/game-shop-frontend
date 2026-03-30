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
        <Link href={item.slug} className='catalog-item'>
            <div className='catalog-item-img-wrapper'>
                <img
                    src={item.image[1]}
                    alt={item.name}
                    className='catalog-item-img'
                />
                <div className='catalog-item-age-limit'>
                    <span>{item.ageLimit}</span>
                </div>
                <div className='catalog-item-rating'>
                    <Star className='catalog-item-star' size={14} />
                    <span>{item.avgRating}</span>
                </div>
            </div>
            <div className='catalog-item-info'>
                <h4 className='catalog-item-info-title'>{item.name}</h4>
                <p className='catalog-item-info-release-date'>
                    {item.releaseDate}
                </p>
            </div>
        </Link>
    );
}

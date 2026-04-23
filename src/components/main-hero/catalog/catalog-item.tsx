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

                {/* возраст (исчезает на мобилке) */}
                <div className='catalog-item-age-limit'>
                    <span>{item.ageLimit}</span>
                </div>

                {/* рейтинг (только десктоп) */}
                <div className='catalog-item-rating'>
                    <Star className='catalog-item-star' size={14} />
                    <span>{item.avgRating}</span>
                </div>
            </div>

            <div className='catalog-item-info'>
                <h4 className='catalog-item-info-title'>{item.name}</h4>

                {/* ДЕСКТОП дата (вернули обратно) */}
                <p className='catalog-item-info-release-date'>
                    {item.releaseDate}
                </p>

                {/* МОБИЛЬНЫЙ вариант */}
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

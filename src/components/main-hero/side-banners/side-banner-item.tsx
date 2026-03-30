'use client';

import './side-banner.css';
import { IGame } from '@/shared/types';
import Link from 'next/link';

interface SideBannerItemProps {
    item: IGame;
}

export function SideBannerItem({ item }: SideBannerItemProps) {
    return (
        <Link href={item.slug} className='side-banner-item'>
            <img
                src={item.image[1]}
                alt={item.name}
                className='side-banner-item-img'
            />
        </Link>
    );
}

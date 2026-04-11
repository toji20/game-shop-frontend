'use client';

import './side-banner.css';
import { ISideBanner } from '@/shared/types';
import Link from 'next/link';

interface SideBannerItemProps {
    item: ISideBanner;
}

export function SideBannerItem({ item }: SideBannerItemProps) {
    return (
        <Link href={item.link} className='side-banner-item'>
            <img
                src={item.image}
                alt={item.image}
                className='side-banner-item-img'
            />
        </Link>
    );
}

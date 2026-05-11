'use client';

import './side-banner.css';
import { ISideBanner } from '@/shared/types';
import Link from 'next/link';

interface SideBannerItemProps {
    item: ISideBanner;
    active?: boolean;
}

export function SideBannerItem({ item, active }: SideBannerItemProps) {
    return (
        <Link
            href={item.link}
            className={`side-banner-item${active ? ' side-banner-item--active' : ''}`}
            draggable={false}
            onDragStart={(e) => e.preventDefault()}
            tabIndex={active ? 0 : -1}
        >
            <img
                src={item.image}
                alt='Баннер'
                className='side-banner-item-img'
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
            />
        </Link>
    );
}

'use client';

import './ad-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useAdBanner } from '@/hooks/queries/useAdBanner';
import Link from 'next/link';

export function AdBanner() {
    const { adBanners, isLoadingAdBanner } = useAdBanner();

    if (isLoadingAdBanner) {
        return (
            <div className='ad-banner'>
                <Skeleton
                    width='100%'
                    height='0'
                    borderRadius={18}
                    className='ad-banner-skeleton'
                />
            </div>
        );
    }

    if (!adBanners?.length) return null;

    return (
        <div className='ad-banner'>
            {adBanners.map((item) => (
                <Link
                    href={item.link}
                    key={item.link}
                    className='ad-banner-link'
                >
                    <img
                        src={item.image}
                        alt={item.title}
                        className='ad-banner-img'
                    />
                </Link>
            ))}
        </div>
    );
}

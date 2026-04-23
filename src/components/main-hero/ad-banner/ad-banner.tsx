/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import './ad-banner.css';
import { useAdBanner } from '@/hooks/queries/useAdBanner';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const AUTOPLAY_DELAY = 4000;

export function AdBanner() {
    const { adBanners, isLoadingAdBanner } = useAdBanner();
    const [activeIndex, setActiveIndex] = useState(0);

    const activeBanners = useMemo(
        () => adBanners?.filter((item) => item.isActive !== false) ?? [],
        [adBanners],
    );

    useEffect(() => {
        if (!activeBanners.length) return;
        if (activeIndex > activeBanners.length - 1) {
            setActiveIndex(0);
        }
    }, [activeBanners, activeIndex]);

    useEffect(() => {
        if (activeBanners.length <= 1) return;

        const timer = window.setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % activeBanners.length);
        }, AUTOPLAY_DELAY);

        return () => window.clearInterval(timer);
    }, [activeBanners.length]);

    if (isLoadingAdBanner) {
        return (
            <div className='ad-banner-layout'>
                <div className='ad-banner ad-banner--main'>
                    <div className='ad-banner-skeleton' />
                </div>
                <div className='ad-banner-news ad-banner-news--desktop'>
                    <div className='ad-banner-news__skeleton' />
                </div>
            </div>
        );
    }

    if (!activeBanners.length) return null;

    const currentBanner = activeBanners[activeIndex];

    return (
        <div className='ad-banner-layout'>
            <div className='ad-banner ad-banner--main'>
                <Link
                    href={currentBanner.link || '#'}
                    className='ad-banner-link'
                >
                    <img
                        src={currentBanner.image}
                        alt={currentBanner.title}
                        className='ad-banner-img'
                    />
                </Link>

                {activeBanners.length > 1 && (
                    <div className='ad-banner-dots'>
                        {activeBanners.map((item, index) => (
                            <button
                                key={item.id}
                                type='button'
                                className={`ad-banner-dot ${index === activeIndex ? 'ad-banner-dot--active' : ''}`}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Переключить баннер ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className='ad-banner-news ad-banner-news--desktop'>
                <div className='ad-banner-news__content'>
                    <h3 className='ad-banner-news__title'>
                        Конкурсы и новости
                    </h3>
                    <p className='ad-banner-news__text'>
                        Подпишитесь на TG и VK и забирай донат бесплатно!
                    </p>

                    <div className='ad-banner-news__socials'>
                        <Link
                            href='https://vk.com'
                            target='_blank'
                            className='ad-banner-news__social'
                            aria-label='VK'
                        >
                            <img src='/vk-icon.png' alt='VK' />
                        </Link>

                        <Link
                            href='https://t.me'
                            target='_blank'
                            className='ad-banner-news__social'
                            aria-label='Telegram'
                        >
                            <img src='/tg-icon.png' alt='Telegram' />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

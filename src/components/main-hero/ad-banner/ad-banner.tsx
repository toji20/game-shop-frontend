/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import './ad-banner.css';
import { useAdBanner } from '@/hooks/queries/useAdBanner';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

const AUTOPLAY_DELAY = 4000;

const HARDCODED_BANNER = {
    id: 'hardcoded-main',
    link: '/',
    title: 'Прямое пополнение моб. игр',
    subtitle: 'Самый дешевый донат для моб. и пк игр в СНГ!',
    image: 'https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/main-banner-img.png',
    background:
        'https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/main-banner-bacground.png',
};

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

    const newsBannerJSX = (
        <div className='ad-banner-news ad-banner-news--desktop'>
            <div className='ad-banner-news__content'>
                <h3 className='ad-banner-news__title'>Конкурсы и новости</h3>
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
                        <img src='/vk-icon.svg' alt='VK' />
                    </Link>
                    <Link
                        href='https://t.me'
                        target='_blank'
                        className='ad-banner-news__social'
                        aria-label='Telegram'
                    >
                        <img src='/tg-icon.svg' alt='Telegram' />
                    </Link>
                </div>
            </div>
        </div>
    );

    if (isLoadingAdBanner) {
        return (
            <div className='ad-banner-layout'>
                <div className='ad-banner ad-banner--main'>
                    <div className='ad-banner-skeleton' />
                </div>
                {newsBannerJSX}
            </div>
        );
    }

    // Все баннеры: хардкод первым + динамические
    const allBanners = [HARDCODED_BANNER, ...activeBanners];
    const currentBanner = allBanners[activeIndex];
    const isHardcoded = activeIndex === 0;

    return (
        <div className='ad-banner-layout'>
            <div className='ad-banner ad-banner--main'>
                <Link
                    href={currentBanner.link || '#'}
                    className='ad-banner-link'
                >
                    {isHardcoded ? (
                        <div className='ad-banner-hardcoded'>
                            <img
                                src={HARDCODED_BANNER.background}
                                alt=''
                                className='ad-banner-hardcoded__bg'
                            />
                            <div className='ad-banner-hardcoded__content'>
                                <div className='ad-banner-hardcoded__text'>
                                    <h2 className='ad-banner-hardcoded__title'>
                                        {HARDCODED_BANNER.title}
                                    </h2>
                                    <p className='ad-banner-hardcoded__subtitle'>
                                        {HARDCODED_BANNER.subtitle}
                                    </p>
                                </div>
                                <img
                                    src={HARDCODED_BANNER.image}
                                    alt='Телефон'
                                    className='ad-banner-hardcoded__phone'
                                />
                            </div>
                        </div>
                    ) : (
                        <img
                            src={currentBanner.image}
                            alt={currentBanner.title}
                            className='ad-banner-img'
                        />
                    )}
                </Link>

                {allBanners.length > 1 && (
                    <div className='ad-banner-dots'>
                        {allBanners.map((item, index) => (
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

            {newsBannerJSX}
        </div>
    );
}

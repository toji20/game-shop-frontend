'use client';

import './banners.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useBanner } from '@/hooks/queries/useBanner';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export function Banners() {
    const { banners, isLoadingBanner } = useBanner();
    const [current, setCurrent] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 500,
    );
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const isDragging = useRef(false);

    const count = banners?.length ?? 0;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const next = useCallback(() => setCurrent((p) => (p + 1) % count), [count]);
    const prev = useCallback(
        () => setCurrent((p) => (p - 1 + count) % count),
        [count],
    );

    const resetTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(next, AUTO_PLAY_INTERVAL);
    }, [next]);

    useEffect(() => {
        if (!count) return;
        resetTimer();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [count, resetTimer]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const onTouchStart = (e: TouchEvent) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            isDragging.current = false;
        };
        const onTouchMove = (e: TouchEvent) => {
            const dx = Math.abs(e.touches[0].clientX - touchStartX.current);
            const dy = Math.abs(e.touches[0].clientY - touchStartY.current);
            if (dx > dy && dx > 10) {
                e.preventDefault();
                isDragging.current = true;
            }
        };
        const onTouchEnd = (e: TouchEvent) => {
            const diff = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(diff) < SWIPE_THRESHOLD) return;
            if (diff > 0) next();
            else prev();
            resetTimer();
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [next, prev, resetTimer]);

    if (isLoadingBanner) return <div className='banners-skeleton' />;

    if (!banners?.length) return null;

    return (
        <div className='banners' ref={containerRef}>
            {banners.map((b, i) => {
                const img = isMobile
                    ? b.mobileImage || b.desktopImage
                    : b.desktopImage || b.mobileImage;

                return (
                    <Link
                        key={b.id}
                        href={b.link ?? '#'}
                        className={`banners__slide ${i === current ? 'banners__slide--active' : ''}`}
                        draggable={false}
                        onClick={(e) => {
                            if (isDragging.current) e.preventDefault();
                        }}
                    >
                        {img && (
                            <img
                                src={img}
                                alt={b.title}
                                className='banners__slide-img'
                                draggable={false}
                            />
                        )}
                        {/* <div className='banners__slide-overlay'></div> */}
                    </Link>
                );
            })}

            {count > 1 && (
                <div className='banners__dots'>
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className={`banners__dot ${i === current ? 'banners__dot--active' : ''}`}
                            onClick={() => {
                                setCurrent(i);
                                resetTimer();
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

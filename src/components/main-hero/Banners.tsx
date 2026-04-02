/* eslint-disable @next/next/no-img-element */
'use client';

import './banners.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useBanner } from '@/hooks/queries/useBanner';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_PLAY_INTERVAL = 5000;
const SWIPE_THRESHOLD = 50;

export function Banners() {
    const { banners, isLoadingBanner } = useBanner();
    const [current, setCurrent] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number>(0);
    const touchStartY = useRef<number>(0);
    const isDragging = useRef(false);

    const count = banners?.length ?? 0;

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

    const handleArrow = (e: React.MouseEvent, fn: () => void) => {
        e.preventDefault();
        fn();
        resetTimer();
    };

    return (
        <div className='banners' ref={containerRef}>
            <div
                className='banners__track'
                style={{ transform: `translateX(-${current * 100}%)` }}
            >
                {banners?.map((b) => (
                    <Link
                        key={b.id}
                        href={b.link ?? '#'}
                        className='banners__slide'
                        draggable={false}
                        onClick={(e) => {
                            if (isDragging.current) e.preventDefault();
                        }}
                    >
                        {b.images?.[0] && (
                            <img
                                src={b.images[0]}
                                alt={b.title}
                                className='banners__slide-img'
                                draggable={false}
                            />
                        )}
                        <div className='banners__slide-overlay' />
                        <div className='banners__slide-content'>
                            <h2 className='banners__slide-title'>{b.title}</h2>
                            {b.description && (
                                <p className='banners__slide-desc'>
                                    {b.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {count > 1 && (
                <>
                    <button
                        className='banners__arrow banners__arrow--left'
                        onClick={(e) => handleArrow(e, prev)}
                        aria-label='Назад'
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        className='banners__arrow banners__arrow--right'
                        onClick={(e) => handleArrow(e, next)}
                        aria-label='Вперёд'
                    >
                        <ChevronRight size={20} />
                    </button>
                </>
            )}
        </div>
    );
}

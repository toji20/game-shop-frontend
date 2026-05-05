'use client';

import './banners.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useBanner } from '@/hooks/queries/useBanner';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

const AUTO_PLAY_INTERVAL = 5000;

export function Banners() {
    const { banners, isLoadingBanner } = useBanner();
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(
        () => typeof window !== 'undefined' && window.innerWidth <= 500,
    );

    const rafRef = useRef<number>(0);
    const startRef = useRef<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const count = banners?.length ?? 0;

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 500);
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const goTo = useCallback((index: number) => {
        cancelAnimationFrame(rafRef.current);
        setCurrent(index);
        startRef.current = performance.now();
    }, []);

    const next = useCallback(
        () => goTo((current + 1) % count),
        [current, count, goTo],
    );

    const prev = useCallback(
        () => goTo((current - 1 + count) % count),
        [current, count, goTo],
    );

    useEffect(() => {
        if (!count) return;

        startRef.current = performance.now();

        const tick = (now: number) => {
            const elapsed = now - startRef.current;
            const pct = Math.min((elapsed / AUTO_PLAY_INTERVAL) * 100, 100);

            if (pct >= 100) {
                setCurrent((c) => (c + 1) % count);
                // не вызываем setProgress здесь — следующий эффект запустится сам
            } else {
                setProgress(pct);
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => cancelAnimationFrame(rafRef.current);
    }, [current, count]);

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
                    </Link>
                );
            })}

            {count > 1 && (
                <>
                    <button
                        className='banners__arrow banners__arrow--left'
                        onClick={prev}
                    >
                        ‹
                    </button>
                    <button
                        className='banners__arrow banners__arrow--right'
                        onClick={next}
                    >
                        ›
                    </button>
                </>
            )}

            {count > 1 && (
                <div className='banners__dots'>
                    {banners.map((_, i) => (
                        <button
                            key={i}
                            className={`banners__dot ${i === current ? 'banners__dot--active' : ''}`}
                            onClick={() => goTo(i)}
                        >
                            <span
                                className='banners__dot-fill'
                                style={{
                                    width:
                                        i < current
                                            ? '100%'
                                            : i === current
                                              ? `${progress}%`
                                              : '0%',
                                }}
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

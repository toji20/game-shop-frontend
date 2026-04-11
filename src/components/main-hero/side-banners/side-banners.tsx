'use client';

import { SideBannerItem } from './side-banner-item';
import './side-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useGamesActive } from '@/hooks/queries/useGame';
import { useSideBanner } from '@/hooks/queries/useSideBanner';
import { useEffect, useRef } from 'react';

const SPEED = 0.4;
const ITEM_WIDTH = 327 + 25;

export function SideBanners() {
    const { sideBanners } = useSideBanner();
    const trackRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const offsetRef = useRef(0);
    const rafRef = useRef<number>(0);
    const isPaused = useRef(false);

    const touchStartX = useRef(0);
    const touchStartOffset = useRef(0);
    const isTouching = useRef(false);

    const items = sideBanners ?? [];
    const doubled = [...items, ...items, ...items];
    const loopWidth = items.length * ITEM_WIDTH;

    useEffect(() => {
        if (!items.length) return;
        const animate = () => {
            if (!isPaused.current && !isTouching.current) {
                offsetRef.current += SPEED;
                if (offsetRef.current >= loopWidth) {
                    offsetRef.current -= loopWidth;
                }
            }
            if (trackRef.current) {
                trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
            }
            rafRef.current = requestAnimationFrame(animate);
        };
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [items.length, loopWidth]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            offsetRef.current += e.deltaY * 0.5;
            offsetRef.current =
                ((offsetRef.current % loopWidth) + loopWidth) % loopWidth;
        };
        el.addEventListener('wheel', onWheel, { passive: false });
        return () => el.removeEventListener('wheel', onWheel);
    }, [loopWidth]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el) return;
        const onTouchStart = (e: TouchEvent) => {
            isTouching.current = true;
            touchStartX.current = e.touches[0].clientX;
            touchStartOffset.current = offsetRef.current;
        };
        const onTouchMove = (e: TouchEvent) => {
            if (!isTouching.current) return;
            e.preventDefault();
            const diff = touchStartX.current - e.touches[0].clientX;
            let next = touchStartOffset.current + diff;
            next = ((next % loopWidth) + loopWidth) % loopWidth;
            offsetRef.current = next;
        };
        const onTouchEnd = () => {
            isTouching.current = false;
        };
        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: false });
        el.addEventListener('touchend', onTouchEnd, { passive: true });
        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [loopWidth]);

    // Скелетон пока данные не загружены
    if (!sideBanners) {
        return (
            <div className='side-banners'>
                <div className='side-banners__track side-banners__track--static'>
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton
                            key={i}
                            width={320}
                            height={185}
                            borderRadius={16}
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (!items.length) return null;

    return (
        <div
            ref={wrapRef}
            className='side-banners'
            onMouseEnter={() => {
                isPaused.current = true;
            }}
            onMouseLeave={() => {
                isPaused.current = false;
            }}
        >
            <div className='side-banners__track' ref={trackRef}>
                {doubled.map((item, i) => (
                    <SideBannerItem item={item} key={`${item.id}-${i}`} />
                ))}
            </div>
        </div>
    );
}

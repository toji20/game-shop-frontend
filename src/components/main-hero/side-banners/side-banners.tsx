'use client';

import { SideBannerItem } from './side-banner-item';
import './side-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useSideBanner } from '@/hooks/queries/useSideBanner';
import { useEffect, useRef } from 'react';

const SPEED = 0.4;
const ITEM_WIDTH = 327 + 25;

export function SideBanners() {
    const { sideBanners } = useSideBanner();
    const items = sideBanners ?? [];
    const doubled = [...items, ...items, ...items];
    const loopWidth = items.length * ITEM_WIDTH;
    const trackRef = useRef<HTMLDivElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const offsetRef = useRef(0);
    const rafRef = useRef<number>(0);

    const isPaused = useRef(false);

    // 🖱️ drag (fixed)
    const isDragging = useRef(false);
    const startX = useRef(0);
    const startOffset = useRef(0);
    const hasMoved = useRef(false);

    // 👆 touch
    const isTouching = useRef(false);
    const touchStartX = useRef(0);
    const touchStartOffset = useRef(0);

    // 🎬 animation
    useEffect(() => {
        if (!items.length) return;

        const animate = () => {
            if (
                !isPaused.current &&
                !isDragging.current &&
                !isTouching.current
            ) {
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

    // 🖱️ wheel
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

    // 👆 touch
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

            const diff = touchStartX.current - e.touches[0].clientX;
            let next = touchStartOffset.current + diff;

            next = ((next % loopWidth) + loopWidth) % loopWidth;
            offsetRef.current = next;
        };

        const onTouchEnd = () => {
            isTouching.current = false;
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove', onTouchMove, { passive: true });
        el.addEventListener('touchend', onTouchEnd);

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove', onTouchMove);
            el.removeEventListener('touchend', onTouchEnd);
        };
    }, [loopWidth]);

    // 🖱️ drag (FIXED LIKE PopularGames)
    const onMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        hasMoved.current = false;

        startX.current = e.clientX;
        startOffset.current = offsetRef.current;

        wrapRef.current?.classList.add('is-dragging');
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;

        const delta = e.clientX - startX.current;

        if (Math.abs(delta) > 4) {
            hasMoved.current = true;
        }

        offsetRef.current = startOffset.current - delta * 1.2;
    };

    const stopDragging = () => {
        isDragging.current = false;
        wrapRef.current?.classList.remove('is-dragging');
    };

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
            onMouseEnter={() => (isPaused.current = true)}
            onMouseLeave={() => {
                isPaused.current = false;
                stopDragging();
            }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={stopDragging}
        >
            <div className='side-banners__track' ref={trackRef}>
                {doubled.map((item, i) => (
                    <SideBannerItem item={item} key={`${item.id}-${i}`} />
                ))}
            </div>
        </div>
    );
}

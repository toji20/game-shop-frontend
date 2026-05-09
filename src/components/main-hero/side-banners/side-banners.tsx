'use client';

import { SideBannerItem } from './side-banner-item';
import './side-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useSideBanner } from '@/hooks/queries/useSideBanner';
import { useEffect, useRef, useState } from 'react';

const ITEM_WIDTH_DESKTOP = 320 + 25;
const ITEM_WIDTH_MOBILE = 270 + 25;

export function SideBanners() {
    const { sideBanners } = useSideBanner();
    const items = sideBanners ?? [];
    const tripled = [...items, ...items, ...items];

    const wrapRef = useRef<HTMLDivElement>(null);

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const startScrollLeftRef = useRef(0);
    const movedRef = useRef(false);

    const [isDragging, setIsDragging] = useState(false);

    const getItemWidth = () =>
        typeof window !== 'undefined' && window.innerWidth <= 500
            ? ITEM_WIDTH_MOBILE
            : ITEM_WIDTH_DESKTOP;

    const getLoopWidth = () => items.length * getItemWidth();

    const normalizeScroll = () => {
        const el = wrapRef.current;
        if (!el || !items.length) return;
        const loopWidth = getLoopWidth();
        if (el.scrollLeft < loopWidth * 0.5) {
            el.scrollLeft += loopWidth;
        } else if (el.scrollLeft > loopWidth * 1.5) {
            el.scrollLeft -= loopWidth;
        }
    };

    useEffect(() => {
        const el = wrapRef.current;
        if (!el || !items.length) return;
        el.scrollLeft = getLoopWidth();
    }, [items.length]);

    useEffect(() => {
        const el = wrapRef.current;
        if (!el || !items.length) return;

        const handleScroll = () => normalizeScroll();

        el.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            el.removeEventListener('scroll', handleScroll);
        };
    }, [items.length]);

    useEffect(() => {
        const handleMouseUp = () => {
            isDraggingRef.current = false;
            setIsDragging(false);
        };
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = wrapRef.current;
        if (!el) return;
        isDraggingRef.current = true;
        movedRef.current = false;
        startXRef.current = e.clientX;
        startScrollLeftRef.current = el.scrollLeft;
    };

    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = wrapRef.current;
        if (!el || !isDraggingRef.current) return;

        const delta = e.clientX - startXRef.current;

        if (Math.abs(delta) > 4) {
            movedRef.current = true;
            setIsDragging(true);
        }

        el.scrollLeft = startScrollLeftRef.current - delta;
        normalizeScroll();
    };

    const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
        if (movedRef.current) {
            e.preventDefault();
            e.stopPropagation();
        }
        movedRef.current = false;
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
            className={`side-banners ${isDragging ? 'is-dragging' : ''}`}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onClickCapture={onClickCapture}
        >
            <div className='side-banners__track'>
                {tripled.map((item, i) => (
                    <SideBannerItem item={item} key={`${item.id}-${i}`} />
                ))}
            </div>
        </div>
    );
}

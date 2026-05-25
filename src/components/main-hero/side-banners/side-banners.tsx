'use client';

import { SideBannerItem } from './side-banner-item';
import './side-banner.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useSideBanner } from '@/hooks/queries/useSideBanner';
import { useEffect, useRef, useState, useCallback } from 'react';

export function SideBanners() {
    const { sideBanners } = useSideBanner();
    const items = sideBanners ?? [];

    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);

    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const movedRef = useRef(false);
    const dragOffsetRef = useRef(0);

    const autoplayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const stageRef = useRef<HTMLDivElement>(null);

    const count = items.length;

    const getIndex = useCallback(
        (i: number) => ((i % count) + count) % count,
        [count],
    );

    const goTo = useCallback(
        (index: number) => {
            if (count === 0) return;
            setActiveIndex(getIndex(index));
        },
        [count, getIndex],
    );

    const prev = useCallback(() => {
        goTo(activeIndex - 1);
    }, [activeIndex, goTo]);

    const next = useCallback(() => {
        goTo(activeIndex + 1);
    }, [activeIndex, goTo]);

    const resetAutoplay = useCallback(() => {
        if (autoplayRef.current) {
            clearTimeout(autoplayRef.current);
        }

        if (count > 1) {
            autoplayRef.current = setTimeout(() => {
                next();
            }, 4000);
        }
    }, [count, next]);

    useEffect(() => {
        resetAutoplay();

        return () => {
            if (autoplayRef.current) {
                clearTimeout(autoplayRef.current);
            }
        };
    }, [activeIndex, resetAutoplay]);

    // TOUCH
    useEffect(() => {
        const stage = stageRef.current;

        if (!stage) return;

        const handleTouchStart = (e: TouchEvent) => {
            startXRef.current = e.touches[0].clientX;
            movedRef.current = false;
            dragOffsetRef.current = 0;
        };

        const handleTouchMove = (e: TouchEvent) => {
            const delta = e.touches[0].clientX - startXRef.current;

            if (Math.abs(delta) > 8) {
                movedRef.current = true;
                e.preventDefault();
            }

            dragOffsetRef.current = delta;
        };

        const handleTouchEnd = () => {
            const offset = dragOffsetRef.current;

            if (offset < -50) {
                next();
            } else if (offset > 50) {
                prev();
            }

            dragOffsetRef.current = 0;
            movedRef.current = false;
        };

        stage.addEventListener('touchstart', handleTouchStart, {
            passive: true,
        });

        stage.addEventListener('touchmove', handleTouchMove, {
            passive: false,
        });

        stage.addEventListener('touchend', handleTouchEnd);

        return () => {
            stage.removeEventListener('touchstart', handleTouchStart);
            stage.removeEventListener('touchmove', handleTouchMove);
            stage.removeEventListener('touchend', handleTouchEnd);
        };
    }, [next, prev]);

    // MOUSE
    const onMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        setIsDragging(true);

        movedRef.current = false;
        startXRef.current = e.clientX;
        dragOffsetRef.current = 0;
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDraggingRef.current) return;

        const delta = e.clientX - startXRef.current;

        if (Math.abs(delta) > 4) {
            movedRef.current = true;
            dragOffsetRef.current = delta;
        }
    };

    const onMouseUp = () => {
        if (!isDraggingRef.current) return;

        isDraggingRef.current = false;
        setIsDragging(false);

        if (movedRef.current) {
            const offset = dragOffsetRef.current;

            if (offset < -50) {
                next();
            } else if (offset > 50) {
                prev();
            }
        }

        dragOffsetRef.current = 0;
        movedRef.current = false;
    };

    const onClickCapture = (e: React.MouseEvent) => {
        if (movedRef.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    if (!sideBanners) {
        return (
            <div className='side-banners'>
                <div className='side-banners__stage'>
                    <div className='side-banner-item'>
                        <Skeleton width={360} height={195} borderRadius={16} />
                    </div>
                </div>
            </div>
        );
    }

    if (!items.length) return null;

    type SlotPosition =
        | 'prev3'
        | 'prev2'
        | 'prev'
        | 'active'
        | 'next'
        | 'next2'
        | 'next3';

    const slots = [
        {
            item: items[getIndex(activeIndex - 3)],
            position: 'prev3' as SlotPosition,
            idx: getIndex(activeIndex - 3),
        },
        {
            item: items[getIndex(activeIndex - 2)],
            position: 'prev2' as SlotPosition,
            idx: getIndex(activeIndex - 2),
        },
        {
            item: items[getIndex(activeIndex - 1)],
            position: 'prev' as SlotPosition,
            idx: getIndex(activeIndex - 1),
        },
        {
            item: items[activeIndex],
            position: 'active' as SlotPosition,
            idx: activeIndex,
        },
        {
            item: items[getIndex(activeIndex + 1)],
            position: 'next' as SlotPosition,
            idx: getIndex(activeIndex + 1),
        },
        {
            item: items[getIndex(activeIndex + 2)],
            position: 'next2' as SlotPosition,
            idx: getIndex(activeIndex + 2),
        },
        {
            item: items[getIndex(activeIndex + 3)],
            position: 'next3' as SlotPosition,
            idx: getIndex(activeIndex + 3),
        },
    ];

    return (
        <div className='side-banners'>
            <div
                ref={stageRef}
                className={`side-banners__stage${
                    isDragging ? ' is-dragging' : ''
                }`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                onClickCapture={onClickCapture}
            >
                {slots.map(({ item, position, idx }) => (
                    <div
                        key={`${position}-${idx}`}
                        className={`side-banners__slot side-banners__slot--${position}`}
                        onClick={() => {
                            if (position === 'prev') prev();
                            if (position === 'next') next();
                            if (position === 'prev2') goTo(activeIndex - 2);
                            if (position === 'next2') goTo(activeIndex + 2);
                            if (position === 'prev3') goTo(activeIndex - 3);
                            if (position === 'next3') goTo(activeIndex + 3);
                        }}
                    >
                        <SideBannerItem
                            item={item}
                            active={position === 'active'}
                        />
                    </div>
                ))}
            </div>

            {count > 1 && (
                <div className='side-banners__dots'>
                    {items.map((_, i) => (
                        <button
                            key={i}
                            className={`side-banners__dot${
                                i === activeIndex
                                    ? ' side-banners__dot--active'
                                    : ''
                            }`}
                            onClick={() => goTo(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

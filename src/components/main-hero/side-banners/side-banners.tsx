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
    const [isAnimating, setIsAnimating] = useState(false);
    const [prevIndex, setPrevIndex] = useState<number | null>(null);

    // ИСПРАВЛЕНО: isDragging переведён в state чтобы вызывать ре-рендер
    // (ref не реактивный — className с ref не обновлялся на продакшне)
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
            if (isAnimating || count === 0) return;
            setPrevIndex(activeIndex);
            setIsAnimating(true);
            setActiveIndex(getIndex(index));
            setTimeout(() => {
                setIsAnimating(false);
                setPrevIndex(null);
            }, 550);
        },
        [isAnimating, count, activeIndex, getIndex],
    );

    const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
    const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

    const resetAutoplay = useCallback(() => {
        if (autoplayRef.current) clearTimeout(autoplayRef.current);
        if (count > 1) {
            autoplayRef.current = setTimeout(() => next(), 4000);
        }
    }, [count, next]);

    useEffect(() => {
        resetAutoplay();
        return () => {
            if (autoplayRef.current) clearTimeout(autoplayRef.current);
        };
    }, [activeIndex, resetAutoplay]);

    // ИСПРАВЛЕНО: нативные touch-листенеры с passive: false
    // React по умолчанию вешает листенеры без passive, что блокирует scroll
    // и вызывает дёрганье на мобиле. Нативные листенеры дают полный контроль.
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
                // Предотвращаем горизонтальный скролл страницы
                e.preventDefault();
            }
            dragOffsetRef.current = delta;
        };

        const handleTouchEnd = () => {
            const offset = dragOffsetRef.current;
            if (offset < -50) next();
            else if (offset > 50) prev();
            dragOffsetRef.current = 0;
            movedRef.current = false;
        };

        // passive: false нужен чтобы e.preventDefault() работал в touchmove
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

    const onMouseDown = (e: React.MouseEvent) => {
        isDraggingRef.current = true;
        setIsDragging(true); // ИСПРАВЛЕНО: обновляем state для ре-рендера
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
        setIsDragging(false); // ИСПРАВЛЕНО
        if (movedRef.current) {
            const offset = dragOffsetRef.current;
            if (offset < -50) next();
            else if (offset > 50) prev();
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
                    <div className='side-banners__slot side-banners__slot--prev3'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--prev2'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--prev'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--active'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--next'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--next2'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>

                    <div className='side-banners__slot side-banners__slot--next3'>
                        <div className='side-banner-item'>
                            <Skeleton
                                width={360}
                                height={195}
                                borderRadius={16}
                            />
                        </div>
                    </div>
                </div>

                <div className='side-banners__dots'>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className={`side-banners__dot ${
                                i === 0 ? 'side-banners__dot--active' : ''
                            }`}
                        />
                    ))}
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

    const buildSlots = (): {
        item: (typeof items)[0];
        position: SlotPosition;
        idx: number;
        isHiding?: boolean;
    }[] => {
        const slots: {
            item: (typeof items)[0];
            position: SlotPosition;
            idx: number;
            isHiding?: boolean;
        }[] = [];

        if (count === 1) {
            return [{ item: items[0], position: 'active', idx: 0 }];
        }
        if (count === 2) {
            return [
                {
                    item: items[getIndex(activeIndex - 1)],
                    position: 'prev',
                    idx: getIndex(activeIndex - 1),
                },
                {
                    item: items[activeIndex],
                    position: 'active',
                    idx: activeIndex,
                },
                {
                    item: items[getIndex(activeIndex + 1)],
                    position: 'next',
                    idx: getIndex(activeIndex + 1),
                },
            ];
        }

        // 3+ items — show prev3/next3 for desktop
        const mainSlots = [
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

        // Если идет анимация, добавляем старые крайние элементы с классом hiding
        if (isAnimating && prevIndex !== null) {
            const prevSlots = [
                {
                    item: items[getIndex(prevIndex - 3)],
                    position: 'prev3' as SlotPosition,
                    idx: getIndex(prevIndex - 3),
                    isHiding: true,
                },
                {
                    item: items[getIndex(prevIndex + 3)],
                    position: 'next3' as SlotPosition,
                    idx: getIndex(prevIndex + 3),
                    isHiding: true,
                },
            ];

            prevSlots.forEach((oldSlot) => {
                if (
                    !mainSlots.some(
                        (newSlot) =>
                            newSlot.idx === oldSlot.idx &&
                            newSlot.position === oldSlot.position,
                    )
                ) {
                    slots.push(oldSlot);
                }
            });
        }

        return [...slots, ...mainSlots];
    };

    const slots = buildSlots();

    return (
        <div className='side-banners'>
            <div
                ref={stageRef}
                // ИСПРАВЛЕНО: используем isDragging (state) вместо isDraggingRef.current (ref)
                className={`side-banners__stage${isDragging ? ' is-dragging' : ''}`}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={onMouseUp}
                onMouseLeave={onMouseUp}
                // Touch-события убраны отсюда — обрабатываются нативно в useEffect
                onClickCapture={onClickCapture}
            >
                {slots.map(({ item, position, idx, isHiding }) => (
                    <div
                        key={`${item.id}-${idx}-${isHiding ? 'hiding' : 'visible'}`}
                        className={`side-banners__slot side-banners__slot--${position}${isHiding ? ' side-banners__slot--hiding' : ''}`}
                        onClick={() => {
                            if (isHiding) return;
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
                            active={position === 'active' && !isHiding}
                        />
                    </div>
                ))}
            </div>

            {count > 1 && (
                <div className='side-banners__dots'>
                    {items.map((_, i) => (
                        <button
                            key={i}
                            className={`side-banners__dot${i === activeIndex ? ' side-banners__dot--active' : ''}`}
                            onClick={() => goTo(i)}
                            aria-label={`Перейти к баннеру ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

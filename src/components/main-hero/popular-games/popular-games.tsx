'use client';

import { PopularGameItem } from './popular-game-item';
import './popular-games.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useCategories } from '@/hooks/queries/useCategory';
import { useGamesPopular } from '@/hooks/queries/useGame';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Props {
    hasTitle?: boolean;
}

export function PopularGames({ hasTitle = true }: Props) {
    const { popularGames } = useGamesPopular(12);
    const { categories } = useCategories();

    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const startX = useRef(0);
    const startScrollLeft = useRef(0);
    const isMouseDown = useRef(false);
    const hasMoved = useRef(false);

    const filtered = selectedCategory
        ? popularGames?.filter((g) => g.categoryId === selectedCategory)
        : popularGames;

    const updateArrows = () => {
        const el = scrollRef.current;
        if (!el) return;

        const maxScrollLeft = el.scrollWidth - el.clientWidth;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft < maxScrollLeft - 4);
    };

    const scrollByAmount = (direction: 'left' | 'right') => {
        const el = scrollRef.current;
        if (!el) return;

        const amount = Math.max(el.clientWidth * 0.8, 260);

        el.scrollBy({
            left: direction === 'left' ? -amount : amount,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        updateArrows();

        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

            e.preventDefault();
            el.scrollLeft += e.deltaY;
            updateArrows();
        };

        const onDragStart = (e: DragEvent) => e.preventDefault();
        const onScroll = () => updateArrows();
        const onResize = () => updateArrows();

        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('dragstart', onDragStart);
        el.addEventListener('scroll', onScroll);
        window.addEventListener('resize', onResize);

        return () => {
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('dragstart', onDragStart);
            el.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        el.scrollTo({ left: 0, behavior: 'auto' });
        updateArrows();
    }, [filtered?.length]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const el = scrollRef.current;
            if (!isMouseDown.current || !el) return;

            const delta = e.clientX - startX.current;

            if (Math.abs(delta) > 8) {
                hasMoved.current = true;

                if (!isDragging) {
                    setIsDragging(true);
                }
            }

            if (!hasMoved.current) return;

            el.scrollLeft = startScrollLeft.current - delta;
            updateArrows();
        };

        const handleMouseUp = () => {
            isMouseDown.current = false;

            if (isDragging) {
                setIsDragging(false);
            }

            window.setTimeout(() => {
                hasMoved.current = false;
            }, 0);
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.button !== 0 || !scrollRef.current) return;

        isMouseDown.current = true;
        hasMoved.current = false;
        startX.current = e.clientX;
        startScrollLeft.current = scrollRef.current.scrollLeft;
    };

    const onClickCapture = (e: React.MouseEvent) => {
        if (hasMoved.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <div className='popular-games'>
            <div className='popular-games-header'>
                {hasTitle && (
                    <h3 className='popular-games-title'>Популярные позиции</h3>
                )}

                <div className='popular-games-filters'>
                    <button
                        className={`popular-games-filter-btn ${
                            selectedCategory === null
                                ? 'popular-games-filter-btn--active'
                                : ''
                        }`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Все
                    </button>

                    {categories?.map((c) => (
                        <button
                            key={c.id}
                            className={`popular-games-filter-btn ${
                                selectedCategory === c.id
                                    ? 'popular-games-filter-btn--active'
                                    : ''
                            }`}
                            onClick={() =>
                                setSelectedCategory(
                                    selectedCategory === c.id ? null : c.id,
                                )
                            }
                        >
                            {c.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className='popular-games-slider'>
                <button
                    type='button'
                    className='popular-games-arrow popular-games-arrow--left'
                    onClick={() => scrollByAmount('left')}
                    disabled={!canScrollLeft}
                    aria-label='Прокрутить влево'
                >
                    <ChevronLeft size={28} strokeWidth={2.2} />
                </button>

                <button
                    type='button'
                    className='popular-games-arrow popular-games-arrow--right'
                    onClick={() => scrollByAmount('right')}
                    disabled={!canScrollRight}
                    aria-label='Прокрутить вправо'
                >
                    <ChevronRight size={28} strokeWidth={2.2} />
                </button>

                <div
                    className={`popular-games-scroll ${
                        isDragging ? 'is-dragging' : ''
                    } ${canScrollLeft ? 'popular-games-scroll--scrolled' : ''}`}
                    ref={scrollRef}
                    onMouseDown={onMouseDown}
                    onClickCapture={onClickCapture}
                >
                    <div className='popular-games-items'>
                        {!popularGames
                            ? Array.from({ length: 8 }).map((_, i) => (
                                  <div key={i} className='popular-game-item'>
                                      <div className='popular-game-item-img-wrapper'>
                                          <Skeleton
                                              width='100%'
                                              height='100%'
                                              borderRadius={12}
                                          />
                                      </div>

                                      <div className='popular-game-item-info'>
                                          <Skeleton
                                              width='75%'
                                              height={16}
                                              borderRadius={4}
                                          />
                                          <Skeleton
                                              width='45%'
                                              height={12}
                                              borderRadius={4}
                                          />
                                      </div>
                                  </div>
                              ))
                            : filtered?.map((item) => (
                                  <PopularGameItem key={item.id} item={item} />
                              ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

'use client';

import { PopularGameItem } from './popular-game-item';
import './popular-games.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useCategories } from '@/hooks/queries/useCategory';
import { useGamesPopular } from '@/hooks/queries/useGame';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface Props {
    hasTitle?: boolean;
}

export function PopularGames({ hasTitle = true }: Props) {
    const { popularGames } = useGamesPopular(12);
    const { categories } = useCategories();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null,
    );

    const {
        scrollRef,
        canScrollLeft,
        canScrollRight,
        isDragging,
        scrollByAmount,
        resetScroll,
        onMouseDown,
        onClickCapture,
    } = useHorizontalScroll();

    const filtered = selectedCategory
        ? popularGames?.filter((g) => g.categoryId === selectedCategory)
        : popularGames;

    useEffect(() => {
        resetScroll();
    }, [filtered?.length]);

    return (
        <div className='popular-games'>
            <div className='popular-games-header'>
                {hasTitle && (
                    <h3 className='popular-games-title'>Популярные позиции</h3>
                )}

                <div className='popular-games-filters'>
                    <button
                        className={`popular-games-filter-btn ${selectedCategory === null ? 'popular-games-filter-btn--active' : ''}`}
                        onClick={() => setSelectedCategory(null)}
                    >
                        Все
                    </button>
                    {categories?.map((c) => (
                        <button
                            key={c.id}
                            className={`popular-games-filter-btn ${selectedCategory === c.id ? 'popular-games-filter-btn--active' : ''}`}
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
                    className={`popular-games-scroll ${isDragging ? 'is-dragging' : ''} ${canScrollLeft ? 'popular-games-scroll--scrolled' : ''}`}
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
                                          {' '}
                                          <Skeleton
                                              width='75%'
                                              height={25}
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

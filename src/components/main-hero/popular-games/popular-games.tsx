'use client';

import { PopularGameItem } from './popular-game-item';
import './popular-games.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useGamesPopular } from '@/hooks/queries/useGame';
import { useRef, useEffect } from 'react';

interface Props {
    hasTitle?: boolean;
}

export function PopularGames({ hasTitle = true }: Props) {
    const { popularGames } = useGamesPopular(12);
    const scrollRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);
    const hasMoved = useRef(false);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        };
        const onDragStart = (e: DragEvent) => e.preventDefault();
        el.addEventListener('wheel', onWheel, { passive: false });
        el.addEventListener('dragstart', onDragStart);
        return () => {
            el.removeEventListener('wheel', onWheel);
            el.removeEventListener('dragstart', onDragStart);
        };
    }, []);

    const onMouseDown = (e: React.MouseEvent) => {
        if (!scrollRef.current) return;
        isDragging.current = true;
        hasMoved.current = false;
        startX.current = e.clientX;
        scrollLeft.current = scrollRef.current.scrollLeft;
        scrollRef.current.style.cursor = 'grabbing';
    };

    const onMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current || !scrollRef.current) return;
        const delta = e.clientX - startX.current;
        if (Math.abs(delta) > 4) hasMoved.current = true;
        scrollRef.current.scrollLeft = scrollLeft.current - delta * 1.2;
    };

    const stopDragging = () => {
        isDragging.current = false;
        if (scrollRef.current) scrollRef.current.style.cursor = 'grab';
    };

    const onClickCapture = (e: React.MouseEvent) => {
        if (hasMoved.current) {
            e.preventDefault();
            e.stopPropagation();
        }
    };

    return (
        <div className='popular-games'>
            {hasTitle && (
                <h3 className='popular-games-title'>Популярные позиции</h3>
            )}
            <div
                className='popular-games-scroll'
                ref={scrollRef}
                onMouseDown={onMouseDown}
                onMouseMove={onMouseMove}
                onMouseUp={stopDragging}
                onMouseLeave={stopDragging}
                onClickCapture={onClickCapture}
            >
                <div className='popular-games-items'>
                    {!popularGames
                        ? Array.from({ length: 8 }).map((_, i) => (
                              <div key={i} className='popular-game-item'>
                                  <Skeleton
                                      width={220}
                                      height={200}
                                      borderRadius={12}
                                  />
                                  <div
                                      className='popular-game-item-info'
                                      style={{
                                          marginTop: 15,
                                          gap: 6,
                                          display: 'flex',
                                          flexDirection: 'column',
                                      }}
                                  >
                                      <Skeleton width='80%' height={15} />
                                      <Skeleton width='50%' height={13} />
                                  </div>
                              </div>
                          ))
                        : popularGames.map((item) => (
                              <PopularGameItem key={item.id} item={item} />
                          ))}
                </div>
            </div>
        </div>
    );
}

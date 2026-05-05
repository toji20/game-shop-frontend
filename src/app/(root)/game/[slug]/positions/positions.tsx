'use client';

import { PositionItem } from '../position-item/position-item';
import './positions.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { IPosition } from '@/shared/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const INITIAL_ROWS = 2;
const COLS = 3;
const INITIAL_COUNT = INITIAL_ROWS * COLS;

interface PositionsProps {
    items: IPosition[];
    gameId: number;
    gameName?: string;
    selectedCategory?: number | null;
}

export function Positions({
    items,
    gameId,
    gameName,
    selectedCategory = null,
}: PositionsProps) {
    const [expanded, setExpanded] = useState(false);

    if (!items.length) {
        return (
            <div className='positions-block'>
                {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} height={207} borderRadius={10} />
                ))}
            </div>
        );
    }

    const filtered =
        selectedCategory !== null
            ? items.filter((item) => item.categoryId === selectedCategory)
            : items;

    const hasMore = filtered.length > INITIAL_COUNT;
    const visible = expanded ? filtered : filtered.slice(0, INITIAL_COUNT);

    return (
        <div className='positions'>
            <div
                className={`positions-block-wrap ${!expanded && hasMore ? 'positions-block-wrap--faded' : ''}`}
            >
                <div className='positions-block'>
                    {visible.map((item) => (
                        <PositionItem
                            item={item}
                            key={item.id}
                            gameId={gameId}
                            gameName={gameName}
                        />
                    ))}
                </div>

                {!expanded && hasMore && <div className='positions-fade' />}
            </div>

            {hasMore && (
                <button
                    className={`positions-more-btn ${expanded ? 'positions-more-btn--expanded' : ''}`}
                    onClick={() => setExpanded((v) => !v)}
                >
                    <span>
                        {expanded
                            ? 'Свернуть'
                            : `Показать ещё ${filtered.length - INITIAL_COUNT}`}
                    </span>
                    <ChevronDown
                        size={16}
                        className='positions-more-btn__icon'
                    />
                </button>
            )}
        </div>
    );
}

'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { useGamesActive } from '@/hooks/queries/useGame';
import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { RefObject, useEffect, useRef, useState } from 'react';

interface SearchBarProps {
    onClose?: () => void;
    onOpen?: () => void;
    isOpen?: boolean;
    triggerRef?: RefObject<HTMLButtonElement | null>;
}

export function SearchBar({
    onClose,
    onOpen,
    isOpen = false,
    triggerRef,
}: SearchBarProps) {
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { activeGames } = useGamesActive();

    const filtered =
        query.trim().length >= 1
            ? (activeGames ?? [])
                  .filter((g) =>
                      g.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .slice(0, 8)
            : (activeGames ?? []).slice(0, 6);

    useEffect(() => {
        if (isOpen && window.innerWidth > 500) {
            const t = setTimeout(() => inputRef.current?.focus(), 120);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Node;

            if (wrapRef.current && wrapRef.current.contains(target)) return;

            if (triggerRef?.current && triggerRef.current.contains(target))
                return;

            onClose?.();
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose, triggerRef]);

    const handleSelect = (slug: string) => {
        setQuery('');
        onClose?.();
        router.push(PUBLIC_URL.game(slug));
    };

    return (
        <div className='searchbar' ref={wrapRef}>
            <div className='searchbar__input-wrap'>
                <Search className='searchbar__icon' />
                <input
                    ref={inputRef}
                    className='searchbar__input'
                    placeholder='Поиск...'
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        onOpen?.();
                    }}
                />
            </div>

            {isOpen && (
                <div className='searchbar__dropdown'>
                    {filtered.length === 0 ? (
                        <p className='searchbar__empty'>Ничего не найдено</p>
                    ) : (
                        filtered.map((g) => (
                            <div
                                key={g.slug}
                                className='searchbar__item'
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(g.slug);
                                }}
                            >
                                {g.icon ? (
                                    <img
                                        src={g.icon}
                                        alt={g.name}
                                        className='searchbar__item-img'
                                    />
                                ) : (
                                    <div className='searchbar__item-img searchbar__item-img--placeholder'>
                                        🎮
                                    </div>
                                )}

                                <div>
                                    <div className='searchbar__item-name'>
                                        {g.name}
                                    </div>
                                    {g.category && (
                                        <div className='searchbar__item-category'>
                                            {g.category.title}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

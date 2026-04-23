'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { useGames } from '@/hooks/queries/useGame';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
    onClose?: () => void;
    onOpen?: () => void;
    isOpen?: boolean;
}

export function SearchBar({ onClose, onOpen, isOpen = false }: SearchBarProps) {
    const [query, setQuery] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const { games } = useGames();

    const filtered =
        query.trim().length >= 1
            ? (games ?? [])
                  .filter((g) =>
                      g.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .slice(0, 8)
            : (games ?? []).slice(0, 6);

    // автофокус (только десктоп)
    useEffect(() => {
        if (isOpen && window.innerWidth > 500) {
            const t = setTimeout(() => inputRef.current?.focus(), 200);
            return () => clearTimeout(t);
        }
    }, [isOpen]);

    // закрытие по клику вне
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as Element;
            if (wrapRef.current?.contains(target)) return;
            if (target.closest?.('[data-search-toggle]')) return;
            onClose?.();
        };

        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [onClose]);

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
                    onFocus={() => {
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
                                // mousedown — срабатывает до blur инпута,
                                // preventDefault не даёт инпуту терять фокус
                                // и гарантирует переход до закрытия дропдауна
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(g.slug);
                                }}
                            >
                                {g.icon?.[0] ? (
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

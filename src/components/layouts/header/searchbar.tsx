'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { useGames } from '@/hooks/queries/useGame';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
    onClose?: () => void;
}

export function SearchBar({ onClose }: SearchBarProps) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const wrapRef = useRef<HTMLDivElement>(null);

    const { games } = useGames();

    const filtered =
        query.trim().length >= 1
            ? (games ?? [])
                  .filter((g) =>
                      g.name.toLowerCase().includes(query.toLowerCase()),
                  )
                  .slice(0, 8)
            : (games ?? []).slice(0, 6);

    // Авто-фокус при открытии панели
    useEffect(() => {
        const timer = setTimeout(() => inputRef.current?.focus(), 300);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapRef.current &&
                !wrapRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleSelect = () => {
        setQuery('');
        setOpen(false);
        onClose?.();
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
                        setOpen(true);
                    }}
                    onFocus={() => setOpen(true)}
                />
            </div>

            {open && (
                <div className='searchbar__dropdown'>
                    {filtered.length === 0 ? (
                        <p className='searchbar__empty'>Ничего не найдено</p>
                    ) : (
                        filtered.map((g) => (
                            <Link
                                key={g.slug}
                                href={g.slug}
                                className='searchbar__item'
                                onClick={handleSelect}
                            >
                                {g.image?.[0] ? (
                                    <img
                                        src={g.image[0]}
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
                            </Link>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}

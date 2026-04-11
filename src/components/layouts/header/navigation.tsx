'use client';

import { NavItem } from './nav-item';
import { PUBLIC_URL } from '@/config/url.config';
import { Search, X } from 'lucide-react';

const nav = [
    { title: 'Главная', url: PUBLIC_URL.home() },
    { title: 'Каталог', url: PUBLIC_URL.games() },
    { title: 'Отзывы', url: PUBLIC_URL.reviews() },
    { title: 'Поддержка', url: PUBLIC_URL.support() },
];

interface NavigationProps {
    searchOpen: boolean;
    onSearchToggle: () => void;
}

export function Navigation({ searchOpen, onSearchToggle }: NavigationProps) {
    return (
        <nav className='nav'>
            {nav.map((item) => (
                <NavItem item={item} key={item.url} />
            ))}

            <button
                className={`nav__search-btn ${searchOpen ? '' : ''}`}
                onClick={onSearchToggle}
                aria-label='Поиск'
            >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
        </nav>
    );
}

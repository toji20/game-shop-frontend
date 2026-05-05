'use client';

import { NavItem } from './nav-item';
import { SupportMenu } from './support-menu';
import { PUBLIC_URL } from '@/config/url.config';
import { Search, X } from 'lucide-react';
import { RefObject } from 'react';

const nav = [
    { title: 'Главная', url: PUBLIC_URL.home() },
    { title: 'Каталог', url: PUBLIC_URL.games() },
    { title: 'Отзывы', url: PUBLIC_URL.reviews() },
];

interface NavigationProps {
    searchOpen: boolean;
    onSearchToggle: () => void;
    searchTriggerRef?: RefObject<HTMLButtonElement | null>
}

export function Navigation({
    searchOpen,
    onSearchToggle,
    searchTriggerRef,
}: NavigationProps) {
    return (
        <nav className='nav'>
            {nav.map((item) => (
                <NavItem item={item} key={item.url} />
            ))}

            <div className='nav__support-tablet'>
                <SupportMenu mode='nav' />
            </div>

            <button
                ref={searchTriggerRef} // 👈
                className={`nav__search-btn ${searchOpen ? 'nav__search-btn--active' : ''}`}
                onClick={onSearchToggle}
                aria-label='Поиск'
                type='button'
            >
                {searchOpen ? <X size={18} /> : <Search size={18} />}
            </button>
        </nav>
    );
}

'use client';

import { Buttons } from './buttons';
import './header.css';
import { MobileNav } from './mobile-nav';
import { Navigation } from './navigation';
import { SearchBar } from './searchbar';
import Image from 'next/image';
import { useState, useEffect, Suspense } from 'react';

export function Header() {
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        // Вешаем на html, а не на body — иначе fixed элементы могут пропадать
        document.documentElement.style.overflow = searchOpen ? 'hidden' : '';
        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [searchOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`header-overlay ${searchOpen ? 'header-overlay--visible' : ''}`}
                onClick={() => setSearchOpen(false)}
            />

            <header className='header' suppressHydrationWarning>
                {/* Десктоп */}
                <div className='header-block header-block--desktop'>
                    <Image
                        src={'/rov-logo.png'}
                        alt='rov'
                        width={160}
                        height={40}
                        priority
                        className='header-logo'
                    />
                    <Navigation
                        searchOpen={searchOpen}
                        onSearchToggle={() => setSearchOpen((v) => !v)}
                    />
                    <Suspense fallback={<div style={{ width: '120px' }} />}>
                        <Buttons />
                    </Suspense>
                </div>

                {/* Мобильный */}
                <div className='header-block header-block--mobile'>
                    <Image
                        src={'/rov-logo.png'}
                        alt='rov'
                        width={130}
                        height={34}
                        priority
                        className='header-logo'
                    />
                    <Suspense fallback={null}>
                        <Buttons />
                    </Suspense>
                </div>

                {/* Мобильный поиск */}
                <div className='header-search-mobile'>
                    <SearchBar
                        isOpen={searchOpen}
                        onOpen={() => setSearchOpen(true)}
                        onClose={() => setSearchOpen(false)}
                    />
                </div>

                {/* Десктоп поиск */}
                <div
                    className={`header-search-panel ${searchOpen ? 'header-search-panel--open' : ''}`}
                >
                    <SearchBar
                        isOpen={searchOpen}
                        onOpen={() => setSearchOpen(true)}
                        onClose={() => setSearchOpen(false)}
                    />
                </div>
            </header>

            <MobileNav />
        </>
    );
}

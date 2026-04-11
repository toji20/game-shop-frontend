'use client';

import { Buttons } from './buttons';
import './header.css';
import { Navigation } from './navigation';
import { SearchBar } from './searchbar';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export function Header() {
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = searchOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [searchOpen]);

    return (
        <>
            {/* Оверлей */}
            <div
                className={`header-overlay ${searchOpen ? 'header-overlay--visible' : ''}`}
                onClick={() => setSearchOpen(false)}
            />

            <header className='header'>
                <div className='header-block'>
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
                    <Buttons />
                </div>

                <div
                    className={`header-search-panel ${searchOpen ? 'header-search-panel--open' : ''}`}
                >
                    <SearchBar onClose={() => setSearchOpen(false)} />
                </div>
            </header>
        </>
    );
}

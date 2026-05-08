/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { Buttons } from './buttons';
import './header.css';
import { MobileNav } from './mobile-nav';
import { Navigation } from './navigation';
import { SearchBar } from './searchbar';
import { SupportMenu } from './support-menu';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';

export function Header() {
    const pathname = usePathname();
    const isHomePage = pathname === '/';
    const isGamesPage = pathname === '/games';
    const hasFloatingSearchByDefault = isHomePage || isGamesPage;

    const [isMobile, setIsMobile] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchBarVisible, setSearchBarVisible] = useState(
        hasFloatingSearchByDefault,
    );
    const lastScrollY = useRef(0);
    const searchTriggerRef = useRef<HTMLButtonElement>(null);

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 650);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useLayoutEffect(() => {
        setSearchBarVisible(isMobile ? true : hasFloatingSearchByDefault);
        setSearchOpen(false);
    }, [isMobile, hasFloatingSearchByDefault]);

    useEffect(() => {
        document.documentElement.style.overflow = searchOpen ? 'hidden' : '';
        return () => {
            document.documentElement.style.overflow = '';
        };
    }, [searchOpen]);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const isScrollingDown = currentScrollY > lastScrollY.current;
            const isAtTop = currentScrollY <= 10;

            if (searchOpen) {
                setSearchBarVisible(true);
            } else if (isMobile) {
                setSearchBarVisible(isAtTop || !isScrollingDown);
            } else if (hasFloatingSearchByDefault) {
                setSearchBarVisible(isAtTop || !isScrollingDown);
            } else {
                setSearchBarVisible(false);
            }

            lastScrollY.current = currentScrollY;
        };

        lastScrollY.current = window.scrollY;
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [isMobile, searchOpen, hasFloatingSearchByDefault]);

    const handleSearchToggle = () => {
        setSearchOpen((prev) => {
            const next = !prev;
            if (next) {
                setSearchBarVisible(true);
            } else if (!isMobile && !hasFloatingSearchByDefault) {
                setSearchBarVisible(false);
            }
            return next;
        });
    };

    const handleSearchOpen = () => {
        setSearchBarVisible(true);
        setSearchOpen(true);
    };

    const handleSearchClose = () => {
        setSearchOpen(false);
        if (!isMobile && !hasFloatingSearchByDefault) {
            setSearchBarVisible(false);
        }
    };

    return (
        <>
            <div
                className={`header-overlay ${searchOpen ? 'header-overlay--visible' : ''}`}
                onClick={() => setSearchOpen(false)}
            />

            <header className='header'>
                <div className='header-block header-block--desktop'>
                    <Image
                        src='/zaneshop-logo.png'
                        alt='rov'
                        width={210}
                        height={70}
                        priority
                        className='header-logo'
                    />
                    <Navigation
                        searchOpen={searchOpen}
                        onSearchToggle={handleSearchToggle}
                        searchTriggerRef={searchTriggerRef}
                    />
                    <Suspense fallback={<div style={{ width: '120px' }} />}>
                        <Buttons />
                    </Suspense>
                </div>

                <div className='header-block header-block--mobile'>
                    <Image
                        src='/zaneshop-logo.png'
                        alt='rov'
                        width={110}
                        height={38}
                        priority
                        className='header-logo'
                    />
                    <Suspense fallback={null}>
                        <Buttons />
                    </Suspense>
                </div>

                <div
                    className={`header-search-mobile ${
                        searchBarVisible
                            ? 'header-search-mobile--visible'
                            : 'header-search-mobile--hidden'
                    }`}
                >
                    <SearchBar
                        isOpen={searchOpen}
                        onOpen={handleSearchOpen}
                        onClose={handleSearchClose}
                        triggerRef={searchTriggerRef}
                    />
                </div>

                <div
                    className={`header-search-panel ${
                        searchBarVisible
                            ? 'header-search-panel--visible'
                            : 'header-search-panel--hidden'
                    }`}
                >
                    <SearchBar
                        isOpen={searchOpen}
                        onOpen={handleSearchOpen}
                        onClose={handleSearchClose}
                        triggerRef={searchTriggerRef}
                    />
                </div>
            </header>

            <SupportMenu mode='desktop' />
            <MobileNav />
        </>
    );
}

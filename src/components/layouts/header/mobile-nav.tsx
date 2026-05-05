'use client';

import { SupportMenu } from './support-menu';
import { PUBLIC_URL } from '@/config/url.config';
import { BookOpen, Home, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
    { title: 'Главная', url: PUBLIC_URL.home(), icon: Home },
    { title: 'Каталог', url: PUBLIC_URL.games(), icon: BookOpen },
    { title: 'Отзывы', url: PUBLIC_URL.reviews(), icon: MessageCircle },
];

export function MobileNav() {
    const pathname = usePathname();

    return (
        <nav className='mobile-nav'>
            {nav.slice(0, 2).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;

                return (
                    <Link
                        key={item.url}
                        href={item.url}
                        className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
                    >
                        <Icon size={22} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}

            <SupportMenu mode='mobile-nav' />

            {nav.slice(2).map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.url;

                return (
                    <Link
                        key={item.url}
                        href={item.url}
                        className={`mobile-nav__item ${isActive ? 'mobile-nav__item--active' : ''}`}
                    >
                        <Icon size={22} />
                        <span>{item.title}</span>
                    </Link>
                );
            })}
        </nav>
    );
}

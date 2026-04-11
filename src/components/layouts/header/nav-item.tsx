'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface INavItem {
    title: string;
    url: string;
}

export function NavItem({ item }: { item: INavItem }) {
    const pathName = usePathname();
    const isActive = pathName === item.url;

    return (
        <Link
            href={item.url}
            className={`nav-item ${isActive ? 'nav-item--active' : ''}`}
        >
            {item.title}
        </Link>
    );
}

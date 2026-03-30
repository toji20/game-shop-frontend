'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface INavItem {
    title: string;
    url: string;
}

interface NavItemProps {
    item: INavItem;
}

export function NavItem({ item }: NavItemProps) {
    const pathName = usePathname();
    const isActive = pathName === item.url;

    return (
        <Link
            href={item.url}
            className={cn(
                'relative pb-1 text-[17px] font-medium text-white transition-colors duration-200 hover:text-[#BABABA]',
                'after:absolute after:bottom-0 after:left-1/2 after:h-0.5 after:w-full after:rounded-sm',
                'after:bg-[#BABABA] after:-translate-x-1/2 after:scale-x-0 after:transition-transform after:duration-300 after:origin-center',
                {
                    'text-[#BABABA] after:scale-x-100': isActive,
                },
            )}
        >
            {item.title}
        </Link>
    );
}

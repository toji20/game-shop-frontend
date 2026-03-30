import { NavItem } from './nav-item';
import { PUBLIC_URL } from '@/config/url.config';

const nav = [
    {
        title: 'Главная',
        url: `${PUBLIC_URL.home()}`,
    },
    {
        title: 'Игры',
        url: `${PUBLIC_URL.games()}`,
    },
    {
        title: 'Отзывы',
        url: `${PUBLIC_URL.reviews()}`,
    },
    {
        title: 'Поддержка',
        url: `${PUBLIC_URL.support()}`,
    },
];

export function Navigation() {
    return (
        <nav className='nav'>
            {nav.map((item) => (
                <NavItem item={item} key={item.url} />
            ))}
        </nav>
    );
}

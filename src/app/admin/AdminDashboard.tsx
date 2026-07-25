'use client';

import AdBannersSection from './sections/AdBannerSection';
import AvatarSection from './sections/AvatarSection';
import BannersSection from './sections/BannersSection';
import CategoriesSection from './sections/CategoriesSection';
import GamesSection from './sections/GamesSection';
import GiftApiProductsSection from './sections/GiftApiProductsSection';
import OrdersSection from './sections/OrderSection';
import PositionCategoriesSection from './sections/PositionCategorySection';
import PromoCodesSection from './sections/PromoCodesSection';
import ReviewsSection from './sections/ReviewsSection';
import SideBannersSection from './sections/SideBannerSection';
import UsersSection from './sections/UserSection';
import './shared/admin.css';
import { useState } from 'react';

type Section =
    | 'games'
    | 'giftapi-products'
    | 'categories'
    | 'position-categories'
    | 'banners'
    | 'ad-banner'
    | 'side-banners'
    | 'reviews'
    | 'promoCodes'
    | 'orders'
    | 'users'
    | 'avatars';

const NAV: { id: Section; label: string; icon: string }[] = [
    { id: 'games', label: 'Игры', icon: '🎮' },
    { id: 'giftapi-products', label: 'Гифтапи продукты', icon: '🎁' },
    { id: 'categories', label: 'Категории', icon: '📂' },
    { id: 'position-categories', label: 'Категории позиций', icon: '🧩' },
    { id: 'banners', label: 'Баннеры', icon: '🖼️' },
    { id: 'side-banners', label: 'Доп баннеры', icon: '📄' },
    { id: 'ad-banner', label: 'Рекламный баннер', icon: '📋' },
    { id: 'avatars', label: 'Аватары', icon: '👾' },
    { id: 'reviews', label: 'Отзывы', icon: '⭐' },
    { id: 'promoCodes', label: 'Промокоды', icon: '🎟️' },
    { id: 'orders', label: 'Заказы', icon: '📦' },
    { id: 'users', label: 'Пользователи', icon: '👤' },
];

export default function AdminDashboard() {
    const [active, setActive] = useState<Section>('games');

    return (
        <div className='dashboard'>
            <aside className='sidebar'>
                <div className='sidebar__logo'>
                    <span className='sidebar__logo-text'>Admin</span>
                </div>
                <nav className='sidebar__nav'>
                    {NAV.map((item) => (
                        <button
                            key={item.id}
                            className={`sidebar__item ${active === item.id ? 'sidebar__item--active' : ''}`}
                            onClick={() => setActive(item.id)}
                        >
                            <span className='sidebar__icon'>{item.icon}</span>
                            <span className='sidebar__label'>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            <main className='dashboard__content'>
                {active === 'games' && <GamesSection />}
                {active === 'giftapi-products' && <GiftApiProductsSection />}
                {active === 'categories' && <CategoriesSection />}
                {active === 'position-categories' && (
                    <PositionCategoriesSection />
                )}
                {active === 'banners' && <BannersSection />}
                {active === 'side-banners' && <SideBannersSection />}
                {active === 'ad-banner' && <AdBannersSection />}
                {active === 'avatars' && <AvatarSection />}
                {active === 'reviews' && <ReviewsSection />}
                {active === 'promoCodes' && <PromoCodesSection />}
                {active === 'orders' && <OrdersSection />}
                {active === 'users' && <UsersSection />}
            </main>
        </div>
    );
}

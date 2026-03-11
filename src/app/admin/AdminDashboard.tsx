'use client';

import BannersSection from './sections/BannersSection';
import CategoriesSection from './sections/CategoriesSection';
import GamesSection from './sections/GamesSection';
import ReviewsSection from './sections/ReviewsSection';
import './shared/admin.css';
import { useState } from 'react';

type Section = 'games' | 'categories' | 'banners' | 'reviews';

const NAV: { id: Section; label: string; icon: string }[] = [
    { id: 'games', label: 'Игры', icon: '🎮' },
    { id: 'categories', label: 'Категории', icon: '📂' },
    { id: 'banners', label: 'Баннеры', icon: '🖼️' },
    { id: 'reviews', label: 'Отзывы', icon: '⭐' },
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
                {active === 'categories' && <CategoriesSection />}
                {active === 'banners' && <BannersSection />}
                {active === 'reviews' && <ReviewsSection />}
            </main>
        </div>
    );
}

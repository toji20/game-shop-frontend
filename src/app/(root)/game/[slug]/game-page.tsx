'use client';

import './game-page.css';
import { Faq } from './info-block/faq/faq';
import { Instructions } from './info-block/instructions/instructions';
import { SideBar } from './info-block/sidebar/sidebar';
import { Positions } from './positions/positions';
import { SteamTopUp } from '@/components/steam/steam-topup';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { gameService } from '@/services/game.service';
import { Reviews } from '@/shared/reviews/reviews';
import { useCartStore } from '@/store/cart-store';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Tab = 'instructions' | 'reviews' | 'faq';

export default function GamePage() {
    const params = useParams<{ slug: string }>();
    const [tab, setTab] = useState<Tab>('instructions');
    const isSteam = params.slug.toLowerCase().includes('steam');
    const [offset, setOffset] = useState(118);

    const { data: game, isLoading } = useQuery({
        queryKey: ['get game', params.slug],
        queryFn: () => gameService.getBySlug(params.slug),
    });

    useEffect(() => {
        useCartStore.getState().clear();
        return () => {
            useCartStore.getState().clear();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(Math.max(90, 118 - window.scrollY * 0.3));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!game) {
        return (
            <div className='game-page'>
                <div className='game-page__grid'>
                    <div className='game-page__left'>
                        <div className='game-page__info'>
                            <Skeleton width={120} height={14} />
                            <Skeleton width={300} height={40} />
                        </div>
                        <div className='positions-block'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    height={206}
                                    borderRadius={12}
                                />
                            ))}
                        </div>
                        <Skeleton height={40} width={200} />
                        <Skeleton height={366} />
                    </div>
                    <div className='game-page__sidebar'>
                        <SideBar game={game ?? null} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        );
    }

    const hasFaq = Array.isArray(game.faq) && game.faq.length > 0;

    return (
        <div className='game-page'>
            {/* Фон */}
            <div className='game-page__bg-wrap'>
                <img
                    src={game.bgDesktop || ''}
                    alt={game.name}
                    className='game-page__bg'
                />
                <div className='game-page__bg-overlay' />
            </div>

            <div className='game-page__grid'>
                <div className='game-page__left'>
                    {/* Заголовок */}
                    <div className='game-page__info'>
                        <div className='game-page__breadcrumbs'>
                            <Link href='/' className='game-page__breadcrumb'>
                                Главная
                            </Link>
                            <span className='game-page__breadcrumb-sep'>›</span>
                            <span className='game-page__breadcrumb'>
                                {game.name}
                            </span>
                        </div>
                        <h1 className='game-page__title'>{game.name}</h1>
                        {game.description && (
                            <p className='game-page__desc'>
                                {game.description}
                            </p>
                        )}
                    </div>

                    {/* Позиции или Steam */}
                    {isSteam ? (
                        <SteamTopUp />
                    ) : (
                        <Positions
                            items={game.positions ?? []}
                            gameId={game.id}
                            gameName={game.name}
                        />
                    )}

                    {/* Табы */}
                    <div className='game-page__tabs'>
                        <button
                            className={`game-page__tab ${tab === 'instructions' ? 'game-page__tab--active' : ''}`}
                            onClick={() => setTab('instructions')}
                        >
                            📖 Инструкция
                        </button>
                        <button
                            className={`game-page__tab ${tab === 'reviews' ? 'game-page__tab--active' : ''}`}
                            onClick={() => setTab('reviews')}
                        >
                            ⊞ Отзывы
                        </button>
                        {hasFaq && (
                            <button
                                className={`game-page__tab ${tab === 'faq' ? 'game-page__tab--active' : ''}`}
                                onClick={() => setTab('faq')}
                            >
                                ❓ Вопросы
                            </button>
                        )}
                    </div>

                    {/* Контент таба */}
                    <div className='game-page__tab-content'>
                        {tab === 'instructions' && (
                            <Instructions images={game.instructions} />
                        )}
                        {tab === 'reviews' && <Reviews game={game} />}
                        {tab === 'faq' && hasFaq && (
                            <Faq items={game.faq ?? []} />
                        )}
                    </div>
                </div>

                {/* Сайдбар */}
                <div
                    className='game-page__sidebar'
                    style={{ top: `${offset}px` }}
                >
                    <SideBar game={game ?? null} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

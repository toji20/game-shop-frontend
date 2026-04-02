'use client';

import './game-page.css';
import { Instructions } from './info-block/instructions/instructions';
import { SideBar } from './info-block/sidebar/sidebar';
import { Positions } from './positions/positions';
import { gameService } from '@/services/game.service';
import { Reviews } from '@/shared/reviews/reviews';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GamePage() {
    const params = useParams<{ slug: string }>();
    const [tab, setTab] = useState<'instructions' | 'reviews'>('instructions');

    const [offset, setOffset] = useState(160);

    const { data: game } = useQuery({
        queryKey: ['get game', params.slug],
        queryFn: () => gameService.getBySlug(params.slug),
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;

            const newOffset = Math.max(90, 160 - scrollY * 0.3);

            setOffset(newOffset);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!game) return null;

    return (
        <div className='game-page'>
            <div className='game-page__bg-wrap'>
                <img
                    src={game.image?.[2]}
                    alt={game.name}
                    className='game-page__bg'
                />
                <div className='game-page__bg-overlay' />
            </div>

            <div className='game-page__grid'>
                <div className='game-page__left'>
                    <div className='game-page__info'>
                        <div className='game-page__breadcrumbs'>
                            <Link href={'/'} className='game-page__breadcrumb'>
                                Главная
                            </Link>
                            <span className='game-page__breadcrumb-sep'>›</span>
                            <span className='game-page__breadcrumb'>Игры</span>
                        </div>
                        <h1 className='game-page__title'>{game.name}</h1>
                        {game.description && (
                            <p className='game-page__desc'>
                                {game.description}
                            </p>
                        )}
                    </div>

                    <Positions
                        items={game.positions ?? []}
                        gameId={game.id}
                        gameName={game.name}
                    />

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
                    </div>

                    <div className='game-page__tab-content'>
                        {tab === 'instructions' && (
                            <Instructions images={game.instructions} />
                        )}
                        {tab === 'reviews' && <Reviews game={game} />}
                    </div>
                </div>

                <div
                    className='game-page__sidebar'
                    style={{ top: `${offset}px` }}
                >
                    <SideBar game={game} />
                </div>
            </div>
        </div>
    );
}

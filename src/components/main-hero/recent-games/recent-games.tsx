'use client';

import './recent-games.css';
import { PUBLIC_URL } from '@/config/url.config';
import { useProfile } from '@/hooks/queries/useUser';
import { useRecentGames } from '@/hooks/useRecentGames';
import Link from 'next/link';

export function RecentGames() {
    const { profile } = useProfile();
    const { recentGames } = useRecentGames();

    // Показываем только авторизованным у которых есть история
    if (!profile || !recentGames || recentGames.length === 0) return null;

    return (
        <section className='recent-games'>
            <div className='recent-games__header'>
                <span className='recent-games__label'>Недавно пополняли</span>
                <span className='recent-games__sub'>Быстрый доступ</span>
            </div>

            <div className='recent-games__list'>
                {recentGames.map((game) => (
                    <Link
                        key={game.id}
                        href={PUBLIC_URL.game(game.slug)}
                        className='recent-games__item'
                    >
                        <div className='recent-games__img-wrap'>
                            {game.icon ? (
                                <img
                                    src={game.icon}
                                    alt={game.name}
                                    className='recent-games__img'
                                    draggable={false}
                                />
                            ) : (
                                <div className='recent-games__img-placeholder'>
                                    {game.name[0]}
                                </div>
                            )}
                            <div className='recent-games__shine' />
                        </div>
                        <span className='recent-games__name'>{game.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}

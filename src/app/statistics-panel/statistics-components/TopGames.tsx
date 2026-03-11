'use client';

import { ITopGame } from '@/shared/types';
import Image from 'next/image';

interface TopGamesProps {
    games: ITopGame[];
}

export function TopGames({ games }: TopGamesProps) {
    const max = Math.max(...games.map((g) => g.revenue), 1);

    return (
        <div className='top-games'>
            <h2 className='chart-title'>Топ игр по выручке</h2>
            <ul className='top-games__list'>
                {games.map((game, i) => (
                    <li key={game.gameId} className='top-games__item'>
                        <span className='top-games__rank'>#{i + 1}</span>
                        {game.image ? (
                            <img
                                src={game.image}
                                alt={game.name}
                                width={36}
                                height={36}
                                className='top-games__img'
                            />
                        ) : (
                            <div className='top-games__img top-games__img--placeholder'>
                                🎮
                            </div>
                        )}
                        <div className='top-games__info'>
                            <span className='top-games__name'>{game.name}</span>
                            <div className='top-games__bar-wrap'>
                                <div
                                    className='top-games__bar'
                                    style={{
                                        width: `${(game.revenue / max) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                        <div className='top-games__meta'>
                            <span className='top-games__revenue'>
                                {new Intl.NumberFormat('ru-RU', {
                                    style: 'currency',
                                    currency: 'RUB',
                                    maximumFractionDigits: 0,
                                }).format(game.revenue)}
                            </span>
                            <span className='top-games__orders'>
                                {game.ordersCount} заказов
                            </span>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

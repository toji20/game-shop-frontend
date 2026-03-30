'use client';

import './game-page.css';
import { InfoBlock } from './info-block/info-block';
import { SideBar } from './info-block/sidebar/sidebar';
import { Positions } from './positions/positions';
import { gameService } from '@/services/game.service';
import { Reviews } from '@/shared/reviews/reviews';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function GamePage() {
    const params = useParams<{ slug: string }>();

    const { data: game } = useQuery({
        queryKey: ['get game', params.slug],
        queryFn: () => gameService.getBySlug(params.slug),
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (!game) return null;

    return (
        <div className='game-page'>
            <div className='game-page__main'>
                <div className='game-page__content'>
                    <Positions items={game.positions ?? []} gameId={game.id} />
                    <InfoBlock game={game} />
                </div>
                <div className='game-page__sidebar'>
                    <SideBar game={game} />
                </div>
            </div>
            <Reviews game={game} />
        </div>
    );
}

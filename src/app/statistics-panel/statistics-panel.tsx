'use client';

import { LastUsers } from './statistics-components/LastUsers';
import { RevenueChart } from './statistics-components/RevenueChart';
import { StatCard } from './statistics-components/StatCard';
import { TopGames } from './statistics-components/TopGames';
import './statistics-components/statistics.css';
import {
    useDetailedStatistics,
    useMainStatistics,
} from '@/hooks/queries/useStatistics';

export default function StatisticsPanel() {
    const { statistics: cards, isLoadingStatistics: isLoadingCards } =
        useMainStatistics();
    const { statistics: detailed, isLoadingStatistics: isLoadingDetailed } =
        useDetailedStatistics();

    return (
        <div className='stats'>
            <header className='stats__header'>
                <h1 className='stats__title'>Аналитика</h1>
                <span className='stats__subtitle'>
                    Данные обновляются в реальном времени
                </span>
            </header>

            {/* Карточки */}
            <section className='stats__cards'>
                {isLoadingCards
                    ? Array.from({ length: 5 }).map((_, i) => (
                          <div
                              key={i}
                              className='stat-card stat-card--skeleton'
                          />
                      ))
                    : cards?.map((card, i) => (
                          <StatCard key={card.id} card={card} index={i} />
                      ))}
            </section>

            {/* График */}
            <section className='stats__chart'>
                {isLoadingDetailed ? (
                    <div className='skeleton skeleton--chart' />
                ) : (
                    detailed?.monthlySales && (
                        <RevenueChart data={detailed.monthlySales} />
                    )
                )}
            </section>

            {/* Нижний блок */}
            <section className='stats__bottom'>
                {isLoadingDetailed ? (
                    <>
                        <div className='skeleton skeleton--block' />
                        <div className='skeleton skeleton--block' />
                    </>
                ) : (
                    <>
                        {detailed?.topGames && (
                            <TopGames games={detailed.topGames} />
                        )}
                        {detailed?.lastUsers && (
                            <LastUsers users={detailed.lastUsers} />
                        )}
                    </>
                )}
            </section>
        </div>
    );
}

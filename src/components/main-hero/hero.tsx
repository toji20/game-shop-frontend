'use client';

import { Banners } from './Banners';
import { AdBanner } from './ad-banner/ad-banner';
import { Catalog } from './catalog/catalog';
import { PopularGames } from './popular-games/popular-games';
import { QuickRefill } from './quick-refill/quick-refill';
import { RecentGames } from './recent-games/recent-games';
import { SideBanners } from './side-banners/side-banners';
import { useGamesPopular } from '@/hooks/queries/useGame';

export function Hero() {
    const { popularGames: recentTopUpGames } = useGamesPopular(12);
    return (
        <div>
            <Banners />
            <SideBanners />
            <div className='px-2 sm:px-2'>
                <AdBanner />
                {/* <RecentGames /> */}
                <PopularGames />
                {/* <QuickRefill items={recentTopUpGames} /> */}
                <Catalog />
            </div>
        </div>
    );
}

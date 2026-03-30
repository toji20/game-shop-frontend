'use client';

import { Banners } from './Banners';
import { AdBanner } from './ad-banner/ad-banner';
import { Catalog } from './catalog/catalog';
import { PopularGames } from './popular-games/popular-games';
import { SideBanners } from './side-banners/side-banners';

export function Hero() {
    return (
        <div>
            <Banners />
            <SideBanners />
            <AdBanner />
            <PopularGames />
            <Catalog />
        </div>
    );
}

import './GamesPage.css';
import { Catalog } from '@/components/main-hero/catalog/catalog';
import { PopularGames } from '@/components/main-hero/popular-games/popular-games';

export default function GamesPage() {
    return (
        <div className='game-page-al px-4'>
            <PopularGames hasTitle={true} />
            <Catalog titleOrSort={false} />
        </div>
    );
}

import './GamePage.css';
import { Catalog } from '@/components/main-hero/catalog/catalog';
import { PopularGames } from '@/components/main-hero/popular-games/popular-games';

export default function GamePage() {
    return (
        <div className='game-page'>
            <PopularGames hasTitle={false} />
            <Catalog titleOrSort={false} />
        </div>
    );
}

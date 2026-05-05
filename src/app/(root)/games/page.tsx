import GamePage from './GamesPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Каталог — ZaneShop',
    description:
        'Большой ассортимент игр и сервисов для пополнения по лучшим ценам',
};

export default function HomePage() {
    return <GamePage />;
}

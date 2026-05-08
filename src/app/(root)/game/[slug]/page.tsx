import GamePage from './game-page';
import NotFound from '@/app/not-found';
import { Metadata } from 'next';

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const game = await getGame(slug);

    if (!game) {
        return {
            title: 'Товар не найден — ZaneShop',
        };
    }

    return {
        title: `${game.slug} — ZaneShop`,
        description: game.description,
        openGraph: {
            title: `${game.slug} — ZaneShop`,
            url: `https://zaneshop.ru/game/${slug}`,
            siteName: 'ZaneShop',
            images: [
                {
                    url: game.imageUrl,
                    width: 1200,
                    height: 630,
                },
            ],
            type: 'website',
            locale: 'ru_RU',
        },
    };
}

async function getGame(slug: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/game/${slug}`,
            {
                cache: 'no-store',
            },
        );

        if (!res.ok) return null;

        const text = await res.text();
        if (!text) return null;

        return JSON.parse(text);
    } catch {
        return null;
    }
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function GamePageHome({ params }: PageProps) {
    const { slug } = await params;
    const initialGame = await getGame(slug);

    return <GamePage slug={slug} initialGame={initialGame} />;
}

import { MetadataRoute } from 'next';

async function getAllGames() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/games`);
    return res.json();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const games = await getAllGames();

    const gameUrls = games.map((game: { slug: string }) => ({
        url: `https://zaneshop.ru/game/${game.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://zaneshop.ru',
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        ...gameUrls,
    ];
}

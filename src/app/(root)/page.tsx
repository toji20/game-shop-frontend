import Home from './home';
import { SITE_DESCRIPTION, SITE_NAME } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    openGraph: {
        title: 'ZaneShop — цифровые игры',
        description: 'Купите игры дешево...',
        url: 'https://zaneshop.ru',
        siteName: 'ZaneShop',
        images: [{ url: 'https://zaneshop.ru/og-image.jpg' }],
        locale: 'ru_RU',
        type: 'website',
    },
};

export default function HomePage() {
    return <Home />;
}

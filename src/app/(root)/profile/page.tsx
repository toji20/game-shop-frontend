import ProfilePageClient from './profile-page-client';
import { NO_INDEX_PAGE } from '@/constants/seo.constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Профиль — ZaneShop',
    ...NO_INDEX_PAGE,
};

export default function HomePage() {
    return (
        <div className='bg-[#0000007e]'>
            <ProfilePageClient />
        </div>
    );
}

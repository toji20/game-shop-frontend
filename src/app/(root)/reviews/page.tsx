import ReviewsPage from './ReviewsPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Отзывы — ZaneShop',
    description: 'Здесь вы можете ознакомиться с нашими отзывами',
};

export default function HomePage() {
    return (
        <div className='bg-black'>
            <ReviewsPage />
        </div>
    );
}

import './reviews-page.css';
import { Reviews } from '@/shared/reviews/reviews';

export default function ReviewsPage() {
    return (
        <div className='reviews-page'>
            <div className='reviews-page__bg-wrap'>
                <img
                    src={'/steam-bg.png'}
                    alt={''}
                    className='reviews-page__bg'
                />
                <div className='reviews-page__bg-overlay' />
            </div>

            <div className='reviews-page__content'>
                <Reviews />
            </div>
        </div>
    );
}

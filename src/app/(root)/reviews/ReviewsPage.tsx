import './reviews-page.css';
import { Reviews } from '@/shared/reviews/reviews';
import Link from 'next/link';

export default function ReviewsPage() {
    return (
        <div className='reviews-page-wrapper'>
            <div className='reviews-page__info'>
                <div className='reviews-page__breadcrumbs'>
                    <Link href='/' className='reviews-page__breadcrumb'>
                        Главная
                    </Link>
                    <span className='reviews-page__breadcrumb-sep'>›</span>
                    <span className='reviews-page__breadcrumb'>Отзывы</span>
                </div>
                <h1 className='reviews-page__title'>Наши отзывы</h1>
                <p className='reviews-page__desc'>
                    Тут вы можете прочитать наш отзывы
                </p>
            </div>
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
        </div>
    );
}

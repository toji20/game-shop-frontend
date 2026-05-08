'use client';

import './reviews-page.css';
import { useProfile } from '@/hooks/queries/useUser';
import { Reviews } from '@/shared/reviews/reviews';
import Link from 'next/link';

export default function ReviewsPage() {
    const { profile, isLoadingProfile } = useProfile();

    return (
        <div className='reviews-page-wrapper'>
            <div className='reviews-page__bg-wrap'>
                <img
                    src='https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/steam-bg.png'
                    alt=''
                    className='reviews-page__bg'
                />
                <div className='reviews-page__bg-overlay' />
            </div>

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
                    Тут вы можете прочитать наши отзывы
                </p>
            </div>

            <div className='reviews-page__content'>
                {isLoadingProfile ? (
                    <div className='notice-skeleton'>
                        <div className='skeleton notice-skeleton__title' />
                        <div className='skeleton notice-skeleton__text' />
                        <div className='skeleton notice-skeleton__text notice-skeleton__text--short' />
                    </div>
                ) : (
                    <div className='reviews-page__notice'>
                        <h2 className='reviews-page__notice-title'>
                            {profile
                                ? 'Мы будем рады вашему отзыву!'
                                : 'Авторизуйтесь, чтобы оставить отзыв'}
                        </h2>
                        <p className='reviews-page__notice-text'>
                            {profile
                                ? 'Оставить отзыв можно на страницах игр и сервисов.'
                                : 'Чтобы оставлять отзывы, пожалуйста, войдите в аккаунт. Читать отзывы можно и без авторизации.'}
                        </p>
                        {!profile && (
                            <Link
                                href='/auth'
                                className='reviews-page__notice-btn'
                            >
                                Войти
                            </Link>
                        )}
                    </div>
                )}

                <Reviews />
            </div>
        </div>
    );
}

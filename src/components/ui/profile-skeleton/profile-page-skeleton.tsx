import { Skeleton } from '../skeleton/skeleton';
import { OrderCardSkeleton } from './order-card-skeleton';
import '@/app/(root)/profile/profile-page.css';
import Link from 'next/link';

export function ProfilePageSkeleton({
    tab = 'profile',
}: {
    tab?: 'profile' | 'orders';
}) {
    return (
        <div className='profile-page'>
            <div className='profile-page__bg-wrap'>
                <img
                    src='https://s3.twcstorage.ru/741177d0-6f55-44da-8dfe-8f593447297f/steam-bg.png'
                    alt=''
                    className='profile-page__bg'
                />
                <div className='profile-page__bg-overlay' />
            </div>

            <div className='profile-page__inner'>
                {/* Breadcrumbs + title */}
                <div className='profile-page__info'>
                    <div className='profile-page__breadcrumbs'>
                        <Link href='/' className='profile-page__breadcrumb'>
                            Главная
                        </Link>
                        <span className='profile-page__breadcrumb-sep'>›</span>
                        <span className='profile-page__breadcrumb'>
                            Профиль
                        </span>
                    </div>
                    <h1 className='profile-page__title'>Ваш профиль</h1>
                    <p className='profile-page__desc'>
                        Здесь хранятся все ваши покупки
                    </p>
                </div>

                {/* Profile card */}
                <div className='profile-card'>
                    <div className='profile-card__user'>
                        <img
                            src='/no-user-image.png'
                            alt=''
                            className='profile-card__avatar'
                        />
                        <div className='profile-card__info' style={{ gap: 8 }}>
                            <Skeleton
                                width='130px'
                                height='13px'
                                borderRadius='4px'
                            />
                            <Skeleton
                                width='180px'
                                height='24px'
                                borderRadius='5px'
                            />
                        </div>
                    </div>

                    <div className='profile-card__tabs'>
                        <div className='profile-card__tab profile-card__tab--active'>
                            <Skeleton
                                width='64px'
                                height='14px'
                                borderRadius='4px'
                            />
                        </div>
                        <div className='profile-card__tab'>
                            <Skeleton
                                width='90px'
                                height='14px'
                                borderRadius='4px'
                            />
                        </div>
                        <div className='profile-card__tab'>
                            <Skeleton
                                width='90px'
                                height='14px'
                                borderRadius='4px'
                            />
                        </div>
                    </div>
                </div>

                {tab === 'profile' && (
                    <div className='profile-info-block'>
                        {[0, 1, 2].map((i) => (
                            <div className='profile-info-row' key={i}>
                                <Skeleton
                                    width='70px'
                                    height='14px'
                                    borderRadius='4px'
                                />
                                <Skeleton
                                    width='160px'
                                    height='14px'
                                    borderRadius='4px'
                                />
                            </div>
                        ))}
                    </div>
                )}

                {tab === 'orders' && (
                    <div className='profile-orders'>
                        <h2 className='profile-orders__title'>
                            История покупок
                        </h2>
                        <div className='profile-orders__grid'>
                            {Array.from({ length: 10 }).map((_, i) => (
                                <OrderCardSkeleton key={i} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

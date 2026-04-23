'use client';

import { OrderCard } from './order-card';
import './profile-page.css';
import { SteamOrderCard } from './steam-order-card';
import { ProfilePageSkeleton } from '@/components/ui/profile-skeleton/profile-page-skeleton';
import { useProfile } from '@/hooks/queries/useUser';
import { IOrder, ISteamOrder } from '@/shared/types';
import { LayoutGrid, User, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';

type Tab = 'profile' | 'orders';
type AnyOrder =
    | { type: 'game'; data: IOrder }
    | { type: 'steam'; data: ISteamOrder };

export default function ProfilePage() {
    const router = useRouter();
    const pathname = usePathname();
    const { profile } = useProfile();
    const searchParams = useSearchParams();
    const [copied, setCopied] = useState(false);

    const urlTab = searchParams.get('tab');
    const activeTab: Tab = urlTab === 'orders' ? 'orders' : 'profile';

    const handleSetTab = (t: Tab) => {
        if (t === 'orders') {
            router.push(`${pathname}?tab=orders`);
        } else {
            router.push(pathname);
        }
    };

    const handleCopyId = () => {
        navigator.clipboard.writeText(profile?.id ?? '');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const allOrders = useMemo((): AnyOrder[] => {
        const game = (profile?.orders ?? []).map(
            (o): AnyOrder => ({ type: 'game', data: o }),
        );
        const steam = (profile?.steamOrders ?? []).map(
            (o): AnyOrder => ({ type: 'steam', data: o }),
        );
        return [...game, ...steam].sort(
            (a, b) =>
                new Date(b.data.createdAt).getTime() -
                new Date(a.data.createdAt).getTime(),
        );
    }, [profile?.orders, profile?.steamOrders]);

    if (!profile) return <ProfilePageSkeleton tab={activeTab} />;

    return (
        <div className='profile-page'>
            <div className='profile-page__bg-wrap'>
                <img src='/steam-bg.png' alt='' className='profile-page__bg' />
                <div className='profile-page__bg-overlay' />
            </div>

            <div className='profile-page__inner'>
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

                <div className='profile-card'>
                    <div className='profile-card__user'>
                        <img
                            src={profile.picture || '/default-avatar.png'}
                            alt={profile.name}
                            className='profile-card__avatar'
                        />
                        <div className='profile-card__info'>
                            <button
                                className='profile-card__id-btn'
                                onClick={handleCopyId}
                                title='Скопировать ID'
                            >
                                <span className='profile-card__id-prefix'>
                                    ID:
                                </span>
                                <span className='profile-card__id-value'>
                                    {profile.id.slice(0, 16).toUpperCase()}
                                </span>
                                {copied ? (
                                    <Check
                                        size={13}
                                        className='profile-card__id-icon profile-card__id-icon--success'
                                    />
                                ) : (
                                    <Copy
                                        size={13}
                                        className='profile-card__id-icon'
                                    />
                                )}
                            </button>
                            <p className='profile-card__name'>{profile.name}</p>
                        </div>
                    </div>

                    <div className='profile-card__tabs'>
                        <button
                            className={`profile-card__tab ${activeTab === 'profile' ? 'profile-card__tab--active' : ''}`}
                            onClick={() => handleSetTab('profile')}
                        >
                            <User size={15} />
                            Профиль
                        </button>
                        <button
                            className={`profile-card__tab ${activeTab === 'orders' ? 'profile-card__tab--active' : ''}`}
                            onClick={() => handleSetTab('orders')}
                        >
                            <LayoutGrid size={15} />
                            Все покупки
                        </button>
                    </div>
                </div>

                {activeTab === 'orders' && (
                    <div className='profile-orders'>
                        <h2 className='profile-orders__title'>
                            История покупок
                        </h2>
                        <div className='profile-orders__grid'>
                            {!allOrders.length ? (
                                <p className='profile-orders__empty'>
                                    Покупок пока нет
                                </p>
                            ) : (
                                allOrders.map((entry) =>
                                    entry.type === 'game' ? (
                                        <OrderCard
                                            key={`game-${entry.data.id}`}
                                            item={entry.data.items[0]}
                                            order={entry.data}
                                        />
                                    ) : (
                                        <SteamOrderCard
                                            key={`steam-${entry.data.id}`}
                                            order={entry.data}
                                        />
                                    ),
                                )
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'profile' && (
                    <div className='profile-info-block'>
                        <div className='profile-info-row'>
                            <span className='profile-info-label'>Email</span>
                            <span className='profile-info-value'>
                                {profile.email}
                            </span>
                        </div>
                        <div className='profile-info-row'>
                            <span className='profile-info-label'>Имя</span>
                            <span className='profile-info-value'>
                                {profile.name}
                            </span>
                        </div>
                        <div className='profile-info-row'>
                            <span className='profile-info-label'>
                                Регистрация
                            </span>
                            <span className='profile-info-value'>
                                {new Date(profile.createdAt).toLocaleDateString(
                                    'ru-RU',
                                )}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { useProfile } from '@/hooks/queries/useUser';
import { LogIn, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Buttons() {
    const { profile } = useProfile();
    const isAuth = !!profile;
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isOnOrders =
        pathname === PUBLIC_URL.profile() &&
        searchParams.get('tab') === 'orders';

    const isOnProfile =
        pathname === PUBLIC_URL.profile() &&
        searchParams.get('tab') !== 'orders';

    return (
        <div className='buttons'>
            <Link
                href={`${PUBLIC_URL.profile()}?tab=orders`}
                className={`btn-ghost ${isOnOrders ? 'btn-ghost--active' : ''}`}
            >
                <img src={'/cart.svg'} alt='' />
                <span>Покупки</span>
            </Link>

            {isAuth ? (
                <Link
                    href={PUBLIC_URL.profile()}
                    className={`btn-ghost btn-ghost--user ${isOnProfile ? 'btn-ghost--active' : ''}`}
                >
                    {profile.picture ? (
                        <img
                            src={profile.picture}
                            alt={profile.name}
                            className='btn-avatar'
                        />
                    ) : (
                        <UserCircle size={18} />
                    )}
                    <span>{profile.name ?? 'Профиль'}</span>
                </Link>
            ) : (
                <Link
                    href={PUBLIC_URL.auth()}
                    className='btn-ghost btn-ghost--auth'
                >
                    <LogIn size={18} />
                    <span>Войти</span>
                </Link>
            )}
        </div>
    );
}

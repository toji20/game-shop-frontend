/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { PUBLIC_URL } from '@/config/url.config';
import { useProfile } from '@/hooks/queries/useUser';
import { getAccessToken } from '@/services/auth/auth-token.service';
import { LogIn, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

function ProfileButtonSkeleton() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '0 16px',
                height: '100%',
            }}
        >
            <div
                style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.1)',
                    flexShrink: 0,
                    animation: 'pulse 1.5s ease-in-out infinite',
                }}
            />
            <div
                style={{
                    width: 64,
                    height: 12,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.07)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: '0.2s',
                }}
            />
        </div>
    );
}

function LoginButtonSkeleton() {
    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                padding: '0 16px',
                height: '100%',
            }}
        >
            <div
                style={{
                    width: 18,
                    height: 18,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.1)',
                    flexShrink: 0,
                    animation: 'pulse 1.5s ease-in-out infinite',
                }}
            />
            <div
                style={{
                    width: 40,
                    height: 12,
                    borderRadius: 4,
                    background: 'rgba(255,255,255,0.07)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                    animationDelay: '0.2s',
                }}
            />
        </div>
    );
}

export function Buttons() {
    const { profile, isLoadingProfile } = useProfile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isAuth = !!profile;
    const hasToken = mounted ? !!getAccessToken() : false;
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

            {!mounted ? (
                <LoginButtonSkeleton />
            ) : isLoadingProfile ? (
                hasToken ? (
                    <ProfileButtonSkeleton />
                ) : (
                    <Link
                        href={PUBLIC_URL.auth()}
                        className='btn-ghost btn-ghost--auth'
                    >
                        <LogIn size={18} />
                        <span>Войти</span>
                    </Link>
                )
            ) : isAuth ? (
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

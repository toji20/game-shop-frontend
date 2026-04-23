'use client';

import './game-page.css';
import { Faq } from './info-block/faq/faq';
import { Instructions } from './info-block/instructions/instructions';
import { SideBar } from './info-block/sidebar/sidebar';
import { Positions } from './positions/positions';
import { SteamTopUp } from '@/components/steam/steam-topup';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { gameService } from '@/services/game.service';
import { Reviews } from '@/shared/reviews/reviews';
import { useCartStore } from '@/store/cart-store';
import { useQuery } from '@tanstack/react-query';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Tab = 'instructions' | 'reviews' | 'faq';

export default function GamePage() {
    const params = useParams<{ slug: string }>();
    const [tab, setTab] = useState<Tab>('instructions');
    const [offset, setOffset] = useState(130);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSteamCheckoutOpen, setIsSteamCheckoutOpen] = useState(false);
    const isSteam = params.slug.toLowerCase().includes('steam');

    const { items, total } = useCartStore();

    const { data: game, isLoading } = useQuery({
        queryKey: ['get game', params.slug],
        queryFn: () => gameService.getBySlug(params.slug),
    });

    useEffect(() => {
        useCartStore.getState().clear();
        return () => {
            useCartStore.getState().clear();
        };
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(Math.max(90, 130 - window.scrollY * 0.3));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const isOpen = isCheckoutOpen || isSteamCheckoutOpen;
        if (!isOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isCheckoutOpen, isSteamCheckoutOpen]);

    useEffect(() => {
        if (!items.length) {
            setTimeout(() => {
                setIsCheckoutOpen(false);
            }, 0);
        }
    }, [items.length]);

    if (!game) {
        return (
            <div className='game-page mt-5'>
                <div className='game-page__grid'>
                    <div className='game-page__left'>
                        <div className='game-page__info'>
                            <Skeleton width={120} height={14} />
                            <Skeleton width={300} height={40} />
                        </div>
                        <div className='positions-block'>
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div
                                    className='positions-item-skeleton'
                                    key={i}
                                >
                                    <Skeleton height='100%' borderRadius={12} />
                                </div>
                            ))}
                        </div>
                        <Skeleton height={40} width={200} />
                        <Skeleton height={366} />
                    </div>
                    <div className='game-page__sidebar mt-5'>
                        <SideBar game={game ?? null} isLoading={isLoading} />
                    </div>
                </div>
            </div>
        );
    }

    const hasFaq = Array.isArray(game.faq) && game.faq.length > 0;
    const selectedItem = items[0]?.position;
    const selectedPrice = selectedItem
        ? Number(selectedItem.finalPrice ?? selectedItem.myPrice)
        : 0;
    const hasDiscount = selectedItem && Number(selectedItem.discount) > 0;
    const mobileBarLabel =
        items.length > 1
            ? `${selectedItem?.name ?? ''} +${items.length - 1}`
            : (selectedItem?.name ?? '');
    const mobileBarTotal = total().toLocaleString('ru-RU');

    return (
        <>
            <div className='game-page'>
                <div className='game-page__bg-wrap'>
                    <img
                        src={game.bgDesktop || ''}
                        alt={game.name}
                        className='game-page__bg game-page__bg--desktop'
                    />
                    <img
                        src={game.bgMobile || game.bgDesktop || ''}
                        alt={game.name}
                        className='game-page__bg game-page__bg--mobile'
                    />
                    <div className='game-page__bg-overlay' />
                </div>

                <div className='game-page__grid'>
                    <div className='game-page__left'>
                        <div className='game-page__info'>
                            <div className='game-page__breadcrumbs'>
                                <Link
                                    href='/'
                                    className='game-page__breadcrumb'
                                >
                                    Главная
                                </Link>
                                <span className='game-page__breadcrumb-sep'>
                                    ›
                                </span>
                                <span className='game-page__breadcrumb'>
                                    {game.name}
                                </span>
                            </div>
                            <h1 className='game-page__title'>{game.name}</h1>
                            {game.description && (
                                <p className='game-page__desc'>
                                    {game.description}
                                </p>
                            )}
                        </div>

                        {isSteam ? (
                            <SteamTopUp />
                        ) : (
                            <Positions
                                items={game.positions ?? []}
                                gameId={game.id}
                                gameName={game.name}
                            />
                        )}

                        <div className='game-page__tabs'>
                            <button
                                className={`game-page__tab ${tab === 'instructions' ? 'game-page__tab--active' : ''}`}
                                onClick={() => setTab('instructions')}
                            >
                                Инструкция
                            </button>
                            <button
                                className={`game-page__tab ${tab === 'reviews' ? 'game-page__tab--active' : ''}`}
                                onClick={() => setTab('reviews')}
                            >
                                Отзывы
                            </button>
                            {hasFaq && (
                                <button
                                    className={`game-page__tab ${tab === 'faq' ? 'game-page__tab--active' : ''}`}
                                    onClick={() => setTab('faq')}
                                >
                                    Вопросы
                                </button>
                            )}
                        </div>

                        <div className='game-page__tab-content'>
                            {tab === 'instructions' && (
                                <Instructions images={game.instructions} />
                            )}
                            {tab === 'reviews' && <Reviews game={game} />}
                            {tab === 'faq' && hasFaq && (
                                <Faq items={game.faq ?? []} />
                            )}
                        </div>
                    </div>

                    <div
                        className='game-page__sidebar'
                        style={{ top: `${offset}px` }}
                    >
                        <SideBar game={game ?? null} isLoading={isLoading} />
                    </div>
                </div>
            </div>

            {/* Мобильная кнопка для обычных игр */}
            {!isSteam && items.length > 0 && selectedItem && (
                <div className='mobile-cart-bar'>
                    <div className='mobile-cart-bar__item'>
                        <img
                            src={selectedItem.image || undefined}
                            alt={selectedItem.name}
                            className='mobile-cart-bar__image'
                        />
                        <div className='mobile-cart-bar__content'>
                            <span className='mobile-cart-bar__name'>
                                {mobileBarLabel}
                            </span>
                            <div className='mobile-cart-bar__price-row'>
                                <span className='mobile-cart-bar__price'>
                                    {mobileBarTotal} ₽
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className='mobile-cart-bar__discount'>
                                            -{selectedItem.discount}%
                                        </span>
                                        <span className='mobile-cart-bar__old-price'>
                                            {selectedPrice.toLocaleString(
                                                'ru-RU',
                                            )}{' '}
                                            ₽
                                        </span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        className='mobile-cart-bar__button'
                        onClick={() => setIsCheckoutOpen(true)}
                    >
                        К оплате
                    </button>
                </div>
            )}

            {/* Мобильная кнопка для Steam */}
            {isSteam && (
                <div className='mobile-cart-bar mobile-cart-bar--steam'>
                    <button
                        className='mobile-cart-bar__button mobile-cart-bar__button--full'
                        onClick={() => setIsSteamCheckoutOpen(true)}
                    >
                        Продолжить
                    </button>
                </div>
            )}

            {/* Модалка оплаты для обычных игр */}
            {isCheckoutOpen && (
                <div
                    className='mobile-checkout-modal'
                    onClick={() => setIsCheckoutOpen(false)}
                >
                    <div
                        className='mobile-checkout-modal__dialog'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className='mobile-checkout-modal__close'
                            onClick={() => setIsCheckoutOpen(false)}
                            aria-label='Закрыть окно оплаты'
                        >
                            <X size={20} />
                        </button>
                        <SideBar
                            game={game}
                            isLoading={isLoading}
                            mode='mobile'
                            onRequestClose={() => setIsCheckoutOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Модалка оплаты для Steam */}
            {isSteamCheckoutOpen && (
                <div
                    className='mobile-checkout-modal'
                    onClick={() => setIsSteamCheckoutOpen(false)}
                >
                    <div
                        className='mobile-checkout-modal__dialog'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className='mobile-checkout-modal__close'
                            onClick={() => setIsSteamCheckoutOpen(false)}
                            aria-label='Закрыть окно оплаты'
                        >
                            <X size={20} />
                        </button>
                        <SideBar
                            game={game}
                            isLoading={isLoading}
                            mode='mobile'
                            onRequestClose={() => setIsSteamCheckoutOpen(false)}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

'use client';

import './game-page.css';
import { Faq } from './info-block/faq/faq';
import { Instructions } from './info-block/instructions/instructions';
import { SideBar } from './info-block/sidebar/sidebar';
import { Positions } from './positions/positions';
import { SteamTopUp } from '@/components/steam/steam-topup';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { useHorizontalScroll } from '@/hooks/useHorizontalScroll';
import { gameService } from '@/services/game.service';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { Reviews } from '@/shared/reviews/reviews';
import { IGame, IWarningItem } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';
import { useSteamStore } from '@/store/steam-store';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CircleAlert, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Tab = 'instructions' | 'reviews' | 'faq';

const VARIANT_ICONS = {
    danger: CircleAlert,
    alert: AlertTriangle,
};

const FILTER_SKELETON_WIDTHS = [64, 96, 88, 104];

interface GamePageProps {
    slug: string;
    initialGame: IGame | null;
}

export default function GamePage({ slug, initialGame }: GamePageProps) {
    const [tab, setTab] = useState<Tab>('instructions');
    const [offset, setOffset] = useState(130);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [isSteamCheckoutOpen, setIsSteamCheckoutOpen] = useState(false);
    const [selectedPositionCategory, setSelectedPositionCategory] = useState<
        number | null
    >(null);

    const isSteam = slug.toLowerCase().includes('steam');

    const { items, total } = useCartStore();

    const { checkResult, paymentMethod: steamPaymentMethod } = useSteamStore();
    const steamTotal =
        checkResult == null
            ? null
            : steamPaymentMethod === 'sbp'
              ? checkResult.totalRubSbp
              : checkResult.totalRubCard;
    const isSteamReady = steamTotal !== null;

    const { data: game, isLoading } = useQuery<IGame | null>({
        queryKey: ['get game', slug],
        queryFn: () => gameService.getBySlug(slug),
        initialData: initialGame,
    });

    const {
        scrollRef: filtersScrollRef,
        onMouseDown: filtersMouseDown,
        onClickCapture: filtersClickCapture,
    } = useHorizontalScroll();

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
    }, [slug]);

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

    const handleShowInstructions = () => {
        setIsCheckoutOpen(false);
        setTab('instructions');
        setTimeout(() => {
            document
                .getElementById('instructions')
                ?.scrollIntoView({ behavior: 'smooth' });
        }, 50);
    };

    if (!game) {
        return (
            <>
                <div className='game-page'>
                    <div className='game-page__grid'>
                        <div className='game-page__left'>
                            <div className='game-page__info'>
                                <Skeleton width={120} height={14} />
                                <div className='game-page__title-row'>
                                    <Skeleton width={300} height={40} />
                                    {!isSteam && (
                                        <div className='game-page__pos-filters-wrap game-page__pos-filters-wrap--skeleton'>
                                            <div className='game-page__pos-filters-skeleton'>
                                                {FILTER_SKELETON_WIDTHS.map(
                                                    (width, index) => (
                                                        <Skeleton
                                                            key={index}
                                                            width={width}
                                                            height={36}
                                                            borderRadius={999}
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {!isSteam ? (
                                <div className='positions-block'>
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <div
                                            className='positions-item-skeleton'
                                            key={i}
                                        >
                                            <Skeleton
                                                height='100%'
                                                borderRadius={12}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <SteamTopUp />
                            )}
                            <Skeleton height={40} width={200} />
                            <Skeleton height={366} />
                        </div>
                        <div className='game-page__sidebar mt-5'>
                            <SideBar
                                game={null}
                                isLoading={true}
                                onShowInstructions={handleShowInstructions}
                            />
                        </div>
                    </div>
                </div>
            </>
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

    const categoriesWithItems =
        game.positionCategories?.filter((category) =>
            (game.positions ?? []).some(
                (position) => position.categoryId === category.id,
            ),
        ) ?? [];

    const hasPositionCategories = categoriesWithItems.length > 0;

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
                                <span className='game-page__breadcrumb game-page__breadcrumb--current'>
                                    {game.name}
                                </span>
                            </div>

                            <div className='game-page__title-row'>
                                <h1 className='game-page__title'>
                                    {game.name}
                                </h1>

                                {!isSteam && hasPositionCategories && (
                                    <div className='game-page__pos-filters-wrap'>
                                        <div
                                            className='game-page__pos-filters'
                                            ref={filtersScrollRef}
                                            onMouseDown={filtersMouseDown}
                                            onClickCapture={filtersClickCapture}
                                        >
                                            <button
                                                className={`positions-filter-btn ${selectedPositionCategory === null ? 'positions-filter-btn--active' : ''}`}
                                                onClick={() =>
                                                    setSelectedPositionCategory(
                                                        null,
                                                    )
                                                }
                                            >
                                                Все
                                            </button>
                                            {categoriesWithItems.map((c) => (
                                                <button
                                                    key={c.id}
                                                    className={`positions-filter-btn ${selectedPositionCategory === c.id ? 'positions-filter-btn--active' : ''}`}
                                                    onClick={() =>
                                                        setSelectedPositionCategory(
                                                            selectedPositionCategory ===
                                                                c.id
                                                                ? null
                                                                : c.id,
                                                        )
                                                    }
                                                >
                                                    {c.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

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
                                selectedCategory={selectedPositionCategory}
                            />
                        )}

                        {!!game.warnings?.length && (
                            <div className='game-page__warnings-mobile'>
                                {game.warnings.map((warning, index) => (
                                    <CheckoutWarning
                                        key={index}
                                        icon={VARIANT_ICONS[warning.variant]}
                                        title={warning.title}
                                        text={warning.text}
                                        variant={warning.variant}
                                    />
                                ))}
                            </div>
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
                        <SideBar
                            game={game}
                            isLoading={isLoading}
                            onShowInstructions={handleShowInstructions}
                        />
                    </div>
                </div>
            </div>

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

            {isSteam && (
                <div className='mobile-cart-bar mobile-cart-bar--steam'>
                    <button
                        className='mobile-cart-bar__button mobile-cart-bar__button--full mobile-cart-bar__button--steam-continue'
                        disabled={!isSteamReady}
                        onClick={() => setIsSteamCheckoutOpen(true)}
                    >
                        {isSteamReady ? 'Продолжить' : 'Рассчитываем сумму...'}
                    </button>
                </div>
            )}

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
                            onShowInstructions={handleShowInstructions}
                        />
                    </div>
                </div>
            )}

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
                            onRequestClose={() => setIsCheckoutOpen(false)}
                            onShowInstructions={handleShowInstructions}
                        />
                    </div>
                </div>
            )}
        </>
    );
}

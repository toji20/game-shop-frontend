'use client';
import {
    getAmountField,
    getLoginField,
    getProductForCurrency,
} from './steam-checkout.utils';
import { useSteamTopupStore } from './steam-topup-store';
import '@/app/(root)/game/[slug]/info-block/sidebar/sidebar.css';
import { usePlaceOrder } from '@/hooks/queries/useOrder';
import { useCheckPromo } from '@/hooks/queries/usePromo';
import { IGame, PaymentMethod } from '@/shared/types';
import { Ticket } from 'lucide-react';
import { useState } from 'react';

const PAYMENT_METHODS: { key: PaymentMethod; img: string; title: string }[] = [
    { key: 'bank_card', img: '/card.png', title: 'Картой' },
    { key: 'sbp', img: '/spb.png', title: 'СБП' },
];

const STEAM_SERVICE_COMMISSION_PERCENT = 4;

interface SteamCheckoutSidebarProps {
    game: IGame;
}

export function SteamCheckoutSidebar({ game }: SteamCheckoutSidebarProps) {
    const { login, amount, currency } = useSteamTopupStore();
    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>('bank_card');
    const [promoCode, setPromoCode] = useState('');
    const { placeOrder, isLoadingPlace } = usePlaceOrder();
    const { checkPromo, isCheckingPromo, promoData, promoError, resetPromo } =
        useCheckPromo();

    const products = game.giftApiProducts ?? [];
    const activeProduct = getProductForCurrency(products, currency);
    const loginField = getLoginField(activeProduct);
    const amountField = getAmountField(activeProduct);

    const rawAmount = Number(amount) || 0;
    const discount = promoData?.discount ?? 0;
    const afterDiscount =
        discount > 0
            ? +(rawAmount * (1 - discount / 100)).toFixed(2)
            : rawAmount;

    const serviceCommissionAmount = +(
        (afterDiscount * STEAM_SERVICE_COMMISSION_PERCENT) /
        100
    ).toFixed(2);

    const bankCommissionRate = paymentMethod === 'sbp' ? 1.01 : 1.02;
    const bankCommissionPercent = ((bankCommissionRate - 1) * 100).toFixed(0);
    const withService = afterDiscount + serviceCommissionAmount;
    const finalTotal = +(withService * bankCommissionRate).toFixed(2);

    const canBuy =
        !!login.trim() && rawAmount > 0 && !!activeProduct && !isLoadingPlace;

    const handleApplyPromo = () => {
        const code = promoCode.trim();
        if (!code) return;
        checkPromo({ code, target: 'GAME' });
    };

    const handleBuy = () => {
        if (!canBuy || !activeProduct) return;

        placeOrder({
            type: game.type,
            paymentMethod,
            promoCode: promoCode.trim() || undefined,
            items: [
                {
                    giftapiProductId: activeProduct.id,
                    gameId: game.id,
                    price: rawAmount,
                    quantity: 1,
                    fields: {
                        ...(loginField ? { [loginField.code]: login } : {}),
                        ...(amountField ? { [amountField.code]: amount } : {}),
                    },
                },
            ],
        });
    };

    return (
        <div className='sidebar-wrapper'>
            <div className='sidebar__payment'>
                <div className='sidebar__payment-methods'>
                    {PAYMENT_METHODS.map((m) => {
                        const isActive = paymentMethod === m.key;
                        return (
                            <button
                                key={m.key}
                                type='button'
                                className={`sidebar__payment-btn ${
                                    isActive
                                        ? 'sidebar__payment-btn--active'
                                        : ''
                                }`}
                                onClick={() => setPaymentMethod(m.key)}
                            >
                                <img
                                    className='sidebar__payment-img'
                                    src={m.img}
                                    alt={m.title}
                                />
                                <span
                                    className={`sidebar__payment-title ${
                                        isActive
                                            ? 'sidebar__payment-title--active'
                                            : ''
                                    }`}
                                >
                                    {m.title}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className='sidebar'>
                <div className='sidebar__summary'>
                    <div className='sidebar__summary-total-row'>
                        <span className='sidebar__summary-total-label'>
                            Итого
                        </span>
                        <span className='sidebar__summary-total-value'>
                            {finalTotal.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>

                    <div className='sidebar__summary-row sidebar__summary-row--commission'>
                        <span>Комиссия Steam</span>
                        <span>{STEAM_SERVICE_COMMISSION_PERCENT}%</span>
                    </div>
                    <div className='sidebar__summary-row sidebar__summary-row--commission'>
                        <span>Комиссия банка</span>
                        <span>{bankCommissionPercent}%</span>
                    </div>

                    {discount > 0 && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Скидка по промокоду</span>
                            <span>-{discount}%</span>
                        </div>
                    )}
                </div>

                <div className='sidebar__summary-divider' />

                <div className='sidebar__promo'>
                    <div className='sidebar__promo-wrap'>
                        <div className='sidebar__promo-input-wrap'>
                            <Ticket size={16} className='sidebar__promo-icon' />
                            <input
                                className={`sidebar__field-input sidebar__field-input--promo ${
                                    promoData
                                        ? 'sidebar__field-input--success'
                                        : promoError
                                          ? 'sidebar__field-input--error'
                                          : ''
                                }`}
                                value={promoCode}
                                onChange={(e) => {
                                    setPromoCode(e.target.value.toUpperCase());
                                    resetPromo();
                                }}
                                placeholder='Промокод'
                            />
                        </div>
                        <button
                            type='button'
                            className='sidebar__promo-btn'
                            onClick={handleApplyPromo}
                            disabled={
                                !promoCode.trim() ||
                                isCheckingPromo ||
                                !!promoData
                            }
                        >
                            {isCheckingPromo
                                ? '...'
                                : promoData
                                  ? '✓'
                                  : 'Применить'}
                        </button>
                    </div>
                    {promoData && (
                        <span className='sidebar__promo-success'>
                            Промокод применён
                        </span>
                    )}
                    {promoError && (
                        <span className='sidebar__promo-error'>
                            {promoError}
                        </span>
                    )}
                </div>

                <button
                    type='button'
                    className='sidebar__btn'
                    disabled={!canBuy}
                    onClick={handleBuy}
                >
                    {isLoadingPlace
                        ? 'Переход к оплате...'
                        : `Пополнить ${finalTotal.toLocaleString('ru-RU')} ₽`}
                </button>

                <p className='sidebar__terms'>
                    Нажимая «Купить», вы принимаете Правила пользования сайтом и
                    Политику конфиденциальности.
                </p>
            </div>
        </div>
    );
}

'use client';

import './sidebar.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { usePlaceOrder } from '@/hooks/queries/useOrder';
import { useCheckPromo } from '@/hooks/queries/usePromo';
import { usePlaceSteamOrder } from '@/hooks/queries/useSteamOrder';
import { STEAM_COMMISSION } from '@/shared/constant';
import { IGame, PaymentMethod } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';
import { useSteamStore } from '@/store/steam-store';
import { Ticket } from 'lucide-react';
import { useState } from 'react';

interface SideBarProps {
    game: IGame;
}

const PAYMENT_METHODS: { key: PaymentMethod; img: string; title: string }[] = [
    { key: 'bank_card', img: '/card.png', title: 'Картой' },
    { key: 'sbp', img: '/spb.png', title: 'СПБ' },
];

export function SideBar({ game }: SideBarProps) {
    const isSteam = game.slug?.toLowerCase().includes('steam');
    const commission = STEAM_COMMISSION;

    const { items, fields, setField, total } = useCartStore();
    const { placeOrder, isLoadingPlace } = usePlaceOrder();
    const { account, amount, currency } = useSteamStore();
    const { placeSteamOrder, isLoadingPlace: isLoadingSteam } =
        usePlaceSteamOrder();
    const { checkPromo, isCheckingPromo, promoData, promoError, resetPromo } =
        useCheckPromo();

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>('bank_card');
    const [promoCode, setPromoCode] = useState('');
    const [confirms, setConfirms] = useState<Record<string, boolean>>({});

    // ── Расчёт итогов ──────────────────────────────────────
    const rawTotal = total();
    const discount = promoData?.discount ?? 0;
    const afterDiscount =
        discount > 0 ? +(rawTotal * (1 - discount / 100)).toFixed(2) : rawTotal;

    const commissionRate =
        paymentMethod === 'sbp'
            ? 1.01
            : paymentMethod === 'bank_card'
              ? 1.02
              : 1;
    const commissionPercent = ((commissionRate - 1) * 100).toFixed(0);
    const commissionAmount = +(
        afterDiscount * commissionRate -
        afterDiscount
    ).toFixed(2);
    const finalTotal = +(afterDiscount * commissionRate).toFixed(2);
    const steamTotal = amount * commission;

    // ── Проверка полей ─────────────────────────────────────
    const requiredFields = game.fields?.filter((f) => f.required) ?? [];
    const isFieldsFilled = requiredFields.every(
        (f) => (fields[String(f.id)] ?? '').trim().length > 0,
    );
    const allConfirmed = requiredFields.length === 0 || !!confirms['all'];
    const canBuy = items.length > 0 && isFieldsFilled && allConfirmed;

    const handleBuy = () => {
        if (isSteam) {
            if (!account || !amount) return;
            placeSteamOrder({ account, amount, currency });
            return;
        }
        if (!canBuy) return;
        placeOrder({
            type: game.type,
            paymentMethod,
            promoCode: promoCode.trim() || undefined,
            items: items.map((i) => ({
                positionId: i.position.id,
                gameId: i.gameId,
                price: Number(i.position.finalPrice ?? i.position.myPrice),
                quantity: 1,
                fields: Object.keys(fields).length > 0 ? fields : undefined,
            })),
        });
    };

    if (!game) {
        return (
            <div className='sidebar'>
                <Skeleton height={30} width='60%' />
                <Skeleton height={20} width='40%' />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={60} borderRadius={999} />
            </div>
        );
    }

    return (
        <div className='sidebar-wrapper'>
            {/* Методы оплаты */}
            <div className='sidebar__payment'>
                <div className='sidebar__payment-methods'>
                    {PAYMENT_METHODS.map((m) => (
                        <button
                            key={m.key}
                            className={`sidebar__payment-btn ${paymentMethod === m.key ? 'sidebar__payment-btn--active' : ''}`}
                            onClick={() => setPaymentMethod(m.key)}
                        >
                            <img src={m.img} className='sidebar__payment-img' />
                            <h3
                                className={`sidebar__payment-title ${paymentMethod === m.key ? 'sidebar__payment-title--active' : ''}`}
                            >
                                {m.title}
                            </h3>
                        </button>
                    ))}
                </div>
            </div>

            <div className='sidebar'>
                {/* Итого */}
                <div className='sidebar__summary'>
                    <div className='sidebar__summary-total-row'>
                        <span className='sidebar__summary-total-label'>
                            Итого
                        </span>
                        <span className='sidebar__summary-total-value'>
                            {isSteam
                                ? `${steamTotal.toLocaleString('ru-RU')} ${currency === 'RUB' ? '₽' : currency === 'KZT' ? '₸' : '$'}`
                                : `${finalTotal.toLocaleString('ru-RU')} ₽`}
                        </span>
                    </div>

                    {!isSteam && discount > 0 && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Скидка {discount}%</span>
                            <span>
                                −{(rawTotal - afterDiscount).toFixed(2)} ₽
                            </span>
                        </div>
                    )}

                    {!isSteam && (
                        <div className='sidebar__summary-row sidebar__summary-row--commission'>
                            <span>Комиссия банка {commissionPercent}%</span>
                            <span>
                                +{commissionAmount.toLocaleString('ru-RU')} ₽
                            </span>
                        </div>
                    )}

                    {isSteam && commission > 1 && (
                        <div className='sidebar__summary-row'>
                            <span>Комиссия</span>
                            <span>{((commission - 1) * 100).toFixed(0)}%</span>
                        </div>
                    )}
                </div>

                {/* Промокод */}
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
                            className='sidebar__promo-btn'
                            onClick={() => checkPromo(promoCode.trim())}
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
                        <p className='sidebar__promo-success'>
                            Скидка {promoData.discount}% применена
                        </p>
                    )}
                    {promoError && (
                        <p className='sidebar__promo-error'>{promoError}</p>
                    )}
                </div>

                {/* Поля */}
                {game.fields && game.fields.length > 0 && (
                    <div className='sidebar__fields'>
                        <div className='sidebar__fields-header'>
                            <p className='sidebar__section-title'>
                                Данные для заказа
                            </p>

                            <a
                                href='#instructions'
                                className='sidebar__fields-hint'
                                onClick={() =>
                                    document
                                        .getElementById('game-instructions')
                                        ?.scrollIntoView({ behavior: 'smooth' })
                                }
                            >
                                Где найти?
                            </a>
                        </div>
                        {game.fields.map((f) => (
                            <div key={f.id} className='sidebar__field'>
                                <input
                                    className='sidebar__field-input'
                                    value={fields[String(f.id)] ?? ''}
                                    onChange={(e) =>
                                        setField(String(f.id), e.target.value)
                                    }
                                    placeholder={
                                        f.required ? `${f.label} *` : f.label
                                    }
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Чекбоксы подтверждения */}
                {requiredFields.length > 0 && (
                    <label className='sidebar__confirm-item'>
                        <input
                            type='checkbox'
                            className='sidebar__confirm-checkbox'
                            checked={!!confirms['all']}
                            onChange={(e) =>
                                setConfirms({ all: e.target.checked })
                            }
                        />
                        <span
                            className={`sidebar__confirm-label ${
                                confirms['all']
                                    ? 'sidebar__confirm-label--checked'
                                    : 'sidebar__confirm-label--unchecked'
                            }`}
                        >
                            Я подтверждаю, что указал верные данные:{' '}
                            {requiredFields.map((f, i) => (
                                <span key={f.id}>
                                    <b>{f.label.toLowerCase()}</b>
                                    {fields[String(f.id)]?.trim() && (
                                        <span className='sidebar__confirm-value'></span>
                                    )}
                                    {i < requiredFields.length - 1 ? ', ' : ''}
                                </span>
                            ))}
                        </span>
                    </label>
                )}

                {/* Кнопка */}
                <button
                    className='sidebar__btn'
                    disabled={
                        isSteam
                            ? !account || !amount || isLoadingSteam
                            : !canBuy || isLoadingPlace
                    }
                    onClick={handleBuy}
                >
                    {isSteam
                        ? isLoadingSteam
                            ? 'Переход...'
                            : `Пополнить ${amount} ${currency === 'RUB' ? '₽' : currency === 'KZT' ? '₸' : '$'}`
                        : isLoadingPlace
                          ? 'Переход к оплате...'
                          : items.length
                            ? `Оплатить ${finalTotal.toLocaleString('ru-RU')} ₽`
                            : 'Выберите позиции'}
                </button>

                <p className='sidebar__terms'>
                    Нажимая «Купить», вы принимаете Правила пользования сайтом и
                    Политику конфиденциальности
                </p>

                {!isFieldsFilled && items.length > 0 && (
                    <p className='sidebar__hint'>
                        Заполните обязательные поля *
                    </p>
                )}
            </div>
        </div>
    );
}

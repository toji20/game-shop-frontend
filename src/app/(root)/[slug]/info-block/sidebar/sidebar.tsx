'use client';

import './sidebar.css';
import { usePlaceOrder } from '@/hooks/queries/useOrder';
import { useCheckPromo } from '@/hooks/queries/usePromo';
import { IGame, PaymentMethod } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';
import { Ticket } from 'lucide-react';
import { useState } from 'react';

interface SideBarProps {
    game: IGame;
}

const PAYMENT_METHODS: {
    key: PaymentMethod;
    img: string;
}[] = [
    {
        key: 'bank_card',
        img: '/card.png',
    },
    {
        key: 'sbp',
        img: '/spb.png',
    },
];

export function SideBar({ game }: SideBarProps) {
    const { items, fields, setField, total } = useCartStore();
    const { placeOrder, isLoadingPlace } = usePlaceOrder();
    const { checkPromo, isCheckingPromo, promoData, promoError, resetPromo } =
        useCheckPromo();

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>('bank_card');
    const [promoCode, setPromoCode] = useState('');

    const rawTotal = total();
    const discount = promoData?.discount ?? 0;
    const finalTotal =
        discount > 0 ? +(rawTotal * (1 - discount / 100)).toFixed(2) : rawTotal;

    const requiredFields = game.fields?.filter((f) => f.required) ?? [];
    const isFieldsFilled = requiredFields.every(
        (f) => (fields[String(f.id)] ?? '').trim().length > 0,
    );
    const canBuy = items.length > 0 && isFieldsFilled;

    const handleBuy = () => {
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

    return (
        <div className='sidebar'>
            {/* Способ оплаты */}
            <div className='sidebar__payment'>
                <p className='sidebar__section-title-methods'>Способ оплаты</p>
                <div className='sidebar__payment-methods'>
                    {PAYMENT_METHODS.map((m) => (
                        <button
                            key={m.key}
                            className={`sidebar__payment-btn ${paymentMethod === m.key ? 'sidebar__payment-btn--active' : ''}`}
                            onClick={() => setPaymentMethod(m.key)}
                        >
                            <img src={m.img} className='sidebar__payment-img' />
                        </button>
                    ))}
                </div>
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
                            onClick={() => {
                                document
                                    .getElementById('instructions')
                                    ?.scrollIntoView({ behavior: 'smooth' });
                            }}
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

            {/* Промокод */}
            <div className='sidebar__promo'>
                <p className='sidebar__section-title'>Промокод</p>
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
                            placeholder='Введите промокод'
                        />
                    </div>
                    <button
                        className='sidebar__promo-btn'
                        onClick={() => checkPromo(promoCode.trim())}
                        disabled={
                            !promoCode.trim() || isCheckingPromo || !!promoData
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

            {/* Итог */}
            <div className='sidebar__summary'>
                <div className='sidebar__summary-row'>
                    <span>Позиций</span>
                    <span>{items.length}</span>
                </div>
                {discount > 0 && (
                    <div
                        className='sidebar__summary-row'
                        style={{ color: '#4ade80' }}
                    >
                        <span>Скидка по промокоду</span>
                        <span>-{discount}%</span>
                    </div>
                )}
                <div className='sidebar__summary-row sidebar__summary-row--total'>
                    <span>Итого</span>
                    <div className='sidebar__summary-prices'>
                        {discount > 0 && (
                            <span className='sidebar__summary-old'>
                                {rawTotal.toLocaleString('ru-RU')} ₽
                            </span>
                        )}
                        <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </div>
            </div>

            <button
                className='sidebar__btn'
                disabled={!canBuy || isLoadingPlace}
                onClick={handleBuy}
            >
                {isLoadingPlace
                    ? 'Переход к оплате...'
                    : items.length
                      ? `Купить за ${finalTotal.toLocaleString('ru-RU')} ₽`
                      : 'Выберите позиции'}
            </button>

            {!isFieldsFilled && items.length > 0 && (
                <p className='sidebar__hint'>Заполните обязательные поля *</p>
            )}
        </div>
    );
}

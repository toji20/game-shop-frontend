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
        <div className='sidebar-wrapper'>
            <div className='sidebar__payment'>
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
                    {discount > 0 && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Цена без скидки</span>
                            <span style={{ textDecoration: 'line-through' }}>
                                {rawTotal.toLocaleString('ru-RU')} ₽
                            </span>
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

                <button
                    className='sidebar__btn'
                    disabled={!canBuy || isLoadingPlace}
                    onClick={handleBuy}
                >
                    {isLoadingPlace
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

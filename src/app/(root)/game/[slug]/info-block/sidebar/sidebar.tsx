/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { CheckoutSelectedItems } from './checkout-selected-items/checkout-selected-items';
import './sidebar.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { usePlaceOrder } from '@/hooks/queries/useOrder';
import { useCheckPromo } from '@/hooks/queries/usePromo';
import {
    useCheckSteam,
    usePlaceSteamOrder,
} from '@/hooks/queries/useSteamOrder';
import { useFieldHistory } from '@/hooks/useFieldsHistory';
import { saveAccountHistory } from '@/lib/steam-history';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { IGame, IWarningItem, PaymentMethod } from '@/shared/types';
import { useCartStore } from '@/store/cart-store';
import { useSteamStore } from '@/store/steam-store';
import { AlertTriangle, CircleAlert, Ticket } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

interface SideBarProps {
    game: IGame | null;
    isLoading?: boolean;
    mode?: 'desktop' | 'mobile';
    onRequestClose?: () => void;
    onShowInstructions?: () => void;
}

const PAYMENT_METHODS: { key: PaymentMethod; img: string; title: string }[] = [
    { key: 'bank_card', img: '/card.png', title: 'Картой' },
    { key: 'sbp', img: '/spb.png', title: 'СБП' },
];

const VARIANT_ICONS = {
    danger: CircleAlert,
    alert: AlertTriangle,
};

// Единый вид поля для рендера, независимо от того, откуда оно взялось:
// из классического GameField (AUTO-игры) или из attributes.fields
// конкретного GiftAPI-товара (все остальные типы игр).
type DisplayField = {
    key: string;
    label: string;
    required: boolean;
};

export function SideBar({
    game,
    isLoading,
    mode = 'desktop',
    onShowInstructions,
}: SideBarProps) {
    const isSteam = game?.slug?.toLowerCase().includes('steam');
    const isMobile = mode === 'mobile';

    const { items, fields, setField, total } = useCartStore();
    const selectedProducts = items.map((item) => item.product);
    const { checkSteam, isChecking } = useCheckSteam();

    const { placeOrder, isLoadingPlace } = usePlaceOrder();
    const {
        account,
        amount,
        currency,
        paymentMethod: steamPaymentMethod,
        setPaymentMethod: setSteamPaymentMethod,
        checkResult,
    } = useSteamStore();
    const { placeSteamOrder, isLoadingPlace: isLoadingSteam } =
        usePlaceSteamOrder();
    const { checkPromo, isCheckingPromo, promoData, promoError, resetPromo } =
        useCheckPromo();

    const { history: fieldHistory, saveFields } = useFieldHistory(
        game?.id ?? 0,
    );

    const [paymentMethod, setPaymentMethod] =
        useState<PaymentMethod>('bank_card');
    const [promoCode, setPromoCode] = useState('');
    const [confirms, setConfirms] = useState<Record<string, boolean>>({});
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const rawTotal = total();
    const discount = !isSteam ? (promoData?.discount ?? 0) : 0;
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

    const STEAM_SERVICE_COMMISSION_PERCENT = 6;
    const steamBankCommissionPercent = steamPaymentMethod === 'sbp' ? 1 : 2;

    const steamTotal =
        checkResult == null
            ? null
            : steamPaymentMethod === 'sbp'
              ? checkResult.totalRubSbp
              : checkResult.totalRubCard;
    const currencySymbol =
        currency === 'RUB' ? '₽' : currency === 'KZT' ? '₸' : '$';

    const steamTotalWithDiscount =
        steamTotal === null
            ? null
            : promoData?.discount
              ? +(steamTotal * (1 - promoData.discount / 100)).toFixed(2)
              : steamTotal;

    const isSteamAmountLoading = isSteam && isChecking;

    // ── Все товары игры (не только выбранные) — нужны, чтобы показать поля
    // заранее, ещё до того, как пользователь что-то выбрал/добавил в корзину.
    const allGameProducts = game?.giftApiProducts ?? [];

    // ── Источник полей заказа зависит от типа игры:
    //  - AUTO   -> attributes.fields конкретных товаров GiftAPI в корзине
    //              (эти поля уходят в GiftAPI при автоматической отправке заказа);
    //  - MANUAL -> классические game.fields — их видит оператор и вводит
    //              вручную при обработке заказа, GiftAPI не участвует.
    // Оба варианта приводятся к единому виду { key, label, required }.
    const isAutoGame = game?.type === 'AUTO';

    const displayFields: DisplayField[] = useMemo(() => {
        if (!isAutoGame) {
            return (game?.fields ?? []).map((f) => ({
                key: String(f.id),
                label: f.label,
                required: f.required,
            }));
        }

        const map = new Map<string, DisplayField>();

        const sourceProducts =
            selectedProducts.length > 0 ? selectedProducts : allGameProducts;

        sourceProducts.forEach((product) => {
            const productFieldList = product?.attributes?.fields ?? [];

            productFieldList.forEach((field) => {
                const existing = map.get(field.code);

                if (!existing || (field.required && !existing.required)) {
                    map.set(field.code, {
                        key: field.code,
                        label: field.name,
                        required: field.required,
                    });
                }
            });
        });

        return Array.from(map.values());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAutoGame, game?.fields, selectedProducts, allGameProducts]);

    const requiredFields = displayFields.filter((f) => f.required);
    const isFieldsFilled = requiredFields.every(
        (f) => (fields[f.key] ?? '').trim().length > 0,
    );
    const allConfirmed = requiredFields.length === 0 || !!confirms['all'];
    const canBuy = items.length > 0 && isFieldsFilled && allConfirmed;

    const handleApplyPromo = () => {
        const code = promoCode.trim();
        if (!code) return;
        checkPromo({ code, target: isSteam ? 'STEAM' : 'GAME' });
    };

    const handleBuy = () => {
        if (isSteam) {
            if (!account || !amount || steamTotalWithDiscount === null) return;
            placeSteamOrder(
                {
                    account,
                    amount,
                    currency,
                    paymentMethod: steamPaymentMethod,
                    promoCode: promoCode.trim() || undefined,
                },
                {
                    onSuccess: () => {
                        saveAccountHistory(account);
                    },
                },
            );
            return;
        }

        if (!canBuy || !game) return;

        placeOrder(
            {
                type: game.type,
                paymentMethod,
                promoCode: promoCode.trim() || undefined,
                items: items.map((i) => ({
                    giftapiProductId: i.product.id,
                    gameId: i.gameId,
                    price: Number(i.product.finalPrice ?? i.product.price),
                    quantity: 1,
                    fields: Object.keys(fields).length > 0 ? fields : undefined,
                })),
            },
            {
                onSuccess: () => {
                    if (displayFields.length > 0) {
                        // saveFields из хука — сохраняем историю значений по key полей.
                        // Хук исторически ждал GameField[] ({id, label}), поэтому
                        // приводим DisplayField[] к совместимому виду.
                        saveFields(
                            fields,
                            displayFields.map((f) => ({
                                id: f.key,
                                label: f.label,
                            })),
                        );
                    }
                },
            },
        );
    };

    const paymentSection = (
        <div className='sidebar__payment'>
            <div className='sidebar__payment-methods'>
                {PAYMENT_METHODS.map((m) => {
                    const isActive = isSteam
                        ? steamPaymentMethod === m.key
                        : paymentMethod === m.key;

                    return (
                        <button
                            key={m.key}
                            type='button'
                            className={`sidebar__payment-btn ${isActive ? 'sidebar__payment-btn--active' : ''}`}
                            onClick={() => {
                                if (isSteam) {
                                    setSteamPaymentMethod(
                                        m.key as 'bank_card' | 'sbp',
                                    );
                                } else {
                                    setPaymentMethod(m.key);
                                }
                            }}
                        >
                            <img
                                src={m.img}
                                alt={m.title}
                                className='sidebar__payment-img'
                            />
                            <h3
                                className={`sidebar__payment-title ${isActive ? 'sidebar__payment-title--active' : ''}`}
                            >
                                {m.title}
                            </h3>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    const promoSection = (
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
                        !promoCode.trim() || isCheckingPromo || !!promoData
                    }
                >
                    {isCheckingPromo ? '...' : promoData ? '✓' : 'Применить'}
                </button>
            </div>

            {promoData && (
                <p className='sidebar__promo-success'>
                    Скидка {promoData.discount}% применена
                </p>
            )}

            {promoError && <p className='sidebar__promo-error'>{promoError}</p>}
        </div>
    );

    const fieldsSection = isLoading ? (
        <div className='sidebar__fields'>
            <Skeleton height={14} width={140} />
            <Skeleton height={44} borderRadius={8} />
            <Skeleton height={44} borderRadius={8} />
        </div>
    ) : (
        <div className='sidebar__fields'>
            <div className='sidebar__fields-header'>
                <p className='sidebar__section-title'>Данные для заказа</p>

                <a
                    href='#instructions'
                    className='sidebar__fields-hint'
                    onClick={(e) => {
                        e.preventDefault();
                        onShowInstructions?.();
                    }}
                >
                    Где найти?
                </a>
            </div>

            {displayFields.length > 0 ? (
                displayFields.map((f) => {
                    const isServerField =
                        f.label.toLowerCase().includes('сервер') ||
                        f.label.toLowerCase().includes('server');
                    const suggestions = fieldHistory[f.label] ?? [];
                    const currentValue = fields[f.key] ?? '';
                    const canShowSuggestions =
                        isMounted &&
                        suggestions.length > 0 &&
                        currentValue === '';

                    return (
                        <div key={f.key} className='sidebar__field'>
                            {isServerField &&
                            game?.servers &&
                            game.servers.length > 0 ? (
                                <select
                                    className='sidebar__field-input sidebar__field-select'
                                    value={currentValue}
                                    onChange={(e) =>
                                        setField(f.key, e.target.value)
                                    }
                                >
                                    <option value='' disabled>
                                        {f.required ? `${f.label} *` : f.label}
                                    </option>
                                    {game.servers.map((s) => (
                                        <option
                                            key={s.id}
                                            value={s.code ?? s.name}
                                        >
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <>
                                    <input
                                        className='sidebar__field-input'
                                        value={currentValue}
                                        onChange={(e) =>
                                            setField(f.key, e.target.value)
                                        }
                                        placeholder={
                                            f.required
                                                ? `${f.label} *`
                                                : f.label
                                        }
                                    />
                                    {canShowSuggestions && (
                                        <div className='sidebar__suggestions'>
                                            {suggestions.map((s) => (
                                                <button
                                                    key={s}
                                                    type='button'
                                                    className='sidebar__suggestion'
                                                    onClick={() =>
                                                        setField(f.key, s)
                                                    }
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <p className='sidebar__fields-empty'>
                    Добавьте товар в корзину, чтобы указать данные для заказа
                </p>
            )}
        </div>
    );

    const summarySection = (
        <div className='sidebar__summary'>
            <div className='sidebar__summary-total-row'>
                <span className='sidebar__summary-total-label'>Итого</span>
                <span className='sidebar__summary-total-value'>
                    {isLoading ? (
                        <Skeleton width={80} height={22} />
                    ) : isSteam ? (
                        steamTotal !== null ? (
                            `${steamTotalWithDiscount!.toLocaleString('ru-RU')} ₽`
                        ) : isChecking ? (
                            <Skeleton width={120} height={22} />
                        ) : (
                            '—'
                        )
                    ) : (
                        `${finalTotal.toLocaleString('ru-RU')} ₽`
                    )}
                </span>
            </div>

            {!isLoading && isSteam && (
                <>
                    <div className='sidebar__summary-row sidebar__summary-row--commission'>
                        <span>Комиссия Steam</span>
                        <span>{STEAM_SERVICE_COMMISSION_PERCENT}%</span>
                    </div>

                    <div className='sidebar__summary-row sidebar__summary-row--commission'>
                        <span>Комиссия банка</span>
                        <span>{steamBankCommissionPercent}%</span>
                    </div>

                    {promoData && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Скидка по промокоду</span>
                            <span>-{promoData.discount}%</span>
                        </div>
                    )}
                </>
            )}

            {!isLoading && !isSteam && (
                <>
                    {discount > 0 && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Скидка {discount}%</span>
                            <span>
                                −{(rawTotal - afterDiscount).toFixed(2)} ₽
                            </span>
                        </div>
                    )}

                    <div className='sidebar__summary-row sidebar__summary-row--commission'>
                        <span>Комиссия банка {commissionPercent}%</span>
                        <span>
                            +{commissionAmount.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>
                </>
            )}

            {isMobile && !isLoading && !isSteam && items.length > 0 && (
                <>
                    <div className='sidebar__summary-divider' />

                    <div className='sidebar__summary-row'>
                        <span>Сумма</span>
                        <span>{rawTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>

                    {discount > 0 && (
                        <div className='sidebar__summary-row sidebar__summary-row--discount'>
                            <span>Скидка {discount}%</span>
                            <span>
                                −{(rawTotal - afterDiscount).toFixed(2)} ₽
                            </span>
                        </div>
                    )}

                    <div className='sidebar__summary-row'>
                        <span>Комиссия банка {commissionPercent}%</span>
                        <span>
                            +{commissionAmount.toLocaleString('ru-RU')} ₽
                        </span>
                    </div>

                    <div className='sidebar__summary-row sidebar__summary-row--accent'>
                        <span>Итого к оплате</span>
                        <span>{finalTotal.toLocaleString('ru-RU')} ₽</span>
                    </div>
                </>
            )}
        </div>
    );

    const confirmSection = !isLoading && requiredFields.length > 0 && (
        <label
            className={`sidebar__confirm-item ${confirms['all'] ? 'sidebar__confirm-item--checked' : ''}`}
        >
            <input
                type='checkbox'
                className='sidebar__confirm-checkbox'
                checked={!!confirms['all']}
                onChange={(e) => setConfirms({ all: e.target.checked })}
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
                    <span key={f.key}>
                        <b>{f.label.toLowerCase()}</b>
                        {i < requiredFields.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </span>
        </label>
    );

    const actionSection = isLoading ? (
        <Skeleton height={52} borderRadius={999} />
    ) : (
        <button
            type='button'
            className='sidebar__btn'
            disabled={
                isSteam
                    ? !account ||
                      !amount ||
                      steamTotal === null ||
                      isLoadingSteam
                    : !canBuy || isLoadingPlace
            }
            onClick={handleBuy}
        >
            {isSteam
                ? isLoadingSteam
                    ? 'Переход...'
                    : isSteamAmountLoading && steamTotal === null
                      ? 'Рассчитываем сумму...'
                      : steamTotal !== null
                        ? `Оплатить ${steamTotalWithDiscount!.toLocaleString('ru-RU')} ₽`
                        : `Пополнить ${amount.toLocaleString('ru-RU')} ${currencySymbol}`
                : isLoadingPlace
                  ? 'Переход к оплате...'
                  : items.length
                    ? `Оплатить ${finalTotal.toLocaleString('ru-RU')} ₽`
                    : 'Выберите позиции'}
        </button>
    );

    const termsSection = (
        <>
            <p className='sidebar__terms'>
                Нажимая «Купить», вы принимаете Правила пользования сайтом и
                Политику конфиденциальности.
            </p>

            {!isLoading && !isFieldsFilled && items.length > 0 && (
                <p className='sidebar__hint'>Заполните обязательные поля *</p>
            )}
        </>
    );

    if (isMobile) {
        return (
            <div className='sidebar-wrapper sidebar-wrapper--mobile'>
                <div className='sidebar sidebar--mobile'>
                    {selectedProducts.length > 0 && (
                        <CheckoutSelectedItems items={selectedProducts} />
                    )}

                    {paymentSection}

                    <div className='sidebar__mobile-section'>
                        <p className='sidebar__section-title'>Промокод</p>
                        {promoSection}
                    </div>

                    {!isSteam && (
                        <div className='sidebar__mobile-section'>
                            <p className='sidebar__section-title'>
                                Ваши данные
                            </p>
                            {fieldsSection}
                        </div>
                    )}

                    {summarySection}

                    {game?.warnings &&
                        (game.warnings as IWarningItem[]).map((w, i) => (
                            <CheckoutWarning
                                key={i}
                                icon={VARIANT_ICONS[w.variant]}
                                title={w.title}
                                text={w.text}
                                variant={w.variant}
                            />
                        ))}

                    {confirmSection}
                    {actionSection}
                    {termsSection}
                </div>
            </div>
        );
    }

    return (
        <div className='sidebar-wrapper'>
            {paymentSection}

            <div className='sidebar'>
                {summarySection}
                {promoSection}
                {!isSteam && fieldsSection}
                {confirmSection}
                {actionSection}
                {termsSection}
            </div>
        </div>
    );
}

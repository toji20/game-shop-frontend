/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { CheckoutSelectedItems } from './checkout-selected-items/checkout-selected-items';
import './sidebar.css';
import { Skeleton } from '@/components/ui/skeleton/skeleton';
import { usePlaceOrder } from '@/hooks/queries/useOrder';
import { useCheckPromo } from '@/hooks/queries/usePromo';
import { useFieldHistory } from '@/hooks/useFieldsHistory';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { IGame, IWarningItem, PaymentMethod } from '@/shared/types';
import { IGiftApiFieldValidation } from '@/shared/types/giftapi-product.interface';
import { useCartStore } from '@/store/cart-store';
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

// Комиссия сервиса за пополнение товаров с произвольной суммой (например,
// Steam-кошелёк) — используется здесь ТОЛЬКО для отображения примерного %.
// Совпадает с GIFTAPI_CUSTOM_TOPUP_COMMISSION на бэкенде (order.service.ts).
const APPROX_CUSTOM_TOPUP_COMMISSION_PERCENT = 4;

// Единый вид поля для рендера, независимо от того, откуда оно взялось:
// из классического GameField (MANUAL-игры) или из attributes.fields
// конкретного GiftAPI-товара (AUTO-игры, включая пополнение на произвольную
// сумму вроде Steam — там же лежит поле "amount").
type DisplayField = {
    key: string;
    label: string;
    required: boolean;
    fieldType?: string; // 'string' | 'decimal' и т.п. — только у GiftAPI-полей
    validation?: IGiftApiFieldValidation; // { regex? } — только у GiftAPI-полей
};

export function SideBar({
    game,
    isLoading,
    mode = 'desktop',
    onShowInstructions,
}: SideBarProps) {
    const isMobile = mode === 'mobile';

    const { items, fields, setField, total, hasApproxPricedItem } =
        useCartStore();
    const selectedProducts = items.map((item) => item.product);

    const { placeOrder, isLoadingPlace } = usePlaceOrder();
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

    const isApprox = hasApproxPricedItem();

    // ── Все товары игры (не только выбранные) — нужны, чтобы показать поля
    // заранее, ещё до того, как пользователь что-то выбрал/добавил в корзину.
    const allGameProducts = game?.giftApiProducts ?? [];

    // ── Источник полей заказа зависит от типа игры:
    //  - AUTO   -> attributes.fields конкретных товаров GiftAPI в корзине
    //              (эти поля уходят в GiftAPI при автоматической отправке заказа;
    //              сюда же попадает "amount" у товаров с произвольной суммой,
    //              например пополнение Steam);
    //  - MANUAL -> классические game.fields — их видит оператор и вводит
    //              вручную при обработке заказа, GiftAPI не участвует.
    // Оба варианта приводятся к единому виду DisplayField.
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
                        fieldType: field.type,
                        validation: field.validation,
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
        checkPromo({ code, target: 'GAME' });
    };

    const handleBuy = () => {
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
                    const isActive = paymentMethod === m.key;

                    return (
                        <button
                            key={m.key}
                            type='button'
                            className={`sidebar__payment-btn ${isActive ? 'sidebar__payment-btn--active' : ''}`}
                            onClick={() => setPaymentMethod(m.key)}
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
                    const isDecimalField = f.fieldType === 'decimal';
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
                                        type={
                                            isDecimalField ? 'number' : 'text'
                                        }
                                        step={
                                            isDecimalField ? 'any' : undefined
                                        }
                                        // Нативная HTML-валидация по regex работает только
                                        // для type="text" — для number браузер её игнорирует,
                                        // поэтому для decimal-полей pattern не выставляем.
                                        pattern={
                                            !isDecimalField
                                                ? f.validation?.regex
                                                : undefined
                                        }
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
                    ) : (
                        `${isApprox ? '~' : ''}${finalTotal.toLocaleString('ru-RU')} ₽`
                    )}
                </span>
            </div>

            {!isLoading && isApprox && (
                <div className='sidebar__summary-row sidebar__summary-row--commission'>
                    <span>Комиссия сервиса (ориентировочно)</span>
                    <span>{APPROX_CUSTOM_TOPUP_COMMISSION_PERCENT}%</span>
                </div>
            )}

            {!isLoading && (
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

                    {/* TODO: сюда добавить предупреждение, что итоговая стоимость
                        может измениться из-за разницы в курсах — для товаров
                        с isApprox === true */}
                </>
            )}

            {isMobile && !isLoading && items.length > 0 && (
                <>
                    <div className='sidebar__summary-divider' />

                    <div className='sidebar__summary-row'>
                        <span>Сумма</span>
                        <span>
                            {isApprox ? '~' : ''}
                            {rawTotal.toLocaleString('ru-RU')} ₽
                        </span>
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
                        <span>
                            {isApprox ? '~' : ''}
                            {finalTotal.toLocaleString('ru-RU')} ₽
                        </span>
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
            disabled={!canBuy || isLoadingPlace}
            onClick={handleBuy}
        >
            {isLoadingPlace
                ? 'Переход к оплате...'
                : items.length
                  ? `Оплатить ${isApprox ? '~' : ''}${finalTotal.toLocaleString('ru-RU')} ₽`
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

                    <div className='sidebar__mobile-section'>
                        <p className='sidebar__section-title'>Ваши данные</p>
                        {fieldsSection}
                    </div>

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
                {fieldsSection}
                {confirmSection}
                {actionSection}
                {termsSection}
            </div>
        </div>
    );
}

'use client';

import './steam-checkout.css';
import {
    getAmountField,
    getLoginField,
    getProductForCurrency,
} from './steam-checkout.utils';
import { useSteamTopupStore } from './steam-topup-store';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { IGame, IWarningItem } from '@/shared/types';
import { AlertTriangle, CircleAlert } from 'lucide-react';

const VARIANT_ICONS = {
    danger: CircleAlert,
    alert: AlertTriangle,
};

const QUICK_AMOUNTS = [100, 500, 1000];

const MIN_AMOUNT = 100;
const MAX_AMOUNT = 15000;

interface SteamCheckoutFormProps {
    game: IGame;
}

export function SteamCheckoutForm({ game }: SteamCheckoutFormProps) {
    const {
        login,
        amount,
        currency,
        setLogin,
        setAmount,
        setCurrency,
        addAmount,
    } = useSteamTopupStore();

    const products = game.giftApiProducts ?? [];
    const activeProduct = getProductForCurrency(products, currency);
    const loginField = getLoginField(activeProduct);
    const amountField = getAmountField(activeProduct);

    const numericAmount = Number(amount) || 0;
    const isBelowMin =
        amount !== '' && numericAmount > 0 && numericAmount < MIN_AMOUNT;
    const isAboveMax = numericAmount > MAX_AMOUNT;
    const amountError = isBelowMin
        ? `Минимальная сумма пополнения — ${MIN_AMOUNT} ₽`
        : isAboveMax
          ? `Максимальная сумма пополнения — ${MAX_AMOUNT.toLocaleString('ru-RU')} ₽`
          : null;

    const handleAmountChange = (value: string) => {
        // допускаем пустую строку и промежуточный ввод, но не даём превысить максимум
        if (value === '') {
            setAmount(value);
            return;
        }
        const num = Number(value);
        if (Number.isNaN(num)) return;
        if (num > MAX_AMOUNT) {
            setAmount(String(MAX_AMOUNT));
            return;
        }
        setAmount(value);
    };

    const handleAmountBlur = () => {
        const num = Number(amount) || 0;
        if (num > 0 && num < MIN_AMOUNT) {
            setAmount(String(MIN_AMOUNT));
        }
    };

    const handleQuickAmount = (n: number) => {
        const next = Math.min(numericAmount + n, MAX_AMOUNT);
        setAmount(String(next));
    };

    return (
        <div className='steam-checkout'>
            <div className='steam-checkout__header'>
                {game.icon && (
                    <img
                        src={game.icon}
                        alt={game.name}
                        className='steam-checkout__icon'
                    />
                )}
                <h2 className='steam-checkout__title'>Пополнить {game.name}</h2>
            </div>

            {game.description && (
                <p className='steam-checkout__desc'>{game.description}</p>
            )}

            <div className='steam-checkout__field'>
                <label className='steam-checkout__label'>
                    {loginField?.name ?? `Логин ${game.name}`}
                </label>
                <input
                    className='steam-checkout__input'
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                    placeholder={`Ваш логин ${game.name}`}
                />
            </div>

            <div className='steam-checkout__field'>
                <label className='steam-checkout__label'>
                    {amountField?.name ?? 'Сумма'}
                </label>

                <div className='steam-checkout__amount-row'>
                    <input
                        className={`steam-checkout__input steam-checkout__input--amount ${
                            amountError ? 'steam-checkout__input--error' : ''
                        }`}
                        type='number'
                        min={MIN_AMOUNT}
                        max={MAX_AMOUNT}
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        onBlur={handleAmountBlur}
                        placeholder='0'
                    />

                    <div className='steam-checkout__currency-toggle'>
                        <button
                            type='button'
                            className={`steam-checkout__currency-btn ${
                                currency === 'RUB'
                                    ? 'steam-checkout__currency-btn--active'
                                    : ''
                            }`}
                            onClick={() => setCurrency('RUB')}
                        >
                            RU ₽
                        </button>
                        <button
                            type='button'
                            className={`steam-checkout__currency-btn ${
                                currency === 'KZT'
                                    ? 'steam-checkout__currency-btn--active'
                                    : ''
                            }`}
                            onClick={() => setCurrency('KZT')}
                        >
                            KZ ₸
                        </button>
                    </div>
                </div>

                {amountError && (
                    <p className='steam-checkout__amount-hint steam-checkout__amount-hint--error'>
                        {amountError}
                    </p>
                )}
                {!amountError && (
                    <p className='steam-checkout__amount-hint'>
                        От {MIN_AMOUNT} ₽ до{' '}
                        {MAX_AMOUNT.toLocaleString('ru-RU')} ₽
                    </p>
                )}

                <div className='steam-checkout__quick-amounts'>
                    {QUICK_AMOUNTS.map((n) => (
                        <button
                            key={n}
                            type='button'
                            className='steam-checkout__quick-btn'
                            onClick={() => handleQuickAmount(n)}
                            disabled={numericAmount >= MAX_AMOUNT}
                        >
                            + {n} ₽
                        </button>
                    ))}
                </div>
            </div>

            {!!game.warnings?.length &&
                (game.warnings as IWarningItem[]).map((w, i) => (
                    <CheckoutWarning
                        key={i}
                        icon={VARIANT_ICONS[w.variant]}
                        title={w.title}
                        text={w.text}
                        variant={w.variant}
                    />
                ))}
        </div>
    );
}

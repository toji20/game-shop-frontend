/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import './steam-topup.css';
import { useCheckSteam } from '@/hooks/queries/useSteamOrder';
import { loadAccountHistory } from '@/lib/steam-history';
import { CheckoutWarning } from '@/shared/checkout-warning/checkout-warning';
import { useSteamStore } from '@/store/steam-store';
import { AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

const QUICK_AMOUNTS = {
    RUB: [100, 500, 1000],
    KZT: [500, 2000, 5000],
    USD: [1, 5, 10],
};

const CURRENCY_FLAGS: Record<string, string> = {
    RUB: '🇷🇺',
    KZT: '🇰🇿',
    USD: '🇺🇸',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
    RUB: '₽',
    KZT: '₸',
    USD: '$',
};

export function SteamTopUp() {
    const { account, amount, currency, setAccount, setAmount, setCurrency } =
        useSteamStore();
    const { checkSteam } = useCheckSteam();

    const [mounted, setMounted] = useState(false);
    const [accountHistory, setAccountHistory] = useState<string[]>([]);

    useEffect(() => {
        setMounted(true);
        setAccountHistory(loadAccountHistory());
    }, []);

    useEffect(() => {
        const onStorage = () => setAccountHistory(loadAccountHistory());
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    useEffect(() => {
        if (!account || !amount) return;
        const timeout = setTimeout(() => {
            checkSteam();
        }, 600);
        return () => clearTimeout(timeout);
    }, [account, amount, currency]);

    return (
        <div className='steam'>
            <div className='steam__header'>
                <img
                    src='/steam-icon.svg'
                    alt='Steam'
                    className='steam__icon'
                />
                <h2 className='steam__title'>Пополнить Стим</h2>
            </div>

            <p className='steam__desc'>
                Пополнение стим для аккаунтов России, Беларуси, Казахстана и
                других стран СНГ. Мгновенное пополнение баланса вашего кошелька,
                безопасные платежи и самая низкая комиссия на рынке. Доступные
                валюты для пополнения в рублях и тенге. Наша служба поддержки
                работает 24/7.
            </p>

            <div className='steam__field'>
                <label className='steam__label'>
                    Логин Steam
                    <HelpCircle size={14} className='steam__label-icon' />
                </label>
                <input
                    className='steam__input'
                    placeholder='Ваш логин Steam'
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                />
                {/* Рендерим suggestions только после монтирования — иначе гидрация падает */}
                {mounted && accountHistory.length > 0 && account === '' && (
                    <div className='steam__suggestions'>
                        {accountHistory.map((a) => (
                            <button
                                key={a}
                                type='button'
                                className='steam__suggestion'
                                onClick={() => setAccount(a)}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className='steam__field'>
                <label className='steam__label'>Сумма</label>
                <div className='steam__amount-wrap'>
                    <input
                        className='steam__input steam__input--amount'
                        type='number'
                        value={amount === 0 ? '' : amount}
                        min={0}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value.length > 6) return;
                            setAmount(value === '' ? 0 : Number(value));
                        }}
                    />
                    <div className='steam__currencies'>
                        {(['RUB', 'KZT'] as const).map((c) => (
                            <button
                                key={c}
                                className={`steam__currency-btn ${currency === c ? 'steam__currency-btn--active' : ''}`}
                                onClick={() => setCurrency(c)}
                            >
                                <span>{CURRENCY_FLAGS[c]}</span>
                                <span>{CURRENCY_SYMBOLS[c]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className='steam__quick'>
                    {QUICK_AMOUNTS[currency].map((q) => (
                        <button
                            key={q}
                            className='steam__quick-btn'
                            onClick={() => setAmount(amount + q)}
                        >
                            + {q} {CURRENCY_SYMBOLS[currency]}
                        </button>
                    ))}
                </div>
            </div>

            <CheckoutWarning
                icon={AlertCircle}
                title='Внимание:'
                text='Указывайте только логин Steam. Мы пополняем аккаунты только из стран СНГ (Россия, Казахстан, Узбекистан и др.). Для пополнения прочтите гайд.'
                variant='danger'
            />

            <CheckoutWarning
                icon={AlertTriangle}
                title='Обратите внимание'
                text='Если у вас на аккаунте до этого не было пополнений прочтите гайд.'
                variant='alert'
            />
        </div>
    );
}

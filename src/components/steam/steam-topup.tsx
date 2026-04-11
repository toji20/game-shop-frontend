/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import './steam-topup.css';
import { useSteamStore } from '@/store/steam-store';
import { AlertCircle, AlertTriangle, HelpCircle } from 'lucide-react';

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

    return (
        <div className='steam'>
            {/* Заголовок */}
            <div className='steam__header'>
                <img
                    src='/steam-icon.svg'
                    alt='Steam'
                    className='steam__icon'
                />
                <h2 className='steam__title'>Пополнить Стим</h2>
            </div>

            {/* Описание */}
            <p className='steam__desc'>
                Пополнение стим для аккаунтов России, Беларуси, Казахстана и
                других стран СНГ. Мгновенное пополнение баланса вашего кошелька,
                безопасные платежи и самая низкая комиссия на рынке. Доступные
                валюты для пополнения в рублях и тенге. Наша служба поддержки
                работает 24/7.
            </p>

            {/* Логин */}
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
            </div>

            {/* Сумма + валюта */}
            <div className='steam__field'>
                <label className='steam__label'>Сумма</label>
                <div className='steam__amount-wrap'>
                    <input
                        className='steam__input steam__input--amount'
                        type='number'
                        value={amount}
                        min={1}
                        onChange={(e) => {
                            const value = e.target.value;

                            if (value.length > 6) return;

                            setAmount(Number(value));
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

                {/* Быстрые суммы */}
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

            {/* Предупреждения */}
            <div className='steam__alert steam__alert--red'>
                <AlertCircle size={16} className='steam__alert-icon' />
                <p>
                    <strong>Внимание:</strong> Указывайте только логин Steam. Мы
                    пополняем аккаунты только из стран СНГ (Россия, Казахстан,
                    Узбекистан и др.). Для пополнения{' '}
                    <a href='/guide' className='steam__alert-link'>
                        прочтите гайд
                    </a>
                    .
                </p>
            </div>

            <div className='steam__alert steam__alert--yellow'>
                <AlertTriangle size={16} className='steam__alert-icon' />
                <p>
                    <strong>Обратите внимание</strong>
                    <br />
                    Внимание: Если у вас на аккаунте до этого не было пополнений{' '}
                    <a href='/guide' className='steam__alert-link'>
                        прочтите гайд
                    </a>
                    .
                </p>
            </div>
        </div>
    );
}

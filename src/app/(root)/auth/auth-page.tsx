/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import '../auth/shared/auth-page.css';
import { SERVER_URL } from '@/config/api.config';
import { useSendCode, useVerifyCode } from '@/hooks/queries/useAuth';
import { useState, useRef } from 'react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');

    // код как массив
    const [codeArray, setCodeArray] = useState(['', '', '', '', '', '']);

    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const { sendCode, isLoadingSendCode } = useSendCode();
    const { verifyCode, isLoadingVerify } = useVerifyCode();

    const handleSendCode = () => {
        if (!email.trim()) return;

        sendCode(email, {
            onSuccess: () => setStep('code'),
        });
    };

    const handleVerify = () => {
        const code = codeArray.join('');
        if (code.length !== 6) return;

        verifyCode({ email, code });
    };

    const handleYandex = () => {
        window.location.href = `${SERVER_URL}/auth/yandex`;
    };

    const handleGoogle = () => {
        window.location.href = `${SERVER_URL}/auth/google`;
    };

    // ввод символа
    const handleCodeChange = (value: string, index: number) => {
        if (!/^[a-zA-Z0-9]?$/.test(value)) return;

        const newCode = [...codeArray];
        newCode[index] = value.toUpperCase();
        setCodeArray(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    // backspace
    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        if (e.key === 'Backspace') {
            if (codeArray[index]) {
                const newCode = [...codeArray];
                newCode[index] = '';
                setCodeArray(newCode);
            } else if (index > 0) {
                inputsRef.current[index - 1]?.focus();
            }
        }
    };

    // вставка
    const handlePaste = (e: React.ClipboardEvent) => {
        const paste = e.clipboardData.getData('text').slice(0, 6);
        if (!paste) return;

        const newCode = paste.split('').map((c) => c.toUpperCase());

        while (newCode.length < 6) newCode.push('');

        setCodeArray(newCode);
    };

    return (
        <div className='auth-page'>
            <div className='auth-page__bg' />

            <div className='auth-card'>
                <h1 className='auth-card__title'>Авторизация</h1>

                {step === 'email' ? (
                    <p className='auth-card__desc'>
                        Введите email — мы отправим код для входа (если раннее
                        регистрировались через Google в нашем сервисе)
                    </p>
                ) : (
                    <p className='auth-card__desc'>
                        Введите код, отправленный на {email}
                    </p>
                )}

                {/* EMAIL */}
                {step === 'email' && (
                    <>
                        <input
                            className='auth-card__input'
                            type='email'
                            placeholder='Ваш Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleSendCode()
                            }
                        />

                        <button
                            className='auth-card__btn auth-card__btn--email'
                            onClick={handleSendCode}
                            disabled={isLoadingSendCode || !email.trim()}
                        >
                            {isLoadingSendCode ? 'Отправка...' : 'Получить код'}
                        </button>
                    </>
                )}

                {/* CODE */}
                {step === 'code' && (
                    <>
                        <div className='auth-code'>
                            {codeArray.map((char, i) => (
                                <input
                                    key={i}
                                    ref={(el) => {
                                        inputsRef.current[i] = el;
                                    }}
                                    className='auth-code__input'
                                    value={char}
                                    onChange={(e) =>
                                        handleCodeChange(e.target.value, i)
                                    }
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                    onPaste={handlePaste}
                                    maxLength={1}
                                />
                            ))}
                        </div>

                        <button
                            className='auth-card__btn auth-card__btn--email'
                            onClick={handleVerify}
                            disabled={
                                isLoadingVerify ||
                                codeArray.join('').length !== 6
                            }
                        >
                            {isLoadingVerify ? 'Проверка...' : 'Войти'}
                        </button>

                        <button
                            className='auth-card__change-email'
                            onClick={() => {
                                setStep('email');
                                setCodeArray(['', '', '', '', '', '']);
                            }}
                        >
                            Изменить email
                        </button>

                        <button
                            className='auth-card__resend'
                            onClick={handleSendCode}
                            disabled={isLoadingSendCode}
                        >
                            Отправить код ещё раз
                        </button>
                    </>
                )}

                {/* OAuth */}
                {step === 'email' && (
                    <>
                        <button
                            className='auth-card__btn auth-card__btn--yandex'
                            onClick={handleYandex}
                        >
                            <img
                                src='/yandex.png'
                                alt='Яндекс'
                                className='size-5'
                            />
                            Войти через Яндекс
                        </button>

                        <button
                            className='auth-card__btn auth-card__btn--google'
                            onClick={handleGoogle}
                        >
                            <svg width='20' height='20' viewBox='0 0 24 24'>
                                <path
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                    fill='#4285F4'
                                />
                                <path
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                    fill='#34A853'
                                />
                                <path
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
                                    fill='#FBBC05'
                                />
                                <path
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                    fill='#EA4335'
                                />
                            </svg>
                            Войти через Google
                        </button>
                    </>
                )}

                <p className='auth-card__terms'>
                    Продолжая, вы принимаете условия{' '}
                    <a href='/user_agreement'>соглашения</a> и{' '}
                    <a href='/data'>политику обработки данных</a>
                </p>
            </div>
        </div>
    );
}

/* eslint-disable @next/next/no-html-link-for-pages */
'use client';

import '../auth/shared/auth-page.css';
import { SERVER_URL } from '@/config/api.config';
import { useSendCode, useVerifyCode } from '@/hooks/queries/useAuth';
import { useState } from 'react';

export default function AuthPage() {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');

    const { sendCode, isLoadingSendCode } = useSendCode();
    const { verifyCode, isLoadingVerify } = useVerifyCode();

    const handleSendCode = () => {
        if (!email.trim()) return;

        sendCode(email, {
            onSuccess: () => setStep('code'),
        });
    };

    const handleVerify = () => {
        if (!code.trim()) return;

        verifyCode({ email, code });
    };

    const handleVk = () => {
        window.location.href = `${SERVER_URL}/auth/vk`;
    };

    const handleGoogle = () => {
        window.location.href = `${SERVER_URL}/auth/google`;
    };

    return (
        <div className='auth-page'>
            {/* фон */}
            <div className='auth-page__bg' />

            <div className='auth-card'>
                <h1 className='auth-card__title'>Авторизация</h1>

                {step === 'email' ? (
                    <p className='auth-card__desc'>
                        Введите email — мы отправим код для входа
                    </p>
                ) : (
                    <p className='auth-card__desc'>
                        Введите код, отправленный на {email}
                    </p>
                )}

                {/* EMAIL STEP */}
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

                {/* CODE STEP */}
                {step === 'code' && (
                    <>
                        <input
                            className='auth-card__input'
                            type='text'
                            placeholder='Введите код'
                            value={code}
                            onChange={(e) =>
                                setCode(e.target.value.toUpperCase())
                            }
                            onKeyDown={(e) =>
                                e.key === 'Enter' && handleVerify()
                            }
                        />

                        <button
                            className='auth-card__btn auth-card__btn--email'
                            onClick={handleVerify}
                            disabled={isLoadingVerify || !code.trim()}
                        >
                            {isLoadingVerify ? 'Проверка...' : 'Войти'}
                        </button>

                        {/* сменить email */}
                        <button
                            className='auth-card__change-email'
                            onClick={() => {
                                setStep('email');
                                setCode('');
                            }}
                        >
                            Изменить email
                        </button>

                        {/* resend */}
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

                {/* OAuth */}
                {step === 'email' && (
                    <>
                        <button
                            className='auth-card__btn auth-card__btn--vk'
                            onClick={handleVk}
                        >
                            <svg
                                className='auth-card__btn-icon'
                                viewBox='0 0 24 24'
                                fill='currentColor'
                            >
                                <path d='M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14C20.67 22 22 20.67 22 15.07V8.93C22 3.33 20.67 2 15.07 2zm2.96 13.5h-1.6c-.6 0-.79-.48-1.87-1.57-.94-.94-1.36-.94-1.6-.94-.32 0-.42.1-.42.56v1.43c0 .4-.13.64-1.17.64-1.73 0-3.65-1.05-5-3.01C4.9 10.06 4.5 8.5 4.5 8.16c0-.24.1-.46.56-.46h1.6c.42 0 .58.19.74.64.82 2.37 2.2 4.45 2.77 4.45.21 0 .31-.1.31-.64V9.77c-.07-1.15-.67-1.25-.67-1.66 0-.2.16-.4.42-.4h2.52c.35 0 .48.19.48.6v3.22c0 .35.16.48.26.48.21 0 .4-.13.8-.53 1.24-1.39 2.13-3.52 2.13-3.52.12-.24.32-.46.74-.46h1.6c.48 0 .59.25.48.6-.2.93-2.15 3.68-2.15 3.68-.17.28-.23.4 0 .7.17.24.72.74 1.09 1.19.67.79 1.19 1.46 1.33 1.92.14.45-.08.68-.54.68z' />
                            </svg>
                            Войти с VK ID
                        </button>

                        <button
                            className='auth-card__btn auth-card__btn--google'
                            onClick={handleGoogle}
                        >
                            Войти через Google
                        </button>
                    </>
                )}

                <p className='auth-card__terms'>
                    Продолжая, вы принимаете условия{' '}
                    <a href='/terms'>соглашения</a> и{' '}
                    <a href='/privacy'>политику конфиденциальности</a>
                </p>
            </div>
        </div>
    );
}

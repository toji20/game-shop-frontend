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

    const handleVk = () => {
        window.location.href = `${SERVER_URL}/auth/vk`;
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
                        Введите email — мы отправим код для входа
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
                            className='auth-card__btn auth-card__btn--vk'
                            onClick={handleVk}
                        >
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
                    <a href='/user_agreement'>соглашения</a> и{' '}
                    <a href='/privacy'>политику конфиденциальности</a>
                </p>
            </div>
        </div>
    );
}

'use client';

import { Image, MessageCircleMore } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface SupportMenuProps {
    mode?: 'desktop' | 'nav' | 'mobile-nav';
}

const SUPPORT_LINKS = [
    {
        title: 'VK',
        href: 'https://vk.com',
        className: 'support-menu__social-btn--vk',
        content: (
            <img
                src='/vk-supp.png'
                className='support-menu__social-btn-img'
                alt='VK'
            />
        ),
    },
    {
        title: 'Telegram',
        href: 'https://t.me',
        className: 'support-menu__social-btn--tg',
        content: (
            <img
                src='/tg-supp.png'
                className='support-menu__social-btn-img'
                alt='Telegram'
            />
        ),
    },
    {
        title: 'Email',
        href: 'mailto:support@zaneshop.ru',
        className: 'support-menu__social-btn--mail',
        content: (
            <img
                src='/gmail-supp.png'
                className='support-menu__social-btn-img'
                alt='Email'
            />
        ),
    },
];

export function SupportMenu({ mode = 'desktop' }: SupportMenuProps) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!rootRef.current) return;
            if (rootRef.current.contains(event.target as Node)) return;
            setOpen(false);
        };

        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    if (mode === 'desktop') {
        return (
            <div
                ref={rootRef}
                className={`support-menu support-menu--desktop ${
                    open ? 'support-menu--open' : ''
                }`}
            >
                <div className='support-menu__stack'>
                    {SUPPORT_LINKS.map((item, index) => (
                        <a
                            key={item.title}
                            href={item.href}
                            target='_blank'
                            rel='noreferrer'
                            className={`support-menu__social-btn ${item.className}`}
                            style={{ transitionDelay: `${index * 40}ms` }}
                            aria-label={item.title}
                        >
                            {item.content}
                        </a>
                    ))}
                </div>

                <button
                    type='button'
                    className={`support-menu__trigger support-menu__trigger--desktop ${
                        open ? 'support-menu__trigger--open' : ''
                    }`}
                    onClick={() => setOpen((value) => !value)}
                    aria-label='Открыть поддержку'
                >
                    <div className='support-menu__trigger-closed'>
                        <span className='support-menu__trigger-label'>
                            24/7
                        </span>
                        <span className='support-menu__trigger-chat'>
                            <img
                                src='/support-icon.png'
                                className='w-8 h-6.5'
                            />
                        </span>
                    </div>

                    <div className='support-menu__trigger-open'>
                        <span className='support-menu__trigger-open-bg' />
                        <img
                            src='/arrow-supp.png'
                            className='support-menu__trigger-open-circle-img'
                            alt='Открыть поддержку'
                        />
                    </div>
                </button>
            </div>
        );
    }

    if (mode === 'nav') {
        return (
            <div
                ref={rootRef}
                className={`support-menu support-menu--nav ${
                    open ? 'support-menu--open' : ''
                }`}
            >
                <button
                    type='button'
                    className={`support-menu__nav-trigger ${
                        open ? 'support-menu__nav-trigger--open' : ''
                    }`}
                    onClick={() => setOpen((value) => !value)}
                    aria-label='Поддержка'
                >
                    <img
                        src='/support-icon.png'
                        alt='Поддержка'
                        className='mobile-nav__custom-icon'
                    />
                    <span>Поддержка</span>
                </button>

                <div className='support-menu__dropdown support-menu__dropdown--nav'>
                    {SUPPORT_LINKS.map((item) => (
                        <a
                            key={item.title}
                            href={item.href}
                            target='_blank'
                            rel='noreferrer'
                            className={`support-menu__social-btn ${item.className}`}
                            aria-label={item.title}
                        >
                            {item.content}
                        </a>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div
            ref={rootRef}
            className={`support-menu support-menu--mobile-nav ${
                open ? 'support-menu--open' : ''
            }`}
        >
            <button
                type='button'
                className={`mobile-nav__item mobile-nav__support-btn ${
                    open ? 'mobile-nav__item--active' : ''
                }`}
                onClick={() => setOpen((value) => !value)}
            >
                <svg
                    width='22'
                    height='22'
                    viewBox='0 0 24 24'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                    className={`mobile-nav__support-icon ${
                        open ? 'mobile-nav__support-icon--active' : ''
                    }`}
                >
                    <path
                        d='M15.526 19.6C12.7943 20.4572 9.69156 20.3058 6.9844 18.9944L1.5 20.159L3.01691 15.6169C0.305113 11.614 1.35293 6.44885 5.46738 3.53489C9.58184 0.622085 15.491 0.860856 19.2893 4.09391C21.2134 5.73254 22.2939 7.88252 22.4889 10.0941M20.1702 22.4883V22.5M20.1702 18.9944C20.6933 18.9928 21.2008 18.816 21.6113 18.4924C22.0219 18.1689 22.3117 17.7171 22.4346 17.2096C22.5575 16.7021 22.5062 16.1682 22.2891 15.6932C22.072 15.2181 21.7013 14.8296 21.2368 14.5897C20.7725 14.3524 20.2416 14.2788 19.7301 14.3809C19.2187 14.483 18.7568 14.7549 18.4199 15.1522'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                    />
                </svg>

                <span>Поддержка</span>
            </button>

            <div className='support-menu__dropdown support-menu__dropdown--mobile'>
                {SUPPORT_LINKS.map((item) => (
                    <a
                        key={item.title}
                        href={item.href}
                        target='_blank'
                        rel='noreferrer'
                        className={`support-menu__social-btn ${item.className}`}
                        aria-label={item.title}
                    >
                        {item.content}
                    </a>
                ))}
            </div>
        </div>
    );
}

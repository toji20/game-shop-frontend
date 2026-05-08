/* eslint-disable @next/next/no-html-link-for-pages */
import './footer.css';
import { Send, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sections = [
    {
        title: 'Разделы',
        links: [
            { label: 'Главная', href: '/', bold: true },
            { label: 'Игры', href: '/games' },
            { label: 'Отзывы', href: '/reviews' },
            { label: 'Промокоды', href: '/promo' },
            { label: 'Поддержка', href: '/support' },
        ],
    },
    {
        title: 'Информация',
        links: [
            { label: 'Пользовательское соглашение', href: '/user_agreement' },
            { label: 'Политика обработки данных', href: '/data' },
            { label: 'Политика возвратов', href: '/refunds' },
            { label: 'Акции и предложения', href: '/offers' },
            {
                label: 'Сотрудничество: @Company.com',
                href: 'mailto:company@company.com',
            },
        ],
    },
    {
        title: 'Связаться с нами',
        links: [
            { label: 'По вопросам рекламы', href: '/ads' },
            { label: 'Контакты', href: '/contacts' },
            { label: 'Поддержка клиентов', href: '/support' },
            {
                label: 'Сотрудничество: @Company.com',
                href: 'mailto:company@company.com',
            },
        ],
    },
];

export function Footer() {
    return (
        <footer className='footer'>
            <div className='footer__inner'>
                <div className='footer__grid'>
                    {sections.map((section) => (
                        <div key={section.title} className='footer__section'>
                            <p className='footer__section-title'>
                                {section.title}
                            </p>
                            <ul className='footer__links'>
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className={`footer__link ${link.bold ? 'footer__link--bold' : ''}`}
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Правая колонка — лого + соцсети */}
                    <div className='footer__brand'>
                        <div className='footer__logo'>
                            <Image
                                src='/zaneshop-logo.png'
                                alt='ROV'
                                width={170}
                                height={42}
                            />
                        </div>
                        <div className='footer__socials'>
                            <p className='footer__socials-title'>
                                Мы в соцсетях:
                            </p>
                            <div className='footer__socials-links'>
                                <a
                                    href='https://t.me/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social-btn'
                                    aria-label='Telegram'
                                >
                                    <Send size={16} />
                                </a>
                                <a
                                    href='https://tiktok.com/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social-btn'
                                    aria-label='TikTok'
                                >
                                    <svg
                                        width='16'
                                        height='16'
                                        viewBox='0 0 24 24'
                                        fill='currentColor'
                                    >
                                        <path d='M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z' />
                                    </svg>
                                </a>
                                <a
                                    href='https://youtube.com/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                    className='footer__social-btn'
                                    aria-label='YouTube'
                                >
                                    <Youtube size={16} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Кнопка */}
                <div className='footer__action'>
                    <a href='/support' className='footer__ask-btn'>
                        <Send size={15} />
                        Задать вопрос
                    </a>
                </div>

                {/* Копирайт */}
                <div className='footer__bottom'>
                    <p className='footer__copyright'>
                        Copyright 2026 © Все права защищены
                    </p>
                </div>
            </div>
        </footer>
    );
}

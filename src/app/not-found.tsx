/* eslint-disable @next/next/no-html-link-for-pages */
import './not-found.css';
import { Header } from '@/components/layouts/header/header';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <>
            <Header />
            <div className='not-found'>
                <div className='not-found__content'>
                    <div className='not-found__code'>
                        <img src='/not-found.png' alt='' />
                    </div>

                    <h1 className='not-found__title'>СТРАНИЦА НЕ НАЙДЕНА</h1>

                    <p className='not-found__desc'>
                        Похоже вы попали не туда. Страница, которую вы ищите,
                        <br />
                        больше не существует или была перемещена
                    </p>

                    <a href='/' className='not-found__btn'>
                        <Home size={20} />
                        НА ГЛАВНУЮ
                    </a>

                    <p className='not-found__support-text'>
                        Если вы считаете, что это ошибка, свяжитесь с нашей
                        поддержкой
                    </p>
                    <a href='https://t.me' className='not-found__support-link'>
                        Написать в поддержку
                    </a>
                </div>
            </div>
        </>
    );
}

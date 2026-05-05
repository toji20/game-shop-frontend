'use client';

import './review-auth-modal.css';
import { X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ReviewAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ReviewAuthModal({ isOpen, onClose }: ReviewAuthModalProps) {
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = '';
            return;
        }

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className='review-form-modal' onClick={onClose}>
            <div
                className='review-form-modal__dialog'
                onClick={(e) => e.stopPropagation()}
            >
                <div className='review-form-modal__header'>
                    <h3 className='review-form-modal__title'>Оставить отзыв</h3>
                    <button
                        type='button'
                        className='review-form-modal__close'
                        onClick={onClose}
                        aria-label='Закрыть'
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className='review-auth-modal__content'>
                    <p className='review-auth-modal__text'>
                        Чтобы оставить отзыв, нужно авторизоваться.
                    </p>

                    <Link
                        href='/auth'
                        className='review-auth-modal__button'
                        onClick={onClose}
                    >
                        Войти
                    </Link>
                </div>
            </div>
        </div>,
        document.body,
    );
}

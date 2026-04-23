'use client';

import './review-form-modal.css';
import { IReviewCreate } from '@/shared/types';
import { X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';

interface ReviewFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameName: string;
    gameCategory?: string;
    gameImage?: string | null;
    onSubmit: (payload: IReviewCreate) => void;
    isLoading?: boolean;
}

export function ReviewFormModal({
    isOpen,
    onClose,
    gameName,
    gameCategory,
    gameImage,
    onSubmit,
    isLoading,
}: ReviewFormModalProps) {
    const [rating, setRating] = useState(6);
    const [text, setText] = useState('');

    const marks = useMemo(
        () => Array.from({ length: 10 }, (_, i) => i + 1),
        [],
    );

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

    const handleSubmit = () => {
        if (!text.trim()) return;

        onSubmit({
            rating,
            text: text.trim(),
        });

        if (!isLoading) {
            setText('');
            setRating(6);
        }
    };

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

                <div className='review-form-modal__game'>
                    <img
                        src={gameImage || '/placeholder.png'}
                        alt={gameName}
                        className='review-form-modal__game-image'
                    />
                    <div className='review-form-modal__game-info'>
                        <div className='review-form-modal__game-name'>
                            {gameName}
                        </div>
                        {gameCategory && (
                            <div className='review-form-modal__game-category'>
                                {gameCategory}
                            </div>
                        )}
                    </div>
                </div>

                <div className='review-form-modal__section'>
                    <div className='review-form-modal__label'>Ваша оценка</div>

                    <div className='review-form-modal__marks'>
                        {marks.map((mark) => (
                            <button
                                key={mark}
                                type='button'
                                className={`review-form-modal__mark ${rating === mark ? 'review-form-modal__mark--active' : ''}`}
                                onClick={() => setRating(mark)}
                            >
                                {mark}
                            </button>
                        ))}
                    </div>

                    <input
                        type='range'
                        min={1}
                        max={10}
                        step={1}
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        className='review-form-modal__range'
                    />
                </div>

                <textarea
                    className='review-form-modal__textarea'
                    placeholder='Напишите отзыв...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />

                <button
                    type='button'
                    className='review-form-modal__submit'
                    onClick={handleSubmit}
                    disabled={!text.trim() || isLoading}
                >
                    {isLoading ? 'Отправка...' : 'Оставить отзыв'}
                </button>
            </div>
        </div>,
        document.body,
    );
}

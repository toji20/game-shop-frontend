'use client';

import './instructions.css';
import { useState, useEffect, useRef, useCallback } from 'react';

interface InstructionsProps {
    images: string[];
    interval?: number; // ms, default 4000
}

export function Instructions({ images, interval = 4000 }: InstructionsProps) {
    const [current, setCurrent] = useState(0);
    const [progress, setProgress] = useState(0);
    const rafRef = useRef<number>(0);
    const startRef = useRef<number>(0);
    const pausedRef = useRef(false);
    const pausedProgressRef = useRef(0);

    const count = images.length;

    const goTo = useCallback((index: number) => {
        setCurrent(index);
        setProgress(0);
        startRef.current = performance.now();
    }, []);

    const next = useCallback(() => {
        goTo((current + 1) % count);
    }, [current, count, goTo]);

    const prev = useCallback(() => {
        goTo((current - 1 + count) % count);
    }, [current, count, goTo]);

    useEffect(() => {
        startRef.current = performance.now();
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setProgress(0);

        const tick = (now: number) => {
            if (pausedRef.current) {
                rafRef.current = requestAnimationFrame(tick);
                return;
            }
            const elapsed = now - startRef.current;
            const pct = Math.min((elapsed / interval) * 100, 100);
            setProgress(pct);

            if (pct >= 100) {
                setCurrent((c) => (c + 1) % count);
                startRef.current = performance.now();
                setProgress(0);
            } else {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafRef.current);
    }, [current, count, interval]);

    const handleManual = (index: number) => {
        cancelAnimationFrame(rafRef.current);
        goTo(index);
    };

    if (!images.length) return null;

    return (
        <div
            id='instructions'
            className='instructions'
            onMouseEnter={() => {
                pausedRef.current = true;
            }}
            onMouseLeave={() => {
                pausedRef.current = false;
                startRef.current =
                    performance.now() -
                    (pausedProgressRef.current / 100) * interval;
            }}
        >
            {/* Прогресс-линии */}
            <div className='instructions__bars'>
                {images.map((_, i) => (
                    <button
                        key={i}
                        className='instructions__bar-track'
                        onClick={() => handleManual(i)}
                        aria-label={`Слайд ${i + 1}`}
                    >
                        <span
                            className='instructions__bar-fill'
                            style={{
                                width:
                                    i < current
                                        ? '100%'
                                        : i === current
                                          ? `${progress}%`
                                          : '0%',
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* Изображения */}
            <div className='instructions__slides'>
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt={`Инструкция ${i + 1}`}
                        className={`instructions__slide ${i === current ? 'instructions__slide--active' : ''}`}
                    />
                ))}
            </div>

            {/* Стрелки */}
            {count > 1 && (
                <>
                    <button
                        className='instructions__arrow instructions__arrow--left'
                        onClick={prev}
                        aria-label='Назад'
                    >
                        ‹
                    </button>
                    <button
                        className='instructions__arrow instructions__arrow--right'
                        onClick={next}
                        aria-label='Вперёд'
                    >
                        ›
                    </button>
                </>
            )}

            {/* Счётчик */}
            <div className='instructions__counter'>
                {current + 1} / {count}
            </div>
        </div>
    );
}

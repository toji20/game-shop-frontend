'use client';

import './faq.css';
import { IFaqItem } from '@/shared/types';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FaqProps {
    items: IFaqItem[];
}

export function Faq({ items }: FaqProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (!items?.length) return null;

    return (
        <div className='faq'>
            {items.map((item, i) => {
                const isOpen = openIndex === i;
                return (
                    <div
                        key={i}
                        className={`faq__item ${isOpen ? 'faq__item--open' : ''}`}
                    >
                        <button
                            className='faq__question'
                            onClick={() => setOpenIndex(isOpen ? null : i)}
                        >
                            <span>{item.question}</span>
                            <ChevronDown
                                size={18}
                                className={`faq__chevron ${isOpen ? 'faq__chevron--open' : ''}`}
                            />
                        </button>
                        <div className='faq__answer-wrap'>
                            <p className='faq__answer'>{item.answer}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

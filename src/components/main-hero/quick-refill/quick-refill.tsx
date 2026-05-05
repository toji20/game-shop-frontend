'use client';

import './quick-refill.css';
import { PUBLIC_URL } from '@/config/url.config';
import { RotateCcw, Clock3 } from 'lucide-react';
import Link from 'next/link';

export interface QuickRefillItem {
    id: number;
    name: string;
    slug: string;
    iconWide?: string | null;
    genre?: string | null;
    lastOrderAt?: string | null;
    ordersCount?: number;
}

interface QuickRefillProps {
    items: QuickRefillItem[];
    hasTitle?: boolean;
}

export function QuickRefill({ items, hasTitle = true }: QuickRefillProps) {
    if (!items?.length) return null;

    return (
        <section className='quick-refill'>
            {hasTitle && (
                <div className='quick-refill__header'>
                    <div>
                        <h3 className='quick-refill__title'>
                            Быстрое пополнение
                        </h3>
                        <p className='quick-refill__subtitle'>
                            Игры, в которые вы уже донатили
                        </p>
                    </div>
                </div>
            )}

            <div className='quick-refill__grid'>
                {items.map((item) => (
                    <Link
                        key={item.id}
                        href={PUBLIC_URL.game(item.slug)}
                        className='quick-refill__card'
                    >
                        <div className='quick-refill__image-wrap'>
                            <img
                                src={item.iconWide || ''}
                                alt={item.name}
                                className='quick-refill__image'
                            />
                        </div>

                        <div className='quick-refill__body'>
                            <div className='quick-refill__top'>
                                <h4 className='quick-refill__name'>
                                    {item.name}
                                </h4>

                                <span className='quick-refill__action'>
                                    <RotateCcw size={14} />
                                    Повторить
                                </span>
                            </div>

                            <div className='quick-refill__meta'>
                                {item.genre && (
                                    <span className='quick-refill__genre'>
                                        {item.genre}
                                    </span>
                                )}

                                {item.ordersCount ? (
                                    <span className='quick-refill__count'>
                                        {item.ordersCount} пополнений
                                    </span>
                                ) : null}
                            </div>

                            {item.lastOrderAt && (
                                <div className='quick-refill__history'>
                                    <Clock3 size={14} />
                                    Последний раз: {item.lastOrderAt}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}

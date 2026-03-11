'use client';

import { ManualStatus } from '@/shared/types';

const FILTERS: { label: string; value: ManualStatus | 'ALL' }[] = [
    { label: 'Все', value: 'ALL' },
    { label: 'Ожидают', value: 'PENDING' },
    { label: 'В работе', value: 'IN_PROGRESS' },
    { label: 'Ждут 2FA', value: 'AWAITING_2FA' },
    { label: 'Завершены', value: 'COMPLETED' },
    { label: 'Ошибки', value: 'FAILED' },
];

interface OrderFiltersProps {
    active: ManualStatus | 'ALL';
    onChange: (status: ManualStatus | 'ALL') => void;
    counts: Partial<Record<ManualStatus | 'ALL', number>>;
}

export function OrderFilters({ active, onChange, counts }: OrderFiltersProps) {
    return (
        <div className='filters'>
            {FILTERS.map((f) => (
                <button
                    key={f.value}
                    className={`filters__btn ${active === f.value ? 'filters__btn--active' : ''}`}
                    onClick={() => onChange(f.value)}
                >
                    {f.label}
                    {counts[f.value] !== undefined && (
                        <span className='filters__count'>
                            {counts[f.value]}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
}

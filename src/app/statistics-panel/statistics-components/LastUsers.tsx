'use client';

import { ILastUser } from '@/shared/types';

interface LastUsersProps {
    users: ILastUser[];
}

export function LastUsers({ users }: LastUsersProps) {
    return (
        <div className='last-users'>
            <h2 className='chart-title'>Последние пользователи</h2>
            <ul className='last-users__list'>
                {users.map((user) => (
                    <li key={user.id} className='last-users__item'>
                        <div className='last-users__info'>
                            <span className='last-users__name'>
                                {user.name}
                            </span>
                            <span className='last-users__email'>
                                {user.email}
                            </span>
                        </div>
                        <span className='last-users__spent'>
                            {new Intl.NumberFormat('ru-RU', {
                                style: 'currency',
                                currency: 'RUB',
                                maximumFractionDigits: 0,
                            }).format(user.totalSpent)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

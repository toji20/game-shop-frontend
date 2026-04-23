'use client';

import '../shared/admin.css';
import { useUpdateUserRole, useUserSearch } from '@/hooks/queries/useUser';
import { UserRole } from '@/shared/types';
import { Loader2, Search } from 'lucide-react';
import { useState } from 'react';

const ROLE_OPTIONS: UserRole[] = ['USER', 'MANAGER', 'OPERATOR', 'ADMIN'];

const ROLE_LABELS: Record<UserRole, string> = {
    USER: 'Пользователь',
    MANAGER: 'Менеджер',
    OPERATOR: 'Оператор',
    ADMIN: 'Администратор',
};

export default function UsersSection() {
    const [input, setInput] = useState('');
    const [query, setQuery] = useState('');

    const { users, isLoading } = useUserSearch(query);
    const { updateUserRole, isLoadingUpdate } = useUpdateUserRole();

    const handleSearch = () => {
        if (input.trim()) {
            setQuery(input.trim());
        }
    };

    return (
        <div>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Пользователи</h2>
                    <p className='section-sub'>Поиск по ID, нику или email</p>
                </div>
            </div>

            <div className='orders-search'>
                <input
                    className='form-input orders-search__input'
                    placeholder='Введите ID, ник или email...'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                    className='btn btn--primary orders-search__btn'
                    onClick={handleSearch}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 size={15} className='orders-search__spinner' />
                    ) : (
                        <Search size={15} />
                    )}
                    Найти
                </button>
            </div>

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Имя</th>
                            <th>Email</th>
                            <th>Роль</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {!query ? (
                            <tr>
                                <td colSpan={8} className='table-empty'>
                                    Начните поиск пользователя
                                </td>
                            </tr>
                        ) : isLoading ? (
                            <tr>
                                <td colSpan={8} className='table-empty'>
                                    Загрузка...
                                </td>
                            </tr>
                        ) : !users?.length ? (
                            <tr>
                                <td colSpan={8} className='table-empty'>
                                    Пользователи не найдены
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td className='td-mono'>
                                        {user.id.slice(-10)}
                                    </td>
                                    <td className='td-main'>{user.name}</td>
                                    <td className='td-muted'>{user.email}</td>
                                    <td>
                                        <span className='badge badge--yellow'>
                                            {ROLE_LABELS[user.role]}
                                        </span>
                                    </td>
                                    <td className='col-actions'>
                                        <select
                                            className='form-input'
                                            value={user.role}
                                            disabled={isLoadingUpdate}
                                            onChange={(e) =>
                                                updateUserRole({
                                                    id: user.id,
                                                    role: e.target
                                                        .value as UserRole,
                                                })
                                            }
                                        >
                                            {ROLE_OPTIONS.map((role) => (
                                                <option key={role} value={role}>
                                                    {ROLE_LABELS[role]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

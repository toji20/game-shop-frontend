'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useGameFields,
    useCreateGameField,
    useUpdateGameField,
    useDeleteGameField,
} from '@/hooks/queries/useGameField';
import { IGameFieldCreate } from '@/shared/types';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
    params: { gameId: string };
}

const EMPTY: IGameFieldCreate = { label: '', required: true };

export default function GameFieldsPage({ params }: Props) {
    const gameId = Number(params.gameId);

    const { fields, isLoadingFields } = useGameFields(gameId);
    const { createField, isLoadingCreate } = useCreateGameField(gameId);
    const { deleteField, isLoadingDelete } = useDeleteGameField(gameId);

    const [editing, setEditing] = useState<
        (IGameFieldCreate & { id: number; gameId: number }) | null
    >(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState<IGameFieldCreate>(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { updateField, isLoadingUpdate } = useUpdateGameField(
        editing?.id ?? 0,
    );

    const handleCreate = () => {
        createField(newForm, {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;
        updateField(
            { label: editing.label, required: editing.required },
            {
                onSuccess: () => setEditing(null),
            },
        );
    };

    return (
        <div className='dashboard__content'>
            <Link href='/admin' className='back-link'>
                ← Назад к играм
            </Link>

            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Поля игры</h2>
                    <p className='section-sub'>
                        Игра #{gameId} · {fields?.length ?? 0} записей
                    </p>
                </div>
                <button
                    className='btn btn--primary'
                    onClick={() => setCreating(true)}
                >
                    + Добавить
                </button>
            </div>

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>Метка (label)</th>
                            <th>Обязательное</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingFields ? (
                            <SkeletonRows rows={3} cols={4} />
                        ) : !fields?.length ? (
                            <tr>
                                <td colSpan={4} className='table-empty'>
                                    Нет полей
                                </td>
                            </tr>
                        ) : (
                            fields.map((f) => (
                                <tr key={f.id}>
                                    <td className='td-main'>{f.label}</td>
                                    <td>
                                        {f.required ? (
                                            <span className='badge badge--green'>
                                                Да
                                            </span>
                                        ) : (
                                            <span className='td-muted'>
                                                Нет
                                            </span>
                                        )}
                                    </td>
                                    <td className='col-id'>{f.id}</td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing({
                                                        id: f.id,
                                                        gameId: f.gameId,
                                                        label: f.label,
                                                        required: f.required,
                                                    })
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(f.id)
                                                }
                                            >
                                                Удал.
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {creating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новое поле</p>
                        <Field
                            label='Метка поля (label)'
                            value={newForm.label}
                            autoFocus
                            placeholder='Например: Никнейм или ID персонажа'
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, label: v }))
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='c-required'
                                checked={newForm.required}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        required: e.target.checked,
                                    }))
                                }
                            />
                            <label htmlFor='c-required'>
                                Обязательное поле
                            </label>
                        </div>
                        <div className='modal__footer'>
                            <button
                                className='btn btn--ghost'
                                onClick={() => setCreating(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className='btn btn--primary'
                                disabled={
                                    isLoadingCreate || !newForm.label.trim()
                                }
                                onClick={handleCreate}
                            >
                                {isLoadingCreate ? 'Создаём...' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {editing && (
                <div className='modal-overlay' onClick={() => setEditing(null)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Редактировать поле</p>
                        <Field
                            label='Метка поля (label)'
                            value={editing.label}
                            autoFocus
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, label: v })
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='e-required'
                                checked={editing.required}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                required: e.target.checked,
                                            },
                                    )
                                }
                            />
                            <label htmlFor='e-required'>
                                Обязательное поле
                            </label>
                        </div>
                        <div className='modal__footer'>
                            <button
                                className='btn btn--ghost'
                                onClick={() => setEditing(null)}
                            >
                                Отмена
                            </button>
                            <button
                                className='btn btn--primary'
                                disabled={isLoadingUpdate}
                                onClick={handleSave}
                            >
                                {isLoadingUpdate ? 'Сохраняем...' : 'Сохранить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirmDelete !== null && (
                <ConfirmModal
                    isLoading={isLoadingDelete}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => {
                        deleteField(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </div>
    );
}

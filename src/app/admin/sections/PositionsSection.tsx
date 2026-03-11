'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    usePositions,
    useCreatePosition,
    useUpdatePosition,
    useDeletePosition,
} from '@/hooks/queries/usePosition';
import ImageUpload from '@/shared/ImageUpload';
import { IPosition, IPositionUpdate } from '@/shared/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Props {
    params: { gameId: string };
}

type EditState = {
    id: number;
    gameId: number;
    name: string;
    myPrice: string;
    image: string;
    isActive: boolean;
    isPublic: boolean;
};

function toEdit(p: IPosition): EditState {
    return {
        id: p.id,
        gameId: Number(p.gameId),
        name: p.name,
        myPrice: p.myPrice?.toString() ?? '',
        image: p.image ?? '',
        isActive: p.isActive,
        isPublic: p.isPublic ?? true,
    };
}

const EMPTY_FORM = {
    name: '',
    myPrice: '',
    image: '',
    isActive: true,
    isPublic: true,
};

export default function PositionsPage({ params }: Props) {
    const gameId = Number(params.gameId);

    const { positions, isLoadingPositions } = usePositions(gameId);
    const { createPosition, isLoadingCreate } = useCreatePosition(gameId);
    const { deletePosition, isLoadingDelete } = useDeletePosition(gameId);

    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY_FORM);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { updatePosition, isLoadingUpdate } = useUpdatePosition(
        editing?.gameId ?? gameId,
    );

    const handleCreate = () => {
        createPosition(
            {
                name: newForm.name,
                myPrice: Number(newForm.myPrice),
                image: newForm.image || undefined,
                isActive: newForm.isActive,
                isPublic: newForm.isPublic,
                price: 0,
            },
            {
                onSuccess: () => {
                    setCreating(false);
                    setNewForm(EMPTY_FORM);
                },
            },
        );
    };

    const handleSave = () => {
        if (!editing) return;
        const dto: IPositionUpdate = {
            name: editing.name,
            myPrice: Number(editing.myPrice),
            image: editing.image || undefined,
            isActive: editing.isActive,
            isPublic: editing.isPublic,
        };
        updatePosition(dto, { onSuccess: () => setEditing(null) });
    };

    return (
        <div className='dashboard__content'>
            <Link href='/admin' className='back-link'>
                ← Назад к играм
            </Link>

            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Позиции</h2>
                    <p className='section-sub'>
                        Игра #{gameId} · {positions?.length ?? 0} записей
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
                            <th className='col-img'></th>
                            <th>Название</th>
                            <th>Цена (сайт)</th>
                            <th>Закупка</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingPositions ? (
                            <SkeletonRows rows={4} cols={7} />
                        ) : !positions?.length ? (
                            <tr>
                                <td colSpan={7} className='table-empty'>
                                    Нет позиций
                                </td>
                            </tr>
                        ) : (
                            positions.map((p) => (
                                <tr key={p.id}>
                                    <td className='col-img'>
                                        {p.image && (
                                            <img
                                                src={p.image || ''}
                                                alt={p.name}
                                                width={36}
                                                height={36}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                    border: '1px solid var(--border)',
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className='td-main'>{p.name}</td>
                                    <td className='td-price'>
                                        {p.price != null
                                            ? `${Number(p.price).toLocaleString('ru-RU')} ₽`
                                            : '—'}
                                    </td>
                                    <td className='td-price'>
                                        {Number(p.myPrice).toLocaleString(
                                            'ru-RU',
                                        )}{' '}
                                        ₽
                                    </td>
                                    <td>
                                        {p.isActive ? (
                                            <span className='badge badge--green'>
                                                Активна
                                            </span>
                                        ) : (
                                            <span className='badge badge--red'>
                                                Скрыта
                                            </span>
                                        )}
                                    </td>
                                    <td className='col-id'>{p.id}</td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing(toEdit(p))
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(p.id)
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

            {/* Create modal */}
            {creating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новая позиция</p>
                        <Field
                            label='Название'
                            value={newForm.name}
                            autoFocus
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, name: v }))
                            }
                        />
                        <div className='form-row'>
                            <Field
                                label='Цена (₽, для сайта)'
                                type='number'
                                value={newForm.myPrice}
                                onChange={(v) =>
                                    setNewForm((p) => ({ ...p, myPrice: v }))
                                }
                            />
                        </div>
                        <ImageUpload
                            label='Изображение'
                            value={newForm.image}
                            folder='positions'
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, image: v }))
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='c-isActive'
                                checked={newForm.isActive}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        isActive: e.target.checked,
                                    }))
                                }
                            />
                            <label htmlFor='c-isActive'>Активна</label>
                        </div>
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='c-isPublic'
                                checked={newForm.isPublic}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        isPublic: e.target.checked,
                                    }))
                                }
                            />
                            <label htmlFor='c-isPublic'>Публичная</label>
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
                                    isLoadingCreate ||
                                    !newForm.name.trim() ||
                                    !newForm.myPrice
                                }
                                onClick={handleCreate}
                            >
                                {isLoadingCreate ? 'Создаём...' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit modal */}
            {editing && (
                <div className='modal-overlay' onClick={() => setEditing(null)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Редактировать позицию</p>
                        <Field
                            label='Название'
                            value={editing.name}
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, name: v })
                            }
                        />
                        <div className='form-row'>
                            <Field
                                label='Цена (₽)'
                                type='number'
                                value={editing.myPrice}
                                onChange={(v) =>
                                    setEditing((p) => p && { ...p, myPrice: v })
                                }
                            />
                        </div>
                        <ImageUpload
                            label='Изображение'
                            value={editing.image}
                            folder='positions'
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, image: v })
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='e-isActive'
                                checked={editing.isActive}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                isActive: e.target.checked,
                                            },
                                    )
                                }
                            />
                            <label htmlFor='e-isActive'>Активна</label>
                        </div>
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='e-isPublic'
                                checked={editing.isPublic}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                isPublic: e.target.checked,
                                            },
                                    )
                                }
                            />
                            <label htmlFor='e-isPublic'>Публичная</label>
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
                        deletePosition(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </div>
    );
}

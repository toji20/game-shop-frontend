/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ConfirmModal from '../shared/ConfirmModal';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useAvatars,
    useCreateAvatar,
    useUpdateAvatar,
    useDeleteAvatar,
} from '@/hooks/queries/useAvatar';
import ImageUpload from '@/shared/ImageUpload';
import { IAvatar, IAvatarCreate, IAvatarUpdate } from '@/shared/types';
import { useState } from 'react';

const EMPTY: IAvatarCreate = { image: '' };

type EditState = IAvatarUpdate & { id: string };

function toEdit(a: IAvatar): EditState {
    return { id: a.id, image: a.image };
}

export default function AvatarSection() {
    const { avatars, isLoadingAvatars } = useAvatars();
    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState<IAvatarCreate>(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { createAvatar, isLoadingCreate } = useCreateAvatar();
    const { updateAvatar, isLoadingUpdate } = useUpdateAvatar(
        editing?.id ?? '',
    );
    const { deleteAvatar, isLoadingDelete } = useDeleteAvatar();

    const handleCreate = () => {
        createAvatar(
            { image: newForm.image },
            {
                onSuccess: () => {
                    setCreating(false);
                    setNewForm(EMPTY);
                },
            },
        );
    };

    const handleSave = () => {
        if (!editing) return;
        updateAvatar(
            { image: editing.image },
            { onSuccess: () => setEditing(null) },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Аватары</h2>
                    <p className='section-sub'>
                        {avatars?.length ?? 0} записей
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
                            <th className='col-id'>ID</th>
                            <th>Дата создания</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingAvatars ? (
                            <SkeletonRows rows={4} cols={4} />
                        ) : !avatars?.length ? (
                            <tr>
                                <td colSpan={4} className='table-empty'>
                                    Нет аватаров
                                </td>
                            </tr>
                        ) : (
                            avatars.map((a) => (
                                <tr key={a.id}>
                                    <td className='col-img'>
                                        {a.image ? (
                                            <img
                                                src={a.image}
                                                alt='avatar'
                                                width={40}
                                                height={40}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: '50%',
                                                    border: '1px solid var(--border)',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    borderRadius: '50%',
                                                    background:
                                                        'var(--bg-secondary)',
                                                    border: '1px solid var(--border)',
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className='col-id td-mono'>{a.id}</td>
                                    <td className='td-muted'>
                                        {new Date(
                                            a.createdAt,
                                        ).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing(toEdit(a))
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(a.id)
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
                        <p className='modal__title'>Новый аватар</p>
                        <ImageUpload
                            label='Изображение'
                            value={newForm.image}
                            folder='avatars'
                            onChange={(v) => setNewForm({ image: v })}
                        />
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
                                    isLoadingCreate || !newForm.image.trim()
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
                        <p className='modal__title'>Редактировать аватар</p>
                        <ImageUpload
                            label='Изображение'
                            value={editing.image ?? ''}
                            folder='avatars'
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, image: v })
                            }
                        />
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
                        deleteAvatar(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

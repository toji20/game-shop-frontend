/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useAdBanner,
    useCreateAdBanner,
    useUpdateAdBanner,
    useDeleteAdBanner,
} from '@/hooks/queries/useAdBanner';
import ImageUpload from '@/shared/ImageUpload';
import { IAdBanner, IAdBannerCreate, IAdBannerUpdate } from '@/shared/types';
import { useState } from 'react';

const EMPTY: IAdBannerCreate = {
    title: '',
    description: '',
    link: '',
    image: '',
    isActive: true,
};

type EditState = IAdBannerUpdate & { id: number };

function toEdit(b: IAdBanner): EditState {
    return {
        id: b.id,
        title: b.title,
        description: b.description,
        link: b.link ?? '',
        image: b.image,
        isActive: b.isActive,
    };
}

export default function AdBannersSection() {
    const { adBanners, isLoadingAdBanner } = useAdBanner();
    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { createAdBanner, isLoadingCreate } = useCreateAdBanner();
    const { updateAdBanner, isLoadingUpdate } = useUpdateAdBanner(
        editing?.id ?? 0,
    );
    const { deleteAdBanner, isLoadingDelete } = useDeleteAdBanner();

    const handleCreate = () => {
        createAdBanner(
            {
                title: newForm.title,
                description: newForm.description,
                link: newForm.link,
                image: newForm.image,
                isActive: newForm.isActive,
            },
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
        updateAdBanner(
            {
                title: editing.title,
                description: editing.description,
                link: editing.link,
                image: editing.image,
                isActive: editing.isActive,
            },
            { onSuccess: () => setEditing(null) },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Рекламные баннеры</h2>
                    <p className='section-sub'>
                        {adBanners?.length ?? 0} записей
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
                            <th>Заголовок</th>
                            <th>Описание</th>
                            <th>Ссылка</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingAdBanner ? (
                            <SkeletonRows rows={3} cols={6} />
                        ) : !adBanners?.length ? (
                            <tr>
                                <td colSpan={6} className='table-empty'>
                                    Нет баннеров
                                </td>
                            </tr>
                        ) : (
                            adBanners.map((b) => (
                                <tr key={b.id}>
                                    <td className='col-img'>
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt={b.title}
                                                width={36}
                                                height={36}
                                                style={{
                                                    objectFit: 'cover',
                                                    borderRadius: 4,
                                                    border: '1px solid var(--border)',
                                                }}
                                            />
                                        ) : (
                                            <div
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 4,
                                                    background:
                                                        'var(--bg-secondary)',
                                                    border: '1px solid var(--border)',
                                                }}
                                            />
                                        )}
                                    </td>
                                    <td className='td-main'>{b.title}</td>
                                    <td className='td-muted td-truncate'>
                                        {b.description}
                                    </td>
                                    <td className='td-mono td-truncate'>
                                        {b.link ?? '—'}
                                    </td>
                                    <td>
                                        {b.isActive ? (
                                            <span className='badge badge--green'>
                                                Активна
                                            </span>
                                        ) : (
                                            <span className='badge badge--red'>
                                                Скрыта
                                            </span>
                                        )}
                                    </td>
                                    <td className='col-id'>{b.id}</td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing(toEdit(b))
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(b.id)
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
                        <p className='modal__title'>Новый баннер</p>
                        <Field
                            label='Заголовок'
                            value={newForm.title}
                            autoFocus
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, title: v }))
                            }
                        />
                        <Field
                            label='Описание'
                            value={newForm.description}
                            textarea
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, description: v }))
                            }
                        />
                        <Field
                            label='Ссылка (необязательно)'
                            value={newForm.link ?? ''}
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, link: v }))
                            }
                        />

                        <ImageUpload
                            label='Изображение'
                            value={newForm.image}
                            folder='adbanners'
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
                            <label htmlFor='c-isActive'>Активен</label>
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
                                    isLoadingCreate || !newForm.title.trim()
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
                        <p className='modal__title'>Редактировать баннер</p>
                        <Field
                            label='Заголовок'
                            value={editing.title ?? ''}
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, title: v })
                            }
                        />
                        <Field
                            label='Описание'
                            value={editing.description ?? ''}
                            textarea
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, description: v })
                            }
                        />
                        <Field
                            label='Ссылка'
                            value={editing.link ?? ''}
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, link: v })
                            }
                        />

                        <ImageUpload
                            label='Изображение'
                            value={editing.image ?? ''}
                            folder='adbanners'
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, image: v })
                            }
                        />

                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='e-isActive'
                                checked={editing.isActive ?? true}
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
                            <label htmlFor='e-isActive'>Активен</label>
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
                        deleteAdBanner(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

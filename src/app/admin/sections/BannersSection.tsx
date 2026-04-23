/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useBanner,
    useCreateBanner,
    useUpdateBanner,
    useDeleteBanner,
} from '@/hooks/queries/useBanner';
import ImageUpload from '@/shared/ImageUpload';
import { IBanner, IBannerCreate, IBannerUpdate } from '@/shared/types';
import { useState } from 'react';

const EMPTY: IBannerCreate = {
    title: '',
    description: '',
    link: '',
    desktopImage: '',
    mobileImage: '',
};

type EditState = IBannerUpdate & { id: number };

function toEdit(b: IBanner): EditState {
    return {
        id: b.id,
        title: b.title,
        description: b.description,
        link: b.link ?? '',
        desktopImage: b.desktopImage,
        mobileImage: b.mobileImage,
    };
}

export default function BannersSection() {
    const { banners, isLoadingBanner } = useBanner();
    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { createBanner, isLoadingCreate } = useCreateBanner();
    const { updateBanner, isLoadingUpdate } = useUpdateBanner(editing?.id ?? 0);
    const { deleteBanner, isLoadingDelete } = useDeleteBanner();

    const handleCreate = () => {
        console.log('CREATE DATA:', newForm);

        createBanner(newForm, {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;

        console.log('UPDATE DATA:', editing);

        updateBanner(
            {
                title: editing.title,
                description: editing.description,
                link: editing.link,
                desktopImage: editing.desktopImage,
                mobileImage: editing.mobileImage,
            },
            { onSuccess: () => setEditing(null) },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Баннеры</h2>
                    <p className='section-sub'>
                        {banners?.length ?? 0} записей
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
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingBanner ? (
                            <SkeletonRows rows={3} cols={6} />
                        ) : !banners?.length ? (
                            <tr>
                                <td colSpan={6} className='table-empty'>
                                    Нет баннеров
                                </td>
                            </tr>
                        ) : (
                            banners.map((b) => (
                                <tr key={b.id}>
                                    <td className='col-img'>
                                        {b.desktopImage && (
                                            <img
                                                src={b.desktopImage}
                                                alt={b.title}
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
                                    <td className='td-main'>{b.title}</td>
                                    <td className='td-muted td-truncate'>
                                        {b.description}
                                    </td>
                                    <td className='td-mono td-truncate'>
                                        {b.link ?? '—'}
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
                                setNewForm((p) => ({
                                    ...p,
                                    description: v,
                                }))
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
                            label='Изображение — десктоп'
                            value={newForm.desktopImage}
                            folder='banners'
                            onChange={(url: string) =>
                                setNewForm((p) => ({
                                    ...p,
                                    desktopImage: url ?? '',
                                }))
                            }
                        />

                        <ImageUpload
                            label='Изображение — мобильный'
                            value={newForm.mobileImage}
                            folder='banners'
                            onChange={(url: string) =>
                                setNewForm((p) => ({
                                    ...p,
                                    mobileImage: url ?? '',
                                }))
                            }
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
                            label='Изображение — десктоп'
                            value={editing.desktopImage || ''}
                            folder='banners'
                            onChange={(url: string) =>
                                setEditing(
                                    (p) =>
                                        p && {
                                            ...p,
                                            desktopImage: url,
                                        },
                                )
                            }
                        />

                        <ImageUpload
                            label='Изображение — мобильный'
                            value={editing.mobileImage || ''}
                            folder='banners'
                            onChange={(url: string) =>
                                setEditing(
                                    (p) =>
                                        p && {
                                            ...p,
                                            mobileImage: url,
                                        },
                                )
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
                        deleteBanner(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

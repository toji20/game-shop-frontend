/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useSideBanner,
    useCreateSideBanner,
    useUpdateSideBanner,
    useDeleteSideBanner,
} from '@/hooks/queries/useSideBanner';
import ImageUpload from '@/shared/ImageUpload';
import {
    ISideBanner,
    ISideBannerCreate,
    ISideBannerUpdate,
} from '@/shared/types';
import { useState } from 'react';

const EMPTY: ISideBannerCreate = {
    image: '',
    link: '',
};

type EditState = ISideBannerUpdate & { id: number };

function toEdit(b: ISideBanner): EditState {
    return {
        id: b.id,
        image: b.image,
        link: b.link ?? '',
    };
}

export default function SideBannersSection() {
    const { sideBanners, isLoadingBanner } = useSideBanner();

    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { createSideBanner, isLoadingCreate } = useCreateSideBanner();
    const { updateSideBanner, isLoadingUpdate } = useUpdateSideBanner(
        editing?.id ?? 0,
    );
    const { deleteSideBanner, isLoadingDelete } = useDeleteSideBanner();

    const handleCreate = () => {
        createSideBanner(newForm, {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;

        updateSideBanner(
            {
                image: editing.image,
                link: editing.link,
            },
            {
                onSuccess: () => setEditing(null),
            },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Сайд баннеры</h2>
                    <p className='section-sub'>
                        {sideBanners?.length ?? 0} записей
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
                            <th>Ссылка</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingBanner ? (
                            <SkeletonRows rows={3} cols={4} />
                        ) : !sideBanners?.length ? (
                            <tr>
                                <td colSpan={4} className='table-empty'>
                                    Нет баннеров
                                </td>
                            </tr>
                        ) : (
                            sideBanners.map((b) => (
                                <tr key={b.id}>
                                    <td className='col-img'>
                                        {b.image ? (
                                            <img
                                                src={b.image}
                                                alt='banner'
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
                                    <td className='td-mono td-truncate'>
                                        {b.link || '—'}
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
                        <p className='modal__title'>Новый сайд баннер</p>

                        <Field
                            label='Ссылка (необязательно)'
                            value={newForm.link}
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, link: v }))
                            }
                        />

                        <ImageUpload
                            label='Изображение'
                            value={newForm.image}
                            folder='image'
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, image: v }))
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
                                disabled={isLoadingCreate || !newForm.image}
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
                        <p className='modal__title'>
                            Редактировать сайд баннер
                        </p>

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
                            folder='image'
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
                        deleteSideBanner(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    useCategories,
    useCreateCategory,
    useUpdateCategory,
    useDeleteCategory,
} from '@/hooks/queries/useCategory';
import { ICategoryCreate, ICategoryUpdate } from '@/shared/types';
import { useState } from 'react';

const EMPTY: ICategoryCreate = { title: '', description: '' };

export default function CategoriesSection() {
    const { categories, isLoadingCategories } = useCategories();
    const [editing, setEditing] = useState<
        (ICategoryUpdate & { id: string }) | null
    >(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState<ICategoryCreate>(EMPTY);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { createCategory, isLoadingCreate } = useCreateCategory();
    const { updateCategory, isLoadingUpdate } = useUpdateCategory(
        editing?.id ?? '',
    );
    const { deleteCategory, isLoadingDelete } = useDeleteCategory();

    const handleCreate = () => {
        createCategory(newForm, {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;
        updateCategory(
            { title: editing.title, description: editing.description },
            {
                onSuccess: () => setEditing(null),
            },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Категории</h2>
                    <p className='section-sub'>
                        {categories?.length ?? 0} записей
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
                            <th>Название</th>
                            <th>Описание</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingCategories ? (
                            <SkeletonRows rows={4} cols={4} />
                        ) : !categories?.length ? (
                            <tr>
                                <td colSpan={4} className='table-empty'>
                                    Нет категорий
                                </td>
                            </tr>
                        ) : (
                            categories.map((c) => (
                                <tr key={c.id}>
                                    <td className='td-main'>{c.title}</td>
                                    <td className='td-muted td-truncate'>
                                        {c.description}
                                    </td>
                                    <td className='col-id'>
                                        {c.id.slice(0, 8)}
                                    </td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing({
                                                        id: c.id,
                                                        title: c.title,
                                                        description:
                                                            c.description,
                                                    })
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(c.id)
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
                        <p className='modal__title'>Новая категория</p>
                        <Field
                            label='Название'
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

            {editing && (
                <div className='modal-overlay' onClick={() => setEditing(null)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Редактировать категорию</p>
                        <Field
                            label='Название'
                            value={editing.title || ''}
                            autoFocus
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

            {confirmDelete && (
                <ConfirmModal
                    isLoading={isLoadingDelete}
                    onCancel={() => setConfirmDelete(null)}
                    onConfirm={() => {
                        deleteCategory(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

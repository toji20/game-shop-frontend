'use client';

import ConfirmModal from '@/app/admin/shared/ConfirmModal';
import Field from '@/app/admin/shared/Field';
import SkeletonRows from '@/app/admin/shared/SkeletonRows';
import '@/app/admin/shared/admin.css';
import { API_URL, SERVER_URL } from '@/config/api.config';
import {
    usePositions,
    useCreatePosition,
    useUpdatePosition,
    useDeletePosition,
} from '@/hooks/queries/usePosition';
import {
    usePositionCategoryByGame,
    useCreatePositionCategory,
    useUpdatePositionCategory,
    useDeletePositionCategory,
} from '@/hooks/queries/usePositionCategory';
import ImageUpload from '@/shared/ImageUpload';
import { IPosition, IPositionUpdate } from '@/shared/types';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';

interface Props {
    params: { gameId: string };
}

type EditState = {
    id: number;
    gameId: number;
    name: string;
    myPrice: string;
    discount: string;
    image: string;
    isActive: boolean;
    isPublic: boolean;
    categoryId: string;
};

function toEdit(p: IPosition): EditState {
    return {
        id: p.id,
        gameId: Number(p.gameId),
        name: p.name,
        myPrice: p.myPrice?.toString() ?? '',
        discount: p.discount?.toString() ?? '',
        image: p.image ?? '',
        isActive: p.isActive,
        isPublic: p.isPublic ?? true,
        categoryId: p.categoryId ? String(p.categoryId) : '',
    };
}

const EMPTY_FORM = {
    name: '',
    myPrice: '',
    discount: '',
    image: '',
    isActive: true,
    isPublic: true,
    categoryId: '',
};

type CategoryForm = {
    id?: number;
    name: string;
};

export default function PositionsPage({}: Props) {
    const params = useParams<{ gameId: string }>();
    const gameId = Number(params.gameId);

    const { positions, isLoadingPositions } = usePositions(gameId);
    const { positionCategories, isLoadingPositionCategory } =
        usePositionCategoryByGame(gameId);

    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY_FORM);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const [categoryCreating, setCategoryCreating] = useState(false);
    const [categoryEditing, setCategoryEditing] = useState<CategoryForm | null>(
        null,
    );

    const { createPosition, isLoadingCreate } = useCreatePosition(gameId);
    const { deletePosition, isLoadingDelete } = useDeletePosition(gameId);
    const { updatePosition, isLoadingUpdate } = useUpdatePosition(
        editing?.id ?? 0,
    );

    const { createPositionCategory, isLoadingCreate: isLoadingCategoryCreate } =
        useCreatePositionCategory();
    const { updatePositionCategory, isLoadingUpdate: isLoadingCategoryUpdate } =
        useUpdatePositionCategory(categoryEditing?.id ?? 0, gameId);
    const { deletePositionCategory, isLoadingDelete: isLoadingCategoryDelete } =
        useDeletePositionCategory(gameId);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [confirmCategoryDelete, setConfirmCategoryDelete] = useState<
        number | null
    >(null);

    const handleCreate = () => {
        createPosition(
            {
                name: newForm.name,
                myPrice: Number(newForm.myPrice),
                discount: newForm.discount
                    ? Number(newForm.discount)
                    : undefined,
                image: newForm.image || undefined,
                isActive: newForm.isActive,
                isPublic: newForm.isPublic,
                price: 0,
                categoryId: newForm.categoryId
                    ? Number(newForm.categoryId)
                    : null,
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
            discount: editing.discount ? Number(editing.discount) : undefined,
            image: editing.image || undefined,
            isActive: editing.isActive,
            isPublic: editing.isPublic,
            categoryId: editing.categoryId ? Number(editing.categoryId) : null,
        };

        updatePosition(dto, { onSuccess: () => setEditing(null) });
    };

    const handleCreateCategory = () => {
        if (!newCategoryName.trim()) return;

        createPositionCategory(
            {
                name: newCategoryName,
                gameId,
            },
            {
                onSuccess: () => {
                    setCategoryCreating(false);
                    setNewCategoryName('');
                },
            },
        );
    };

    const handleUpdateCategory = () => {
        if (!categoryEditing?.id || !categoryEditing.name.trim()) return;

        updatePositionCategory(
            { name: categoryEditing.name },
            {
                onSuccess: () => setCategoryEditing(null),
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

            <div className='admin-card admin-card--spaced'>
                <div className='section-header section-header--inner'>
                    <div>
                        <h3 className='section-title section-title--sm'>
                            Категории позиций
                        </h3>
                        <p className='section-sub'>
                            {positionCategories?.length ?? 0} записей
                        </p>
                    </div>
                    <button
                        className='btn btn--ghost'
                        onClick={() => setCategoryCreating(true)}
                    >
                        + Добавить категорию
                    </button>
                </div>

                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingPositionCategory ? (
                            <SkeletonRows rows={3} cols={3} />
                        ) : !positionCategories?.length ? (
                            <tr>
                                <td colSpan={3} className='table-empty'>
                                    Нет категорий позиций
                                </td>
                            </tr>
                        ) : (
                            positionCategories.map((category) => (
                                <tr key={category.id}>
                                    <td className='td-main'>{category.name}</td>
                                    <td className='col-id'>{category.id}</td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setCategoryEditing({
                                                        id: category.id,
                                                        name: category.name,
                                                    })
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmCategoryDelete(
                                                        category.id,
                                                    )
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

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th className='col-img'></th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Финальная цена</th>
                            <th>Скидка</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingPositions ? (
                            <SkeletonRows rows={4} cols={9} />
                        ) : !positions?.length ? (
                            <tr>
                                <td colSpan={9} className='table-empty'>
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
                                    <td className='td-muted'>
                                        {p.category?.name || '—'}
                                    </td>
                                    <td className='td-price'>
                                        {Number(p.myPrice).toLocaleString(
                                            'ru-RU',
                                        )}{' '}
                                        ₽
                                    </td>
                                    <td className='td-price'>
                                        {p.finalPrice != null
                                            ? `${Number(p.finalPrice).toLocaleString('ru-RU')} ₽`
                                            : '—'}
                                    </td>
                                    <td>
                                        {p.discount ? (
                                            <span className='badge badge--green'>
                                                {p.discount}%
                                            </span>
                                        ) : (
                                            <span className='td-muted'>—</span>
                                        )}
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
                            <Field
                                label='Скидка (%)'
                                type='number'
                                value={newForm.discount}
                                onChange={(v) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        discount:
                                            v === ''
                                                ? ''
                                                : String(
                                                      Math.min(
                                                          100,
                                                          Math.max(
                                                              0,
                                                              Number(v),
                                                          ),
                                                      ),
                                                  ),
                                    }))
                                }
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Категория</label>
                            <select
                                className='form-input'
                                value={newForm.categoryId}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        categoryId: e.target.value,
                                    }))
                                }
                            >
                                <option value=''>— Без категории —</option>
                                {positionCategories?.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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
                            <Field
                                label='Скидка (%)'
                                type='number'
                                value={editing.discount}
                                onChange={(v) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                discount:
                                                    v === ''
                                                        ? ''
                                                        : String(
                                                              Math.min(
                                                                  100,
                                                                  Math.max(
                                                                      0,
                                                                      Number(v),
                                                                  ),
                                                              ),
                                                          ),
                                            },
                                    )
                                }
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>Категория</label>
                            <select
                                className='form-input'
                                value={editing.categoryId}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                categoryId: e.target.value,
                                            },
                                    )
                                }
                            >
                                <option value=''>— Без категории —</option>
                                {positionCategories?.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </select>
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

            {categoryCreating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCategoryCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новая категория позиции</p>
                        <Field
                            label='Название'
                            value={newCategoryName}
                            autoFocus
                            onChange={setNewCategoryName}
                        />
                        <div className='modal__footer'>
                            <button
                                className='btn btn--ghost'
                                onClick={() => setCategoryCreating(false)}
                            >
                                Отмена
                            </button>
                            <button
                                className='btn btn--primary'
                                disabled={
                                    isLoadingCategoryCreate ||
                                    !newCategoryName.trim()
                                }
                                onClick={handleCreateCategory}
                            >
                                {isLoadingCategoryCreate
                                    ? 'Создаём...'
                                    : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {categoryEditing && (
                <div
                    className='modal-overlay'
                    onClick={() => setCategoryEditing(null)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>
                            Редактировать категорию позиции
                        </p>
                        <Field
                            label='Название'
                            value={categoryEditing.name}
                            autoFocus
                            onChange={(v) =>
                                setCategoryEditing((p) =>
                                    p ? { ...p, name: v } : p,
                                )
                            }
                        />
                        <div className='modal__footer'>
                            <button
                                className='btn btn--ghost'
                                onClick={() => setCategoryEditing(null)}
                            >
                                Отмена
                            </button>
                            <button
                                className='btn btn--primary'
                                disabled={
                                    isLoadingCategoryUpdate ||
                                    !categoryEditing.name.trim()
                                }
                                onClick={handleUpdateCategory}
                            >
                                {isLoadingCategoryUpdate
                                    ? 'Сохраняем...'
                                    : 'Сохранить'}
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

            {confirmCategoryDelete !== null && (
                <ConfirmModal
                    isLoading={isLoadingCategoryDelete}
                    onCancel={() => setConfirmCategoryDelete(null)}
                    onConfirm={() => {
                        deletePositionCategory(confirmCategoryDelete);
                        setConfirmCategoryDelete(null);
                    }}
                />
            )}
        </div>
    );
}

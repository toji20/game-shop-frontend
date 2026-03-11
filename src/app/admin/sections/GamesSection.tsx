'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import { DASHBOARD_URL } from '@/config/url.config';
import { useCategories } from '@/hooks/queries/useCategory';
import {
    useGames,
    useUpdateGame,
    useDeleteGame,
    useCreateGame,
} from '@/hooks/queries/useGame';
import ImageUpload from '@/shared/ImageUpload';
import { IGame, IGameUpdate, IGameCreate } from '@/shared/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// ── form types ────────────────────────────────────────────────────────────────
type GameForm = {
    name: string;
    description: string;
    slug: string;
    image?: string;
    categoryId: string;
    isActive: boolean;
    isPublic: boolean;
};

const EMPTY_FORM: GameForm = {
    name: '',
    description: '',
    slug: '',
    image: '',
    categoryId: '',
    isActive: true,
    isPublic: true,
};

function toForm(g: IGame): GameForm & { id: number } {
    return {
        id: g.id,
        name: g.name,
        description: g.description ?? '',
        slug: g.slug ?? '',
        image: g.image ?? '',
        categoryId: g.categoryId ?? '',
        isActive: g.isActive,
        isPublic: g.isPublic ?? true,
    };
}

// ── component ─────────────────────────────────────────────────────────────────
export default function GamesSection() {
    const router = useRouter();
    const { games, isLoadingGames } = useGames();
    const { categories } = useCategories();

    const [editing, setEditing] = useState<(GameForm & { id: number }) | null>(
        null,
    );
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState<GameForm>(EMPTY_FORM);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const { createGame, isLoadingCreate } = useCreateGame();
    const { updateGame, isLoadingUpdate } = useUpdateGame(editing?.id ?? 0);
    const { deleteGame, isLoadingDelete } = useDeleteGame();

    const handleCreate = () => {
        createGame(
            {
                name: newForm.name,
                description: newForm.description,
                slug: newForm.slug,
                image: newForm.image || '',
                categoryId: newForm.categoryId || undefined,
                isActive: newForm.isActive,
                isPublic: newForm.isPublic,
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
        const dto: IGameUpdate = {
            name: editing.name,
            description: editing.description,
            slug: editing.slug,
            image: editing.image,
            categoryId: editing.categoryId || undefined,
            isActive: editing.isActive,
            isPublic: editing.isPublic,
        };
        updateGame(dto, { onSuccess: () => setEditing(null) });
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Игры</h2>
                    <p className='section-sub'>{games?.length ?? 0} записей</p>
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
                            <th>Категория</th>
                            <th>Slug</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingGames ? (
                            <SkeletonRows rows={5} cols={7} />
                        ) : !games?.length ? (
                            <tr>
                                <td colSpan={7} className='table-empty'>
                                    Нет игр
                                </td>
                            </tr>
                        ) : (
                            games.map((g) => (
                                <tr key={g.id}>
                                    <td className='col-img'>
                                        {g.image && (
                                            <img
                                                src={g.image || ''}
                                                alt={g.name}
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
                                    <td className='td-main'>{g.name}</td>
                                    <td className='td-muted'>
                                        {g.category?.title ?? '—'}
                                    </td>
                                    <td className='td-mono'>{g.slug ?? '—'}</td>
                                    <td>
                                        {g.isActive ? (
                                            <span className='badge badge--green'>
                                                Активна
                                            </span>
                                        ) : (
                                            <span className='badge badge--red'>
                                                Скрыта
                                            </span>
                                        )}
                                    </td>
                                    <td className='col-id'>{g.id}</td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    router.push(
                                                        DASHBOARD_URL.gamePositions(
                                                            g.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Позиции
                                            </button>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    router.push(
                                                        DASHBOARD_URL.gameFields(
                                                            g.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Поля
                                            </button>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing(toForm(g))
                                                }
                                            >
                                                Ред.
                                            </button>
                                            <button
                                                className='btn btn--danger btn--sm'
                                                onClick={() =>
                                                    setConfirmDelete(g.id)
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

            {/* ── Create modal ── */}
            {creating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новая игра</p>
                        <Field
                            label='Название'
                            value={newForm.name}
                            autoFocus
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, name: v }))
                            }
                        />
                        <Field
                            label='Slug'
                            value={newForm.slug}
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, slug: v }))
                            }
                        />
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
                                {categories?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <ImageUpload
                            label='Изображение'
                            value={newForm.image || ''}
                            folder='games'
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, image: v }))
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
                                    isLoadingCreate || !newForm.name.trim()
                                }
                                onClick={handleCreate}
                            >
                                {isLoadingCreate ? 'Создаём...' : 'Создать'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Edit modal ── */}
            {editing && (
                <div className='modal-overlay' onClick={() => setEditing(null)}>
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Редактировать игру</p>
                        <Field
                            label='Название'
                            value={editing.name}
                            autoFocus
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, name: v })
                            }
                        />
                        <Field
                            label='Slug'
                            value={editing.slug}
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, slug: v })
                            }
                        />
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
                                {categories?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <ImageUpload
                            label='Изображение'
                            value={editing.image || ''}
                            folder='games'
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, image: v })
                            }
                        />
                        <Field
                            label='Описание'
                            value={editing.description}
                            textarea
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, description: v })
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
                        deleteGame(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

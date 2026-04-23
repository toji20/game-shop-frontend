'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import { API_URL, SERVER_URL } from '@/config/api.config';
import { useGames } from '@/hooks/queries/useGame';
import {
    usePositionCategoryByGame,
    useCreatePositionCategory,
    useUpdatePositionCategory,
    useDeletePositionCategory,
} from '@/hooks/queries/usePositionCategory';
import { useMemo, useState } from 'react';

type EditState = {
    id: number;
    name: string;
};

export default function PositionCategoriesSection() {
    const { games, isLoadingGames } = useGames();
    const [selectedGameId, setSelectedGameId] = useState<number>(0);
    const [creating, setCreating] = useState(false);
    const [newName, setNewName] = useState('');
    const [editing, setEditing] = useState<EditState | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    const normalizedGameId = useMemo(() => {
        if (selectedGameId) return selectedGameId;
        return games?.[0]?.id ?? 0;
    }, [selectedGameId, games]);

    const { positionCategories, isLoadingPositionCategory } =
        usePositionCategoryByGame(normalizedGameId);

    const { createPositionCategory, isLoadingCreate } =
        useCreatePositionCategory();
    const { updatePositionCategory, isLoadingUpdate } =
        useUpdatePositionCategory(editing?.id ?? 0, normalizedGameId);
    const { deletePositionCategory, isLoadingDelete } =
        useDeletePositionCategory(normalizedGameId);

    const handleCreate = () => {
        if (!normalizedGameId || !newName.trim()) return;

        createPositionCategory(
            {
                name: newName,
                gameId: normalizedGameId,
            },
            {
                onSuccess: () => {
                    setCreating(false);
                    setNewName('');
                },
            },
        );
    };

    const handleUpdate = () => {
        if (!editing?.id || !editing.name.trim()) return;

        updatePositionCategory(
            { name: editing.name },
            {
                onSuccess: () => setEditing(null),
            },
        );
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Категории позиций</h2>
                    <p className='section-sub'>
                        Управление категориями внутри игр
                    </p>
                </div>
                <button
                    className='btn btn--primary'
                    onClick={() => setCreating(true)}
                    disabled={!normalizedGameId}
                >
                    + Добавить
                </button>
            </div>

            <div className='admin-filters'>
                <div className='form-group admin-filters__field'>
                    <label className='form-label'>Игра</label>
                    <select
                        className='form-input'
                        value={normalizedGameId || ''}
                        onChange={(e) =>
                            setSelectedGameId(Number(e.target.value))
                        }
                        disabled={isLoadingGames}
                    >
                        {!games?.length ? (
                            <option value=''>Нет игр</option>
                        ) : (
                            games.map((game) => (
                                <option key={game.id} value={game.id}>
                                    {game.name}
                                </option>
                            ))
                        )}
                    </select>
                </div>
            </div>

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th>Название</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingGames || isLoadingPositionCategory ? (
                            <SkeletonRows rows={5} cols={3} />
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
                                                    setEditing({
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
                                                    setConfirmDelete(
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

            {creating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новая категория позиции</p>
                        <Field
                            label='Название'
                            value={newName}
                            autoFocus
                            onChange={setNewName}
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
                                disabled={isLoadingCreate || !newName.trim()}
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
                        <p className='modal__title'>
                            Редактировать категорию позиции
                        </p>
                        <Field
                            label='Название'
                            value={editing.name}
                            autoFocus
                            onChange={(v) =>
                                setEditing((p) => (p ? { ...p, name: v } : p))
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
                                disabled={
                                    isLoadingUpdate || !editing.name.trim()
                                }
                                onClick={handleUpdate}
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
                        deletePositionCategory(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import { TypeSelect } from '../shared/typeSelect';
import { DASHBOARD_URL } from '@/config/url.config';
import { useCategories } from '@/hooks/queries/useCategory';
import {
    useGames,
    useUpdateGame,
    useDeleteGame,
    useCreateGame,
} from '@/hooks/queries/useGame';
import ImageUpload from '@/shared/ImageUpload';
import {
    IGame,
    IGameUpdate,
    IGameCreate,
    GameType,
    IFaqItem,
    IWarningItem,
} from '@/shared/types';
import { Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type GameForm = {
    name: string;
    description: string;
    slug: string;
    icon: string;
    iconWide: string;
    bgDesktop: string;
    bgMobile: string;
    categoryId: string;
    isActive: boolean;
    isPublic: boolean;
    type: GameType;
    ageLimit: string;
    genre: string;
    releaseDate: string;
    instructions: string[];
    faq: IFaqItem[];
    warnings: IWarningItem[];
};

const EMPTY_FORM: GameForm = {
    name: '',
    description: '',
    slug: '',
    icon: '',
    iconWide: '',
    bgDesktop: '',
    bgMobile: '',
    categoryId: '',
    isActive: true,
    isPublic: true,
    type: 'AUTO',
    ageLimit: '',
    genre: '',
    releaseDate: '',
    instructions: [],
    faq: [],
    warnings: [],
};

function toForm(g: IGame): GameForm & { id: number } {
    return {
        id: g.id,
        name: g.name,
        description: g.description ?? '',
        slug: g.slug ?? '',
        icon: g.icon ?? '',
        iconWide: g.iconWide ?? '',
        bgDesktop: g.bgDesktop ?? '',
        bgMobile: g.bgMobile ?? '',
        categoryId: g.categoryId ?? '',
        isActive: g.isActive,
        isPublic: g.isPublic ?? true,
        type: (g.type as GameType) ?? 'AUTO',
        ageLimit: g.ageLimit ?? '',
        genre: g.genre ?? '',
        releaseDate: g.releaseDate ?? '',
        instructions: g.instructions ?? [],
        faq: (g.faq as IFaqItem[]) ?? [],
        warnings: (g.warnings as IWarningItem[]) ?? [],
    };
}

// ── FAQ Editor ────────────────────────────────────────────────────────────────
function FaqEditor({
    value,
    onChange,
}: {
    value: IFaqItem[];
    onChange: (v: IFaqItem[]) => void;
}) {
    const add = () => onChange([...value, { question: '', answer: '' }]);
    const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
    const update = (i: number, field: keyof IFaqItem, val: string) => {
        const next = [...value];
        next[i] = { ...next[i], [field]: val };
        onChange(next);
    };

    return (
        <div className='form-group'>
            <div className='faq-editor__header'>
                <label className='form-label'>Вопросы и ответы</label>
                <button
                    type='button'
                    className='btn btn--ghost btn--sm'
                    onClick={add}
                >
                    <Plus size={14} />
                    Добавить
                </button>
            </div>

            {value.length === 0 && (
                <p className='faq-editor__empty'>Вопросов пока нет</p>
            )}

            <div className='faq-editor__list'>
                {value.map((item, i) => (
                    <div key={i} className='faq-editor__item'>
                        <div className='faq-editor__item-index'>{i + 1}</div>
                        <div className='faq-editor__item-fields'>
                            <input
                                className='form-input'
                                placeholder='Вопрос'
                                value={item.question}
                                onChange={(e) =>
                                    update(i, 'question', e.target.value)
                                }
                            />
                            <textarea
                                className='form-input faq-editor__textarea'
                                placeholder='Ответ'
                                value={item.answer}
                                rows={2}
                                onChange={(e) =>
                                    update(i, 'answer', e.target.value)
                                }
                            />
                        </div>
                        <button
                            type='button'
                            className='btn btn--danger btn--sm faq-editor__remove'
                            onClick={() => remove(i)}
                            title='Удалить'
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Warnings Editor ───────────────────────────────────────────────────────────
function WarningsEditor({
    value,
    onChange,
}: {
    value: IWarningItem[];
    onChange: (v: IWarningItem[]) => void;
}) {
    const add = () =>
        onChange([...value, { title: '', text: '', variant: 'alert' }]);
    const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
    const update = (i: number, field: keyof IWarningItem, val: string) => {
        const next = [...value];
        next[i] = { ...next[i], [field]: val };
        onChange(next);
    };

    return (
        <div className='form-group'>
            <div className='faq-editor__header'>
                <label className='form-label'>Предупреждения</label>
                <button
                    type='button'
                    className='btn btn--ghost btn--sm'
                    onClick={add}
                >
                    <Plus size={14} />
                    Добавить
                </button>
            </div>

            {value.length === 0 && (
                <p className='faq-editor__empty'>Предупреждений пока нет</p>
            )}

            <div className='faq-editor__list'>
                {value.map((item, i) => (
                    <div key={i} className='faq-editor__item'>
                        <div className='faq-editor__item-index'>{i + 1}</div>
                        <div className='faq-editor__item-fields'>
                            <input
                                className='form-input'
                                placeholder='Заголовок'
                                value={item.title}
                                onChange={(e) =>
                                    update(i, 'title', e.target.value)
                                }
                            />
                            <textarea
                                className='form-input faq-editor__textarea'
                                placeholder='Текст'
                                value={item.text}
                                rows={2}
                                onChange={(e) =>
                                    update(i, 'text', e.target.value)
                                }
                            />
                            <select
                                className='form-input'
                                value={item.variant}
                                onChange={(e) =>
                                    update(i, 'variant', e.target.value)
                                }
                            >
                                <option value='alert'>Alert (жёлтый)</option>
                                <option value='danger'>Danger (красный)</option>
                            </select>
                        </div>
                        <button
                            type='button'
                            className='btn btn--danger btn--sm faq-editor__remove'
                            onClick={() => remove(i)}
                            title='Удалить'
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────────
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

    const buildPayload = (form: GameForm) => ({
        name: form.name,
        description: form.description,
        slug: form.slug,
        icon: form.icon || undefined,
        iconWide: form.iconWide || undefined,
        bgDesktop: form.bgDesktop || undefined,
        bgMobile: form.bgMobile || undefined,
        categoryId: form.categoryId || undefined,
        isActive: form.isActive,
        isPublic: form.isPublic,
        type: form.type,
        ageLimit: form.ageLimit || undefined,
        genre: form.genre || undefined,
        releaseDate: form.releaseDate || undefined,
        instructions: form.instructions,
        faq: form.faq.length > 0 ? form.faq : undefined,
        warnings: form.warnings.length > 0 ? form.warnings : undefined,
    });

    const handleCreate = () => {
        createGame(buildPayload(newForm), {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY_FORM);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;
        updateGame(buildPayload(editing), {
            onSuccess: () => setEditing(null),
        });
    };

    const renderFormFields = (
        form: GameForm,
        set: (updater: (p: GameForm) => GameForm) => void,
        prefix: string,
    ) => (
        <>
            <Field
                label='Название'
                value={form.name}
                autoFocus
                onChange={(v) => set((p) => ({ ...p, name: v }))}
            />
            <Field
                label='Slug'
                value={form.slug}
                onChange={(v) => set((p) => ({ ...p, slug: v }))}
            />
            <TypeSelect
                value={form.type}
                onChange={(v) => set((p) => ({ ...p, type: v }))}
            />
            <div className='form-group'>
                <label className='form-label'>Категория</label>
                <select
                    className='form-input'
                    value={form.categoryId}
                    onChange={(e) =>
                        set((p) => ({ ...p, categoryId: e.target.value }))
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
            <Field
                label='Жанр'
                value={form.genre}
                onChange={(v) => set((p) => ({ ...p, genre: v }))}
            />
            <Field
                label='Возрастной рейтинг'
                value={form.ageLimit}
                onChange={(v) => set((p) => ({ ...p, ageLimit: v }))}
            />
            <Field
                label='Дата выхода'
                value={form.releaseDate}
                onChange={(v) => set((p) => ({ ...p, releaseDate: v }))}
            />
            <ImageUpload
                label='Иконка (квадратная)'
                value={form.icon}
                folder='games'
                onChange={(url) => set((p) => ({ ...p, icon: url ?? '' }))}
            />
            <ImageUpload
                label='Широкая иконка (баннер)'
                value={form.iconWide}
                folder='games'
                onChange={(url) => set((p) => ({ ...p, iconWide: url ?? '' }))}
            />
            <ImageUpload
                label='Фон — десктоп'
                value={form.bgDesktop}
                folder='games'
                onChange={(url) => set((p) => ({ ...p, bgDesktop: url ?? '' }))}
            />
            <ImageUpload
                label='Фон — мобильный'
                value={form.bgMobile}
                folder='games'
                onChange={(url) => set((p) => ({ ...p, bgMobile: url ?? '' }))}
            />
            <Field
                label='Описание'
                value={form.description}
                textarea
                onChange={(v) => set((p) => ({ ...p, description: v }))}
            />
            <ImageUpload
                multiple
                label='Инструкции (фото)'
                value={form.instructions}
                folder='instructions'
                onChange={(v) =>
                    set((p) => ({ ...p, instructions: v as string[] }))
                }
            />
            <FaqEditor
                value={form.faq}
                onChange={(faq) => set((p) => ({ ...p, faq }))}
            />
            <WarningsEditor
                value={form.warnings}
                onChange={(warnings) => set((p) => ({ ...p, warnings }))}
            />
            <div className='form-check'>
                <input
                    type='checkbox'
                    id={`${prefix}-isActive`}
                    checked={form.isActive}
                    onChange={(e) =>
                        set((p) => ({ ...p, isActive: e.target.checked }))
                    }
                />
                <label htmlFor={`${prefix}-isActive`}>Активна</label>
            </div>
            <div className='form-check'>
                <input
                    type='checkbox'
                    id={`${prefix}-isPublic`}
                    checked={form.isPublic}
                    onChange={(e) =>
                        set((p) => ({ ...p, isPublic: e.target.checked }))
                    }
                />
                <label htmlFor={`${prefix}-isPublic`}>Публичная</label>
            </div>
        </>
    );

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
                            <th>Жанр</th>
                            <th>Возраст</th>
                            <th>Тип</th>
                            <th>Slug</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingGames ? (
                            <SkeletonRows rows={5} cols={9} />
                        ) : !games?.length ? (
                            <tr>
                                <td colSpan={9} className='table-empty'>
                                    Нет игр
                                </td>
                            </tr>
                        ) : (
                            games.map((g) => (
                                <tr key={g.id}>
                                    <td className='col-img'>
                                        {g.icon && (
                                            <img
                                                src={g.icon}
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
                                        {g.genre || '—'}
                                    </td>
                                    <td className='td-muted'>
                                        {g.ageLimit || '—'}
                                    </td>
                                    <td>
                                        <span
                                            className={`badge ${g.type === 'AUTO' ? 'badge--green' : 'badge--red'}`}
                                        >
                                            {g.type ?? '—'}
                                        </span>
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
                        {renderFormFields(
                            newForm,
                            (updater) => setNewForm((p) => updater(p)),
                            'c',
                        )}
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
                        {renderFormFields(
                            editing,
                            (updater) =>
                                setEditing(
                                    (p) =>
                                        p &&
                                        (updater(p as GameForm) as GameForm & {
                                            id: number;
                                        }),
                                ),
                            'e',
                        )}
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

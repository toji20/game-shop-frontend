'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import { useGames } from '@/hooks/queries/useGame';
import {
    GAME_TOP_UPS_CATEGORY,
    useGiftApiProducts,
    useCreateGiftApiProduct,
    useUpdateGiftApiProduct,
    useUpdateGiftApiProductById,
    useDeleteGiftApiProduct,
    useGiftApiProductsByCategory,
} from '@/hooks/queries/useGiftApiProducts';
import { usePositionCategoryByGame } from '@/hooks/queries/usePositionCategory';
import ImageUpload from '@/shared/ImageUpload';
import {
    IGiftApiProduct,
    IGiftApiProductUpdate,
} from '@/shared/types/giftapi-product.interface';
import { useMemo, useState } from 'react';

type EditState = {
    id: string;
    name: string;
    price: string;
    currency: string;
    stock: string;
    maxPerOrder: string;
    discount: string;
    image: string;
    isActive: boolean;
    isPublic: boolean;
    gameId: string;
    positionCategoryId: string;
};

function toEdit(p: IGiftApiProduct): EditState {
    return {
        id: p.id,
        name: p.name,
        price: p.price != null ? String(p.price) : '',
        currency: p.currency ?? 'RUB',
        stock: String(p.stock ?? 0),
        maxPerOrder: String(p.maxPerOrder ?? 1),
        discount: p.discount != null ? String(p.discount) : '',
        image: p.image ?? '',
        isActive: p.isActive,
        isPublic: p.isPublic ?? true,
        gameId: p.gameId != null ? String(p.gameId) : '',
        positionCategoryId: p.positionCategoryId
            ? String(p.positionCategoryId)
            : '',
    };
}

const EMPTY_FORM = {
    name: '',
    price: '',
    currency: 'RUB',
    stock: '0',
    maxPerOrder: '1',
    discount: '',
    image: '',
    isActive: true,
    isPublic: true,
    category: GAME_TOP_UPS_CATEGORY,
    gameId: '',
    positionCategoryId: '',
};

type LinkFilter = 'all' | 'linked' | 'unlinked';

export default function GiftApiProductsSection() {
    const { products, isLoading: isLoadingProducts } =
        useGiftApiProductsByCategory(GAME_TOP_UPS_CATEGORY);
    const { games, isLoadingGames } = useGames();

    const [search, setSearch] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');
    const [linkFilter, setLinkFilter] = useState<LinkFilter>('all');

    const [editing, setEditing] = useState<EditState | null>(null);
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState(EMPTY_FORM);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { createGiftApiProduct, isLoadingCreate } = useCreateGiftApiProduct();
    const { deleteGiftApiProduct, isLoadingDelete } = useDeleteGiftApiProduct();
    const { updateGiftApiProduct, isLoadingUpdate } = useUpdateGiftApiProduct(
        editing?.id ?? '',
    );
    const { updateGiftApiProductById } = useUpdateGiftApiProductById();

    const editGameId = editing?.gameId ? Number(editing.gameId) : 0;
    const newGameId = newForm.gameId ? Number(newForm.gameId) : 0;

    const { positionCategories: editCategories } =
        usePositionCategoryByGame(editGameId);
    const { positionCategories: newCategories } =
        usePositionCategoryByGame(newGameId);

    const gameNameById = useMemo(() => {
        const map = new Map<number, string>();
        games?.forEach((g) => map.set(g.id, g.name));
        return map;
    }, [games]);

    const availableCategories = useMemo(() => {
        const set = new Set<string>();
        products?.forEach((p) => p.category && set.add(p.category));
        return Array.from(set);
    }, [products]);

    const filteredProducts = useMemo(() => {
        return (products ?? []).filter((p) => {
            const matchesSearch = search.trim()
                ? p.name.toLowerCase().includes(search.trim().toLowerCase())
                : true;

            const matchesCategory =
                categoryFilter === 'all' ? true : p.category === categoryFilter;

            const matchesLink =
                linkFilter === 'all'
                    ? true
                    : linkFilter === 'linked'
                      ? p.gameId != null
                      : p.gameId == null;

            return matchesSearch && matchesCategory && matchesLink;
        });
    }, [products, search, categoryFilter, linkFilter]);

    const unlinkedCount = useMemo(
        () => (products ?? []).filter((p) => p.gameId == null).length,
        [products],
    );

    const generateId = () =>
        globalThis.crypto?.randomUUID?.() ??
        `giftapi_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const handleCreate = () => {
        const id = generateId();

        createGiftApiProduct(
            {
                id,
                giftapiProductId: id,
                giftapiSkuId: id,
                name: newForm.name,
                category: newForm.category || GAME_TOP_UPS_CATEGORY,
                type: 'game_top_up',
                denominationType: 'fixed',
                currency: newForm.currency || 'RUB',
                price: newForm.price ? Number(newForm.price) : undefined,
                stock: Number(newForm.stock) || 0,
                maxPerOrder: Number(newForm.maxPerOrder) || 1,
                discount: newForm.discount
                    ? Number(newForm.discount)
                    : undefined,
                image: newForm.image || undefined,
                isActive: newForm.isActive,
                isPublic: newForm.isPublic,
                gameId: newForm.gameId ? Number(newForm.gameId) : undefined,
                positionCategoryId: newForm.positionCategoryId
                    ? Number(newForm.positionCategoryId)
                    : undefined,
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

        const dto: IGiftApiProductUpdate = {
            name: editing.name,
            currency: editing.currency || 'RUB',
            price: editing.price ? Number(editing.price) : undefined,
            stock: Number(editing.stock) || 0,
            maxPerOrder: Number(editing.maxPerOrder) || 1,
            discount: editing.discount ? Number(editing.discount) : undefined,
            image: editing.image || undefined,
            isActive: editing.isActive,
            isPublic: editing.isPublic,
            gameId: editing.gameId ? Number(editing.gameId) : null,
            positionCategoryId: editing.positionCategoryId
                ? Number(editing.positionCategoryId)
                : null,
        };

        updateGiftApiProduct(dto, { onSuccess: () => setEditing(null) });
    };

    // Быстрая привязка игры прямо из таблицы, без открытия модалки.
    // Важно: используем updateGiftApiProductById с явным id товара,
    // а не updateGiftApiProduct (тот завязан на editing?.id и в этот
    // момент editing === null, поэтому летел PUT без id -> 404).
    const handleQuickLink = (product: IGiftApiProduct, gameIdValue: string) => {
        updateGiftApiProductById({
            id: product.id,
            dto: {
                gameId: gameIdValue ? Number(gameIdValue) : null,
                positionCategoryId: null,
            },
        });
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Товары GiftAPI</h2>
                    <p className='section-sub'>
                        {products?.length ?? 0} записей
                        {unlinkedCount > 0 && (
                            <>
                                {' '}
                                ·{' '}
                                <span className='td-danger'>
                                    {unlinkedCount} не привязано к игре
                                </span>
                            </>
                        )}
                    </p>
                </div>
                <button
                    className='btn btn--primary'
                    onClick={() => setCreating(true)}
                >
                    + Добавить
                </button>
            </div>

            <div className='admin-filters'>
                <div className='form-group admin-filters__field'>
                    <label className='form-label'>Поиск</label>
                    <input
                        className='form-input'
                        placeholder='Название товара...'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className='form-group admin-filters__field'>
                    <label className='form-label'>Категория</label>
                    <select
                        className='form-input'
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        <option value='all'>Все категории</option>
                        {availableCategories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='form-group admin-filters__field'>
                    <label className='form-label'>Привязка к игре</label>
                    <select
                        className='form-input'
                        value={linkFilter}
                        onChange={(e) =>
                            setLinkFilter(e.target.value as LinkFilter)
                        }
                    >
                        <option value='all'>Все</option>
                        <option value='unlinked'>Только не привязанные</option>
                        <option value='linked'>Только привязанные</option>
                    </select>
                </div>
            </div>

            <div className='admin-card'>
                <table className='admin-table'>
                    <thead>
                        <tr>
                            <th className='col-img'></th>
                            <th>Название</th>
                            <th>Категория</th>
                            <th>Цена</th>
                            <th>Игра</th>
                            <th>Статус</th>
                            <th className='col-id'>ID</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingProducts || isLoadingGames ? (
                            <SkeletonRows rows={6} cols={8} />
                        ) : !filteredProducts.length ? (
                            <tr>
                                <td colSpan={8} className='table-empty'>
                                    Нет товаров GiftAPI по заданным фильтрам
                                </td>
                            </tr>
                        ) : (
                            filteredProducts.map((p) => (
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
                                        {p.category || '—'}
                                    </td>
                                    <td className='td-price'>
                                        {p.price != null
                                            ? `${Number(p.price).toLocaleString('ru-RU')} ${p.currency}`
                                            : '—'}
                                    </td>
                                    <td>
                                        <select
                                            className='form-input form-input--sm'
                                            value={
                                                p.gameId != null
                                                    ? String(p.gameId)
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                handleQuickLink(
                                                    p,
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value=''>
                                                — Не привязан —
                                            </option>
                                            {games?.map((g) => (
                                                <option key={g.id} value={g.id}>
                                                    {g.name}
                                                </option>
                                            ))}
                                        </select>
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

            {/* ── Create modal ── */}
            {creating && (
                <div
                    className='modal-overlay'
                    onClick={() => setCreating(false)}
                >
                    <div className='modal' onClick={(e) => e.stopPropagation()}>
                        <p className='modal__title'>Новый товар GiftAPI</p>
                        <Field
                            label='Название'
                            value={newForm.name}
                            autoFocus
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, name: v }))
                            }
                        />
                        <Field
                            label='Категория GiftAPI'
                            value={newForm.category}
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, category: v }))
                            }
                        />
                        <div className='form-row'>
                            <Field
                                label='Цена'
                                type='number'
                                value={newForm.price}
                                onChange={(v) =>
                                    setNewForm((p) => ({ ...p, price: v }))
                                }
                            />
                            <Field
                                label='Валюта'
                                value={newForm.currency}
                                onChange={(v) =>
                                    setNewForm((p) => ({ ...p, currency: v }))
                                }
                            />
                        </div>

                        <div className='form-group'>
                            <label className='form-label'>
                                Привязать к игре
                            </label>
                            <select
                                className='form-input'
                                value={newForm.gameId}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        gameId: e.target.value,
                                        positionCategoryId: '',
                                    }))
                                }
                            >
                                <option value=''>— Не привязан —</option>
                                {games?.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {newForm.gameId && (
                            <div className='form-group'>
                                <label className='form-label'>
                                    Категория позиции
                                </label>
                                <select
                                    className='form-input'
                                    value={newForm.positionCategoryId}
                                    onChange={(e) =>
                                        setNewForm((p) => ({
                                            ...p,
                                            positionCategoryId: e.target.value,
                                        }))
                                    }
                                >
                                    <option value=''>— Без категории —</option>
                                    {newCategories?.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <ImageUpload
                            label='Изображение'
                            value={newForm.image}
                            folder='giftapi-products'
                            onChange={(v) =>
                                setNewForm((p) => ({ ...p, image: v }))
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='gc-isActive'
                                checked={newForm.isActive}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        isActive: e.target.checked,
                                    }))
                                }
                            />
                            <label htmlFor='gc-isActive'>Активна</label>
                        </div>
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='gc-isPublic'
                                checked={newForm.isPublic}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        isPublic: e.target.checked,
                                    }))
                                }
                            />
                            <label htmlFor='gc-isPublic'>Публичная</label>
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
                        <p className='modal__title'>
                            Редактировать товар GiftAPI
                        </p>
                        <Field
                            label='Название'
                            value={editing.name}
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, name: v })
                            }
                        />
                        <div className='form-row'>
                            <Field
                                label='Цена'
                                type='number'
                                value={editing.price}
                                onChange={(v) =>
                                    setEditing((p) => p && { ...p, price: v })
                                }
                            />
                            <Field
                                label='Валюта'
                                value={editing.currency}
                                onChange={(v) =>
                                    setEditing(
                                        (p) => p && { ...p, currency: v },
                                    )
                                }
                            />
                        </div>
                        <div className='form-row'>
                            <Field
                                label='Остаток'
                                type='number'
                                value={editing.stock}
                                onChange={(v) =>
                                    setEditing((p) => p && { ...p, stock: v })
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
                            <label className='form-label'>
                                Привязать к игре
                            </label>
                            <select
                                className='form-input'
                                value={editing.gameId}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                gameId: e.target.value,
                                                positionCategoryId: '',
                                            },
                                    )
                                }
                            >
                                <option value=''>— Не привязан —</option>
                                {games?.map((g) => (
                                    <option key={g.id} value={g.id}>
                                        {g.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {editing.gameId && (
                            <div className='form-group'>
                                <label className='form-label'>
                                    Категория позиции
                                </label>
                                <select
                                    className='form-input'
                                    value={editing.positionCategoryId}
                                    onChange={(e) =>
                                        setEditing(
                                            (p) =>
                                                p && {
                                                    ...p,
                                                    positionCategoryId:
                                                        e.target.value,
                                                },
                                        )
                                    }
                                >
                                    <option value=''>— Без категории —</option>
                                    {editCategories?.map((category) => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <ImageUpload
                            label='Изображение'
                            value={editing.image}
                            folder='giftapi-products'
                            onChange={(v) =>
                                setEditing((p) => p && { ...p, image: v })
                            }
                        />
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='ge-isActive'
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
                            <label htmlFor='ge-isActive'>Активна</label>
                        </div>
                        <div className='form-check'>
                            <input
                                type='checkbox'
                                id='ge-isPublic'
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
                            <label htmlFor='ge-isPublic'>Публичная</label>
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
                        deleteGiftApiProduct(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

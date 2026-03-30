'use client';

import ConfirmModal from '../shared/ConfirmModal';
import Field from '../shared/Field';
import SkeletonRows from '../shared/SkeletonRows';
import '../shared/admin.css';
import {
    usePromoCodes,
    useCreatePromoCode,
    useUpdatePromoCode,
    useDeletePromoCode,
} from '@/hooks/queries/usePromo';
import {
    IPromoCode,
    IPromoCodeCreate,
    IPromoCodeUpdate,
} from '@/shared/types/promo.interface';
import { useState } from 'react';

type PromoForm = {
    code: string;
    discount: number;
    isActive: boolean;
    usageLimit: string;
    expiresAt: string;
};

const EMPTY_FORM: PromoForm = {
    code: '',
    discount: 10,
    isActive: true,
    usageLimit: '',
    expiresAt: '',
};

function toForm(p: IPromoCode): PromoForm & { id: string } {
    return {
        id: p.id,
        code: p.code,
        discount: p.discount,
        isActive: p.isActive,
        usageLimit: p.usageLimit ? String(p.usageLimit) : '',
        expiresAt: p.expiresAt
            ? new Date(p.expiresAt).toISOString().slice(0, 16)
            : '',
    };
}

function formToCreateDto(f: PromoForm): IPromoCodeCreate {
    return {
        code: f.code.toUpperCase(),
        discount: Number(f.discount),
        isActive: f.isActive,
        usageLimit: f.usageLimit ? Number(f.usageLimit) : undefined,
        expiresAt: f.expiresAt
            ? new Date(f.expiresAt).toISOString()
            : undefined,
    };
}

function formToUpdateDto(f: PromoForm): IPromoCodeUpdate {
    return {
        code: f.code.toUpperCase(),
        discount: Number(f.discount),
        isActive: f.isActive,
        usageLimit: f.usageLimit ? Number(f.usageLimit) : undefined,
        expiresAt: f.expiresAt
            ? new Date(f.expiresAt).toISOString()
            : undefined,
    };
}

export function formatDate(iso: string | null) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default function PromoCodesSection() {
    const { promoCodes, isLoadingPromoCodes } = usePromoCodes();

    const [editing, setEditing] = useState<(PromoForm & { id: string }) | null>(
        null,
    );
    const [creating, setCreating] = useState(false);
    const [newForm, setNewForm] = useState<PromoForm>(EMPTY_FORM);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

    const { createPromoCode, isLoadingCreate } = useCreatePromoCode();
    const { updatePromoCode, isLoadingUpdate } = useUpdatePromoCode(
        editing?.id ?? '',
    );
    const { deletePromoCode, isLoadingDelete } = useDeletePromoCode();

    const handleCreate = () => {
        createPromoCode(formToCreateDto(newForm), {
            onSuccess: () => {
                setCreating(false);
                setNewForm(EMPTY_FORM);
            },
        });
    };

    const handleSave = () => {
        if (!editing) return;
        updatePromoCode(formToUpdateDto(editing), {
            onSuccess: () => setEditing(null),
        });
    };

    return (
        <>
            <div className='section-header'>
                <div>
                    <h2 className='section-title'>Промокоды</h2>
                    <p className='section-sub'>
                        {promoCodes?.length ?? 0} записей
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
                            <th>Код</th>
                            <th>Скидка</th>
                            <th>Использований</th>
                            <th>Лимит</th>
                            <th>Истекает</th>
                            <th>Статус</th>
                            <th className='col-actions'>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoadingPromoCodes ? (
                            <SkeletonRows rows={5} cols={7} />
                        ) : !promoCodes?.length ? (
                            <tr>
                                <td colSpan={7} className='table-empty'>
                                    Нет промокодов
                                </td>
                            </tr>
                        ) : (
                            promoCodes.map((p) => (
                                <tr key={p.id}>
                                    <td className='td-mono'>{p.code}</td>
                                    <td>
                                        <span className='badge badge--green'>
                                            -{p.discount}%
                                        </span>
                                    </td>
                                    <td className='td-muted'>{p.usageCount}</td>
                                    <td className='td-muted'>
                                        {p.usageLimit ?? '∞'}
                                    </td>
                                    <td className='td-muted'>
                                        {formatDate(p.expiresAt)}
                                    </td>
                                    <td>
                                        {p.isActive ? (
                                            <span className='badge badge--green'>
                                                Активен
                                            </span>
                                        ) : (
                                            <span className='badge badge--red'>
                                                Отключён
                                            </span>
                                        )}
                                    </td>
                                    <td className='col-actions'>
                                        <div className='action-btns'>
                                            <button
                                                className='btn btn--ghost btn--sm'
                                                onClick={() =>
                                                    setEditing(toForm(p))
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
                        <p className='modal__title'>Новый промокод</p>
                        <Field
                            label='Код'
                            value={newForm.code}
                            autoFocus
                            onChange={(v) =>
                                setNewForm((p) => ({
                                    ...p,
                                    code: v.toUpperCase(),
                                }))
                            }
                        />
                        <div className='form-group'>
                            <label className='form-label'>Скидка (%)</label>
                            <input
                                type='number'
                                className='form-input'
                                min={1}
                                max={100}
                                value={newForm.discount}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        discount: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>
                                Лимит использований (пусто = безлимит)
                            </label>
                            <input
                                type='number'
                                className='form-input'
                                min={1}
                                value={newForm.usageLimit}
                                placeholder='Безлимит'
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        usageLimit: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>
                                Истекает (пусто = бессрочный)
                            </label>
                            <input
                                type='datetime-local'
                                className='form-input'
                                value={newForm.expiresAt}
                                onChange={(e) =>
                                    setNewForm((p) => ({
                                        ...p,
                                        expiresAt: e.target.value,
                                    }))
                                }
                            />
                        </div>
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
                                    isLoadingCreate || !newForm.code.trim()
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
                        <p className='modal__title'>Редактировать промокод</p>
                        <Field
                            label='Код'
                            value={editing.code}
                            autoFocus
                            onChange={(v) =>
                                setEditing(
                                    (p) => p && { ...p, code: v.toUpperCase() },
                                )
                            }
                        />
                        <div className='form-group'>
                            <label className='form-label'>Скидка (%)</label>
                            <input
                                type='number'
                                className='form-input'
                                min={1}
                                max={100}
                                value={editing.discount}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                discount: Number(
                                                    e.target.value,
                                                ),
                                            },
                                    )
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>
                                Лимит использований (пусто = безлимит)
                            </label>
                            <input
                                type='number'
                                className='form-input'
                                min={1}
                                value={editing.usageLimit}
                                placeholder='Безлимит'
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                usageLimit: e.target.value,
                                            },
                                    )
                                }
                            />
                        </div>
                        <div className='form-group'>
                            <label className='form-label'>
                                Истекает (пусто = бессрочный)
                            </label>
                            <input
                                type='datetime-local'
                                className='form-input'
                                value={editing.expiresAt}
                                onChange={(e) =>
                                    setEditing(
                                        (p) =>
                                            p && {
                                                ...p,
                                                expiresAt: e.target.value,
                                            },
                                    )
                                }
                            />
                        </div>
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
                        deletePromoCode(confirmDelete);
                        setConfirmDelete(null);
                    }}
                />
            )}
        </>
    );
}

'use client'

import { useState } from 'react'
import { useAllReviews, useDeleteReview } from '@/hooks/queries/useReview'
import ConfirmModal from '../shared/ConfirmModal'
import SkeletonRows from '../shared/SkeletonRows'
import '../shared/admin.css'

const stars = (n: number) => '★'.repeat(Math.max(0, n)) + '☆'.repeat(Math.max(0, 5 - n))

export default function ReviewsSection() {
  const { reviews, isLoadingReviews } = useAllReviews()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  // gameId is optional in useDeleteReview — pass undefined for admin-level delete
  const { deleteReview, isLoadingDelete } = useDeleteReview()

  return (
    <>
      <div className='section-header'>
        <div>
          <h2 className='section-title'>Отзывы</h2>
          <p className='section-sub'>{reviews?.length ?? 0} записей</p>
        </div>
      </div>

      <div className='admin-card'>
        <table className='admin-table'>
          <thead>
            <tr>
              <th>Пользователь</th>
              <th>Игра</th>
              <th>Оценка</th>
              <th>Текст</th>
              <th>Дата</th>
              <th className='col-actions'>Действия</th>
            </tr>
          </thead>
          <tbody>
            {isLoadingReviews
              ? <SkeletonRows rows={5} cols={6} />
              : !reviews?.length
              ? <tr><td colSpan={6} className='table-empty'>Нет отзывов</td></tr>
              : reviews.map(r => (
                <tr key={r.id}>
                  <td className='td-main'>{r.user?.name ?? '—'}</td>
                  <td className='td-muted'>{r.game?.name ?? '—'}</td>
                  <td><span className='stars'>{stars(r.rating)}</span></td>
                  <td className='td-muted td-truncate'>{r.text}</td>
                  <td className='td-date'>{new Date(r.createdAt).toLocaleDateString('ru-RU')}</td>
                  <td className='col-actions'>
                    <button className='btn btn--danger btn--sm' onClick={() => setConfirmDelete(r.id)}>
                      Удал.
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {confirmDelete && (
        <ConfirmModal
          isLoading={isLoadingDelete}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={() => { deleteReview(confirmDelete); setConfirmDelete(null) }}
        />
      )}
    </>
  )
}

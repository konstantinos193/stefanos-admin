'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'
import {
  ReviewsHeader,
  type RatingFilter,
  type VisibilityFilter,
} from '@/components/reviews/ReviewsHeader'
import { ReviewsTable } from '@/components/reviews/ReviewsTable'
import { ReviewResponseDialog } from '@/components/reviews/ReviewResponseDialog'
import { reviewsApi, type Review } from '@/lib/api/reviews'
import { formatDate } from '@/lib/dateFormat'

const FETCH_LIMIT = 200

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [responding, setResponding] = useState<Review | null>(null)
  const [savingResponse, setSavingResponse] = useState(false)
  const [responseError, setResponseError] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState<Review | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [rating, setRating] = useState<RatingFilter>('ALL')
  const [visibility, setVisibility] = useState<VisibilityFilter>('ALL')

  const fetchReviews = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await reviewsApi.getAll({ limit: FETCH_LIMIT })
      setReviews(response?.data?.reviews ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης αξιολογήσεων.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleRespond = async (response: string) => {
    if (!responding) return
    setSavingResponse(true)
    setResponseError(null)
    try {
      await reviewsApi.respond(responding.id, response)
      setResponding(null)
      await fetchReviews({ silent: true })
    } catch (error) {
      console.error('Error responding to review:', error)
      setResponseError(errorMessage(error, 'Η αποστολή της απάντησης απέτυχε.'))
    } finally {
      setSavingResponse(false)
    }
  }

  const handleToggleVisibility = async (review: Review) => {
    setBusyId(review.id)
    try {
      await reviewsApi.setVisibility(review.id, !review.isPublic)
      setReviews((prev) =>
        prev.map((r) => (r.id === review.id ? { ...r, isPublic: !r.isPublic } : r)),
      )
    } catch (error) {
      console.error('Error changing review visibility:', error)
      setPageError(errorMessage(error, 'Η αλλαγή ορατότητας απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setBusyId(target.id)
    setPendingDelete(null)
    try {
      await reviewsApi.delete(target.id)
      setReviews((prev) => prev.filter((r) => r.id !== target.id))
    } catch (error) {
      console.error('Error deleting review:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const visibleReviews = useMemo(() => {
    return reviews.filter((review) => {
      if (visibility === 'PUBLIC' && !review.isPublic) return false
      if (visibility === 'HIDDEN' && review.isPublic) return false

      if (rating === 'LOW') return review.rating <= 2
      if (rating !== 'ALL') return review.rating === Number(rating)
      return true
    })
  }, [reviews, rating, visibility])

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
  }, [reviews])

  const isFiltered = rating !== 'ALL' || visibility !== 'ALL'

  const clearFilters = () => {
    setRating('ALL')
    setVisibility('ALL')
  }

  const handleExport = () => {
    setExporting(true)
    try {
      const rows: (string | number)[][] = [
        [
          'Ημερομηνία',
          'Ακίνητο',
          'Επισκέπτης',
          'Βαθμολογία',
          'Καθαριότητα',
          'Τίτλος',
          'Σχόλιο',
          'Απάντηση',
          'Ορατή',
        ],
        ...visibleReviews.map((review) => [
          formatDate(review.createdAt),
          review.property?.titleGr || review.property?.titleEn || '',
          review.guest?.name || 'Ανώνυμος',
          review.rating,
          review.cleanlinessRating ?? '',
          review.title || '',
          review.comment || '',
          review.response || '',
          review.isPublic ? 'Ναι' : 'Όχι',
        ]),
      ]

      const body = rows
        .map((row) =>
          row
            .map((cell) => {
              const value = String(cell ?? '')
              return /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
            })
            .join(';'),
        )
        .join('\r\n')

      const blob = new Blob([`﻿${body}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `reviews-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting reviews:', error)
      setPageError(errorMessage(error, 'Η εξαγωγή απέτυχε.'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <ReviewsHeader
        rating={rating}
        onRatingChange={setRating}
        visibility={visibility}
        onVisibilityChange={setVisibility}
        onRefresh={() => fetchReviews({ silent: true })}
        onExport={handleExport}
        refreshing={refreshing}
        exporting={exporting}
        exportDisabled={visibleReviews.length === 0}
        total={reviews.length}
        resultCount={visibleReviews.length}
        isFiltered={isFiltered}
        averageRating={averageRating}
      />

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-red-200">{pageError}</p>
          <button
            onClick={() => setPageError(null)}
            aria-label="Κλείσιμο"
            className="text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <ReviewsTable
        reviews={visibleReviews}
        loading={loading}
        busyId={busyId}
        isFiltered={isFiltered}
        onRespond={(review) => {
          setResponseError(null)
          setResponding(review)
        }}
        onToggleVisibility={handleToggleVisibility}
        onDelete={setPendingDelete}
        onClearFilters={clearFilters}
      />

      <ReviewResponseDialog
        review={responding}
        loading={savingResponse}
        error={responseError}
        onClose={() => {
          setResponding(null)
          setResponseError(null)
        }}
        onSubmit={handleRespond}
      />

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPendingDelete(null)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Διαγραφή αξιολόγησης;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Η αξιολόγηση του{' '}
                  <span className="font-semibold text-slate-200">
                    {pendingDelete.guest?.name || 'επισκέπτη'}
                  </span>{' '}
                  θα διαγραφεί οριστικά. Αν θέλετε απλώς να μην φαίνεται, χρησιμοποιήστε την
                  απόκρυψη.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="h-10 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

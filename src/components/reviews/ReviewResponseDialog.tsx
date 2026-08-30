'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, MessageSquare, Star } from 'lucide-react'
import type { Review } from '@/lib/api/reviews'

interface ReviewResponseDialogProps {
  review: Review | null
  loading?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (response: string) => void
}

export function ReviewResponseDialog({
  review,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}: ReviewResponseDialogProps) {
  const [response, setResponse] = useState('')

  useEffect(() => {
    if (review) setResponse(review.response || '')
  }, [review])

  useEffect(() => {
    if (!review) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [review, loading, onClose])

  if (!review) return null

  const canSubmit = response.trim().length > 0 && !loading

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100">
              {review.response ? 'Επεξεργασία Απάντησης' : 'Απάντηση σε Αξιολόγηση'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {review.guest?.name || 'Ανώνυμος'} ·{' '}
              {review.property?.titleGr || review.property?.titleEn || ''}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="h-9 w-9 flex-shrink-0 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="rounded-xl bg-slate-900 border border-slate-700 p-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-200">{review.rating}/5</span>
            </div>
            {review.title && (
              <p className="mt-2 text-sm font-semibold text-slate-100">{review.title}</p>
            )}
            <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
              {review.comment || 'Χωρίς σχόλιο.'}
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
              <MessageSquare className="h-3.5 w-3.5" />
              Η απάντησή σας
            </label>
            <textarea
              rows={5}
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Ευχαριστούμε για τα σχόλιά σας…"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-y"
            />
            <p className="mt-2 text-xs text-slate-500">
              Η απάντηση εμφανίζεται δημόσια κάτω από την αξιολόγηση.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Ακύρωση
          </button>
          <button
            type="button"
            onClick={() => onSubmit(response.trim())}
            disabled={!canSubmit}
            className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Αποθήκευση…' : 'Αποστολή'}
          </button>
        </div>
      </div>
    </div>
  )
}

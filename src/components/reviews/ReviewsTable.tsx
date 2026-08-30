'use client'

import {
  Star,
  MessageSquare,
  User,
  Eye,
  EyeOff,
  Trash2,
  Loader2,
  MessageSquareOff,
  SearchX,
} from 'lucide-react'
import type { Review } from '@/lib/api/reviews'
import { formatDate } from '@/lib/dateFormat'

interface ReviewsTableProps {
  reviews: Review[]
  loading: boolean
  busyId?: string | null
  isFiltered?: boolean
  onRespond: (review: Review) => void
  onToggleVisibility: (review: Review) => void
  onDelete: (review: Review) => void
  onClearFilters?: () => void
}

export function Stars({ rating, size = 'h-4 w-4' }: { rating: number; size?: string }) {
  return (
    <div className="flex" aria-label={`${rating} από 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`${size} ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-slate-600'}`}
        />
      ))}
    </div>
  )
}

const SUB_RATINGS: { key: keyof Review; label: string }[] = [
  { key: 'cleanlinessRating', label: 'Καθαριότητα' },
  { key: 'accuracyRating', label: 'Ακρίβεια' },
  { key: 'communicationRating', label: 'Επικοινωνία' },
  { key: 'locationRating', label: 'Τοποθεσία' },
  { key: 'valueRating', label: 'Αξία' },
]

export function ReviewsTable({
  reviews,
  loading,
  busyId,
  isFiltered,
  onRespond,
  onToggleVisibility,
  onDelete,
  onClearFilters,
}: ReviewsTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-3 space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse h-28 bg-slate-700/40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 py-16 text-center">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          {isFiltered ? (
            <SearchX className="h-5 w-5 text-slate-400" />
          ) : (
            <MessageSquareOff className="h-5 w-5 text-slate-400" />
          )}
        </div>
        <p className="mt-4 text-base font-semibold text-slate-200">
          {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν αξιολογήσεις'}
        </p>
        <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
          {isFiltered
            ? 'Δοκιμάστε διαφορετικά φίλτρα.'
            : 'Οι αξιολογήσεις των επισκεπτών θα εμφανιστούν εδώ.'}
        </p>
        {isFiltered && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-5 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Καθαρισμός φίλτρων
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {reviews.map((review) => {
        const busy = busyId === review.id
        const subRatings = SUB_RATINGS.filter((entry) => review[entry.key] != null)

        return (
          <div
            key={review.id}
            className={`rounded-2xl bg-slate-800/60 border p-5 transition-colors ${
              review.isPublic ? 'border-slate-700' : 'border-slate-700/60 bg-slate-800/30'
            } ${busy ? 'opacity-60' : ''}`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Stars rating={review.rating} />
                  <span className="text-sm font-bold text-slate-100">{review.rating}/5</span>
                  {!review.isPublic && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-slate-600/30 border border-slate-600/40 text-xs font-semibold text-slate-400">
                      <EyeOff className="h-3 w-3" />
                      Κρυφή
                    </span>
                  )}
                </div>

                <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5" />
                    {review.guest?.name || 'Ανώνυμος'}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="truncate">
                    {review.property?.titleGr || review.property?.titleEn || 'Άγνωστο ακίνητο'}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span>{formatDate(review.createdAt)}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => onToggleVisibility(review)}
                  disabled={busy}
                  title={review.isPublic ? 'Απόκρυψη από την ιστοσελίδα' : 'Εμφάνιση στην ιστοσελίδα'}
                  aria-label={review.isPublic ? 'Απόκρυψη' : 'Εμφάνιση'}
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : review.isPublic ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => onDelete(review)}
                  disabled={busy}
                  title="Διαγραφή"
                  aria-label="Διαγραφή"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {review.title && (
              <p className="mt-3 text-sm font-semibold text-slate-100">{review.title}</p>
            )}
            {review.comment && (
              <p className="mt-1 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            )}

            {subRatings.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {subRatings.map((entry) => (
                  <span key={String(entry.key)} className="text-xs text-slate-400">
                    {entry.label}:{' '}
                    <span className="font-semibold text-slate-200">
                      {String(review[entry.key])}/5
                    </span>
                  </span>
                ))}
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-700/60">
              {review.response ? (
                <div>
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-blue-300">
                    <MessageSquare className="h-3.5 w-3.5" />
                    Απάντηση καταλύματος
                  </p>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {review.response}
                  </p>
                  <button
                    onClick={() => onRespond(review)}
                    disabled={busy}
                    className="mt-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors disabled:opacity-50"
                  >
                    Επεξεργασία απάντησης
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => onRespond(review)}
                  disabled={busy}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-blue-500/10 text-blue-300 border border-blue-500/25 text-sm font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50"
                >
                  <MessageSquare className="h-4 w-4" />
                  Απάντηση
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

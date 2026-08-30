'use client'

import { Download, RefreshCw, Loader2, Star } from 'lucide-react'

export type RatingFilter = 'ALL' | '5' | '4' | '3' | 'LOW'
export type VisibilityFilter = 'ALL' | 'PUBLIC' | 'HIDDEN'

interface ReviewsHeaderProps {
  rating: RatingFilter
  onRatingChange: (value: RatingFilter) => void
  visibility: VisibilityFilter
  onVisibilityChange: (value: VisibilityFilter) => void
  onRefresh: () => void
  onExport: () => void
  refreshing?: boolean
  exporting?: boolean
  exportDisabled?: boolean
  total: number
  resultCount: number
  isFiltered: boolean
  averageRating: number | null
}

const RATING_OPTIONS: { value: RatingFilter; label: string }[] = [
  { value: 'ALL', label: 'Όλες οι βαθμολογίες' },
  { value: '5', label: '5 αστέρια' },
  { value: '4', label: '4 αστέρια' },
  { value: '3', label: '3 αστέρια' },
  { value: 'LOW', label: '1–2 αστέρια' },
]

const VISIBILITY_OPTIONS: { value: VisibilityFilter; label: string }[] = [
  { value: 'ALL', label: 'Όλες' },
  { value: 'PUBLIC', label: 'Δημόσιες' },
  { value: 'HIDDEN', label: 'Κρυφές' },
]

export function ReviewsHeader({
  rating,
  onRatingChange,
  visibility,
  onVisibilityChange,
  onRefresh,
  onExport,
  refreshing = false,
  exporting = false,
  exportDisabled = false,
  total,
  resultCount,
  isFiltered,
  averageRating,
}: ReviewsHeaderProps) {
  const controlClass =
    'h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors [&>option]:bg-slate-800'

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Αξιολογήσεις</h1>
          <p className="text-slate-400 mt-1 text-sm flex flex-wrap items-center gap-x-2">
            {total > 0 ? (
              <>
                <span>
                  {isFiltered ? `${resultCount} από ${total}` : `${total}`} αξιολογήσεις
                </span>
                {averageRating !== null && (
                  <>
                    <span className="text-slate-600">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="font-semibold text-slate-200">
                        {averageRating.toFixed(1)}
                      </span>
                      μέσος όρος
                    </span>
                  </>
                )}
              </>
            ) : (
              'Διαχείριση αξιολογήσεων από τους επισκέπτες'
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title="Ανανέωση"
            aria-label="Ανανέωση"
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={onExport}
            disabled={exporting || exportDisabled}
            className="flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">Εξαγωγή</span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <select
          value={rating}
          onChange={(e) => onRatingChange(e.target.value as RatingFilter)}
          className={controlClass}
        >
          {RATING_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={visibility}
          onChange={(e) => onVisibilityChange(e.target.value as VisibilityFilter)}
          className={controlClass}
        >
          {VISIBILITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

'use client'

import { AlertTriangle, CalendarClock, CheckCircle2, LayoutGrid, Star, Home } from 'lucide-react'
import { CleaningStats } from '@/lib/api/types'

export type CleaningView = 'ALL' | 'OVERDUE' | 'DUE_TODAY' | 'UPCOMING'

interface CleaningSummaryProps {
  counts: Record<CleaningView, number>
  view: CleaningView
  onViewChange: (view: CleaningView) => void
  stats: CleaningStats | null
  loading?: boolean
}

const SEGMENTS: {
  key: CleaningView
  label: string
  icon: typeof LayoutGrid
  active: string
  idleIcon: string
}[] = [
  {
    key: 'ALL',
    label: 'Όλα',
    icon: LayoutGrid,
    active: 'bg-slate-700/60 border-slate-500 text-slate-100',
    idleIcon: 'text-slate-400',
  },
  {
    key: 'OVERDUE',
    label: 'Εκπρόθεσμα',
    icon: AlertTriangle,
    active: 'bg-red-500/15 border-red-500/50 text-red-200',
    idleIcon: 'text-red-400',
  },
  {
    key: 'DUE_TODAY',
    label: 'Σήμερα',
    icon: CalendarClock,
    active: 'bg-amber-500/15 border-amber-500/50 text-amber-200',
    idleIcon: 'text-amber-400',
  },
  {
    key: 'UPCOMING',
    label: 'Επόμενες 7 ημέρες',
    icon: CheckCircle2,
    active: 'bg-blue-500/15 border-blue-500/50 text-blue-200',
    idleIcon: 'text-blue-400',
  },
]

export function CleaningSummary({
  counts,
  view,
  onViewChange,
  stats,
  loading,
}: CleaningSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SEGMENTS.map((s) => (
          <div
            key={s.key}
            className="h-[76px] rounded-2xl bg-slate-800/50 border border-slate-700/60 animate-pulse"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SEGMENTS.map((segment) => {
          const isActive = view === segment.key
          const count = counts[segment.key]
          const Icon = segment.icon

          return (
            <button
              key={segment.key}
              onClick={() => onViewChange(segment.key)}
              aria-pressed={isActive}
              className={`text-left rounded-2xl border px-4 py-3.5 transition-colors ${
                isActive
                  ? segment.active
                  : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon
                  className={`h-4 w-4 ${isActive ? '' : segment.idleIcon} ${
                    count === 0 && !isActive ? 'opacity-40' : ''
                  }`}
                />
                <span
                  className={`text-2xl font-bold tabular-nums ${
                    count === 0 ? 'text-slate-500' : 'text-slate-50'
                  }`}
                >
                  {count}
                </span>
              </div>
              <p className="mt-1 text-xs font-medium truncate">{segment.label}</p>
            </button>
          )
        })}
      </div>

      {stats && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 px-1 text-xs text-slate-400">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
            Ολοκληρώθηκαν αυτή την εβδομάδα:{' '}
            <span className="font-semibold text-slate-200">{stats.completedThisWeek}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Home className="h-3.5 w-3.5 text-cyan-400" />
            Ακίνητα με πρόγραμμα:{' '}
            <span className="font-semibold text-slate-200">{stats.propertiesWithCleaning}</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-purple-400" />
            Βαθμολογία καθαριότητας:{' '}
            <span className="font-semibold text-slate-200">
              {stats.averageCleanlinessRating
                ? `${stats.averageCleanlinessRating.toFixed(1)}/5`
                : 'χωρίς κριτικές'}
            </span>
          </span>
        </div>
      )}
    </div>
  )
}

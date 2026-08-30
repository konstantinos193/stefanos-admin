'use client'

import { LayoutGrid, AlertTriangle, Clock, CheckCircle2 } from 'lucide-react'

export type MaintenanceView = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'URGENT' | 'DONE'

interface MaintenanceSummaryProps {
  counts: Record<MaintenanceView, number>
  view: MaintenanceView
  onViewChange: (view: MaintenanceView) => void
  loading?: boolean
}

const SEGMENTS: {
  key: MaintenanceView
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
    key: 'URGENT',
    label: 'Επείγοντα',
    icon: AlertTriangle,
    active: 'bg-red-500/15 border-red-500/50 text-red-200',
    idleIcon: 'text-red-400',
  },
  {
    key: 'OPEN',
    label: 'Ανοιχτά',
    icon: Clock,
    active: 'bg-amber-500/15 border-amber-500/50 text-amber-200',
    idleIcon: 'text-amber-400',
  },
  {
    key: 'IN_PROGRESS',
    label: 'Σε εξέλιξη',
    icon: Clock,
    active: 'bg-blue-500/15 border-blue-500/50 text-blue-200',
    idleIcon: 'text-blue-400',
  },
  {
    key: 'DONE',
    label: 'Ολοκληρωμένα',
    icon: CheckCircle2,
    active: 'bg-green-500/15 border-green-500/50 text-green-200',
    idleIcon: 'text-green-400',
  },
]

export function MaintenanceSummary({
  counts,
  view,
  onViewChange,
  loading,
}: MaintenanceSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
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
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
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
  )
}

'use client'

import { Download, RefreshCw } from 'lucide-react'
import { RANGE_OPTIONS, RangeKey } from './analyticsTheme'

interface AnalyticsHeaderProps {
  range: RangeKey
  onRangeChange: (range: RangeKey) => void
  onRefresh: () => void
  refreshing?: boolean
  onExport: () => void
  exportDisabled?: boolean
}

export function AnalyticsHeader({
  range,
  onRangeChange,
  onRefresh,
  refreshing = false,
  onExport,
  exportDisabled = false,
}: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Αναλυτικά</h1>
        <p className="text-slate-400 mt-1 text-sm">
          Προβολή λεπτομερών αναλυτικών και στατιστικών
        </p>
      </div>

      {/* One filter row scoping every card below it. */}
      <div className="flex items-center gap-2">
        <select
          value={range}
          onChange={(e) => onRangeChange(e.target.value as RangeKey)}
          className="h-11 px-3 pr-8 rounded-xl bg-slate-900 border border-slate-700 text-sm font-medium text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors [&>option]:bg-slate-800"
        >
          {RANGE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <button
          onClick={onRefresh}
          disabled={refreshing}
          title="Ανανέωση"
          className="flex items-center gap-2 h-11 px-3 sm:px-4 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Ανανέωση</span>
        </button>

        <button
          onClick={onExport}
          disabled={exportDisabled}
          title="Εξαγωγή σε CSV"
          className="flex items-center gap-2 h-11 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Εξαγωγή</span>
        </button>
      </div>
    </div>
  )
}

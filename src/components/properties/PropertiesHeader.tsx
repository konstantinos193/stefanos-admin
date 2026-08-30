'use client'

import { Plus, Download, RefreshCw, Loader2 } from 'lucide-react'

interface PropertiesHeaderProps {
  onCreate: () => void
  onExport: () => void
  onRefresh: () => void
  refreshing?: boolean
  exporting?: boolean
  exportDisabled?: boolean
  totalCount?: number
  resultCount?: number
  isFiltered?: boolean
}

export function PropertiesHeader({
  onCreate,
  onExport,
  onRefresh,
  refreshing = false,
  exporting = false,
  exportDisabled = false,
  totalCount,
  resultCount,
  isFiltered = false,
}: PropertiesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Ακίνητα</h1>
        <p className="text-slate-400 mt-1 text-sm">
          {typeof totalCount === 'number' && totalCount > 0
            ? isFiltered && typeof resultCount === 'number'
              ? `${resultCount} από ${totalCount} ακίνητα`
              : `${totalCount} ${totalCount === 1 ? 'ακίνητο' : 'ακίνητα'} στο σύστημα`
            : 'Διαχείριση όλων των ακινήτων στο σύστημα'}
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

        {/* "Εισαγωγή" used to sit here with no handler and no import endpoint on the API. */}
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

        <button
          onClick={onCreate}
          className="flex items-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Προσθήκη Ακινήτου</span>
          <span className="sm:hidden">Νέο</span>
        </button>
      </div>
    </div>
  )
}

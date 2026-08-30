'use client'

import { Plus, Search, RefreshCw, X } from 'lucide-react'
import { PRIORITY_OPTIONS, MaintenancePriorityValue } from './maintenanceUtils'

interface MaintenanceHeaderProps {
  searchValue: string
  onSearch: (query: string) => void
  priority: MaintenancePriorityValue | 'ALL'
  onPriorityChange: (priority: MaintenancePriorityValue | 'ALL') => void
  onCreate: () => void
  onRefresh: () => void
  refreshing?: boolean
  isFiltered?: boolean
  resultCount?: number
  totalCount?: number
}

export function MaintenanceHeader({
  searchValue,
  onSearch,
  priority,
  onPriorityChange,
  onCreate,
  onRefresh,
  refreshing = false,
  isFiltered = false,
  resultCount,
  totalCount,
}: MaintenanceHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Συντήρηση</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {typeof totalCount === 'number' && totalCount > 0
              ? isFiltered && typeof resultCount === 'number'
                ? `${resultCount} από ${totalCount} αιτήματα`
                : `${totalCount} ${totalCount === 1 ? 'αίτημα' : 'αιτήματα'} συντήρησης`
              : 'Διαχείριση αιτημάτων συντήρησης'}
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
            onClick={onCreate}
            className="flex items-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Νέο Αίτημα</span>
            <span className="sm:hidden">Νέο</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Αναζήτηση τίτλου, περιγραφής ή ακινήτου..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-10 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
          {searchValue && (
            <button
              onClick={() => onSearch('')}
              aria-label="Καθαρισμός αναζήτησης"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value as MaintenancePriorityValue | 'ALL')}
          className="h-11 px-3 pr-8 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors sm:w-56 [&>option]:bg-slate-800"
        >
          <option value="ALL">Όλες οι προτεραιότητες</option>
          {PRIORITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

'use client'

import { Plus, Filter, Search, Calendar } from 'lucide-react'

interface CleaningHeaderProps {
  onSearch?: (query: string) => void
  onFilter?: () => void
  onCreate?: () => void
  searchValue?: string
  title?: string
  subtitle?: string
}

export function CleaningHeader({ 
  onSearch, 
  onFilter, 
  onCreate, 
  searchValue = '',
  title = 'Καθαρισμός',
  subtitle = 'Διαχείριση προγραμμάτων καθαρισμού'
}: CleaningHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">{title}</h1>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 sm:space-x-3">
          <button
            onClick={onFilter}
            className="btn btn-secondary flex items-center gap-2 text-sm px-3 py-2"
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Φίλτρα</span>
          </button>
          <button
            onClick={onCreate}
            className="btn btn-primary flex items-center gap-2 text-sm px-3 py-2"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Νέο Πρόγραμμα</span>
            <span className="sm:hidden">Νέο</span>
          </button>
        </div>
      </div>

      {onSearch && (
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Αναζήτηση..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="input w-full pl-10 text-sm"
            />
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <select className="input text-sm">
              <option value="">Όλες οι ημερομηνίες</option>
              <option value="today">Σήμερα</option>
              <option value="week">Αυτή την εβδομάδα</option>
              <option value="month">Αυτό τον μήνα</option>
              <option value="overdue">Εκπρόθεσμες</option>
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

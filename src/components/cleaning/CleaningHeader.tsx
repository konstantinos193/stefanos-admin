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
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onFilter}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Filter className="h-4 w-4" />
            <span>Φίλτρα</span>
          </button>
          <button
            onClick={onCreate}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Νέο Πρόγραμμα</span>
          </button>
        </div>
      </div>

      {onSearch && (
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Αναζήτηση ακινήτων, υπευθύνων..."
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
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

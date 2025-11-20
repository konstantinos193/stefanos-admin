'use client'

import { Search, X } from 'lucide-react'

interface BookingsFiltersProps {
  searchQuery: string
  statusFilter: string
  dateFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onDateChange: (value: string) => void
  onClearFilters: () => void
}

export function BookingsFilters({
  searchQuery,
  statusFilter,
  dateFilter,
  onSearchChange,
  onStatusChange,
  onDateChange,
  onClearFilters,
}: BookingsFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || dateFilter !== ''

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση κρατήσεων..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλες οι Καταστάσεις</option>
            <option value="CONFIRMED">Επιβεβαιωμένη</option>
            <option value="PENDING">Σε Αναμονή</option>
            <option value="COMPLETED">Ολοκληρωμένη</option>
            <option value="CHECKED_IN">Check-in</option>
            <option value="CANCELLED">Ακυρωμένη</option>
            <option value="NO_SHOW">Απουσία</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => onDateChange(e.target.value)}
            className="input"
          />
          {hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="btn btn-secondary flex items-center space-x-2"
              title="Καθαρισμός φίλτρων"
            >
              <X className="h-4 w-4" />
              <span>Καθαρισμός</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}


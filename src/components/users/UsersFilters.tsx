'use client'

import { Search, Filter, X } from 'lucide-react'

interface UsersFiltersProps {
  searchQuery: string
  roleFilter: string
  statusFilter: string
  onSearchChange: (value: string) => void
  onRoleChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClearFilters: () => void
}

export function UsersFilters({
  searchQuery,
  roleFilter,
  statusFilter,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClearFilters,
}: UsersFiltersProps) {
  const hasActiveFilters = searchQuery || roleFilter !== 'all' || statusFilter !== 'all'

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση χρηστών..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={roleFilter}
            onChange={(e) => onRoleChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλοι οι Ρόλοι</option>
            <option value="ADMIN">Διαχειριστής</option>
            <option value="USER">Χρήστης</option>
            <option value="PROPERTY_OWNER">Ιδιοκτήτης</option>
            <option value="MANAGER">Διαχειριστής</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλες οι Καταστάσεις</option>
            <option value="active">Ενεργός</option>
            <option value="inactive">Ανενεργός</option>
          </select>
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


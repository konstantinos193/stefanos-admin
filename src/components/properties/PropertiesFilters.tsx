'use client'

import { Search, X } from 'lucide-react'
import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PropertyStatusValue,
  PropertyTypeValue,
} from './propertyUtils'

interface PropertiesFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  type: PropertyTypeValue | 'ALL'
  onTypeChange: (value: PropertyTypeValue | 'ALL') => void
  status: PropertyStatusValue | 'ALL'
  onStatusChange: (value: PropertyStatusValue | 'ALL') => void
  city: string
  onCityChange: (value: string) => void
  cities: string[]
  isFiltered: boolean
  onClear: () => void
}

export function PropertiesFilters({
  search,
  onSearchChange,
  type,
  onTypeChange,
  status,
  onStatusChange,
  city,
  onCityChange,
  cities,
  isFiltered,
  onClear,
}: PropertiesFiltersProps) {
  const controlClass =
    'h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Αναζήτηση τίτλου, πόλης ή διεύθυνσης..."
            className={`${controlClass} w-full pl-10 pr-10 placeholder:text-slate-500`}
          />
          {search && (
            <button
              onClick={() => onSearchChange('')}
              aria-label="Καθαρισμός αναζήτησης"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={type}
            onChange={(e) => onTypeChange(e.target.value as PropertyTypeValue | 'ALL')}
            className={`${controlClass} [&>option]:bg-slate-800`}
          >
            <option value="ALL">Όλοι οι τύποι</option>
            {PROPERTY_TYPES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value as PropertyStatusValue | 'ALL')}
            className={`${controlClass} [&>option]:bg-slate-800`}
          >
            <option value="ALL">Όλες οι καταστάσεις</option>
            {PROPERTY_STATUSES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Options come from the loaded properties, not a hard-coded city list. */}
          <select
            value={city}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={cities.length === 0}
            className={`${controlClass} [&>option]:bg-slate-800 disabled:opacity-60`}
          >
            <option value="">Όλες οι τοποθεσίες</option>
            {cities.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          {isFiltered && (
            <button
              onClick={onClear}
              className="h-11 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              Καθαρισμός
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

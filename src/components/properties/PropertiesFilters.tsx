'use client'

import { Search, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { propertiesApi } from '@/lib/api/properties'
import { Property } from '@/lib/api/types'

interface PropertiesFiltersProps {
  searchQuery: string
  typeFilter: string
  statusFilter: string
  cityFilter: string
  onSearchChange: (value: string) => void
  onTypeChange: (value: string) => void
  onStatusChange: (value: string) => void
  onCityChange: (value: string) => void
  onClearFilters: () => void
}

export function PropertiesFilters({
  searchQuery,
  typeFilter,
  statusFilter,
  cityFilter,
  onSearchChange,
  onTypeChange,
  onStatusChange,
  onCityChange,
  onClearFilters,
}: PropertiesFiltersProps) {
  const [cities, setCities] = useState<string[]>([])
  const [loadingCities, setLoadingCities] = useState(false)

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoadingCities(true)
        const allProperties = await propertiesApi.getAllForSearch()
        const uniqueCities = Array.from(new Set(allProperties.map(p => p.city).filter(Boolean))) as string[]
        setCities(uniqueCities.sort())
      } catch (error) {
        console.error('Error loading cities:', error)
      } finally {
        setLoadingCities(false)
      }
    }
    loadCities()
  }, [])

  const hasActiveFilters = searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || cityFilter !== 'all'

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση ακινήτων..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλοι οι Τύποι</option>
            <option value="APARTMENT">Διαμέρισμα</option>
            <option value="HOUSE">Κατοικία</option>
            <option value="ROOM">Δωμάτιο</option>
            <option value="COMMERCIAL">Επαγγελματικό</option>
            <option value="STORAGE">Αποθήκη</option>
            <option value="VACATION_RENTAL">Διακοπές</option>
            <option value="LUXURY">Πολυτελές</option>
            <option value="INVESTMENT">Επένδυση</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλες οι Καταστάσεις</option>
            <option value="ACTIVE">Ενεργό</option>
            <option value="INACTIVE">Ανενεργό</option>
            <option value="MAINTENANCE">Συντήρηση</option>
            <option value="SUSPENDED">Αναστολή</option>
          </select>
          <select
            value={cityFilter}
            onChange={(e) => onCityChange(e.target.value)}
            className="input"
            disabled={loadingCities}
          >
            <option value="all">Όλες οι Τοποθεσίες</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
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


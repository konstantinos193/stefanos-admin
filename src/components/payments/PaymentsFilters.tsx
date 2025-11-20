'use client'

import { Search, X, Calendar, Filter } from 'lucide-react'

interface PaymentsFiltersProps {
  searchQuery: string
  statusFilter: string
  methodFilter: string
  dateFromFilter: string
  dateToFilter: string
  onSearchChange: (value: string) => void
  onStatusChange: (value: string) => void
  onMethodChange: (value: string) => void
  onDateFromChange: (value: string) => void
  onDateToChange: (value: string) => void
  onClearFilters: () => void
}

export function PaymentsFilters({
  searchQuery,
  statusFilter,
  methodFilter,
  dateFromFilter,
  dateToFilter,
  onSearchChange,
  onStatusChange,
  onMethodChange,
  onDateFromChange,
  onDateToChange,
  onClearFilters,
}: PaymentsFiltersProps) {
  const hasActiveFilters = searchQuery || statusFilter !== 'all' || methodFilter !== 'all' || dateFromFilter !== '' || dateToFilter !== ''

  return (
    <div className="card">
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση πληρωμών, επισκεπτών, ακινήτων..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-11 w-full"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Status Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                <Filter className="h-3 w-3" />
                <span>Κατάσταση</span>
              </label>
              <select
                value={statusFilter}
                onChange={(e) => onStatusChange(e.target.value)}
                className="input w-full"
              >
                <option value="all">Όλες οι Καταστάσεις</option>
                <option value="COMPLETED">Ολοκληρωμένη</option>
                <option value="PENDING">Εκκρεμής</option>
                <option value="FAILED">Αποτυχημένη</option>
                <option value="REFUNDED">Επιστροφή</option>
                <option value="PARTIALLY_REFUNDED">Μερική Επιστροφή</option>
              </select>
            </div>

            {/* Method Filter */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700">Μέθοδος Πληρωμής</label>
              <select
                value={methodFilter}
                onChange={(e) => onMethodChange(e.target.value)}
                className="input w-full"
              >
                <option value="all">Όλες οι Μέθοδοι</option>
                <option value="CREDIT_CARD">Πιστωτική Κάρτα</option>
                <option value="DEBIT_CARD">Χρεωστική Κάρτα</option>
                <option value="APPLE_PAY">Apple Pay</option>
                <option value="GOOGLE_PAY">Google Pay</option>
                <option value="PAYPAL">PayPal</option>
                <option value="BANK_TRANSFER">Τραπεζική Μεταφορά</option>
                <option value="STRIPE_LINK">Stripe Link</option>
              </select>
            </div>

            {/* Date From */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Από</span>
              </label>
              <input
                type="date"
                value={dateFromFilter}
                onChange={(e) => onDateFromChange(e.target.value)}
                className="input w-full"
              />
            </div>

            {/* Date To */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-700 flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Έως</span>
              </label>
              <input
                type="date"
                value={dateToFilter}
                onChange={(e) => onDateToChange(e.target.value)}
                min={dateFromFilter}
                className="input w-full"
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <button
                onClick={onClearFilters}
                className="btn btn-secondary flex items-center space-x-2 h-10 px-4"
                title="Καθαρισμός φίλτρων"
              >
                <X className="h-4 w-4" />
                <span>Καθαρισμός</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


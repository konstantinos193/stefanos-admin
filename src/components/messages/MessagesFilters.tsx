'use client'

import { Search, X } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { bookingsApi } from '@/lib/api/bookings'
import { useState, useEffect } from 'react'

interface MessagesFiltersProps {
  searchQuery: string
  readFilter: string
  bookingFilter: string
  onSearchChange: (value: string) => void
  onReadChange: (value: string) => void
  onBookingChange: (value: string) => void
  onClearFilters: () => void
}

export function MessagesFilters({
  searchQuery,
  readFilter,
  bookingFilter,
  onSearchChange,
  onReadChange,
  onBookingChange,
  onClearFilters,
}: MessagesFiltersProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoadingBookings(true)
        const allBookings = await bookingsApi.getAllForSearch()
        setBookings(allBookings)
      } catch (error) {
        console.error('Error loading bookings:', error)
      } finally {
        setLoadingBookings(false)
      }
    }
    loadBookings()
  }, [])

  const hasActiveFilters = searchQuery || readFilter !== 'all' || bookingFilter !== ''

  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση μηνυμάτων..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={readFilter}
            onChange={(e) => onReadChange(e.target.value)}
            className="input"
          >
            <option value="all">Όλα τα Μηνύματα</option>
            <option value="read">Διαβασμένα</option>
            <option value="unread">Μη Διαβασμένα</option>
          </select>
          <select
            value={bookingFilter}
            onChange={(e) => onBookingChange(e.target.value)}
            className="input min-w-[200px]"
            disabled={loadingBookings}
          >
            <option value="">Όλες οι Κρατήσεις</option>
            {bookings.map((booking) => (
              <option key={booking.id} value={booking.id}>
                {booking.guestName || booking.guest?.name || 'Άγνωστος'} - {booking.property?.titleGr || booking.propertyId}
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


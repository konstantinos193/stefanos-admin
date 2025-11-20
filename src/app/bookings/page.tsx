'use client'

import { useState, useRef } from 'react'
import { BookingsHeader } from '@/components/bookings/BookingsHeader'
import { BookingsTable, BookingsTableRef } from '@/components/bookings/BookingsTable'
import { BookingsFilters } from '@/components/bookings/BookingsFilters'
import { AddBookingModal } from '@/components/bookings/AddBookingModal'
import { bookingsApi } from '@/lib/api/bookings'
import { downloadBookingsCSV } from '@/lib/utils/exportBookings'
import { Booking } from '@/lib/api/types'

export default function BookingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('')
  const bookingsTableRef = useRef<BookingsTableRef>(null)

  const handleNewBooking = () => {
    setIsModalOpen(true)
  }

  const handleBookingCreated = async () => {
    setIsModalOpen(false)
    await new Promise(resolve => setTimeout(resolve, 300))
    if (bookingsTableRef.current) {
      bookingsTableRef.current.refresh()
    }
  }

  const handleExport = async () => {
    try {
      const bookings = await bookingsApi.getAllForExport()
      const timestamp = new Date().toISOString().split('T')[0]
      downloadBookingsCSV(bookings, `bookings_${timestamp}.csv`)
    } catch (error: any) {
      console.error('Error exporting bookings:', error)
      alert(`Σφάλμα εξαγωγής: ${error.message}`)
    }
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setStatusFilter('all')
    setDateFilter('')
  }

  const handleEditBooking = (booking: Booking) => {
    // TODO: Implement edit modal
    console.log('Edit booking:', booking)
  }

  const handleDeleteBooking = async (booking: Booking) => {
    if (confirm(`Είστε σίγουροι ότι θέλετε να ακυρώσετε την κράτηση "${booking.id.slice(-6)}"?`)) {
      try {
        await bookingsApi.cancel(booking.id)
        if (bookingsTableRef.current) {
          bookingsTableRef.current.refresh()
        }
      } catch (error: any) {
        console.error('Error cancelling booking:', error)
        alert(`Σφάλμα ακύρωσης: ${error.message}`)
      }
    }
  }

  return (
    <div className="space-y-6">
      <BookingsHeader 
        onNewBooking={handleNewBooking}
        onExport={handleExport}
      />
      <BookingsFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
        onClearFilters={handleClearFilters}
      />
      <BookingsTable
        ref={bookingsTableRef}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onEditBooking={handleEditBooking}
        onDeleteBooking={handleDeleteBooking}
      />
      <AddBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBookingCreated}
      />
    </div>
  )
}

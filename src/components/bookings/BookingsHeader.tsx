'use client'

import { useState } from 'react'
import { Calendar, Download } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { CreateBookingDialog } from './CreateBookingDialog'

function exportBookingsToCSV(bookings: Booking[]) {
  const headers = [
    'ID',
    'Ακίνητο',
    'Επισκέπτης',
    'Email',
    'Τηλέφωνο',
    'Άφιξη',
    'Αναχώρηση',
    'Επισκέπτες',
    'Σύνολο',
    'Νόμισμα',
    'Κατάσταση',
    'Πληρωμή',
    'Ημ. Δημιουργίας',
  ]

  const rows = bookings.map(b => [
    b.id,
    b.property?.titleGr || b.propertyId,
    b.guestName || b.guest?.name || '',
    b.guestEmail || b.guest?.email || '',
    b.guestPhone || b.guest?.phone || '',
    new Date(b.checkIn).toLocaleDateString('el-GR'),
    new Date(b.checkOut).toLocaleDateString('el-GR'),
    b.guests,
    b.totalPrice,
    b.currency,
    b.status,
    b.paymentStatus,
    new Date(b.createdAt).toLocaleDateString('el-GR'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row =>
      row.map(cell => {
        const str = String(cell ?? '')
        return str.includes(',') || str.includes('"') || str.includes('\n')
          ? `"${str.replace(/"/g, '""')}"`
          : str
      }).join(',')
    ),
  ].join('\n')

  const BOM = '\uFEFF'
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `kratiseis_${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

interface BookingsHeaderProps {
  onBookingCreated?: () => void
}

export function BookingsHeader({ onBookingCreated }: BookingsHeaderProps) {
  const [exporting, setExporting] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await bookingsApi.exportAll()
      const bookings = response.data?.bookings || []

      if (bookings.length === 0) {
        alert('Δεν υπάρχουν κρατήσεις για εξαγωγή.')
        return
      }
      exportBookingsToCSV(bookings)
    } catch (error: any) {
      console.error('Export error:', error)
      alert(`Αποτυχία εξαγωγής κρατήσεων: ${error?.message || 'Άγνωστο σφάλμα'}`)
    } finally {
      setExporting(false)
    }
  }

  const handleBookingCreated = () => {
    onBookingCreated?.()
    window.location.reload()
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Κρατήσεις</h1>
          <p className="text-gray-600 mt-1">Διαχείριση όλων των κρατήσεων και των επιδοτήσεων</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExport}
            disabled={exporting}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>{exporting ? 'Εξαγωγή...' : 'Εξαγωγή'}</span>
          </button>
          <button
            onClick={() => setShowCreateDialog(true)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Νέα Κράτηση</span>
          </button>
        </div>
      </div>

      <CreateBookingDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreated={handleBookingCreated}
      />
    </>
  )
}


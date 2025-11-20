import { Booking } from '@/lib/api/types'

export function bookingsToCSV(bookings: Booking[]): string {
  const headers = [
    'ID',
    'Ακίνητο',
    'Επισκέπτης',
    'Email',
    'Τηλέφωνο',
    'Αφιξη',
    'Αναχώρηση',
    'Επισκέπτες',
    'Κατάσταση',
    'Κατάσταση Πληρωμής',
    'Συνολική Τιμή',
    'Βασική Τιμή',
    'Χρέωση Καθαρισμού',
    'Χρέωση Υπηρεσίας',
    'Φόροι',
    'Νόμισμα',
    'Ημερομηνία Δημιουργίας'
  ]

  const rows = bookings.map((booking) => [
    booking.id,
    booking.property?.titleGr || booking.propertyId,
    booking.guestName || booking.guest?.name || '',
    booking.guestEmail || booking.guest?.email || '',
    booking.guestPhone || booking.guest?.phone || '',
    new Date(booking.checkIn).toLocaleDateString('el-GR'),
    new Date(booking.checkOut).toLocaleDateString('el-GR'),
    booking.guests?.toString() || '0',
    booking.status,
    booking.paymentStatus,
    booking.totalPrice?.toString() || '0',
    booking.basePrice?.toString() || '0',
    booking.cleaningFee?.toString() || '',
    booking.serviceFee?.toString() || '',
    booking.taxes?.toString() || '',
    booking.currency || 'EUR',
    new Date(booking.createdAt).toLocaleDateString('el-GR')
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  return csvContent
}

export function downloadBookingsCSV(bookings: Booking[], filename: string = 'bookings.csv') {
  const csv = bookingsToCSV(bookings)
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


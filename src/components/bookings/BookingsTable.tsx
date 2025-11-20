'use client'

import { useEffect, useState, useImperativeHandle, forwardRef } from 'react'
import { Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { matchesSearch } from '@/lib/utils/textNormalization'

export interface BookingsTableRef {
  refresh: () => void
}

interface BookingsTableProps {
  searchQuery?: string
  statusFilter?: string
  dateFilter?: string
  onEditBooking?: (booking: Booking) => void
  onDeleteBooking?: (booking: Booking) => void
}

export const BookingsTable = forwardRef<BookingsTableRef, BookingsTableProps>(({ 
  searchQuery = '', 
  statusFilter = 'all', 
  dateFilter = '',
  onEditBooking,
  onDeleteBooking
}, ref) => {
  const [allBookings, setAllBookings] = useState<Booking[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      // Always fetch all bookings for client-side filtering
      const response = await bookingsApi.getAll({ limit: 100 })
      const fetchedBookings = response.data?.bookings || []
      setAllBookings(fetchedBookings)
      return fetchedBookings
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setAllBookings([])
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  useImperativeHandle(ref, () => ({
    refresh: () => {
      fetchBookings()
    }
  }))

  // Apply filters
  useEffect(() => {
    let filtered = [...allBookings]

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter)
    }

    // Search filter (accent-insensitive and case-insensitive)
    if (searchQuery.trim()) {
      filtered = filtered.filter((booking) => {
        return (
          matchesSearch(booking.guestName || '', searchQuery) ||
          matchesSearch(booking.guestEmail || '', searchQuery) ||
          matchesSearch(booking.guestPhone || '', searchQuery) ||
          matchesSearch(booking.property?.titleGr || '', searchQuery) ||
          matchesSearch(booking.id, searchQuery)
        )
      })
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter)
      filtered = filtered.filter((booking) => {
        const checkIn = new Date(booking.checkIn)
        const checkOut = new Date(booking.checkOut)
        return (
          checkIn.toDateString() === filterDate.toDateString() ||
          checkOut.toDateString() === filterDate.toDateString() ||
          (checkIn <= filterDate && checkOut >= filterDate)
        )
      })
    }

    setBookings(filtered)
  }, [allBookings, searchQuery, statusFilter, dateFilter])
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CHECKED_IN':
        return 'bg-purple-100 text-purple-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      case 'NO_SHOW':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Επιβεβαιωμένη'
      case 'PENDING':
        return 'Σε Αναμονή'
      case 'COMPLETED':
        return 'Ολοκληρωμένη'
      case 'CHECKED_IN':
        return 'Check-in'
      case 'CANCELLED':
        return 'Ακυρωμένη'
      case 'NO_SHOW':
        return 'Απουσία'
      default:
        return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return CheckCircle
      case 'PENDING':
      case 'CHECKED_IN':
        return Clock
      case 'CANCELLED':
      case 'NO_SHOW':
        return XCircle
      default:
        return Clock
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('el-GR')
  }

  const formatPrice = (price: number, currency: string = 'EUR') => {
    return new Intl.NumberFormat('el-GR', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price)
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-gray-600">Φόρτωση κρατήσεων...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID ΚΡΑΤΗΣΗΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΑΚΙΝΗΤΟ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΕΠΙΣΚΕΠΤΗΣ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΑΦΙΞΗ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΑΝΑΧΩΡΗΣΗ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΣΥΝΟΛΟ
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΚΑΤΑΣΤΑΣΗ
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                ΕΝΕΡΓΕΙΕΣ
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                  Δεν βρέθηκαν κρατήσεις
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status)
                return (
                  <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{booking.id.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.property?.titleGr || booking.propertyId}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.guestName || booking.guest?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.checkIn)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(booking.checkOut)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatPrice(booking.totalPrice, booking.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => onEditBooking?.(booking)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Επεξεργασία"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => onDeleteBooking?.(booking)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Διαγραφή"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
})

BookingsTable.displayName = 'BookingsTable'


'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, CheckCircle, XCircle, Clock, CreditCard, Phone, Mail, Users, Moon, BedDouble } from 'lucide-react'
import { bookingsApi, BookingQueryParams } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { EditBookingDialog } from './EditBookingDialog'
import { DeleteBookingDialog } from './DeleteBookingDialog'

interface BookingsTableProps {
  filters: BookingQueryParams
}

export function BookingsTable({ filters }: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editBooking, setEditBooking] = useState<Booking | null>(null)
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [filters])

  async function fetchBookings() {
    try {
      setLoading(true)
      const response = await bookingsApi.getAll({ limit: 50, ...filters })
      setBookings(response.data?.bookings || [])
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setLoading(false)
    }
  }
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-500/15 text-green-400'
      case 'PENDING':
        return 'bg-yellow-500/15 text-yellow-400'
      case 'COMPLETED':
        return 'bg-blue-500/15 text-blue-400'
      case 'CHECKED_IN':
        return 'bg-purple-500/15 text-purple-400'
      case 'CANCELLED':
        return 'bg-red-500/15 text-red-400'
      case 'NO_SHOW':
        return 'bg-slate-500/15 text-slate-400'
      default:
        return 'bg-slate-500/15 text-slate-400'
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/15 text-green-400'
      case 'PENDING':
        return 'bg-yellow-500/15 text-yellow-400'
      case 'FAILED':
        return 'bg-red-500/15 text-red-400'
      case 'REFUNDED':
      case 'PARTIALLY_REFUNDED':
        return 'bg-orange-500/15 text-orange-400'
      default:
        return 'bg-slate-500/15 text-slate-400'
    }
  }

  const getPaymentStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'Πληρωμένη'
      case 'PENDING':
        return 'Εκκρεμεί'
      case 'FAILED':
        return 'Απέτυχε'
      case 'REFUNDED':
        return 'Επιστροφή'
      case 'PARTIALLY_REFUNDED':
        return 'Μερική Επιστ.'
      default:
        return status
    }
  }

  const getNights = (checkIn: string, checkOut: string) => {
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-6 text-center">
          <p className="text-slate-400">Φόρτωση κρατήσεων...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/50 border-b border-slate-700">
            <tr>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Κράτηση
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Επισκέπτης
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Δωμάτιο / Ακίνητο
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ημερομηνίες
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Σύνολο
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Κατάσταση
              </th>
              <th className="px-4 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                Πληρωμή
              </th>
              <th className="px-4 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">
                Ενέργειες
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400 text-lg">
                  Δεν βρέθηκαν κρατήσεις
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status)
                const nights = getNights(booking.checkIn, booking.checkOut)
                const phone = booking.guestPhone || booking.guest?.phone
                const email = booking.guestEmail || booking.guest?.email
                return (
                  <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-100">#{booking.id.slice(-6)}</span>
                      <div className="text-xs text-slate-500 mt-0.5">{formatDate(booking.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-100">{booking.guestName || booking.guest?.name || '-'}</div>
                      {phone && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-slate-400">
                          <Phone className="h-3 w-3" />
                          <span>{phone}</span>
                        </div>
                      )}
                      {email && (
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400">
                          <Mail className="h-3 w-3" />
                          <span className="truncate max-w-[180px]">{email}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {booking.roomName && (
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-100">
                          <BedDouble className="h-3.5 w-3.5 text-amber-400" />
                          <span>{booking.roomName}</span>
                        </div>
                      )}
                      <div className={`text-xs text-slate-400 ${booking.roomName ? 'mt-0.5' : ''}`}>
                        {booking.property?.titleGr || booking.propertyId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-200">
                        {formatDate(booking.checkIn)} — {formatDate(booking.checkOut)}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1">
                          <Moon className="h-3 w-3" />
                          {nights} {nights === 1 ? 'βράδυ' : 'βράδια'}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {booking.guests} {booking.guests === 1 ? 'άτομο' : 'άτομα'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-100">
                        {formatPrice(booking.totalPrice, booking.currency)}
                      </div>
                      {booking.source && booking.source !== 'DIRECT' && (
                        <div className="text-xs text-slate-500 mt-0.5">{booking.source}</div>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg ${getStatusColor(booking.status)}`}>
                        <StatusIcon className="h-3.5 w-3.5 mr-1" />
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        <CreditCard className="h-3.5 w-3.5 mr-1" />
                        {getPaymentStatusLabel(booking.paymentStatus)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditBooking(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg transition-colors"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Επεξ.</span>
                        </button>
                        <button
                          onClick={() => setDeleteBooking(booking)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-400 bg-red-500/15 hover:bg-red-500/25 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Διαγρ.</span>
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

      {editBooking && (
        <EditBookingDialog
          booking={editBooking}
          isOpen={true}
          onClose={() => setEditBooking(null)}
          onSaved={() => fetchBookings()}
        />
      )}

      {deleteBooking && (
        <DeleteBookingDialog
          booking={deleteBooking}
          isOpen={true}
          onClose={() => setDeleteBooking(null)}
          onDeleted={() => fetchBookings()}
        />
      )}
    </div>
  )
}


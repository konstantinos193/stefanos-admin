'use client'

import { useEffect, useState } from 'react'
import { Edit, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true)
        const response = await bookingsApi.getAll({ limit: 50 })
        setBookings(response.data?.bookings || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])
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
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                ID Κράτησης
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Ακίνητο
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Επισκέπτης
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Άφιξη
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Αναχώρηση
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Σύνολο
              </th>
              <th className="px-6 py-4 text-left text-sm font-bold text-slate-400 uppercase tracking-wider">
                Κατάσταση
              </th>
              <th className="px-6 py-4 text-right text-sm font-bold text-slate-400 uppercase tracking-wider">
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
                return (
                  <tr key={booking.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="text-base font-semibold text-slate-100">#{booking.id.slice(-6)}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-base font-medium text-slate-100">
                        {booking.property?.titleGr || booking.propertyId}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base text-slate-200">{booking.guestName || booking.guest?.name || '-'}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base text-slate-200">{formatDate(booking.checkIn)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base text-slate-200">{formatDate(booking.checkOut)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-base font-bold text-slate-100">
                        {formatPrice(booking.totalPrice, booking.currency)}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1.5 inline-flex items-center text-sm font-semibold rounded-lg ${getStatusColor(booking.status)}`}>
                        <StatusIcon className="h-4 w-4 mr-1.5" />
                        {getStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg transition-colors">
                          <Edit className="h-4 w-4" />
                          <span>Επεξ.</span>
                        </button>
                        <button className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-400 bg-red-500/15 hover:bg-red-500/25 rounded-lg transition-colors">
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
    </div>
  )
}


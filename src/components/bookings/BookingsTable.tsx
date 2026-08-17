'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  CheckCircle, XCircle, Clock, CreditCard,
  Phone, Users, Moon, BedDouble,
  LogIn, LogOut, BanknoteIcon,
  MoreHorizontal, Edit, Trash2, X, AlertTriangle,
} from 'lucide-react'
import { bookingsApi, BookingQueryParams } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { countNights, formatMoney, formatShortDate } from '@/lib/bookings/booking-format'
import { getPaymentStatusPresentation, getRoomLabel, getStatusPresentation } from '@/lib/bookings/booking-labels'
import { EditBookingDialog } from './EditBookingDialog'
import { DeleteBookingDialog } from './DeleteBookingDialog'

interface BookingsTableProps {
  filters: BookingQueryParams
  onRefreshReady?: (fn: () => void) => void
}

type ActionType = 'cancel' | 'mark-paid' | 'check-in' | 'check-out'

interface PendingAction {
  type: ActionType
  booking: Booking
  reason?: string
  notes?: string
}

interface MenuState {
  id: string
  top: number
  right: number
}

export function BookingsTable({ filters, onRefreshReady }: BookingsTableProps) {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editBooking, setEditBooking] = useState<Booking | null>(null)
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [menu, setMenu] = useState<MenuState | null>(null)

  useEffect(() => { fetchBookings() }, [filters])
  useEffect(() => { onRefreshReady?.(fetchBookings) }, [])

  // Close overflow menu on any outside click
  useEffect(() => {
    if (!menu) return
    function handleClick() { setMenu(null) }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [menu])

  async function fetchBookings() {
    try {
      setLoading(true)
      const response = await bookingsApi.getAll({ limit: 50, ...filters })
      setBookings(response.data?.bookings || [])
    } catch { setBookings([]) } finally { setLoading(false) }
  }

  function openMenuAt(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setMenu({ id, top: rect.bottom + 4, right: window.innerWidth - rect.right })
  }

  function openAction(e: React.MouseEvent, type: ActionType, booking: Booking) {
    e.stopPropagation()
    setMenu(null)
    setPending({ type, booking })
    setActionError(null)
  }

  async function confirmAction() {
    if (!pending) return
    setActionLoading(true)
    setActionError(null)
    try {
      if (pending.type === 'cancel')     await bookingsApi.cancel(pending.booking.id, pending.reason)
      if (pending.type === 'mark-paid')  await bookingsApi.markAsPaid(pending.booking.id)
      if (pending.type === 'check-in')   await bookingsApi.checkIn(pending.booking.id, pending.notes)
      if (pending.type === 'check-out')  await bookingsApi.checkOut(pending.booking.id)
      setPending(null)
      await fetchBookings()
    } catch (e: any) {
      setActionError(e?.message || 'Σφάλμα. Δοκιμάστε ξανά.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="space-y-3 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="card p-0 overflow-hidden">
        {actionError && (
          <div className="px-4 md:px-6 py-3 bg-red-500/10 border-b border-red-500/30 text-red-400 text-sm">
            {actionError}
          </div>
        )}

        {/* Mobile Card Layout */}
        <div className="md:hidden space-y-3 p-3 overflow-x-hidden">
          {bookings.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-base">
              Δεν βρέθηκαν κρατήσεις
            </div>
          ) : (
            bookings.map((b) => {
              const n = countNights(b.checkIn, b.checkOut)
              const phone = b.guestPhone || b.guest?.phone
              const canCancel    = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status)
              const canMarkPaid  = b.paymentStatus !== 'COMPLETED' && !['CANCELLED', 'NO_SHOW'].includes(b.status)
              const canCheckIn   = b.status === 'CONFIRMED'
              const canCheckOut  = b.status === 'CHECKED_IN'

              return (
                <div
                  key={b.id}
                  onClick={() => router.push(`/bookings/${b.id}`)}
                  className="bg-slate-800/40 rounded-xl p-3 space-y-3 border border-slate-700/50 cursor-pointer hover:bg-slate-800/60 transition-colors w-full"
                >
                  {/* Guest & Status */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-slate-100 truncate">
                        {b.guestName || b.guest?.name || '—'}
                      </p>
                      {phone && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-slate-400">
                          <Phone className="h-3 w-3" />
                          <span className="truncate">{phone}</span>
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-1">#{b.id.slice(-6)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-lg ${getStatusPresentation(b.status).chip} flex-shrink-0`}>
                      {b.status === 'CONFIRMED' || b.status === 'COMPLETED'
                        ? <CheckCircle className="h-3 w-3" />
                        : <Clock className="h-3 w-3" />
                      }
                      {getStatusPresentation(b.status).label}
                    </span>
                  </div>

                  {/* Property & Room */}
                  <div>
                    {b.roomName && (
                      <div className="flex items-center gap-1 text-sm font-semibold text-slate-100">
                        <BedDouble className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{getRoomLabel(b.roomName)}</span>
                      </div>
                    )}
                    <p className={`text-sm text-slate-400 ${b.roomName ? 'mt-1' : ''} truncate`}>
                      {b.property?.titleGr || b.propertyId}
                </p>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Άφιξη</p>
                      <p className="text-slate-200 truncate">{formatShortDate(b.checkIn)}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Αναχώρηση</p>
                      <p className="text-slate-200 truncate">{formatShortDate(b.checkOut)}</p>
                    </div>
                  </div>

                  {/* Price & Payment */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                    <div className="min-w-0">
                      <p className="text-base font-bold text-slate-100 truncate">
                        {formatMoney(b.totalPrice, b.currency)}
                      </p>
                      <span className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 text-xs font-semibold rounded-lg ${getPaymentStatusPresentation(b.paymentStatus).chip}`}>
                        <CreditCard className="h-3 w-3" />
                        {getPaymentStatusPresentation(b.paymentStatus).label}
                      </span>
                    </div>
                    <div
                      className="flex items-center gap-1 flex-shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Primary action */}
                      {canCheckIn && (
                        <button
                          onClick={(e) => openAction(e, 'check-in', b)}
                          className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                        >
                          <LogIn className="h-4 w-4" />
                        </button>
                      )}
                      {canCheckOut && (
                        <button
                          onClick={(e) => openAction(e, 'check-out', b)}
                          className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                        </button>
                      )}
                      {!canCheckIn && !canCheckOut && canMarkPaid && (
                        <button
                          onClick={(e) => openAction(e, 'mark-paid', b)}
                          className="flex items-center gap-1 px-2 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                        >
                          <BanknoteIcon className="h-4 w-4" />
                        </button>
                      )}

                      {/* Overflow menu */}
                      <button
                        onClick={(e) => openMenuAt(e, b.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Desktop Table Layout */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/60 border-b border-slate-700">
              <tr>
                {[
                  'Επισκέπτης',
                  'Ακίνητο / Δωμάτιο',
                  'Ημερομηνίες',
                  'Σύνολο',
                  'Κατάσταση',
                  'Ενέργεια',
                ].map((h, i) => (
                  <th
                    key={h}
                    className={`px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${i === 5 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400 text-base">
                    Δεν βρέθηκαν κρατήσεις
                  </td>
                </tr>
              ) : (
                bookings.map((b) => {
                  const n = countNights(b.checkIn, b.checkOut)
                  const phone = b.guestPhone || b.guest?.phone
                  const canCancel    = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status)
                  const canMarkPaid  = b.paymentStatus !== 'COMPLETED' && !['CANCELLED', 'NO_SHOW'].includes(b.status)
                  const canCheckIn   = b.status === 'CONFIRMED'
                  const canCheckOut  = b.status === 'CHECKED_IN'

                  return (
                    <tr
                      key={b.id}
                      onClick={() => router.push(`/bookings/${b.id}`)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      {/* Guest */}
                      <td className="px-5 py-5">
                        <p className="text-base font-semibold text-slate-100">
                          {b.guestName || b.guest?.name || '—'}
                        </p>
                        {phone && (
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-slate-400">
                            <Phone className="h-3.5 w-3.5" />
                            {phone}
                          </div>
                        )}
                        <p className="text-xs text-slate-600 mt-1">#{b.id.slice(-6)}</p>
                      </td>

                      {/* Property / Room */}
                      <td className="px-5 py-5">
                        {b.roomName && (
                          <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-100">
                            <BedDouble className="h-4 w-4 text-amber-400 shrink-0" />
                            {getRoomLabel(b.roomName)}
                          </div>
                        )}
                        <p className={`text-sm text-slate-400 ${b.roomName ? 'mt-1' : ''}`}>
                          {b.property?.titleGr || b.propertyId}
                        </p>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <p className="text-sm font-medium text-slate-200">
                          {formatShortDate(b.checkIn)}
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          {formatShortDate(b.checkOut)}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Moon className="h-3 w-3" />
                            {n} {n === 1 ? 'βράδυ' : 'βράδια'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {b.guests}
                          </span>
                        </div>
                      </td>

                      {/* Price + Payment */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <p className="text-base font-bold text-slate-100">
                          {formatMoney(b.totalPrice, b.currency)}
                        </p>
                        <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-1 text-xs font-semibold rounded-lg ${getPaymentStatusPresentation(b.paymentStatus).chip}`}>
                          <CreditCard className="h-3 w-3" />
                          {getPaymentStatusPresentation(b.paymentStatus).label}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl ${getStatusPresentation(b.status).chip}`}>
                          {b.status === 'CONFIRMED' || b.status === 'COMPLETED'
                            ? <CheckCircle className="h-4 w-4" />
                            : <Clock className="h-4 w-4" />
                          }
                          {getStatusPresentation(b.status).label}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-5 py-5 whitespace-nowrap">
                        <div
                          className="flex items-center justify-end gap-2"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {/* Primary action */}
                          {canCheckIn && (
                            <button
                              onClick={(e) => openAction(e, 'check-in', b)}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                            >
                              <LogIn className="h-4 w-4" />
                              Check-in
                            </button>
                          )}
                          {canCheckOut && (
                            <button
                              onClick={(e) => openAction(e, 'check-out', b)}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              Check-out
                            </button>
                          )}
                          {!canCheckIn && !canCheckOut && canMarkPaid && (
                            <button
                              onClick={(e) => openAction(e, 'mark-paid', b)}
                              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
                            >
                              <BanknoteIcon className="h-4 w-4" />
                              Πληρωμή
                            </button>
                          )}

                          {/* Overflow menu */}
                          <div className="relative">
                            <button
                              onClick={(e) => openMenuAt(e, b.id)}
                              className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors"
                              title="Περισσότερες ενέργειες"
                            >
                              <MoreHorizontal className="h-5 w-5" />
                            </button>
                          </div>
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

      {/* Overflow dropdown (fixed positioned to avoid table overflow clipping) */}
      {menu && (
        <div
          style={{ position: 'fixed', top: menu.top, right: menu.right, zIndex: 9999 }}
          className="bg-slate-800 border border-slate-700/60 rounded-xl shadow-2xl py-1.5 min-w-45"
          onClick={(e) => e.stopPropagation()}
        >
          {(() => {
            const b = bookings.find((x) => x.id === menu.id)
            if (!b) return null
            const canCancel   = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status)
            return (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setEditBooking(b); setMenu(null) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors"
                >
                  <Edit className="h-4 w-4 text-blue-400" />
                  Επεξεργασία
                </button>
                {canCancel && (
                  <button
                    onClick={(e) => openAction(e, 'cancel', b)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors"
                  >
                    <XCircle className="h-4 w-4 text-red-400" />
                    Ακύρωση
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteBooking(b); setMenu(null) }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Διαγραφή
                </button>
              </>
            )
          })()}
        </div>
      )}

      {/* Confirmation Modal */}
      {pending && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-100">
                {pending.type === 'cancel'    && 'Ακύρωση Κράτησης'}
                {pending.type === 'mark-paid' && 'Επιβεβαίωση Πληρωμής'}
                {pending.type === 'check-in'  && 'Check-in Επισκέπτη'}
                {pending.type === 'check-out' && 'Check-out Επισκέπτη'}
              </h3>
              <button onClick={() => setPending(null)} className="text-slate-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-800 rounded-xl p-4 space-y-1.5">
                <p className="text-base font-semibold text-slate-100">{pending.booking.guestName || pending.booking.guest?.name}</p>
                <p className="text-sm text-slate-400">
                  {pending.booking.property?.titleGr}
                  {pending.booking.roomName ? ` — ${getRoomLabel(pending.booking.roomName)}` : ''}
                </p>
                <p className="text-sm text-slate-400">
                  {formatShortDate(pending.booking.checkIn)} → {formatShortDate(pending.booking.checkOut)}
                </p>
                <p className="text-base font-bold text-slate-100">
                  {formatMoney(pending.booking.totalPrice, pending.booking.currency)}
                </p>
              </div>

              {pending.type === 'cancel' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Λόγος ακύρωσης (προαιρετικό)
                  </label>
                  <input
                    type="text"
                    value={pending.reason || ''}
                    onChange={(e) => setPending({ ...pending, reason: e.target.value })}
                    placeholder="π.χ. Αίτημα επισκέπτη"
                    className="input w-full"
                  />
                  <div className="flex items-start gap-2 mt-3 p-3 bg-amber-900/20 border border-amber-800/40 rounded-xl">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-300">
                      Η επιστροφή χρημάτων θα υπολογιστεί αυτόματα βάσει πολιτικής ακύρωσης.
                    </p>
                  </div>
                </div>
              )}

              {pending.type === 'mark-paid' && (
                <div className="flex items-start gap-2 p-3 bg-green-900/20 border border-green-800/40 rounded-xl">
                  <BanknoteIcon className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-green-300">
                    Θα δημιουργηθεί εγγραφή πληρωμής {formatMoney(pending.booking.totalPrice, pending.booking.currency)} και η κράτηση θα επιβεβαιωθεί.
                  </p>
                </div>
              )}

              {pending.type === 'check-in' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Σημειώσεις παράδοσης κλειδιών
                  </label>
                  <textarea
                    rows={3}
                    value={pending.notes || ''}
                    onChange={(e) => setPending({ ...pending, notes: e.target.value })}
                    placeholder="π.χ. Κλειδί διαμερίσματος 12, θυρίδα 3"
                    className="input w-full resize-none"
                  />
                </div>
              )}

              {pending.type === 'check-out' && (
                <div className="flex items-start gap-2 p-3 bg-purple-900/20 border border-purple-800/40 rounded-xl">
                  <LogOut className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-300">
                    Η κράτηση θα επισημανθεί ως ΟΛΟΚΛΗΡΩΜΕΝΗ και θα δημιουργηθεί πρόγραμμα καθαρισμού.
                  </p>
                </div>
              )}

              {actionError && <p className="text-sm text-red-400">{actionError}</p>}
            </div>

            <div className="p-6 border-t border-slate-700 flex justify-end gap-3">
              <button onClick={() => setPending(null)} className="btn btn-secondary" disabled={actionLoading}>
                Κλείσιμο
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`btn px-6 py-2.5 text-sm font-semibold rounded-xl text-white transition-colors ${
                  pending.type === 'cancel'
                    ? 'bg-red-600 hover:bg-red-700'
                    : pending.type === 'check-in'
                    ? 'bg-emerald-600 hover:bg-emerald-700'
                    : pending.type === 'check-out'
                    ? 'bg-purple-600 hover:bg-purple-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {actionLoading ? 'Επεξεργασία...' : (
                  pending.type === 'cancel'    ? 'Ακύρωση & Επιστροφή' :
                  pending.type === 'mark-paid' ? 'Επιβεβαίωση Πληρωμής' :
                  pending.type === 'check-in'  ? 'Επιβεβαίωση Check-in' :
                  'Επιβεβαίωση Check-out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {editBooking && (
        <EditBookingDialog booking={editBooking} isOpen onClose={() => setEditBooking(null)} onSaved={fetchBookings} />
      )}
      {deleteBooking && (
        <DeleteBookingDialog booking={deleteBooking} isOpen onClose={() => setDeleteBooking(null)} onDeleted={fetchBookings} />
      )}
    </>
  )
}

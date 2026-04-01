'use client'

import { useEffect, useState } from 'react'
import {
  Edit, Trash2, CheckCircle, XCircle, Clock, CreditCard,
  Phone, Mail, Users, Moon, BedDouble, DoorOpen, X, AlertTriangle,
  LogIn, LogOut, BanknoteIcon,
} from 'lucide-react'
import { bookingsApi, BookingQueryParams } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
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

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED: 'bg-green-500/15 text-green-400',
  PENDING: 'bg-yellow-500/15 text-yellow-400',
  COMPLETED: 'bg-blue-500/15 text-blue-400',
  CHECKED_IN: 'bg-purple-500/15 text-purple-400',
  CANCELLED: 'bg-red-500/15 text-red-400',
  NO_SHOW: 'bg-slate-500/15 text-slate-400',
}
const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Επιβεβαιωμένη', PENDING: 'Σε Αναμονή', COMPLETED: 'Ολοκληρωμένη',
  CHECKED_IN: 'Check-in', CANCELLED: 'Ακυρωμένη', NO_SHOW: 'Απουσία',
}
const PAY_COLOR: Record<string, string> = {
  COMPLETED: 'bg-green-500/15 text-green-400',
  PENDING: 'bg-yellow-500/15 text-yellow-400',
  FAILED: 'bg-red-500/15 text-red-400',
  REFUNDED: 'bg-orange-500/15 text-orange-400',
  PARTIALLY_REFUNDED: 'bg-orange-500/15 text-orange-400',
}
const PAY_LABEL: Record<string, string> = {
  COMPLETED: 'Πληρωμένη', PENDING: 'Εκκρεμεί', FAILED: 'Απέτυχε',
  REFUNDED: 'Επιστροφή', PARTIALLY_REFUNDED: 'Μερική Επιστ.',
}

function formatDate(d: string) { return new Date(d).toLocaleDateString('el-GR') }
function formatPrice(p: number, c = 'EUR') {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: c, minimumFractionDigits: 0 }).format(p)
}
function nights(ci: string, co: string) {
  return Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000)
}

// Convert English room names to Greek for display
function getGreekRoomName(roomName: string | null | undefined): string {
  if (!roomName) return ''
  
  const nameMap: Record<string, string> = {
    'Apartment 01 - Ground Level': 'Διαμέρισμα 01 – Ισόγειο',
    'Apartment 02 - Ground Level': 'Διαμέρισμα 02 – Ισόγειο',
    'Apartment 03 - First Floor': 'Διαμέρισμα 03 – Πρώτος Όροφος',
    'Apartment 04 - First Floor': 'Διαμέρισμα 04 – Πρώτος Όροφος',
    'Apartment 05 - First Floor': 'Διαμέρισμα 05 – Πρώτος Όροφος',
    'Apartment 06 - Second Floor': 'Διαμέρισμα 06 – Δεύτερος Όροφος',
    'Apartment 07 - Second Floor': 'Διαμέρισμα 07 – Δεύτερος Όροφος',
    'Apartment 08 - Second Floor': 'Διαμέρισμα 08 – Δεύτερος Όροφος',
    'Apartment 09 - Third Floor': 'Διαμέρισμα 09 – Τρίτος Όροφος',
    'Apartment 10 - Third Floor': 'Διαμέρισμα 10 – Τρίτος Όροφος',
  }
  
  return nameMap[roomName] || roomName
}

export function BookingsTable({ filters, onRefreshReady }: BookingsTableProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [editBooking, setEditBooking] = useState<Booking | null>(null)
  const [deleteBooking, setDeleteBooking] = useState<Booking | null>(null)
  const [pending, setPending] = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [editingPrice, setEditingPrice] = useState<string | null>(null)
  const [tempPrice, setTempPrice] = useState<string>('')

  useEffect(() => { fetchBookings() }, [filters])
  useEffect(() => { onRefreshReady?.(fetchBookings) }, [])

  async function fetchBookings() {
    try {
      setLoading(true)
      const response = await bookingsApi.getAll({ limit: 50, ...filters })
      setBookings(response.data?.bookings || [])
    } catch { setBookings([]) } finally { setLoading(false) }
  }

  async function updatePrice(bookingId: string, newPrice: number) {
    try {
      await bookingsApi.update(bookingId, { totalPrice: newPrice, basePrice: newPrice } as Partial<Booking>)
      await fetchBookings()
      setEditingPrice(null)
      setTempPrice('')
    } catch (e: any) {
      setActionError(e?.message || 'Σφάλμα κατά την ενημέρωση τιμής')
    }
  }

  function startPriceEdit(booking: Booking) {
    setEditingPrice(booking.id)
    setTempPrice(booking.totalPrice.toString())
    setActionError(null)
  }

  function savePriceEdit(bookingId: string) {
    const price = parseFloat(tempPrice)
    if (!isNaN(price) && price > 0) {
      updatePrice(bookingId, price)
    } else {
      setActionError('Μη έγκυρη τιμή')
    }
  }

  function cancelPriceEdit() {
    setEditingPrice(null)
    setTempPrice('')
    setActionError(null)
  }

  function openAction(type: ActionType, booking: Booking) {
    setPending({ type, booking })
    setActionError(null)
  }

  async function confirmAction() {
    if (!pending) return
    setActionLoading(true)
    setActionError(null)
    try {
      if (pending.type === 'cancel') {
        await bookingsApi.cancel(pending.booking.id, pending.reason)
      } else if (pending.type === 'mark-paid') {
        await bookingsApi.markAsPaid(pending.booking.id)
      } else if (pending.type === 'check-in') {
        await bookingsApi.checkIn(pending.booking.id, pending.notes)
      } else if (pending.type === 'check-out') {
        await bookingsApi.checkOut(pending.booking.id)
      }
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
      <div className="card overflow-hidden">
        <div className="p-6 text-center"><p className="text-slate-400">Φόρτωση κρατήσεων...</p></div>
      </div>
    )
  }

  return (
    <>
      <div className="card overflow-hidden">
        {actionError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {actionError}
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50 border-b border-slate-700">
              <tr>
                {['Κράτηση', 'Επισκέπτης', 'Διαμέρισμα / Ακίνητο', 'Ημερομηνίες', 'Σύνολο', 'Κατάσταση', 'Πληρωμή', 'Ενέργειες'].map((h, i) => (
                  <th key={h} className={`px-4 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider ${i === 7 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {bookings.length === 0 ? (
                <tr><td colSpan={8} className="px-6 py-12 text-center text-slate-400">Δεν βρέθηκαν κρατήσεις</td></tr>
              ) : bookings.map((b) => {
                const n = nights(b.checkIn, b.checkOut)
                const phone = b.guestPhone || b.guest?.phone
                const email = b.guestEmail || b.guest?.email
                const canCancel = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(b.status)
                const canMarkPaid = b.paymentStatus !== 'COMPLETED' && !['CANCELLED', 'NO_SHOW'].includes(b.status)
                const canCheckIn = b.status === 'CONFIRMED'
                const canCheckOut = b.status === 'CHECKED_IN'

                return (
                  <tr key={b.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-slate-100">#{b.id.slice(-6)}</span>
                      <div className="text-xs text-slate-500 mt-0.5">{formatDate(b.createdAt)}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-slate-100">{b.guestName || b.guest?.name || '-'}</div>
                      {phone && <div className="flex items-center gap-1 mt-1 text-xs text-slate-400"><Phone className="h-3 w-3" />{phone}</div>}
                      {email && <div className="flex items-center gap-1 mt-0.5 text-xs text-slate-400"><Mail className="h-3 w-3" /><span className="truncate max-w-[180px]">{email}</span></div>}
                    </td>
                    <td className="px-4 py-4">
                      {b.roomName && (
                        <div className="flex items-center gap-1 text-sm font-medium text-slate-100">
                          <BedDouble className="h-3.5 w-3.5 text-amber-400" />{getGreekRoomName(b.roomName)}
                        </div>
                      )}
                      <div className={`text-xs text-slate-400 ${b.roomName ? 'mt-0.5' : ''}`}>
                        {b.property?.titleGr || b.propertyId}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-200">{formatDate(b.checkIn)} — {formatDate(b.checkOut)}</div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1"><Moon className="h-3 w-3" />{n} {n === 1 ? 'βράδυ' : 'βράδια'}</span>
                        <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" />{b.guests}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {editingPrice === b.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(e.target.value)}
                            className="input text-sm w-24"
                            min="0"
                            step="0.01"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') savePriceEdit(b.id)
                              if (e.key === 'Escape') cancelPriceEdit()
                            }}
                            autoFocus
                          />
                          <button
                            onClick={() => savePriceEdit(b.id)}
                            className="text-green-400 hover:text-green-300"
                            title="Αποθήκευση"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          <button
                            onClick={cancelPriceEdit}
                            className="text-red-400 hover:text-red-300"
                            title="Ακύρωση"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div 
                          className="text-sm font-bold text-slate-100 cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() => startPriceEdit(b)}
                          title="Κάντε κλικ για να αλλάξετε την τιμή"
                        >
                          {formatPrice(b.totalPrice, b.currency)}
                        </div>
                      )}
                      {b.source && b.source !== 'DIRECT' && <div className="text-xs text-slate-500 mt-0.5">{b.source}</div>}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg ${STATUS_COLOR[b.status] || 'bg-slate-500/15 text-slate-400'}`}>
                        {b.status === 'CONFIRMED' || b.status === 'COMPLETED' ? <CheckCircle className="h-3.5 w-3.5 mr-1" /> : <Clock className="h-3.5 w-3.5 mr-1" />}
                        {STATUS_LABEL[b.status] || b.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex items-center text-xs font-semibold rounded-lg ${PAY_COLOR[b.paymentStatus] || 'bg-slate-500/15 text-slate-400'}`}>
                        <CreditCard className="h-3.5 w-3.5 mr-1" />
                        {PAY_LABEL[b.paymentStatus] || b.paymentStatus}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 flex-wrap">
                        {canCheckIn && (
                          <button onClick={() => openAction('check-in', b)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/15 hover:bg-emerald-500/25 rounded-lg transition-colors">
                            <LogIn className="h-3.5 w-3.5" /> Check-in
                          </button>
                        )}
                        {canCheckOut && (
                          <button onClick={() => openAction('check-out', b)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-purple-400 bg-purple-500/15 hover:bg-purple-500/25 rounded-lg transition-colors">
                            <LogOut className="h-3.5 w-3.5" /> Check-out
                          </button>
                        )}
                        {canMarkPaid && (
                          <button onClick={() => openAction('mark-paid', b)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-green-400 bg-green-500/15 hover:bg-green-500/25 rounded-lg transition-colors">
                            <BanknoteIcon className="h-3.5 w-3.5" /> Πληρωμή
                          </button>
                        )}
                        <button onClick={() => setEditBooking(b)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-blue-400 bg-blue-500/15 hover:bg-blue-500/25 rounded-lg transition-colors">
                          <Edit className="h-3.5 w-3.5" /> Επεξ.
                        </button>
                        {canCancel && (
                          <button onClick={() => openAction('cancel', b)}
                            className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-red-400 bg-red-500/15 hover:bg-red-500/25 rounded-lg transition-colors">
                            <XCircle className="h-3.5 w-3.5" /> Ακύρωση
                          </button>
                        )}
                        <button onClick={() => setDeleteBooking(b)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-400 bg-slate-500/15 hover:bg-slate-500/25 rounded-lg transition-colors">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {pending && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl">
            <div className="p-5 border-b border-slate-700 flex items-center justify-between">
              <h3 className="font-semibold text-slate-100">
                {pending.type === 'cancel' && 'Ακύρωση Κράτησης'}
                {pending.type === 'mark-paid' && 'Επιβεβαίωση Πληρωμής'}
                {pending.type === 'check-in' && 'Check-in Επισκέπτη'}
                {pending.type === 'check-out' && 'Check-out Επισκέπτη'}
              </h3>
              <button onClick={() => setPending(null)} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 space-y-4">
              <div className="bg-slate-800 rounded-lg p-3 text-sm space-y-1">
                <p className="text-slate-200 font-medium">{pending.booking.guestName || pending.booking.guest?.name}</p>
                <p className="text-slate-400">{pending.booking.property?.titleGr} {pending.booking.roomName ? `— ${pending.booking.roomName}` : ''}</p>
                <p className="text-slate-400">{formatDate(pending.booking.checkIn)} → {formatDate(pending.booking.checkOut)}</p>
                <p className="text-slate-300 font-semibold">{formatPrice(pending.booking.totalPrice, pending.booking.currency)}</p>
              </div>

              {pending.type === 'cancel' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Λόγος ακύρωσης (προαιρετικό)</label>
                  <input type="text" value={pending.reason || ''} onChange={(e) => setPending({ ...pending, reason: e.target.value })}
                    placeholder="π.χ. Αίτημα επισκέπτη"
                    className="input w-full text-sm" />
                  <div className="flex items-start gap-2 mt-3 p-3 bg-amber-900/20 border border-amber-800/40 rounded-lg">
                    <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-300">
                      Η επιστροφή χρημάτων θα υπολογιστεί αυτόματα βάσει της πολιτικής ακύρωσης και θα εκδοθεί μέσω Stripe.
                    </p>
                  </div>
                </div>
              )}

              {pending.type === 'mark-paid' && (
                <div className="flex items-start gap-2 p-3 bg-green-900/20 border border-green-800/40 rounded-lg">
                  <BanknoteIcon className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-green-300">
                    Θα δημιουργηθεί εγγραφή πληρωμής {formatPrice(pending.booking.totalPrice, pending.booking.currency)} (μεταφορά/μετρητά) και η κράτηση θα επιβεβαιωθεί.
                  </p>
                </div>
              )}

              {pending.type === 'check-in' && (
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Σημειώσεις παράδοσης κλειδιών</label>
                  <textarea rows={3} value={pending.notes || ''} onChange={(e) => setPending({ ...pending, notes: e.target.value })}
                    placeholder="π.χ. Κλειδί διαμερίσματος 12, θυρίδα 3"
                    className="input w-full text-sm resize-none" />
                </div>
              )}

              {pending.type === 'check-out' && (
                <div className="flex items-start gap-2 p-3 bg-purple-900/20 border border-purple-800/40 rounded-lg">
                  <LogOut className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-purple-300">
                    Η κράτηση θα επισημανθεί ως ΟΛΟΚΛΗΡΩΜΕΝΗ και θα δημιουργηθεί αυτόματα πρόγραμμα καθαρισμού.
                  </p>
                </div>
              )}

              {actionError && <p className="text-sm text-red-400">{actionError}</p>}
            </div>

            <div className="p-5 border-t border-slate-700 flex justify-end gap-3">
              <button onClick={() => setPending(null)} className="btn btn-secondary" disabled={actionLoading}>Ακύρωση</button>
              <button onClick={confirmAction} disabled={actionLoading}
                className={`btn ${pending.type === 'cancel' ? 'bg-red-600 hover:bg-red-700 text-white' : pending.type === 'check-in' ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : pending.type === 'check-out' ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'btn-primary'}`}>
                {actionLoading ? 'Επεξεργασία...' : (
                  pending.type === 'cancel' ? 'Ακύρωση & Επιστροφή' :
                  pending.type === 'mark-paid' ? 'Επιβεβαίωση Πληρωμής' :
                  pending.type === 'check-in' ? 'Επιβεβαίωση Check-in' :
                  'Επιβεβαίωση Check-out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {editBooking && (
        <EditBookingDialog booking={editBooking} isOpen={true} onClose={() => setEditBooking(null)} onSaved={fetchBookings} />
      )}
      {deleteBooking && (
        <DeleteBookingDialog booking={deleteBooking} isOpen={true} onClose={() => setDeleteBooking(null)} onDeleted={fetchBookings} />
      )}
    </>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Calendar, BedDouble, Users, Moon,
  Euro, CreditCard, Phone, Mail, MessageSquare,
  CheckCircle, Clock, LogIn, LogOut, BanknoteIcon,
  Edit, XCircle, Trash2, AlertTriangle, X,
} from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'
import { EditBookingDialog } from '@/components/bookings/EditBookingDialog'
import { DeleteBookingDialog } from '@/components/bookings/DeleteBookingDialog'

// ── Shared helpers ────────────────────────────────────────────────────────────

const STATUS_COLOR: Record<string, string> = {
  CONFIRMED:  'bg-green-500/15 text-green-400 border border-green-500/20',
  PENDING:    'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20',
  COMPLETED:  'bg-blue-500/15 text-blue-400 border border-blue-500/20',
  CHECKED_IN: 'bg-purple-500/15 text-purple-400 border border-purple-500/20',
  CANCELLED:  'bg-red-500/15 text-red-400 border border-red-500/20',
  NO_SHOW:    'bg-slate-500/15 text-slate-400 border border-slate-500/20',
}
const STATUS_LABEL: Record<string, string> = {
  CONFIRMED: 'Επιβεβαιωμένη', PENDING: 'Σε Αναμονή', COMPLETED: 'Ολοκληρωμένη',
  CHECKED_IN: 'Check-in', CANCELLED: 'Ακυρωμένη', NO_SHOW: 'Απουσία',
}
const PAY_COLOR: Record<string, string> = {
  COMPLETED:          'bg-green-500/15 text-green-400',
  PENDING:            'bg-yellow-500/15 text-yellow-400',
  FAILED:             'bg-red-500/15 text-red-400',
  REFUNDED:           'bg-orange-500/15 text-orange-400',
  PARTIALLY_REFUNDED: 'bg-orange-500/15 text-orange-400',
}
const PAY_LABEL: Record<string, string> = {
  COMPLETED: 'Πληρωμένη', PENDING: 'Εκκρεμεί', FAILED: 'Απέτυχε',
  REFUNDED: 'Επιστροφή', PARTIALLY_REFUNDED: 'Μερική Επιστ.',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('el-GR', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatPrice(p: number, c = 'EUR') {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency', currency: c, minimumFractionDigits: 0,
  }).format(p)
}
function nights(ci: string, co: string) {
  return Math.ceil((new Date(co).getTime() - new Date(ci).getTime()) / 86400000)
}
function getGreekRoomName(name: string | null | undefined): string {
  if (!name) return ''
  const map: Record<string, string> = {
    'Apartment 01 - Ground Level': 'Διαμέρισμα 01 – Ισόγειο',
    'Apartment 02 - Ground Level': 'Διαμέρισμα 02 – Ισόγειο',
    'Apartment 03 - First Floor':  'Διαμέρισμα 03 – Α΄ Όροφος',
    'Apartment 04 - First Floor':  'Διαμέρισμα 04 – Α΄ Όροφος',
    'Apartment 05 - First Floor':  'Διαμέρισμα 05 – Α΄ Όροφος',
    'Apartment 06 - Second Floor': 'Διαμέρισμα 06 – Β΄ Όροφος',
    'Apartment 07 - Second Floor': 'Διαμέρισμα 07 – Β΄ Όροφος',
    'Apartment 08 - Second Floor': 'Διαμέρισμα 08 – Β΄ Όροφος',
    'Apartment 09 - Third Floor':  'Διαμέρισμα 09 – Γ΄ Όροφος',
    'Apartment 10 - Third Floor':  'Διαμέρισμα 10 – Γ΄ Όροφος',
  }
  return map[name] || name
}

// ── Page ──────────────────────────────────────────────────────────────────────

type ActionType = 'check-in' | 'check-out' | 'mark-paid' | 'cancel'

interface PendingAction {
  type: ActionType
  notes?: string
  reason?: string
}

export default function BookingDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const id      = params.id as string

  const [booking, setBooking]         = useState<Booking | null>(null)
  const [loading, setLoading]         = useState(true)
  const [editOpen, setEditOpen]       = useState(false)
  const [deleteOpen, setDeleteOpen]   = useState(false)
  const [pending, setPending]         = useState<PendingAction | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)

  async function fetchBooking() {
    try {
      setLoading(true)
      const res = await bookingsApi.getById(id)
      setBooking(res.data)
    } catch {
      setBooking(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBooking() }, [id])

  async function confirmAction() {
    if (!pending || !booking) return
    setActionLoading(true)
    setActionError(null)
    try {
      if (pending.type === 'cancel')    await bookingsApi.cancel(booking.id, pending.reason)
      if (pending.type === 'mark-paid') await bookingsApi.markAsPaid(booking.id)
      if (pending.type === 'check-in')  await bookingsApi.checkIn(booking.id, pending.notes)
      if (pending.type === 'check-out') await bookingsApi.checkOut(booking.id)
      setPending(null)
      await fetchBooking()
    } catch (e: any) {
      setActionError(e?.message || 'Σφάλμα. Δοκιμάστε ξανά.')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl">
        <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse" />
        <div className="card animate-pulse h-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card animate-pulse h-40" />
          ))}
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="card text-center py-16 max-w-lg mx-auto">
        <p className="text-slate-300 text-xl font-semibold mb-2">Η κράτηση δεν βρέθηκε</p>
        <p className="text-slate-500 mb-6">Το ID «{id}» δεν αντιστοιχεί σε κάποια κράτηση.</p>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Επιστροφή στις Κρατήσεις
        </Link>
      </div>
    )
  }

  const n           = nights(booking.checkIn, booking.checkOut)
  const canCheckIn  = booking.status === 'CONFIRMED'
  const canCheckOut = booking.status === 'CHECKED_IN'
  const canMarkPaid = booking.paymentStatus !== 'COMPLETED' && !['CANCELLED', 'NO_SHOW'].includes(booking.status)
  const canCancel   = !['CANCELLED', 'COMPLETED', 'NO_SHOW'].includes(booking.status)

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <Link
        href="/bookings"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-100 transition-colors text-base"
      >
        <ArrowLeft className="h-5 w-5" />
        Επιστροφή στις Κρατήσεις
      </Link>

      {/* Header card */}
      <div className="card">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500 mb-1 font-mono">#{booking.id.slice(-10)}</p>
            <h1 className="text-3xl font-bold text-slate-100">
              {booking.guestName || booking.guest?.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl ${STATUS_COLOR[booking.status] || 'bg-slate-500/15 text-slate-400'}`}>
                {booking.status === 'CONFIRMED' || booking.status === 'COMPLETED'
                  ? <CheckCircle className="h-4 w-4" />
                  : <Clock className="h-4 w-4" />
                }
                {STATUS_LABEL[booking.status] || booking.status}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl ${PAY_COLOR[booking.paymentStatus] || 'bg-slate-500/15 text-slate-400'}`}>
                <CreditCard className="h-4 w-4" />
                {PAY_LABEL[booking.paymentStatus] || booking.paymentStatus}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {canCheckIn && (
              <button
                onClick={() => setPending({ type: 'check-in' })}
                className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
              >
                <LogIn className="h-5 w-5" />
                Check-in
              </button>
            )}
            {canCheckOut && (
              <button
                onClick={() => setPending({ type: 'check-out' })}
                className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Check-out
              </button>
            )}
            {canMarkPaid && (
              <button
                onClick={() => setPending({ type: 'mark-paid' })}
                className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors"
              >
                <BanknoteIcon className="h-5 w-5" />
                Σήμανση Πληρωμένη
              </button>
            )}
            <button
              onClick={() => setEditOpen(true)}
              className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-slate-100 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
            >
              <Edit className="h-5 w-5" />
              Επεξεργασία
            </button>
            {canCancel && (
              <button
                onClick={() => setPending({ type: 'cancel' })}
                className="flex items-center gap-2 px-5 py-3 text-base font-semibold text-red-400 bg-red-500/15 hover:bg-red-500/25 rounded-xl transition-colors"
              >
                <XCircle className="h-5 w-5" />
                Ακύρωση
              </button>
            )}
            <button
              onClick={() => setDeleteOpen(true)}
              className="flex items-center gap-2 px-4 py-3 text-base font-semibold text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Διαγραφή κράτησης"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info grid — 4 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {/* Dates */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-blue-500/15 p-2 rounded-lg">
              <Calendar className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Ημερομηνίες</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Άφιξη</p>
              <p className="text-base font-semibold text-slate-100">{formatDate(booking.checkIn)}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Αναχώρηση</p>
              <p className="text-base font-semibold text-slate-100">{formatDate(booking.checkOut)}</p>
            </div>
            <div className="flex items-center gap-4 pt-3 border-t border-slate-700/50">
              <span className="flex items-center gap-1.5 text-sm text-slate-300">
                <Moon className="h-4 w-4 text-slate-400" />
                {n} {n === 1 ? 'βράδυ' : 'βράδια'}
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-300">
                <Users className="h-4 w-4 text-slate-400" />
                {booking.guests} {booking.guests === 1 ? 'επισκέπτης' : 'επισκέπτες'}
              </span>
            </div>
          </div>
        </div>

        {/* Property */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-amber-500/15 p-2 rounded-lg">
              <BedDouble className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Ακίνητο</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Ακίνητο</p>
              <p className="text-base font-semibold text-slate-100">
                {booking.property?.titleGr || booking.property?.titleEn || '—'}
              </p>
            </div>
            {booking.roomName && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Δωμάτιο</p>
                <p className="text-base font-semibold text-slate-100">{getGreekRoomName(booking.roomName)}</p>
              </div>
            )}
            {booking.source && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Πηγή</p>
                <p className="text-sm text-slate-300">{booking.source}</p>
              </div>
            )}
          </div>
        </div>

        {/* Financial */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-emerald-500/15 p-2 rounded-lg">
              <Euro className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Οικονομικά</h3>
          </div>
          <div className="space-y-2.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Βασική τιμή</span>
              <span className="text-slate-200 font-medium">{formatPrice(booking.basePrice, booking.currency)}</span>
            </div>
            {!!booking.cleaningFee && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Καθαρισμός</span>
                <span className="text-slate-200">{formatPrice(booking.cleaningFee, booking.currency)}</span>
              </div>
            )}
            {!!booking.serviceFee && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Υπηρεσίες</span>
                <span className="text-slate-200">{formatPrice(booking.serviceFee, booking.currency)}</span>
              </div>
            )}
            {!!booking.taxes && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Φόροι</span>
                <span className="text-slate-200">{formatPrice(booking.taxes, booking.currency)}</span>
              </div>
            )}
            <div className="flex justify-between pt-3 border-t border-slate-700/50">
              <span className="text-base font-bold text-slate-100">Σύνολο</span>
              <span className="text-base font-bold text-emerald-400">
                {formatPrice(booking.totalPrice, booking.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <div className="bg-sky-500/15 p-2 rounded-lg">
              <Phone className="h-5 w-5 text-sky-400" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Επικοινωνία</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Τηλέφωνο</p>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                <p className="text-base font-semibold text-slate-100">
                  {booking.guestPhone || booking.guest?.phone || '—'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                <p className="text-sm text-slate-200 break-all">
                  {booking.guestEmail || booking.guest?.email || '—'}
                </p>
              </div>
            </div>
            {booking.specialRequests && (
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Ειδικές Απαιτήσεις
                </p>
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 text-slate-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-300">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <p className="text-sm text-slate-600">
        Δημιουργήθηκε: {formatDate(booking.createdAt)}
        {' · '}
        Ενημερώθηκε: {formatDate(booking.updatedAt)}
      </p>

      {/* ── Confirmation modal ─────────────────────────────────────────────── */}
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
                <p className="text-base font-semibold text-slate-100">
                  {booking.guestName || booking.guest?.name}
                </p>
                <p className="text-sm text-slate-400">
                  {booking.property?.titleGr}
                  {booking.roomName ? ` — ${getGreekRoomName(booking.roomName)}` : ''}
                </p>
                <p className="text-sm text-slate-400">
                  {formatDate(booking.checkIn)} → {formatDate(booking.checkOut)}
                </p>
                <p className="text-base font-bold text-slate-100">
                  {formatPrice(booking.totalPrice, booking.currency)}
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
                    Θα δημιουργηθεί εγγραφή πληρωμής{' '}
                    {formatPrice(booking.totalPrice, booking.currency)} και η κράτηση θα επιβεβαιωθεί.
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
              <button
                onClick={() => setPending(null)}
                className="btn btn-secondary"
                disabled={actionLoading}
              >
                Κλείσιμο
              </button>
              <button
                onClick={confirmAction}
                disabled={actionLoading}
                className={`flex items-center gap-2 px-6 py-2.5 text-base font-semibold rounded-xl text-white transition-colors ${
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
                  pending.type === 'cancel'    ? 'Ακύρωση & Επιστροφή'    :
                  pending.type === 'mark-paid' ? 'Επιβεβαίωση Πληρωμής'  :
                  pending.type === 'check-in'  ? 'Επιβεβαίωση Check-in'  :
                  'Επιβεβαίωση Check-out'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {editOpen && (
        <EditBookingDialog
          booking={booking}
          isOpen
          onClose={() => setEditOpen(false)}
          onSaved={fetchBooking}
        />
      )}
      {deleteOpen && (
        <DeleteBookingDialog
          booking={booking}
          isOpen
          onClose={() => setDeleteOpen(false)}
          onDeleted={() => router.push('/bookings')}
        />
      )}
    </div>
  )
}

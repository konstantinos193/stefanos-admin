'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'

interface EditBookingDialogProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onSaved: () => void
}

const statusOptions: { value: Booking['status']; label: string }[] = [
  { value: 'PENDING', label: 'Σε Αναμονή' },
  { value: 'CONFIRMED', label: 'Επιβεβαιωμένη' },
  { value: 'CHECKED_IN', label: 'Check-in' },
  { value: 'COMPLETED', label: 'Ολοκληρωμένη' },
  { value: 'CANCELLED', label: 'Ακυρωμένη' },
  { value: 'NO_SHOW', label: 'Απουσία' },
]

const paymentStatusOptions: { value: Booking['paymentStatus']; label: string }[] = [
  { value: 'PENDING', label: 'Εκκρεμεί' },
  { value: 'COMPLETED', label: 'Πληρωμένη' },
  { value: 'FAILED', label: 'Απέτυχε' },
  { value: 'REFUNDED', label: 'Επιστροφή' },
  { value: 'PARTIALLY_REFUNDED', label: 'Μερική Επιστροφή' },
]

export function EditBookingDialog({ booking, isOpen, onClose, onSaved }: EditBookingDialogProps) {
  const [status, setStatus] = useState<Booking['status']>(booking.status)
  const [paymentStatus, setPaymentStatus] = useState<Booking['paymentStatus']>(booking.paymentStatus)
  const [specialRequests, setSpecialRequests] = useState(booking.specialRequests || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSaving(true)

    try {
      await bookingsApi.update(booking.id, {
        status,
        paymentStatus,
        specialRequests: specialRequests || undefined,
      } as Partial<Booking>)
      onSaved()
      onClose()
    } catch (err: any) {
      console.error('Error updating booking:', err)
      setError(err.message || 'Αποτυχία ενημέρωσης κράτησης.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-100">Επεξεργασία Κράτησης</h2>
              <p className="text-sm text-slate-400 mt-1">#{booking.id.slice(-6)} — {booking.guestName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Κατάσταση
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as Booking['status'])}
              className="input"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Payment Status */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Κατάσταση Πληρωμής
            </label>
            <select
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value as Booking['paymentStatus'])}
              className="input"
            >
              {paymentStatusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Ειδικά Αιτήματα
            </label>
            <textarea
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              rows={3}
              className="input resize-none"
              placeholder="Προαιρετικά σχόλια ή αιτήματα..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary text-sm"
            >
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { bookingsApi } from '@/lib/api/bookings'
import { Booking } from '@/lib/api/types'

interface DeleteBookingDialogProps {
  booking: Booking
  isOpen: boolean
  onClose: () => void
  onDeleted: () => void
}

export function DeleteBookingDialog({ booking, isOpen, onClose, onDeleted }: DeleteBookingDialogProps) {
  const [cancelling, setCancelling] = useState(false)
  const [reason, setReason] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleCancel = async () => {
    setError(null)
    setCancelling(true)

    try {
      await bookingsApi.cancel(booking.id, reason || undefined)
      onDeleted()
      onClose()
    } catch (err: any) {
      console.error('Error cancelling booking:', err)
      setError(err.message || 'Αποτυχία ακύρωσης κράτησης.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] border border-[#334155] rounded-xl max-w-md w-full shadow-2xl">
        <div className="p-6 border-b border-[#334155]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/15 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-slate-100">Ακύρωση Κράτησης</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <p className="text-sm text-slate-300">
            Είστε σίγουροι ότι θέλετε να ακυρώσετε την κράτηση{' '}
            <span className="font-semibold text-slate-100">#{booking.id.slice(-6)}</span>{' '}
            του <span className="font-semibold text-slate-100">{booking.guestName}</span>;
          </p>

          <p className="text-xs text-slate-500">
            Η ενέργεια αυτή δεν μπορεί να αναιρεθεί.
          </p>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Λόγος Ακύρωσης <span className="text-slate-500">(προαιρετικό)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="input resize-none"
              placeholder="π.χ. Αίτημα πελάτη..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#334155]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
            >
              Πίσω
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-400 bg-red-500/15 hover:bg-red-500/25 rounded-lg transition-colors disabled:opacity-50"
            >
              {cancelling ? 'Ακύρωση...' : 'Ακύρωση Κράτησης'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { formatMoney, formatShortDate } from '@/lib/bookings/booking-format'
import { getRoomLabel } from '@/lib/bookings/booking-labels'
import { BookingActionType, getGuestName } from '@/lib/bookings/booking-rules'
import { BOOKING_ACTION_PRESENTATION } from './booking-action-presentation'

interface BookingActionDialogProps {
  action: BookingActionType
  booking: Booking
  isSubmitting: boolean
  error: string | null
  onClose: () => void
  onConfirm: (input: { reason?: string }) => void
}

/** Confirmation step for every reception action, with the booking recap in view. */
export function BookingActionDialog({
  action,
  booking,
  isSubmitting,
  error,
  onClose,
  onConfirm,
}: BookingActionDialogProps) {
  const [reason, setReason] = useState('')
  const presentation = BOOKING_ACTION_PRESENTATION[action]

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isSubmitting) onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [isSubmitting, onClose])

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={presentation.dialogTitle}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onClose()
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-50">{presentation.dialogTitle}</h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Κλείσιμο"
            className="rounded-lg p-1 text-slate-500 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-xl bg-slate-900/60 p-4">
            <p className="text-sm font-bold text-slate-100">{getGuestName(booking)}</p>
            <p className="mt-1 text-xs text-slate-400">
              {getRoomLabel(booking.roomName) || booking.property?.titleGr || booking.property?.titleEn}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              {formatShortDate(booking.checkIn)} → {formatShortDate(booking.checkOut)} ·{' '}
              {formatMoney(booking.totalPrice, booking.currency)}
            </p>
          </div>

          <p className="text-sm leading-relaxed text-slate-300">{presentation.dialogSummary}</p>

          {action === 'cancel' && (
            <div>
              <label htmlFor="cancel-reason" className="mb-2 block text-sm font-medium text-slate-300">
                Λόγος ακύρωσης (προαιρετικό)
              </label>
              <input
                id="cancel-reason"
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="π.χ. Αίτημα επισκέπτη"
                className="input"
              />
            </div>
          )}

          {presentation.isDestructive && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-800/40 bg-amber-900/20 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
              <p className="text-sm text-amber-200">Η ενέργεια δεν αναιρείται από τη σελίδα της κράτησης.</p>
            </div>
          )}

          {error && (
            <p role="alert" className="rounded-xl border border-red-800/40 bg-red-900/20 p-3 text-sm text-red-300">
              {error}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-700 px-6 py-4">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="btn btn-secondary">
            Άκυρο
          </button>
          <button
            type="button"
            onClick={() => onConfirm({ reason: reason.trim() || undefined })}
            disabled={isSubmitting}
            className={`flex h-12 items-center gap-2 rounded-xl px-6 text-base font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${presentation.primaryClass}`}
          >
            {isSubmitting ? 'Γίνεται καταχώρηση…' : presentation.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Booking } from '@/lib/api/types'
import { formatBookingReference, formatInitials } from '@/lib/bookings/booking-format'
import {
  getPaymentStatusPresentation,
  getSourceLabel,
  getStatusPresentation,
  getStayHeadline,
  isDirectSource,
} from '@/lib/bookings/booking-labels'
import { BookingActionType, StayProgress, getGuestName } from '@/lib/bookings/booking-rules'
import { BookingActionBar } from './BookingActionBar'
import { CopyButton } from './CopyButton'

interface BookingDetailHeaderProps {
  booking: Booking
  progress: StayProgress
  actions: BookingActionType[]
  isBusy: boolean
  onAction: (action: BookingActionType) => void
  onEdit: () => void
  onDelete: () => void
}

export function BookingDetailHeader({
  booking,
  progress,
  actions,
  isBusy,
  onAction,
  onEdit,
  onDelete,
}: BookingDetailHeaderProps) {
  const status = getStatusPresentation(booking.status)
  const payment = getPaymentStatusPresentation(booking.paymentStatus)
  const headline = getStayHeadline(progress)
  const guestName = getGuestName(booking)
  const reference = formatBookingReference(booking.id)

  return (
    <header className="card overflow-hidden p-0">
      <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-700/70 text-lg font-bold text-slate-200">
            {formatInitials(guestName)}
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold text-slate-50 lg:text-3xl">{guestName}</h1>

            <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <span className="font-mono tracking-wider">{reference}</span>
              <CopyButton value={reference} title="Αντιγραφή κωδικού κράτησης" />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip className={status.chip} dotClass={status.dot} label={status.label} />
              <Chip className={payment.chip} dotClass={payment.dot} label={payment.label} />
              <span
                className={`inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-semibold ${
                  isDirectSource(booking.source)
                    ? 'bg-slate-700/60 text-slate-300'
                    : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25'
                }`}
              >
                {getSourceLabel(booking.source, booking.externalPlatform)}
              </span>
            </div>
          </div>
        </div>

        <BookingActionBar
          actions={actions}
          isBusy={isBusy}
          onAction={onAction}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </div>

      <div className="border-t border-slate-700/70 bg-slate-900/40 px-5 py-3 sm:px-6">
        <p className={`text-sm font-semibold ${headline.className}`}>{headline.text}</p>
      </div>
    </header>
  )
}

function Chip({ label, className, dotClass }: { label: string; className: string; dotClass: string }) {
  return (
    <span className={`inline-flex items-center gap-2 rounded-lg px-2.5 py-1 text-xs font-semibold ${className}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
      {label}
    </span>
  )
}

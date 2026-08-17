'use client'

import { History } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { formatDateTime } from '@/lib/bookings/booking-format'
import { CopyButton } from './CopyButton'
import { SectionTitle } from './SectionTitle'

interface BookingMetaCardProps {
  booking: Booking
}

/** Record trail — useful when reception has to explain what changed and when. */
export function BookingMetaCard({ booking }: BookingMetaCardProps) {
  return (
    <section className="card">
      <SectionTitle icon={<History className="h-4 w-4" />} title="Ιστορικό εγγραφής" />

      <dl className="mt-4 space-y-3">
        <MetaRow label="Καταχώρηση" value={formatDateTime(booking.createdAt)} />
        <MetaRow label="Τελευταία ενημέρωση" value={formatDateTime(booking.updatedAt)} />
        {booking.lastSyncedAt && (
          <MetaRow label="Συγχρονισμός καναλιού" value={formatDateTime(booking.lastSyncedAt)} />
        )}
        <div className="flex items-center justify-between gap-2 border-t border-slate-700/70 pt-3">
          <dt className="text-sm text-slate-400">ID κράτησης</dt>
          <dd className="flex min-w-0 items-center gap-1">
            <span className="truncate font-mono text-xs text-slate-400">{booking.id}</span>
            <CopyButton value={booking.id} title="Αντιγραφή πλήρους ID" />
          </dd>
        </div>
      </dl>
    </section>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-slate-400">{label}</dt>
      <dd className="text-sm font-medium text-slate-200">{value}</dd>
    </div>
  )
}

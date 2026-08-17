'use client'

import { BedDouble, Building2, CalendarDays, Hash, Users } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { formatDayMonth, formatGuests, formatNights, formatWeekday, formatYear } from '@/lib/bookings/booking-format'
import { getRoomLabel, getSourceLabel, getStatusPresentation } from '@/lib/bookings/booking-labels'
import { StayProgress } from '@/lib/bookings/booking-rules'
import { SectionTitle } from './SectionTitle'

interface StayTimelineCardProps {
  booking: Booking
  progress: StayProgress
}

/** Arrival, departure and how far along the stay is — the first thing reception looks for. */
export function StayTimelineCard({ booking, progress }: StayTimelineCardProps) {
  const { nights, completion, phase } = progress
  const railFill = phase === 'CLOSED' ? 0 : Math.round(completion * 100)
  const statusDot = getStatusPresentation(booking.status).dot
  const roomLabel = getRoomLabel(booking.roomName)

  return (
    <section className="card">
      <SectionTitle icon={<CalendarDays className="h-4 w-4" />} title="Διαμονή" />

      <div className="mt-5 grid grid-cols-2 items-center gap-4 sm:grid-cols-[1fr_minmax(90px,1fr)_1fr]">
        <DateBlock label="Άφιξη" date={booking.checkIn} />

        <div className="order-last col-span-2 sm:order-none sm:col-span-1">
          <div className="flex flex-col items-center gap-2">
            <span className="rounded-full bg-slate-700/60 px-3 py-1 text-xs font-bold whitespace-nowrap text-slate-200">
              {formatNights(nights)}
            </span>
            <div className="relative h-1.5 w-full rounded-full bg-slate-700/70">
              <div
                className={`absolute inset-y-0 left-0 rounded-full ${statusDot}`}
                style={{ width: `${railFill}%` }}
              />
              <span className={`absolute -top-1 -left-1 h-3.5 w-3.5 rounded-full ring-4 ring-slate-800 ${statusDot}`} />
              <span
                className={`absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full ring-4 ring-slate-800 ${
                  railFill >= 100 ? statusDot : 'bg-slate-600'
                }`}
              />
            </div>
          </div>
        </div>

        <DateBlock label="Αναχώρηση" date={booking.checkOut} align="right" />
      </div>

      <dl className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-slate-700/70 bg-slate-700/70 sm:grid-cols-2">
        <Fact icon={<BedDouble className="h-4 w-4" />} label="Δωμάτιο" value={roomLabel || 'Δεν έχει ανατεθεί'} />
        <Fact icon={<Users className="h-4 w-4" />} label="Επισκέπτες" value={formatGuests(booking.guests)} />
        <Fact
          icon={<Building2 className="h-4 w-4" />}
          label="Κατάλυμα"
          value={booking.property?.titleGr || booking.property?.titleEn || '—'}
        />
        <Fact
          icon={<Hash className="h-4 w-4" />}
          label={booking.externalId ? 'Κωδικός καναλιού' : 'Πηγή'}
          value={booking.externalId || getSourceLabel(booking.source, booking.externalPlatform)}
        />
      </dl>
    </section>
  )
}

function DateBlock({ label, date, align = 'left' }: { label: string; date: string; align?: 'left' | 'right' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-400 capitalize">{formatWeekday(date)}</p>
      <p className="text-xl font-bold text-slate-50 lg:text-2xl">{formatDayMonth(date)}</p>
      <p className="text-sm text-slate-500">{formatYear(date)}</p>
    </div>
  )
}

function Fact({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 bg-slate-800 px-4 py-3">
      <span className="mt-0.5 text-slate-500">{icon}</span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</dt>
        <dd className="truncate text-sm font-semibold text-slate-100">{value}</dd>
      </div>
    </div>
  )
}

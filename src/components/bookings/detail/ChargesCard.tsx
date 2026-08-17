'use client'

import { Euro, Info } from 'lucide-react'
import { Booking } from '@/lib/api/types'
import { formatMoney, formatNights } from '@/lib/bookings/booking-format'
import { BookingBalance, getNightlyRate } from '@/lib/bookings/booking-rules'
import { SectionTitle } from './SectionTitle'

interface ChargesCardProps {
  booking: Booking
  balance: BookingBalance
  nights: number
}

/** The money view: what the stay costs, what came in, and what is still owed. */
export function ChargesCard({ booking, balance, nights }: ChargesCardProps) {
  const currency = booking.currency
  const nightlyRate = getNightlyRate(booking)
  const hasChannelCommission = !!booking.commissionAmount

  return (
    <section className="card">
      <SectionTitle icon={<Euro className="h-4 w-4" />} title="Οικονομικά" />

      <div
        className={`mt-4 rounded-xl border p-4 ${
          balance.due > 0 ? 'border-amber-500/30 bg-amber-500/10' : 'border-green-500/25 bg-green-500/10'
        }`}
      >
        <p className={`text-xs font-bold tracking-wider uppercase ${balance.due > 0 ? 'text-amber-300/80' : 'text-green-300/80'}`}>
          {balance.due > 0 ? 'Υπόλοιπο προς είσπραξη' : 'Εξοφλημένο'}
        </p>
        <p className={`mt-1 text-3xl font-bold ${balance.due > 0 ? 'text-amber-300' : 'text-green-300'}`}>
          {formatMoney(balance.due > 0 ? balance.due : balance.total, currency)}
        </p>
        {balance.isEstimated && (
          <p className="mt-2 flex items-start gap-2 text-xs text-slate-400">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            Δεν υπάρχουν καταγεγραμμένες συναλλαγές· το ποσό προκύπτει από την κατάσταση πληρωμής.
          </p>
        )}
      </div>

      <dl className="mt-5 space-y-2.5">
        <ChargeRow
          label="Διαμονή"
          hint={nightlyRate ? `${formatNights(nights)} × ${formatMoney(nightlyRate, currency)}` : undefined}
          value={formatMoney(booking.basePrice, currency)}
        />
        {!!booking.cleaningFee && (
          <ChargeRow label="Καθαρισμός" value={formatMoney(booking.cleaningFee, currency)} />
        )}
        {!!booking.serviceFee && (
          <ChargeRow label="Υπηρεσίες" value={formatMoney(booking.serviceFee, currency)} />
        )}
        {!!booking.taxes && <ChargeRow label="Φόροι & τέλη" value={formatMoney(booking.taxes, currency)} />}

        <div className="flex items-baseline justify-between border-t border-slate-700/70 pt-3">
          <dt className="text-base font-bold text-slate-100">Σύνολο κράτησης</dt>
          <dd className="text-lg font-bold text-slate-50">{formatMoney(balance.total, currency)}</dd>
        </div>

        <ChargeRow label="Εισπραγμένα" value={`− ${formatMoney(balance.paid, currency)}`} tone="positive" />
        {balance.refunded > 0 && (
          <ChargeRow label="Επιστροφές" value={formatMoney(balance.refunded, currency)} tone="warning" />
        )}
      </dl>

      {(hasChannelCommission || booking.ownerRevenue != null) && (
        <div className="mt-5 space-y-2.5 rounded-xl bg-slate-900/50 p-4">
          <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">Καθαρά έσοδα</p>
          {hasChannelCommission && (
            <ChargeRow
              label="Προμήθεια καναλιού"
              hint={booking.commissionRate ? `${booking.commissionRate}%` : undefined}
              value={`− ${formatMoney(booking.commissionAmount, currency)}`}
              tone="warning"
            />
          )}
          {!!booking.platformFee && (
            <ChargeRow label="Χρέωση πλατφόρμας" value={`− ${formatMoney(booking.platformFee, currency)}`} tone="warning" />
          )}
          <div className="flex items-baseline justify-between border-t border-slate-700/50 pt-2.5">
            <dt className="text-sm font-bold text-slate-200">Έσοδα ιδιοκτήτη</dt>
            <dd className="text-base font-bold text-emerald-300">
              {formatMoney(booking.netRevenue ?? booking.ownerRevenue ?? balance.total, currency)}
            </dd>
          </div>
        </div>
      )}
    </section>
  )
}

interface ChargeRowProps {
  label: string
  value: string
  hint?: string
  tone?: 'neutral' | 'positive' | 'warning'
}

function ChargeRow({ label, value, hint, tone = 'neutral' }: ChargeRowProps) {
  const valueClass =
    tone === 'positive' ? 'text-emerald-300' : tone === 'warning' ? 'text-orange-300' : 'text-slate-200'

  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-sm text-slate-400">
        {label}
        {hint && <span className="ml-2 text-xs text-slate-500">{hint}</span>}
      </dt>
      <dd className={`text-sm font-semibold ${valueClass}`}>{value}</dd>
    </div>
  )
}
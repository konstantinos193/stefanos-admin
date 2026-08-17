/**
 * Booking domain rules: where a stay is in its lifecycle, what money is outstanding,
 * and which operations reception is allowed to run next.
 * Pure functions — no React, no API calls.
 */

import { Booking } from '@/lib/api/types'
import { Payment } from '@/lib/api/payments'
import { countDaysFromToday, countNights } from './booking-format'

export type StayPhase =
  | 'UPCOMING'
  | 'ARRIVING_TODAY'
  | 'IN_HOUSE'
  | 'DEPARTING_TODAY'
  | 'DEPARTED'
  | 'CLOSED'

export interface StayProgress {
  phase: StayPhase
  nights: number
  /** Nights already slept, capped to the length of the stay. */
  nightsElapsed: number
  /** 0 → arrival day, negative → already started. */
  daysUntilArrival: number
  daysUntilDeparture: number
  /** 0–1, for the timeline rail. */
  completion: number
}

export function getStayProgress(booking: Booking, now: Date = new Date()): StayProgress {
  const nights = countNights(booking.checkIn, booking.checkOut)
  const daysUntilArrival = countDaysFromToday(booking.checkIn, now)
  const daysUntilDeparture = countDaysFromToday(booking.checkOut, now)
  const nightsElapsed = Math.min(Math.max(nights - daysUntilDeparture, 0), nights)

  const phase: StayPhase =
    booking.status === 'CANCELLED' || booking.status === 'NO_SHOW' ? 'CLOSED'
    : daysUntilArrival > 0 ? 'UPCOMING'
    : daysUntilArrival === 0 && booking.status !== 'CHECKED_IN' ? 'ARRIVING_TODAY'
    : daysUntilDeparture > 0 ? 'IN_HOUSE'
    : daysUntilDeparture === 0 ? 'DEPARTING_TODAY'
    : 'DEPARTED'

  return {
    phase,
    nights,
    nightsElapsed,
    daysUntilArrival,
    daysUntilDeparture,
    completion: nights > 0 ? nightsElapsed / nights : 0,
  }
}

/**
 * Guest identity. The values captured on the booking win over the linked account,
 * because the account can be edited long after the stay was sold.
 */
export function getGuestName(booking: Booking): string {
  return booking.guestName || booking.guest?.name || 'Χωρίς όνομα'
}

export function getGuestEmail(booking: Booking): string | null {
  return booking.guestEmail || booking.guest?.email || null
}

export function getGuestPhone(booking: Booking): string | null {
  return booking.guestPhone || booking.guest?.phone || null
}

export interface BookingBalance {
  total: number
  paid: number
  refunded: number
  /** What reception still has to collect. Never negative. */
  due: number
  isSettled: boolean
  /** True when the figures come from the booking status because no payment records exist. */
  isEstimated: boolean
}

const SETTLED_PAYMENT_STATUSES: Payment['status'][] = ['COMPLETED', 'PARTIALLY_REFUNDED', 'REFUNDED']

export function calculateBalance(booking: Booking, payments: Payment[]): BookingBalance {
  const total = booking.totalPrice ?? 0

  if (payments.length > 0) {
    const settled = payments.filter((payment) => SETTLED_PAYMENT_STATUSES.includes(payment.status))
    const collected = settled.reduce((sum, payment) => sum + payment.amount, 0)
    const refunded = settled.reduce((sum, payment) => sum + (payment.refundAmount ?? 0), 0)
    const paid = Math.max(collected - refunded, 0)
    return { total, paid, refunded, due: Math.max(total - paid, 0), isSettled: paid >= total, isEstimated: false }
  }

  // No payment records (cash at reception, OTA-collected, legacy bookings): fall back to the flag.
  const paid = booking.paymentStatus === 'COMPLETED' ? total : 0
  const refunded = booking.paymentStatus === 'REFUNDED' ? total : 0
  return {
    total,
    paid,
    refunded,
    due: Math.max(total - paid, 0),
    isSettled: paid >= total,
    isEstimated: true,
  }
}

export function getNightlyRate(booking: Booking): number | null {
  const nights = countNights(booking.checkIn, booking.checkOut)
  if (nights <= 0) return null
  return (booking.basePrice ?? 0) / nights
}

export type BookingActionType = 'confirm' | 'check-in' | 'check-out' | 'mark-paid' | 'cancel'

const CLOSED_STATUSES: Booking['status'][] = ['CANCELLED', 'COMPLETED', 'NO_SHOW']

function isActionAllowed(action: BookingActionType, booking: Booking): boolean {
  switch (action) {
    case 'confirm':
      return booking.status === 'PENDING'
    case 'check-in':
      return booking.status === 'CONFIRMED'
    case 'check-out':
      return booking.status === 'CHECKED_IN'
    case 'mark-paid':
      return booking.paymentStatus !== 'COMPLETED' && !['CANCELLED', 'NO_SHOW'].includes(booking.status)
    case 'cancel':
      return !CLOSED_STATUSES.includes(booking.status)
  }
}

/**
 * Available actions ordered by what reception most likely needs right now —
 * the first entry is rendered as the primary button, the rest fall back to secondary/menu.
 */
export function getAvailableActions(booking: Booking, now: Date = new Date()): BookingActionType[] {
  const { phase } = getStayProgress(booking, now)

  const byRelevance: BookingActionType[] =
    phase === 'ARRIVING_TODAY' ? ['check-in', 'confirm', 'mark-paid', 'check-out', 'cancel']
    : phase === 'DEPARTING_TODAY' || phase === 'DEPARTED' ? ['check-out', 'mark-paid', 'check-in', 'confirm', 'cancel']
    : phase === 'IN_HOUSE' ? ['mark-paid', 'check-out', 'check-in', 'confirm', 'cancel']
    : ['confirm', 'mark-paid', 'check-in', 'check-out', 'cancel']

  return byRelevance.filter((action) => isActionAllowed(action, booking))
}
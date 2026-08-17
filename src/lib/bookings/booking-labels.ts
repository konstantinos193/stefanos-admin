/**
 * Greek labels and colour tokens for booking enums.
 * Single source of truth — the bookings table and the booking detail page both read from here.
 */

import { Booking } from '@/lib/api/types'
import { Payment } from '@/lib/api/payments'
import { StayProgress } from './booking-rules'
import { formatDayCount, formatNights } from './booking-format'

export interface EnumPresentation {
  label: string
  /** Full chip classes (background + text + border). */
  chip: string
  /** Solid colour for dots, bars and progress rails. */
  dot: string
}

export const BOOKING_STATUS_PRESENTATION: Record<Booking['status'], EnumPresentation> = {
  PENDING: {
    label: 'Εκκρεμεί Επιβεβαίωση',
    chip: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
    dot: 'bg-orange-400',
  },
  CONFIRMED: {
    label: 'Επιβεβαιωμένη',
    chip: 'bg-green-500/15 text-green-300 border border-green-500/25',
    dot: 'bg-green-400',
  },
  CHECKED_IN: {
    label: 'Στο κατάλυμα',
    chip: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
    dot: 'bg-purple-400',
  },
  COMPLETED: {
    label: 'Ολοκληρωμένη',
    chip: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    dot: 'bg-blue-400',
  },
  CANCELLED: {
    label: 'Ακυρωμένη',
    chip: 'bg-red-500/15 text-red-300 border border-red-500/25',
    dot: 'bg-red-400',
  },
  NO_SHOW: {
    label: 'Δεν εμφανίστηκε',
    chip: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
    dot: 'bg-slate-400',
  },
}

export const PAYMENT_STATUS_PRESENTATION: Record<Booking['paymentStatus'], EnumPresentation> = {
  PENDING: {
    label: 'Απλήρωτη',
    chip: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    dot: 'bg-amber-400',
  },
  COMPLETED: {
    label: 'Εξοφλημένη',
    chip: 'bg-green-500/15 text-green-300 border border-green-500/25',
    dot: 'bg-green-400',
  },
  FAILED: {
    label: 'Αποτυχία πληρωμής',
    chip: 'bg-red-500/15 text-red-300 border border-red-500/25',
    dot: 'bg-red-400',
  },
  REFUNDED: {
    label: 'Επιστροφή χρημάτων',
    chip: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
    dot: 'bg-orange-400',
  },
  PARTIALLY_REFUNDED: {
    label: 'Μερική επιστροφή',
    chip: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
    dot: 'bg-orange-400',
  },
}

const UNKNOWN_PRESENTATION: EnumPresentation = {
  label: '—',
  chip: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  dot: 'bg-slate-400',
}

export function getStatusPresentation(status: string): EnumPresentation {
  return BOOKING_STATUS_PRESENTATION[status as Booking['status']] ?? { ...UNKNOWN_PRESENTATION, label: status }
}

export function getPaymentStatusPresentation(status: string): EnumPresentation {
  return PAYMENT_STATUS_PRESENTATION[status as Booking['paymentStatus']] ?? { ...UNKNOWN_PRESENTATION, label: status }
}

const SOURCE_LABEL: Record<string, string> = {
  DIRECT: 'Απευθείας κράτηση',
  MANUAL: 'Καταχώρηση από reception',
  BOOKING_COM: 'Booking.com',
  AIRBNB: 'Airbnb',
  VRBO: 'VRBO',
  EXPEDIA: 'Expedia',
  OTHER: 'Άλλο κανάλι',
}

export function getSourceLabel(source: string | null | undefined, externalPlatform?: string | null): string {
  if (!source) return 'Άγνωστη πηγή'
  if (source === 'OTHER' && externalPlatform) return externalPlatform
  return SOURCE_LABEL[source] ?? source
}

/** OTA bookings carry commission and different house rules — worth flagging in the UI. */
export function isDirectSource(source: string | null | undefined): boolean {
  return source === 'DIRECT' || source === 'MANUAL' || !source
}

const ROOM_LABEL: Record<string, string> = {
  'Apartment 01 - Ground Level': 'Διαμέρισμα 01 — Ισόγειο',
  'Apartment 02 - Ground Level': 'Διαμέρισμα 02 — Ισόγειο',
  'Apartment 03 - First Floor': 'Διαμέρισμα 03 — Α΄ Όροφος',
  'Apartment 04 - First Floor': 'Διαμέρισμα 04 — Α΄ Όροφος',
  'Apartment 05 - First Floor': 'Διαμέρισμα 05 — Α΄ Όροφος',
  'Apartment 06 - Second Floor': 'Διαμέρισμα 06 — Β΄ Όροφος',
  'Apartment 07 - Second Floor': 'Διαμέρισμα 07 — Β΄ Όροφος',
  'Apartment 08 - Second Floor': 'Διαμέρισμα 08 — Β΄ Όροφος',
  'Apartment 09 - Third Floor': 'Διαμέρισμα 09 — Γ΄ Όροφος',
  'Apartment 10 - Third Floor': 'Διαμέρισμα 10 — Γ΄ Όροφος',
}

export function getRoomLabel(roomName: string | null | undefined): string {
  if (!roomName) return ''
  return ROOM_LABEL[roomName] ?? roomName
}

export interface StayHeadline {
  text: string
  /** Text colour that matches the urgency of the phase. */
  className: string
}

/** One line that tells reception where this stay stands today. */
export function getStayHeadline(progress: StayProgress): StayHeadline {
  const { phase, nights, nightsElapsed, daysUntilArrival, daysUntilDeparture } = progress

  switch (phase) {
    case 'UPCOMING':
      return {
        text: `Άφιξη σε ${formatDayCount(daysUntilArrival)} · ${formatNights(nights)}`,
        className: 'text-slate-300',
      }
    case 'ARRIVING_TODAY':
      return { text: `Άφιξη σήμερα · ${formatNights(nights)}`, className: 'text-amber-300' }
    case 'IN_HOUSE':
      return {
        text: `Στο κατάλυμα · ${nightsElapsed} από ${nights} νύχτες · αναχώρηση σε ${formatDayCount(daysUntilDeparture)}`,
        className: 'text-purple-300',
      }
    case 'DEPARTING_TODAY':
      return { text: 'Αναχώρηση σήμερα', className: 'text-amber-300' }
    case 'DEPARTED':
      return { text: `Ολοκληρώθηκε πριν ${formatDayCount(Math.abs(daysUntilDeparture))}`, className: 'text-slate-400' }
    case 'CLOSED':
      return { text: 'Μη ενεργή κράτηση', className: 'text-slate-400' }
  }
}

const PAYMENT_METHOD_LABEL: Record<Payment['method'], string> = {
  CREDIT_CARD: 'Πιστωτική κάρτα',
  DEBIT_CARD: 'Χρεωστική κάρτα',
  APPLE_PAY: 'Apple Pay',
  GOOGLE_PAY: 'Google Pay',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: 'Τραπεζική κατάθεση',
  STRIPE_LINK: 'Stripe Link',
}

export function getPaymentMethodLabel(method: string | null | undefined): string {
  if (!method) return 'Πληρωμή'
  return PAYMENT_METHOD_LABEL[method as Payment['method']] ?? method
}

/**
 * Greek-locale formatting for booking data.
 * Pure functions — no React, no API, no side effects.
 */

const LOCALE = 'el-GR'
const DAY_MS = 24 * 60 * 60 * 1000

/** Strips the time part so stays are counted in calendar days, not hours. */
export function toCalendarDay(value: string | Date): Date {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function countNights(checkIn: string, checkOut: string): number {
  const diff = toCalendarDay(checkOut).getTime() - toCalendarDay(checkIn).getTime()
  return Math.max(0, Math.round(diff / DAY_MS))
}

/** Positive = in the future, 0 = today, negative = in the past. */
export function countDaysFromToday(date: string, now: Date = new Date()): number {
  return Math.round((toCalendarDay(date).getTime() - toCalendarDay(now).getTime()) / DAY_MS)
}

export function formatWeekday(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, { weekday: 'long' })
}

/** 17 Αυγούστου */
export function formatDayMonth(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, { day: 'numeric', month: 'long' })
}

/** 17 Αυγ 2026 */
export function formatShortDate(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, { day: 'numeric', month: 'short', year: 'numeric' })
}

/** Δευτέρα 17 Αυγούστου 2026 */
export function formatFullDate(date: string): string {
  return new Date(date).toLocaleDateString(LOCALE, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** 8 Ιουν 2026, 14:32 */
export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatYear(date: string): string {
  return new Date(date).getFullYear().toString()
}

export function formatMoney(amount: number | null | undefined, currency = 'EUR'): string {
  const value = amount ?? 0
  return new Intl.NumberFormat(LOCALE, {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}

export function formatNights(nights: number): string {
  return `${nights} ${nights === 1 ? 'βράδυ' : 'βράδια'}`
}

export function formatGuests(guests: number): string {
  return `${guests} ${guests === 1 ? 'επισκέπτης' : 'επισκέπτες'}`
}

export function formatDayCount(days: number): string {
  return `${days} ${days === 1 ? 'ημέρα' : 'ημέρες'}`
}

/** Short booking reference shown to staff and guests. */
export function formatBookingReference(id: string): string {
  return id.slice(-8).toUpperCase()
}

/** Initials for the guest avatar, e.g. "D'ARRIGO LUCIO" → "DL". */
export function formatInitials(name: string | null | undefined): string {
  const words = (name || '').trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '—'
  return words.slice(0, 2).map((word) => word[0]).join('').toUpperCase()
}

/** Digits-only phone for tel: / WhatsApp links. */
export function toDialablePhone(phone: string | null | undefined): string | null {
  if (!phone) return null
  const digits = phone.replace(/[^\d+]/g, '')
  return digits.length >= 6 ? digits : null
}

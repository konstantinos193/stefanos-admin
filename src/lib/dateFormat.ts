/**
 * Shared Greek date formatting for admin lists.
 *
 * Everything here compares by calendar day rather than by elapsed hours, so a
 * task due today never reads as "overdue" just because the clock passed midnight.
 */

/** Midnight of the given date, in local time. */
export function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/**
 * A bare "YYYY-MM-DD" (what <input type="date"> gives us) is parsed as UTC
 * midnight by `new Date()`, which renders as the previous day west of GMT.
 * Parse those as a local calendar date instead.
 */
export function parseDate(value: string | Date): Date {
  if (value instanceof Date) return value
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (match) return new Date(+match[1], +match[2] - 1, +match[3])
  return new Date(value)
}

/** Whole days between two dates, compared by calendar day. */
export function daysUntil(target: string | Date, from: Date = new Date()): number {
  const a = startOfDay(from).getTime()
  const b = startOfDay(parseDate(target)).getTime()
  return Math.round((b - a) / 86400000)
}

export function formatDate(value: string | Date): string {
  return parseDate(value).toLocaleDateString('el-GR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateLong(value: string | Date): string {
  return parseDate(value).toLocaleDateString('el-GR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function pluralDays(n: number): string {
  return n === 1 ? '1 ημέρα' : `${n} ημέρες`
}

/** "πριν 3 ημέρες" / "σήμερα" / "αύριο" / "σε 5 ημέρες" */
export function formatRelativeDays(value: string | Date, now: Date = new Date()): string {
  const diff = daysUntil(value, now)
  if (diff === 0) return 'σήμερα'
  if (diff === 1) return 'αύριο'
  if (diff === -1) return 'χθες'
  if (diff < 0) return `πριν ${pluralDays(Math.abs(diff))}`
  return `σε ${pluralDays(diff)}`
}

/** "2026-08-30" for <input type="date">, using local calendar parts (no UTC shift). */
export function toDateInputValue(value: string | Date | null | undefined): string {
  if (!value) return ''
  const d = parseDate(value)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

/**
 * "2026-08-30" -> ISO string anchored at local noon, so the stored day never
 * slips backwards when the server reads it in another timezone.
 */
export function fromDateInputValue(value: string): string | null {
  if (!value) return null
  const [y, m, d] = value.split('-').map(Number)
  if (!y || !m || !d) return null
  return new Date(y, m - 1, d, 12, 0, 0).toISOString()
}

import { CleaningSchedule } from '@/lib/api/types'
import { daysUntil, parseDate } from '@/lib/dateFormat'

// Re-exported so cleaning components keep importing dates from one place.
export {
  startOfDay,
  parseDate,
  daysUntil,
  formatDate,
  formatDateLong,
  formatRelativeDays,
  toDateInputValue,
  fromDateInputValue,
} from '@/lib/dateFormat'

export type CleaningStatus =
  | 'OVERDUE'
  | 'DUE_TODAY'
  | 'UPCOMING'
  | 'SCHEDULED'
  | 'UNSCHEDULED'

export type CleaningFrequencyValue =
  | 'AFTER_EACH_BOOKING'
  | 'DAILY'
  | 'WEEKLY'
  | 'BIWEEKLY'
  | 'MONTHLY'
  | 'CUSTOM'

export const FREQUENCY_OPTIONS: {
  value: CleaningFrequencyValue
  label: string
  hint: string
  color: string
}[] = [
  {
    value: 'AFTER_EACH_BOOKING',
    label: 'Ανά κράτηση',
    hint: 'Μετά το check-out κάθε επισκέπτη',
    color: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
  },
  {
    value: 'DAILY',
    label: 'Ημερήσια',
    hint: 'Κάθε ημέρα',
    color: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
  },
  {
    value: 'WEEKLY',
    label: 'Εβδομαδιαία',
    hint: 'Κάθε 7 ημέρες',
    color: 'bg-green-500/15 text-green-300 border border-green-500/25',
  },
  {
    value: 'BIWEEKLY',
    label: 'Δεκαπενθήμερη',
    hint: 'Κάθε 14 ημέρες',
    color: 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/25',
  },
  {
    value: 'MONTHLY',
    label: 'Μηνιαία',
    hint: 'Κάθε μήνα',
    color: 'bg-purple-500/15 text-purple-300 border border-purple-500/25',
  },
  {
    value: 'CUSTOM',
    label: 'Προσαρμοσμένη',
    hint: 'Ορίζετε εσείς την επόμενη ημερομηνία',
    color: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
  },
]

export function getFrequencyMeta(frequency: string) {
  return (
    FREQUENCY_OPTIONS.find((f) => f.value === frequency) ?? {
      value: frequency as CleaningFrequencyValue,
      label: frequency,
      hint: '',
      color: 'bg-slate-500/15 text-slate-300 border border-slate-500/25',
    }
  )
}

export const STATUS_META: Record<
  CleaningStatus,
  { label: string; badge: string; dot: string; accent: string }
> = {
  OVERDUE: {
    label: 'Εκπρόθεσμο',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
    dot: 'bg-red-400',
    accent: 'border-l-red-500',
  },
  DUE_TODAY: {
    label: 'Σήμερα',
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-400',
    accent: 'border-l-amber-500',
  },
  UPCOMING: {
    label: 'Προσεχώς',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
    dot: 'bg-blue-400',
    accent: 'border-l-blue-500',
  },
  SCHEDULED: {
    label: 'Προγραμματισμένο',
    badge: 'bg-slate-600/30 text-slate-300 border border-slate-600/40',
    dot: 'bg-slate-400',
    accent: 'border-l-slate-600',
  },
  UNSCHEDULED: {
    label: 'Χωρίς ημερομηνία',
    badge: 'bg-slate-700/30 text-slate-400 border border-dashed border-slate-600',
    dot: 'bg-slate-500',
    accent: 'border-l-slate-700',
  },
}

/**
 * Status is derived by calendar day, so a cleaning due today never reads as
 * "overdue" just because the clock passed midnight.
 */
export function getStatus(schedule: CleaningSchedule, now: Date = new Date()): CleaningStatus {
  if (!schedule.nextCleaning) return 'UNSCHEDULED'
  const diff = daysUntil(schedule.nextCleaning, now)
  if (diff < 0) return 'OVERDUE'
  if (diff === 0) return 'DUE_TODAY'
  if (diff <= 7) return 'UPCOMING'
  return 'SCHEDULED'
}

const STATUS_ORDER: Record<CleaningStatus, number> = {
  OVERDUE: 0,
  DUE_TODAY: 1,
  UPCOMING: 2,
  SCHEDULED: 3,
  UNSCHEDULED: 4,
}

/** Overdue first (worst first), then today, upcoming, scheduled, unscheduled last. */
export function sortByUrgency(schedules: CleaningSchedule[], now: Date = new Date()) {
  return [...schedules].sort((a, b) => {
    const rank = STATUS_ORDER[getStatus(a, now)] - STATUS_ORDER[getStatus(b, now)]
    if (rank !== 0) return rank
    if (!a.nextCleaning) return 1
    if (!b.nextCleaning) return -1
    return parseDate(a.nextCleaning).getTime() - parseDate(b.nextCleaning).getTime()
  })
}

/** Mirrors the backend's calculateNextCleaning so the form can preview the result. */
export function previewNextCleaning(
  frequency: CleaningFrequencyValue,
  lastCleaned: Date = new Date(),
): Date {
  const next = new Date(lastCleaned)
  switch (frequency) {
    case 'AFTER_EACH_BOOKING':
    case 'DAILY':
      next.setDate(next.getDate() + 1)
      break
    case 'BIWEEKLY':
      next.setDate(next.getDate() + 14)
      break
    case 'MONTHLY':
      next.setMonth(next.getMonth() + 1)
      break
    case 'WEEKLY':
    default:
      next.setDate(next.getDate() + 7)
  }
  return next
}

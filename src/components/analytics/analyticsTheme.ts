import type { AnalyticsPeriod } from '@/lib/api/analytics'

/**
 * Categorical series colors, assigned in fixed slot order and never cycled.
 * Validated against this app's chart surface (#1e293b) in dark mode, all pairs:
 * lightness band, chroma floor, CVD separation (worst ΔE 9.4), normal-vision
 * floor (worst ΔE 20.9) and 3:1 contrast all pass.
 */
export const SERIES = {
  slot1: '#3987e5', // blue
  slot2: '#d95926', // orange
  slot3: '#199e70', // aqua
} as const

/** Recessive chart chrome: solid hairlines, muted ink — never dashed. */
export const CHART_CHROME = {
  grid: '#334155',
  axis: '#475569',
  tick: '#94a3b8',
  cursorFill: 'rgba(148, 163, 184, 0.10)',
  cursorLine: '#475569',
} as const

export type RangeKey = '7days' | '30days' | '90days' | '1year'

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: '7days', label: 'Τελευταίες 7 ημέρες' },
  { value: '30days', label: 'Τελευταίες 30 ημέρες' },
  { value: '90days', label: 'Τελευταίες 90 ημέρες' },
  { value: '1year', label: 'Τελευταίο έτος' },
]

/**
 * Bucket granularity has to follow the range. The page previously asked for
 * MONTHLY buckets on every range, so a 30-day window produced a single point.
 */
const RANGE_CONFIG: Record<RangeKey, { days: number; period: AnalyticsPeriod['period'] }> = {
  '7days': { days: 7, period: 'DAILY' },
  '30days': { days: 30, period: 'DAILY' },
  '90days': { days: 90, period: 'WEEKLY' },
  '1year': { days: 365, period: 'MONTHLY' },
}

function toDateParam(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(
    date.getDate(),
  ).padStart(2, '0')}`
}

export function buildPeriod(range: RangeKey): AnalyticsPeriod {
  const { days, period } = RANGE_CONFIG[range]
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  return { period, startDate: toDateParam(start), endDate: toDateParam(end) }
}

/** Axis labels follow the bucket size: a day range shouldn't be labelled by month. */
export function formatBucketLabel(value: string, period: AnalyticsPeriod['period']): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  if (period === 'DAILY' || period === 'WEEKLY') {
    return date.toLocaleDateString('el-GR', { day: '2-digit', month: 'short' })
  }
  if (period === 'YEARLY') {
    return date.toLocaleDateString('el-GR', { year: 'numeric' })
  }
  return date.toLocaleDateString('el-GR', { month: 'short', year: '2-digit' })
}

export function formatBucketTooltipLabel(
  value: string,
  period: AnalyticsPeriod['period'],
): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return String(value)

  if (period === 'MONTHLY') {
    return date.toLocaleDateString('el-GR', { month: 'long', year: 'numeric' })
  }
  if (period === 'WEEKLY') {
    return `Εβδομάδα ${date.toLocaleDateString('el-GR', { day: '2-digit', month: 'short' })}`
  }
  return date.toLocaleDateString('el-GR', { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatCurrency(value: number): string {
  return `€${Math.round(value).toLocaleString('el-GR')}`
}

/**
 * Compact axis ticks that stay distinct at small magnitudes — the old
 * `€${(value/1000).toFixed(0)}k` rendered every tick under 1000 as "€0k".
 */
export function formatCurrencyTick(value: number): string {
  if (!Number.isFinite(value)) return ''
  const abs = Math.abs(value)
  if (abs >= 1_000_000) return `€${(value / 1_000_000).toFixed(1).replace('.0', '')}M`
  if (abs >= 1_000) return `€${(value / 1_000).toFixed(1).replace('.0', '')}k`
  return `€${Math.round(value)}`
}

/** True when every numeric field across the series is zero or missing. */
export function isAllZero<T extends Record<string, unknown>>(rows: T[], keys: (keyof T)[]) {
  if (rows.length === 0) return true
  return rows.every((row) => keys.every((key) => !Number(row[key])))
}

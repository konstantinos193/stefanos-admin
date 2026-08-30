import type { Property } from '@/lib/api/types'

export type PropertyTypeValue = Property['type']
export type PropertyStatusValue = Property['status']

/** Matches the PropertyType enum in prisma/schema.prisma exactly. */
export const PROPERTY_TYPES: { value: PropertyTypeValue; label: string }[] = [
  { value: 'APARTMENT', label: 'Διαμέρισμα' },
  { value: 'HOUSE', label: 'Κατοικία' },
  { value: 'ROOM', label: 'Δωμάτιο' },
  { value: 'COMMERCIAL', label: 'Επαγγελματικό' },
  { value: 'STORAGE', label: 'Αποθήκη' },
  { value: 'PLOT', label: 'Οικόπεδο' },
  { value: 'GARAGE', label: 'Γκαράζ' },
  { value: 'LUXURY', label: 'Πολυτελές' },
  { value: 'INVESTMENT', label: 'Επένδυση' },
]

export const PROPERTY_STATUSES: {
  value: PropertyStatusValue
  label: string
  badge: string
}[] = [
  {
    value: 'ACTIVE',
    label: 'Ενεργό',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/30',
  },
  {
    value: 'INACTIVE',
    label: 'Ανενεργό',
    badge: 'bg-slate-600/30 text-slate-300 border border-slate-600/40',
  },
  {
    value: 'MAINTENANCE',
    label: 'Συντήρηση',
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  },
  {
    value: 'SUSPENDED',
    label: 'Αναστολή',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/30',
  },
]

export function typeLabel(type: string): string {
  return PROPERTY_TYPES.find((t) => t.value === type)?.label ?? type
}

export function statusMeta(status: string) {
  return (
    PROPERTY_STATUSES.find((s) => s.value === status) ?? {
      value: status as PropertyStatusValue,
      label: status,
      badge: 'bg-slate-600/30 text-slate-300 border border-slate-600/40',
    }
  )
}

/**
 * basePrice is a nightly rate — the API pairs it with minStay, maxStay and
 * check-in/out times. The card used to append "/μήνα", so a €150 nightly rate
 * read as a monthly one.
 */
export function formatNightlyPrice(price: number, currency = 'EUR'): string {
  const amount = new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price ?? 0)

  return `${amount}/διανυκτέρευση`
}

export function formatPrice(price: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('el-GR', {
    style: 'currency',
    currency: currency || 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price ?? 0)
}

/** Filter options are built from the loaded data, never hard-coded city lists. */
export function collectCities(properties: Property[]): string[] {
  return Array.from(new Set(properties.map((p) => p.city).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b, 'el'),
  )
}

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookingsHeader } from '@/components/bookings/BookingsHeader'
import { BookingsTable } from '@/components/bookings/BookingsTable'
import { BookingsFilters } from '@/components/bookings/BookingsFilters'
import { BookingQueryParams, bookingsApi } from '@/lib/api/bookings'

// ── Status Tabs ───────────────────────────────────────────────────────────────

type StatusValue = '' | 'PENDING' | 'CONFIRMED' | 'CHECKED_IN' | 'COMPLETED' | 'CANCELLED'

const STATUS_TABS: {
  value: StatusValue
  label: string
  dot?: string
}[] = [
  { value: '', label: 'Όλες' },
  { value: 'PENDING', label: 'Εκκρεμείς', dot: 'bg-yellow-400' },
  { value: 'CONFIRMED', label: 'Επιβεβαιωμένες', dot: 'bg-green-400' },
  { value: 'CHECKED_IN', label: 'Check-in', dot: 'bg-purple-400' },
  { value: 'COMPLETED', label: 'Ολοκληρωμένες', dot: 'bg-blue-400' },
  { value: 'CANCELLED', label: 'Ακυρωμένες', dot: 'bg-red-400' },
]

function StatusTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: StatusValue
  onTabChange: (v: StatusValue) => void
}) {
  const [counts, setCounts] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchCounts() {
      try {
        const results = await Promise.all(
          STATUS_TABS.filter((t) => t.value !== '').map((t) =>
            bookingsApi
              .getAll({ status: t.value, limit: 1 })
              .then((r) => [t.value, r.data.pagination.total] as [string, number])
              .catch(() => [t.value, 0] as [string, number]),
          ),
        )
        setCounts(Object.fromEntries(results))
      } catch {}
    }
    fetchCounts()
  }, [])

  const total = Object.values(counts).reduce((s, n) => s + n, 0)

  return (
    <div className="flex items-center gap-1 overflow-x-auto bg-slate-800/50 border border-slate-700/50 rounded-xl p-1.5">
      {STATUS_TABS.map((tab) => {
        const count = tab.value === '' ? total : (counts[tab.value] ?? null)
        const isActive = activeTab === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value as StatusValue)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-semibold whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
            }`}
          >
            {tab.dot && (
              <span className={`w-2 h-2 rounded-full ${tab.dot} shrink-0`} />
            )}
            {tab.label}
            {count !== null && count > 0 && (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-blue-500/30 text-blue-300'
                    : 'bg-slate-700 text-slate-400'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const refreshRef = useRef<(() => void) | null>(null)

  const initialStatus = (searchParams.get('status') || '') as StatusValue
  const [statusTab, setStatusTab] = useState<StatusValue>(initialStatus)

  const [filters, setFilters] = useState<BookingQueryParams>({
    limit: 50,
    search: searchParams.get('search') || undefined,
    status: initialStatus || undefined,
    dateFrom: searchParams.get('dateFrom') || undefined,
    dateTo: searchParams.get('dateTo') || undefined,
  })

  // Sync URL search param → filters when navigating from header search
  useEffect(() => {
    const newSearch = searchParams.get('search') || ''
    setFilters((prev) => {
      if ((prev.search || '') !== newSearch) {
        return { ...prev, search: newSearch || undefined, page: 1 }
      }
      return prev
    })
  }, [searchParams])

  const pushUrl = useCallback(
    (f: BookingQueryParams) => {
      const params = new URLSearchParams()
      if (f.search) params.set('search', f.search)
      if (f.status) params.set('status', f.status)
      if (f.dateFrom) params.set('dateFrom', f.dateFrom)
      if (f.dateTo) params.set('dateTo', f.dateTo)
      const qs = params.toString()
      router.replace(`/bookings${qs ? `?${qs}` : ''}`, { scroll: false })
    },
    [router],
  )

  const handleFiltersChange = useCallback(
    (newFilters: BookingQueryParams) => {
      setFilters(newFilters)
      pushUrl(newFilters)
    },
    [pushUrl],
  )

  const handleTabChange = useCallback(
    (status: StatusValue) => {
      setStatusTab(status)
      const newFilters = { ...filters, status: status || undefined, page: 1 }
      setFilters(newFilters)
      pushUrl(newFilters)
    },
    [filters, pushUrl],
  )

  return (
    <div className="space-y-5">
      <BookingsHeader onBookingCreated={() => refreshRef.current?.()} />
      <StatusTabs activeTab={statusTab} onTabChange={handleTabChange} />
      <BookingsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <BookingsTable
        filters={filters}
        onRefreshReady={(fn) => {
          refreshRef.current = fn
        }}
      />
    </div>
  )
}

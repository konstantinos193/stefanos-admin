'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { BookingsHeader } from '@/components/bookings/BookingsHeader'
import { BookingsTable } from '@/components/bookings/BookingsTable'
import { BookingsFilters } from '@/components/bookings/BookingsFilters'
import { BookingQueryParams } from '@/lib/api/bookings'

export default function BookingsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSearch = searchParams.get('search') || ''

  const [filters, setFilters] = useState<BookingQueryParams>({
    limit: 50,
    search: urlSearch || undefined,
  })

  // Sync URL search param → filters (when navigating from header search)
  useEffect(() => {
    const newSearch = searchParams.get('search') || ''
    setFilters((prev) => {
      if ((prev.search || '') !== newSearch) {
        return { ...prev, search: newSearch || undefined, page: 1 }
      }
      return prev
    })
  }, [searchParams])

  // Sync filters → URL (keep URL in sync when using inline filters)
  const handleFiltersChange = useCallback((newFilters: BookingQueryParams) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.status) params.set('status', newFilters.status)
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom)
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo)
    const qs = params.toString()
    router.replace(`/bookings${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router])

  return (
    <div className="space-y-6">
      <BookingsHeader />
      <BookingsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <BookingsTable filters={filters} />
    </div>
  )
}


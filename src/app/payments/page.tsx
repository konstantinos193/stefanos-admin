'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { PaymentsHeader } from '@/components/payments/PaymentsHeader'
import { PaymentsTable } from '@/components/payments/PaymentsTable'
import { PaymentsFilters } from '@/components/payments/PaymentsFilters'

interface PaymentQueryParams {
  limit?: number
  page?: number
  search?: string
  status?: string
  method?: string
  dateFrom?: string
  dateTo?: string
}

export default function PaymentsPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSearch = searchParams.get('search') || ''

  const [filters, setFilters] = useState<PaymentQueryParams>({
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
  const handleFiltersChange = useCallback((newFilters: PaymentQueryParams) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.status) params.set('status', newFilters.status)
    if (newFilters.method) params.set('method', newFilters.method)
    if (newFilters.dateFrom) params.set('dateFrom', newFilters.dateFrom)
    if (newFilters.dateTo) params.set('dateTo', newFilters.dateTo)
    const qs = params.toString()
    router.replace(`/payments${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router])

  const handleFilter = () => {
    // TODO: Implement filter functionality
    console.log('Filter clicked')
  }

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export clicked')
  }

  const handleCreate = () => {
    // TODO: Implement create payment functionality
    console.log('Create payment clicked')
  }

  return (
    <div className="space-y-6">
      <PaymentsHeader
        onFilter={handleFilter}
        onExport={handleExport}
        onCreate={handleCreate}
      />
      <PaymentsFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <PaymentsTable filters={filters} />
    </div>
  )
}


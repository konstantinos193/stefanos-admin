'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { KnowledgeHeader } from '@/components/knowledge/KnowledgeHeader'
import { KnowledgeTable } from '@/components/knowledge/KnowledgeTable'
import { KnowledgeFilters } from '@/components/knowledge/KnowledgeFilters'
import { KnowledgeQueryParams } from '@/lib/api/knowledge'

export default function KnowledgePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlSearch = searchParams.get('search') || ''

  const [filters, setFilters] = useState<KnowledgeQueryParams>({
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
  const handleFiltersChange = useCallback((newFilters: KnowledgeQueryParams) => {
    setFilters(newFilters)
    const params = new URLSearchParams()
    if (newFilters.search) params.set('search', newFilters.search)
    if (newFilters.category) params.set('category', newFilters.category)
    if (newFilters.published) params.set('published', newFilters.published)
    if (newFilters.tags) params.set('tags', newFilters.tags)
    const qs = params.toString()
    router.replace(`/knowledge${qs ? `?${qs}` : ''}`, { scroll: false })
  }, [router])

  return (
    <div className="space-y-6">
      <KnowledgeHeader />
      <KnowledgeFilters filters={filters} onFiltersChange={handleFiltersChange} />
      <KnowledgeTable filters={filters} />
    </div>
  )
}


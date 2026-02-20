'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Plus } from 'lucide-react'
import { knowledgeApi, KnowledgeQueryParams } from '@/lib/api/knowledge'
import { KnowledgeArticle } from '@/lib/api/knowledge'

interface KnowledgeFiltersProps {
  filters: KnowledgeQueryParams
  onFiltersChange: (filters: KnowledgeQueryParams) => void
}

export function KnowledgeFilters({ filters, onFiltersChange }: KnowledgeFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState(filters.search || '')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    try {
      const response = await knowledgeApi.getAll({ limit: 1000 })
      const uniqueCategories = [...new Set(response.data?.articles?.map(article => article.category) || [])]
      setCategories(uniqueCategories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    onFiltersChange({ ...filters, search: value || undefined, page: 1 })
  }

  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category: category === 'all' ? undefined : category, page: 1 })
  }

  const handlePublishedChange = (published: string) => {
    onFiltersChange({ ...filters, published: published === 'all' ? undefined : published, page: 1 })
  }

  return (
    <div className="card">
      <div className="p-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Αναζήτηση άρθρων..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="min-w-[150px]">
            <select
              value={filters.category || 'all'}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Όλες οι Κατηγορίες</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Published Filter */}
          <div className="min-w-[150px]">
            <select
              value={filters.published || 'all'}
              onChange={(e) => handlePublishedChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Όλα τα Άρθρα</option>
              <option value="true">Δημοσιευμένα</option>
              <option value="false">Προσχέδια</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

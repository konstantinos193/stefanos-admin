'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, User, Building, Calendar, CreditCard, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { usersApi } from '@/lib/api/users'
import { propertiesApi } from '@/lib/api/properties'
import { bookingsApi } from '@/lib/api/bookings'
import { paymentsApi } from '@/lib/api/payments'
import { User as UserType, Property, Booking } from '@/lib/api/types'
import { Payment } from '@/lib/api/payments'
import { matchesSearch } from '@/lib/utils/textNormalization'

interface SearchResult {
  type: 'user' | 'property' | 'booking' | 'payment'
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode
  url: string
}

export function GlobalSearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const search = async () => {
      setLoading(true)
      setIsOpen(true)
      
      try {
        const searchResults: SearchResult[] = []
        
        // Search all entities in parallel
        const [users, properties, bookings, payments] = await Promise.all([
          usersApi.getAllForExport().catch(() => [] as UserType[]),
          propertiesApi.getAllForSearch().catch(() => [] as Property[]),
          bookingsApi.getAllForSearch().catch(() => [] as Booking[]),
          paymentsApi.getAllForSearch().catch(() => [] as Payment[]),
        ])
        
        // Search users (accent-insensitive and case-insensitive)
        users
          .filter((user) => {
            return (
              matchesSearch(user.name || '', query) ||
              matchesSearch(user.email, query) ||
              matchesSearch(user.phone || '', query)
            )
          })
          .slice(0, 3)
          .forEach((user) => {
            searchResults.push({
              type: 'user',
              id: user.id,
              title: user.name || user.email,
              subtitle: user.email,
              icon: <User className="h-4 w-4" />,
              url: `/users`,
            })
          })

        // Search properties (accent-insensitive and case-insensitive)
        properties
          .filter((property) => {
            return (
              matchesSearch(property.titleGr, query) ||
              matchesSearch(property.titleEn, query) ||
              matchesSearch(property.address, query) ||
              matchesSearch(property.city, query) ||
              matchesSearch(property.descriptionGr || '', query) ||
              matchesSearch(property.descriptionEn || '', query)
            )
          })
          .slice(0, 3)
          .forEach((property) => {
            searchResults.push({
              type: 'property',
              id: property.id,
              title: property.titleGr || property.titleEn,
              subtitle: `${property.city}, ${property.address}`,
              icon: <Building className="h-4 w-4" />,
              url: `/properties`,
            })
          })

        // Search bookings (accent-insensitive and case-insensitive)
        bookings
          .filter((booking) => {
            return (
              matchesSearch(booking.guestName, query) ||
              matchesSearch(booking.guestEmail, query) ||
              matchesSearch(booking.guestPhone || '', query) ||
              matchesSearch(booking.id, query) ||
              matchesSearch(booking.property?.titleGr || '', query) ||
              matchesSearch(booking.property?.titleEn || '', query)
            )
          })
          .slice(0, 3)
          .forEach((booking) => {
            searchResults.push({
              type: 'booking',
              id: booking.id,
              title: booking.guestName || booking.guestEmail,
              subtitle: booking.property?.titleGr || booking.property?.titleEn || `Κράτηση ${booking.id.slice(0, 8)}`,
              icon: <Calendar className="h-4 w-4" />,
              url: `/bookings`,
            })
          })

        // Search payments (accent-insensitive and case-insensitive)
        payments
          .filter((payment) => {
            return (
              matchesSearch(payment.id, query) ||
              matchesSearch(payment.transactionId || '', query) ||
              matchesSearch(payment.booking?.guestName || '', query) ||
              matchesSearch(payment.property?.titleGr || '', query) ||
              matchesSearch(payment.property?.titleEn || '', query)
            )
          })
          .slice(0, 3)
          .forEach((payment) => {
            searchResults.push({
              type: 'payment',
              id: payment.id,
              title: `Πληρωμή ${payment.id.slice(0, 8)}`,
              subtitle: `${payment.amount} ${payment.currency} - ${payment.booking?.guestName || 'N/A'}`,
              icon: <CreditCard className="h-4 w-4" />,
              url: `/payments`,
            })
          })

        // Sort by relevance (exact matches first, then partial)
        const normalizedQuery = query.trim()
        searchResults.sort((a, b) => {
          const aExact = matchesSearch(a.title, normalizedQuery) && a.title.toLowerCase() === normalizedQuery.toLowerCase()
          const bExact = matchesSearch(b.title, normalizedQuery) && b.title.toLowerCase() === normalizedQuery.toLowerCase()
          if (aExact && !bExact) return -1
          if (!aExact && bExact) return 1
          return 0
        })

        setResults(searchResults.slice(0, 10)) // Limit to 10 total results
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(search, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleResultClick = (result: SearchResult) => {
    setQuery('')
    setIsOpen(false)
    router.push(result.url)
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={searchRef}>
      <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-lg px-4 py-2 min-w-[300px]">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Αναζήτηση..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && setIsOpen(true)}
          className="bg-transparent border-none outline-none text-sm flex-1 text-gray-700 placeholder-gray-400"
        />
        {query && (
          <button
            onClick={handleClear}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3 w-3 text-gray-400" />
          </button>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && (query.trim().length >= 2 || results.length > 0) && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Αναζήτηση...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="w-full px-4 py-3 hover:bg-gray-50 flex items-center space-x-3 text-left transition-colors border-b border-gray-100 last:border-b-0"
                >
                  <div className="text-gray-400 flex-shrink-0">{result.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {result.title}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {result.subtitle}
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 capitalize flex-shrink-0">
                    {result.type === 'user' 
                      ? 'Χρήστης' 
                      : result.type === 'property' 
                      ? 'Ακίνητο' 
                      : result.type === 'booking'
                      ? 'Κράτηση'
                      : 'Πληρωμή'}
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Δεν βρέθηκαν αποτελέσματα
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}


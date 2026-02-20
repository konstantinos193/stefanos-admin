'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, User, ChevronRight, Home, X, ArrowRight } from 'lucide-react'
import { NotificationPopup } from './NotificationPopup'

const pageNames: Record<string, string> = {
  '/dashboard': 'Πίνακας Ελέγχου',
  '/bookings': 'Κρατήσεις',
  '/rooms': 'Δωμάτια',
  '/cleaning': 'Καθαρισμός',
  '/maintenance': 'Συντήρηση',
  '/messages': 'Μηνύματα',
  '/properties': 'Ακίνητα',
  '/property-groups': 'Ομάδες Ακινήτων',
  '/users': 'Χρήστες',
  '/payments': 'Πληρωμές',
  '/reviews': 'Αξιολογήσεις',
  '/content': 'Περιεχόμενο',
  '/services': 'Υπηρεσίες',
  '/knowledge': 'Βάση Γνώσης',
  '/analytics': 'Αναλυτικά',
  '/reports': 'Αναφορές',
  '/audit-logs': 'Αρχείο Ελέγχου',
  '/notifications': 'Ειδοποιήσεις',
  '/settings': 'Ρυθμίσεις',
  '/help': 'Βοήθεια',
}

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchValue, setSearchValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Sync search value from URL when on /bookings
  useEffect(() => {
    if (pathname === '/bookings') {
      const urlSearch = searchParams.get('search') || ''
      setSearchValue(urlSearch)
    }
  }, [pathname, searchParams])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Keyboard shortcut: Ctrl+K or / to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        inputRef.current?.blur()
        setIsFocused(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = useCallback((value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return
    router.push(`/bookings?search=${encodeURIComponent(trimmed)}`)
    setIsFocused(false)
    inputRef.current?.blur()
  }, [router])

  const handleClear = useCallback(() => {
    setSearchValue('')
    if (pathname === '/bookings') {
      router.push('/bookings')
    }
    inputRef.current?.focus()
  }, [pathname, router])

  const currentPage = pageNames[pathname] || 'Πίνακας Ελέγχου'
  const isHome = pathname === '/dashboard'

  return (
    <header className="header h-16 flex items-center justify-between px-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-base">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors"
        >
          <Home className="h-5 w-5" />
          <span className="font-medium">Αρχική</span>
        </Link>
        {!isHome && (
          <>
            <ChevronRight className="h-4 w-4 text-slate-600" />
            <span className="font-semibold text-slate-100">{currentPage}</span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div ref={wrapperRef} className="hidden md:block relative">
          <div className={`flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2.5 min-w-[280px] border transition-colors ${
            isFocused ? 'border-blue-500/60 ring-1 ring-blue-500/20' : 'border-slate-700'
          }`}>
            <Search className={`h-5 w-5 shrink-0 transition-colors ${isFocused ? 'text-blue-400' : 'text-slate-400'}`} />
            <input
              ref={inputRef}
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch(searchValue)
              }}
              placeholder="Αναζήτηση κρατήσεων..."
              className="bg-transparent border-none outline-none text-base flex-1 text-slate-200 placeholder-slate-500"
            />
            {searchValue && (
              <button
                onClick={handleClear}
                className="p-0.5 hover:bg-slate-700 rounded-md transition-colors shrink-0"
              >
                <X className="h-4 w-4 text-slate-400" />
              </button>
            )}
            {!searchValue && !isFocused && (
              <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-700/50 rounded border border-slate-600/50">
                Ctrl+K
              </kbd>
            )}
          </div>

          {/* Search hint dropdown */}
          {isFocused && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-[#334155] rounded-xl shadow-2xl z-50 overflow-hidden">
              {searchValue.trim() ? (
                <button
                  onClick={() => handleSearch(searchValue)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                    <Search className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-200 truncate">
                      Αναζήτηση &ldquo;<span className="font-semibold text-white">{searchValue.trim()}</span>&rdquo; στις κρατήσεις
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Όνομα, email, τηλέφωνο, ID κράτησης, ακίνητο</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-700/50 rounded border border-slate-600/50">
                      Enter
                    </kbd>
                    <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                  </div>
                </button>
              ) : (
                <div className="px-4 py-3">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Αναζήτηση με</p>
                  <div className="space-y-1.5">
                    {[
                      'Όνομα επισκέπτη',
                      'Email ή τηλέφωνο',
                      'ID κράτησης',
                      'Όνομα ακινήτου',
                    ].map((hint) => (
                      <div key={hint} className="flex items-center gap-2 text-sm text-slate-400">
                        <span className="w-1 h-1 rounded-full bg-slate-600" />
                        {hint}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Notifications */}
        <NotificationPopup />

        {/* User Menu */}
        <Link 
          href="/settings"
          className="flex items-center gap-2 p-2 rounded-xl hover:bg-slate-700 transition-colors"
        >
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <span className="hidden md:block text-base font-medium text-slate-300">Διαχειριστής</span>
        </Link>
      </div>
    </header>
  )
}


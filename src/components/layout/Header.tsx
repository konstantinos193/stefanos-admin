'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Search, Bell, User, ChevronRight, Home } from 'lucide-react'

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
        <div className="hidden md:flex items-center gap-2 bg-slate-800 rounded-xl px-4 py-2.5 min-w-[280px] border border-slate-700">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Αναζήτηση..."
            className="bg-transparent border-none outline-none text-base flex-1 text-slate-200 placeholder-slate-500"
          />
        </div>

        {/* Notifications */}
        <Link 
          href="/notifications"
          className="relative p-3 rounded-xl hover:bg-slate-700 transition-colors"
        >
          <Bell className="h-5 w-5 text-slate-300" />
          <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
        </Link>

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


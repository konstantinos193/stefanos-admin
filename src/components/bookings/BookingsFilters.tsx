'use client'

import { Search, Filter, CalendarDays } from 'lucide-react'

export function BookingsFilters() {
  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Αναζήτηση με όνομα, email ή ID κράτησης..."
            className="input pl-12"
          />
        </div>

        {/* Filters row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <select className="input w-full sm:w-52">
            <option>Όλες οι Καταστάσεις</option>
            <option>Επιβεβαιωμένη</option>
            <option>Σε Αναμονή</option>
            <option>Ακυρωμένη</option>
            <option>Ολοκληρωμένη</option>
          </select>

          <div className="relative">
            <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="date"
              className="input w-full sm:w-48 pl-10"
            />
          </div>

          <button className="btn btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
            <Filter className="h-4 w-4" />
            <span>Φίλτρο</span>
          </button>
        </div>
      </div>
    </div>
  )
}


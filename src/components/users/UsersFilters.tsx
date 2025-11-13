'use client'

import { Search, Filter } from 'lucide-react'

export function UsersFilters() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Αναζήτηση χρηστών..."
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select className="input">
            <option>Όλοι οι Ρόλοι</option>
            <option>Διαχειριστής</option>
            <option>Χρήστης</option>
            <option>Επισκέπτης</option>
          </select>
          <select className="input">
            <option>Όλες οι Καταστάσεις</option>
            <option>Ενεργός</option>
            <option>Ανενεργός</option>
            <option>Σε Αναμονή</option>
          </select>
          <button className="btn btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Φίλτρο</span>
          </button>
        </div>
      </div>
    </div>
  )
}


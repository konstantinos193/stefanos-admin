'use client'

import { Search, Filter } from 'lucide-react'

export function PropertiesFilters() {
  return (
    <div className="card">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties..."
            className="input pl-10"
          />
        </div>
        <div className="flex items-center space-x-3">
          <select className="input">
            <option>All Types</option>
            <option>Apartment</option>
            <option>House</option>
            <option>Villa</option>
            <option>Commercial</option>
          </select>
          <select className="input">
            <option>All Status</option>
            <option>Available</option>
            <option>Rented</option>
            <option>Sold</option>
          </select>
          <select className="input">
            <option>All Locations</option>
            <option>Athens</option>
            <option>Thessaloniki</option>
            <option>Crete</option>
          </select>
          <button className="btn btn-secondary flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>
    </div>
  )
}


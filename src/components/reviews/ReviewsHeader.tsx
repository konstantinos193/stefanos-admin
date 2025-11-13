'use client'

import { Star, Filter, Download } from 'lucide-react'

export function ReviewsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Αξιολογήσεις</h1>
        <p className="text-gray-600 mt-1">Διαχείριση αξιολογήσεων από τους επισκέπτες</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Φίλτρο</span>
        </button>
        <button className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
      </div>
    </div>
  )
}


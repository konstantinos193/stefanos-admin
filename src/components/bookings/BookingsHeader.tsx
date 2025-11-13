'use client'

import { Calendar, Download } from 'lucide-react'

export function BookingsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Κρατήσεις</h1>
        <p className="text-gray-600 mt-1">Διαχείριση όλων των κρατήσεων και των επιδοτήσεων</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
        <button className="btn btn-primary flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Νέα Κράτηση</span>
        </button>
      </div>
    </div>
  )
}


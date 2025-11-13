'use client'

import { Download, Calendar } from 'lucide-react'

export function AnalyticsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Αναλυτικά</h1>
        <p className="text-gray-600 mt-1">Προβολή λεπτομερών αναλυτικών και στατιστικών</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Τελευταίες 30 ημέρες</span>
        </button>
        <button className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Εξαγωγή Αναφοράς</span>
        </button>
      </div>
    </div>
  )
}


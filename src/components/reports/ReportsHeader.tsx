'use client'

import { FileText, Download } from 'lucide-react'

export function ReportsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Αναφορές</h1>
        <p className="text-gray-600 mt-1">Προβολή και δημιουργία αναφορών συστήματος</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-primary flex items-center space-x-2">
          <FileText className="h-4 w-4" />
          <span>Δημιουργία Αναφοράς</span>
        </button>
      </div>
    </div>
  )
}


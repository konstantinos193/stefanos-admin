'use client'

import { Download } from 'lucide-react'

interface PaymentsHeaderProps {
  onExport: () => void
}

export function PaymentsHeader({ onExport }: PaymentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Πληρωμές</h1>
        <p className="text-gray-600 mt-1">Διαχείριση όλων των πληρωμών και συναλλαγών</p>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onExport}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
      </div>
    </div>
  )
}


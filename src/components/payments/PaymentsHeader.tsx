'use client'

import { useState } from 'react'
import { Plus, Download, Filter, Search, CreditCard } from 'lucide-react'

interface PaymentsHeaderProps {
  onSearch?: (query: string) => void
  onFilter?: () => void
  onExport?: () => void
  onCreate?: () => void
  searchValue?: string
  title?: string
  subtitle?: string
}

export function PaymentsHeader({ 
  onSearch, 
  onFilter, 
  onExport,
  onCreate, 
  searchValue = '',
  title = 'Πληρωμές',
  subtitle = 'Διαχείριση όλων των πληρωμών και συναλλαγών'
}: PaymentsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <p className="text-gray-600 mt-1">{subtitle}</p>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={onFilter}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Filter className="h-4 w-4" />
          <span>Φίλτρο</span>
        </button>
        <button
          onClick={onExport}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
        <button
          onClick={onCreate}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Νέα Πληρωμή</span>
        </button>
      </div>
    </div>
  )
}


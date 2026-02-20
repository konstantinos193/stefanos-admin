'use client'

import { useState } from 'react'
import { Download, Calendar, RefreshCw } from 'lucide-react'

export function AnalyticsHeader() {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('30days')

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
    // Trigger data refresh here
  }

  const periods = [
    { value: '7days', label: 'Τελευταίες 7 ημέρες' },
    { value: '30days', label: 'Τελευταίες 30 ημέρες' },
    { value: '90days', label: 'Τελευταίες 90 ημέρες' },
    { value: '1year', label: 'Τελευταίο έτος' },
  ]

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Αναλυτικά</h1>
        <p className="text-gray-600 mt-1">Προβολή λεπτομερών αναλυτικών και στατιστικών</p>
      </div>
      <div className="flex items-center space-x-3">
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {periods.map((period) => (
            <option key={period.value} value={period.value}>
              {period.label}
            </option>
          ))}
        </select>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="btn btn-secondary flex items-center space-x-2 hover:bg-gray-100 transition-colors"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Ανανέωση</span>
        </button>
        
        <button className="btn btn-primary flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <Download className="h-4 w-4" />
          <span>Εξαγωγή Αναφοράς</span>
        </button>
      </div>
    </div>
  )
}


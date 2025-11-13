'use client'

import { BarChart3, TrendingUp } from 'lucide-react'

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Επισκόπηση Εσόδων</h2>
            <p className="text-sm text-gray-600 mt-1">Τελευταίοι 6 μήνες</p>
          </div>
          <BarChart3 className="h-5 w-5 text-blue-500" />
        </div>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-2" />
            <p className="text-gray-600">Οπτικοποίηση γραφήματος</p>
            <p className="text-sm text-gray-400">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>

      {/* Growth Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Τάσεις Ανάπτυξης</h2>
            <p className="text-sm text-gray-600 mt-1">Ανάπτυξη χρηστών και ακινήτων</p>
          </div>
          <TrendingUp className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-12 w-12 text-green-400 mx-auto mb-2" />
            <p className="text-gray-600">Οπτικοποίηση γραφήματος</p>
            <p className="text-sm text-gray-400">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>
    </div>
  )
}


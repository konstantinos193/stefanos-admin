'use client'

import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react'

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Τάσεις Εσόδων</h2>
            <p className="text-sm text-gray-600 mt-1">Μηνιαία έσοδα με την πάροδο του χρόνου</p>
          </div>
          <BarChart3 className="h-5 w-5 text-blue-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Γράφημα Εσόδων</p>
            <p className="text-sm text-gray-400 mt-1">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Κατανομή Χρηστών</h2>
            <p className="text-sm text-gray-600 mt-1">Χρήστες ανά κατηγορία</p>
          </div>
          <PieChart className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg">
          <div className="text-center">
            <PieChart className="h-16 w-16 text-green-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Γράφημα Κατανομής</p>
            <p className="text-sm text-gray-400 mt-1">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Τάσεις Κρατήσεων</h2>
            <p className="text-sm text-gray-600 mt-1">Μοτίβα κρατήσεων με την πάροδο του χρόνου</p>
          </div>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Γράφημα Τάσεων</p>
            <p className="text-sm text-gray-400 mt-1">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Επισκόπηση Δραστηριότητας</h2>
            <p className="text-sm text-gray-600 mt-1">Μετρικές δραστηριότητας συστήματος</p>
          </div>
          <Activity className="h-5 w-5 text-pink-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <Activity className="h-16 w-16 text-pink-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Γράφημα Δραστηριότητας</p>
            <p className="text-sm text-gray-400 mt-1">Απαιτείται ενσωμάτωση βιβλιοθήκης γραφημάτων</p>
          </div>
        </div>
      </div>
    </div>
  )
}


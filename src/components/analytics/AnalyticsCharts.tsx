'use client'

import { BarChart3, PieChart, TrendingUp, Activity } from 'lucide-react'

export function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Revenue Trends</h2>
            <p className="text-sm text-gray-600 mt-1">Monthly revenue over time</p>
          </div>
          <BarChart3 className="h-5 w-5 text-blue-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-blue-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Revenue Chart</p>
            <p className="text-sm text-gray-400 mt-1">Chart library integration needed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Distribution</h2>
            <p className="text-sm text-gray-600 mt-1">Users by category</p>
          </div>
          <PieChart className="h-5 w-5 text-green-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-green-50 to-cyan-50 rounded-lg">
          <div className="text-center">
            <PieChart className="h-16 w-16 text-green-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Distribution Chart</p>
            <p className="text-sm text-gray-400 mt-1">Chart library integration needed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Booking Trends</h2>
            <p className="text-sm text-gray-600 mt-1">Booking patterns over time</p>
          </div>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
          <div className="text-center">
            <TrendingUp className="h-16 w-16 text-orange-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Trend Chart</p>
            <p className="text-sm text-gray-400 mt-1">Chart library integration needed</p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Activity Overview</h2>
            <p className="text-sm text-gray-600 mt-1">System activity metrics</p>
          </div>
          <Activity className="h-5 w-5 text-pink-500" />
        </div>
        <div className="h-80 flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg">
          <div className="text-center">
            <Activity className="h-16 w-16 text-pink-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">Activity Chart</p>
            <p className="text-sm text-gray-400 mt-1">Chart library integration needed</p>
          </div>
        </div>
      </div>
    </div>
  )
}


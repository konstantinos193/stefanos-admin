'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Eye, Users, DollarSign, Calendar, Loader2 } from 'lucide-react'
import { analyticsApi, type AnalyticsMetrics, type AnalyticsPeriod } from '@/lib/api/analytics'

const defaultPeriod: AnalyticsPeriod = {
  period: 'MONTHLY',
  startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  endDate: new Date().toISOString().split('T')[0],
}

const metricConfig = [
  {
    key: 'pageViews' as keyof AnalyticsMetrics,
    title: 'Προβολές Σελίδας',
    icon: Eye,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-600',
  },
  {
    key: 'activeUsers' as keyof AnalyticsMetrics,
    title: 'Ενεργοί Χρήστες',
    icon: Users,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
    textColor: 'text-green-600',
  },
  {
    key: 'revenue' as keyof AnalyticsMetrics,
    title: 'Έσοδα',
    icon: DollarSign,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-600',
  },
  {
    key: 'bookings' as keyof AnalyticsMetrics,
    title: 'Κρατήσεις',
    icon: Calendar,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-600',
  },
]

export function AnalyticsMetrics() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        const data = await analyticsApi.getDashboardMetrics(defaultPeriod)
        setMetrics(data)
      } catch (err) {
        console.error('Failed to fetch analytics metrics:', err)
        setError('Αποτυχία φόρτωσης δεδομένων')
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metricConfig.map((config) => (
          <div key={config.key} className="card">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || !metrics) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <p className="text-red-600">{error || 'Δεν βρέθηκαν δεδομένα'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricConfig.map((config) => {
        const Icon = config.icon
        const value = metrics[config.key]
        const changeKey = `${config.key}Change` as keyof AnalyticsMetrics
        const change = metrics[changeKey] as number
        const trend = change >= 0 ? 'up' : 'down'
        const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div key={config.key} className="card hover:shadow-lg transition-all duration-200 border border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{config.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {config.key === 'revenue' 
                    ? `€${value.toLocaleString('el-GR')}`
                    : value.toLocaleString('el-GR')
                  }
                </p>
                <div className={`flex items-center space-x-1 mt-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {trend === 'up' ? '+' : ''}{change}%
                  </span>
                  <span className="text-sm text-gray-500">vs προηγ. περίοδο</span>
                </div>
              </div>
              <div className={`${config.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${config.textColor}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


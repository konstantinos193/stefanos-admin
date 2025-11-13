'use client'

import { TrendingUp, TrendingDown, Eye, Users, DollarSign, Calendar } from 'lucide-react'

const metrics = [
  {
    title: 'Προβολές Σελίδας',
    value: '45,231',
    change: '+12.5%',
    trend: 'up',
    icon: Eye,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Ενεργοί Χρήστες',
    value: '2,543',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Έσοδα',
    value: '€124,567',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Κρατήσεις',
    value: '456',
    change: '-3.1%',
    trend: 'down',
    icon: Calendar,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
]

export function AnalyticsMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon
        const TrendIcon = metric.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div key={metric.title} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                <div className={`flex items-center space-x-1 mt-2 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{metric.change}</span>
                  <span className="text-sm text-gray-500">σε σχέση με την προηγούμενη περίοδο</span>
                </div>
              </div>
              <div className={`${metric.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${metric.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


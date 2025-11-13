'use client'

import { Users, Building2, Calendar, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

const stats = [
  {
    title: 'Total Users',
    value: '2,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Properties',
    value: '1,234',
    change: '+8.2%',
    trend: 'up',
    icon: Building2,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Bookings',
    value: '456',
    change: '-3.1%',
    trend: 'down',
    icon: Calendar,
    color: 'bg-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Revenue',
    value: '$124,567',
    change: '+15.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown
        
        return (
          <div key={stat.title} className="card hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className={`flex items-center space-x-1 mt-2 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}


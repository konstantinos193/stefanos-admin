'use client'

import { Clock, User, Building2, Calendar } from 'lucide-react'

const activities = [
  {
    type: 'user',
    title: 'New user registered',
    description: 'John Doe created an account',
    time: '2 minutes ago',
    icon: User,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    type: 'property',
    title: 'Property added',
    description: 'New property listed in Athens',
    time: '15 minutes ago',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    type: 'booking',
    title: 'Booking confirmed',
    description: 'Booking #1234 confirmed',
    time: '1 hour ago',
    icon: Calendar,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    type: 'user',
    title: 'User updated profile',
    description: 'Jane Smith updated her profile',
    time: '2 hours ago',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    type: 'property',
    title: 'Property updated',
    description: 'Property #567 updated',
    time: '3 hours ago',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

export function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <Clock className="h-5 w-5 text-gray-400" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              <div className={`${activity.bgColor} p-2 rounded-lg`}>
                <Icon className={`h-4 w-4 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                <p className="text-sm text-gray-600 mt-0.5">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


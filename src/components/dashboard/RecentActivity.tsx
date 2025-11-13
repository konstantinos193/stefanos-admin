'use client'

import { Clock, User, Building2, Calendar } from 'lucide-react'

const activities = [
  {
    type: 'user',
    title: 'Νέος χρήστης εγγράφηκε',
    description: 'Ο John Doe δημιούργησε λογαριασμό',
    time: 'πριν 2 λεπτά',
    icon: User,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
  },
  {
    type: 'property',
    title: 'Προστέθηκε ακίνητο',
    description: 'Νέο ακίνητο καταχωρήθηκε στην Αθήνα',
    time: 'πριν 15 λεπτά',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    type: 'booking',
    title: 'Επιβεβαιώθηκε κράτηση',
    description: 'Η κράτηση #1234 επιβεβαιώθηκε',
    time: 'πριν 1 ώρα',
    icon: Calendar,
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
  },
  {
    type: 'user',
    title: 'Ενημερώθηκε προφίλ χρήστη',
    description: 'Η Jane Smith ενημέρωσε το προφίλ της',
    time: 'πριν 2 ώρες',
    icon: User,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    type: 'property',
    title: 'Ενημερώθηκε ακίνητο',
    description: 'Το ακίνητο #567 ενημερώθηκε',
    time: 'πριν 3 ώρες',
    icon: Building2,
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
  },
]

export function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Πρόσφατη Δραστηριότητα</h2>
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


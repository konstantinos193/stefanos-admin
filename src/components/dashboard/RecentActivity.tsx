'use client'

import { Clock, User, Building2, Calendar } from 'lucide-react'

const activities = [
  {
    type: 'user',
    title: 'Νέος χρήστης εγγράφηκε',
    description: 'Ο John Doe δημιούργησε λογαριασμό',
    time: 'πριν 2 λεπτά',
    icon: User,
    color: 'text-green-400',
    bgColor: 'bg-green-500/15',
  },
  {
    type: 'property',
    title: 'Προστέθηκε ακίνητο',
    description: 'Νέο ακίνητο καταχωρήθηκε στην Αθήνα',
    time: 'πριν 15 λεπτά',
    icon: Building2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
  },
  {
    type: 'booking',
    title: 'Επιβεβαιώθηκε κράτηση',
    description: 'Η κράτηση #1234 επιβεβαιώθηκε',
    time: 'πριν 1 ώρα',
    icon: Calendar,
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/15',
  },
  {
    type: 'user',
    title: 'Ενημερώθηκε προφίλ χρήστη',
    description: 'Η Jane Smith ενημέρωσε το προφίλ της',
    time: 'πριν 2 ώρες',
    icon: User,
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/15',
  },
  {
    type: 'property',
    title: 'Ενημερώθηκε ακίνητο',
    description: 'Το ακίνητο #567 ενημερώθηκε',
    time: 'πριν 3 ώρες',
    icon: Building2,
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/15',
  },
]

export function RecentActivity() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Πρόσφατη Δραστηριότητα</h2>
        <Clock className="h-5 w-5 text-slate-500" />
      </div>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon
          return (
            <div key={index} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
              <div className={`${activity.bgColor} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`h-5 w-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-100">{activity.title}</p>
                <p className="text-sm text-slate-400 mt-1">{activity.description}</p>
                <p className="text-sm text-slate-500 mt-2">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}


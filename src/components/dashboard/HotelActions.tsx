'use client'

import Link from 'next/link'
import { Calendar, DoorOpen, Sparkles, Wrench, Briefcase, BookOpen } from 'lucide-react'

const actions = [
  {
    label: 'Κρατήσεις',
    description: 'Προβολή & διαχείριση κρατήσεων',
    icon: Calendar,
    href: '/bookings',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-400',
  },
  {
    label: 'Δωμάτια',
    description: 'Διαχείριση δωματίων ξενοδοχείου',
    icon: DoorOpen,
    href: '/rooms',
    iconBg: 'bg-indigo-500/15',
    iconColor: 'text-indigo-400',
  },
  {
    label: 'Καθαρισμός',
    description: 'Πρόγραμμα καθαριότητας',
    icon: Sparkles,
    href: '/cleaning',
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
  },
  {
    label: 'Συντήρηση',
    description: 'Αιτήματα & επισκευές',
    icon: Wrench,
    href: '/maintenance',
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
  },
  {
    label: 'Υπηρεσίες',
    description: 'Υπηρεσίες ξενοδοχείου',
    icon: Briefcase,
    href: '/services',
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
  },
  {
    label: 'Βάση Γνώσης',
    description: 'Πληροφορίες & οδηγίες',
    icon: BookOpen,
    href: '/knowledge',
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
  },
]

export function HotelActions() {
  return (
    <div className="rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-slate-900/50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-orange-500/15 p-3 rounded-xl">
          <Calendar className="h-7 w-7 text-orange-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Incanto Hotel</h2>
          <p className="text-sm text-slate-400">Διαχείριση ξενοδοχείου & κρατήσεων</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-orange-500/20 transition-all duration-200 group"
            >
              <div className={`${action.iconBg} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-100 group-hover:text-orange-300 transition-colors">
                  {action.label}
                </p>
                <p className="text-sm text-slate-400">{action.description}</p>
              </div>
              <svg className="h-5 w-5 text-slate-600 group-hover:text-orange-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

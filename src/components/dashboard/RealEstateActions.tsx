'use client'

import Link from 'next/link'
import { Building2, Layers, Star, FileEdit, Users } from 'lucide-react'

const actions = [
  {
    label: 'Ακίνητα',
    description: 'Προβολή & επεξεργασία ακινήτων',
    icon: Building2,
    href: '/properties',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-400',
  },
  {
    label: 'Ομάδες Ακινήτων',
    description: 'Οργάνωση σε ομάδες',
    icon: Layers,
    href: '/property-groups',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
  },
  {
    label: 'Αξιολογήσεις',
    description: 'Κριτικές πελατών',
    icon: Star,
    href: '/reviews',
    iconBg: 'bg-yellow-500/15',
    iconColor: 'text-yellow-400',
  },
  {
    label: 'Περιεχόμενο',
    description: 'Κείμενα & φωτογραφίες',
    icon: FileEdit,
    href: '/content',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
  {
    label: 'Χρήστες',
    description: 'Διαχείριση χρηστών',
    icon: Users,
    href: '/users',
    iconBg: 'bg-green-500/15',
    iconColor: 'text-green-400',
  },
]

export function RealEstateActions() {
  return (
    <div className="rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-slate-900/50 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-purple-500/15 p-3 rounded-xl">
          <Building2 className="h-7 w-7 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Stefanos Real Estate</h2>
          <p className="text-sm text-slate-400">Διαχείριση ακινήτων & ιστοσελίδας</p>
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
              className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-transparent hover:border-purple-500/20 transition-all duration-200 group"
            >
              <div className={`${action.iconBg} p-3 rounded-xl flex-shrink-0`}>
                <Icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
                  {action.label}
                </p>
                <p className="text-sm text-slate-400">{action.description}</p>
              </div>
              <svg className="h-5 w-5 text-slate-600 group-hover:text-purple-400 transition-colors flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

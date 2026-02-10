'use client'

import Link from 'next/link'
import { Calendar, Building2, CreditCard, Wrench, MessageSquare, Settings } from 'lucide-react'

const actions = [
  { 
    label: 'Κρατήσεις', 
    description: 'Δείτε & διαχειριστείτε κρατήσεις',
    icon: Calendar, 
    color: 'bg-orange-500/10 hover:bg-orange-500/20 border-orange-500/20',
    iconColor: 'text-orange-400',
    href: '/bookings' 
  },
  { 
    label: 'Ακίνητα', 
    description: 'Διαχείριση ακινήτων',
    icon: Building2, 
    color: 'bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/20',
    iconColor: 'text-purple-400',
    href: '/properties' 
  },
  { 
    label: 'Πληρωμές', 
    description: 'Κατάσταση πληρωμών',
    icon: CreditCard, 
    color: 'bg-green-500/10 hover:bg-green-500/20 border-green-500/20',
    iconColor: 'text-green-400',
    href: '/payments' 
  },
  { 
    label: 'Συντήρηση', 
    description: 'Αιτήματα & επισκευές',
    icon: Wrench, 
    color: 'bg-red-500/10 hover:bg-red-500/20 border-red-500/20',
    iconColor: 'text-red-400',
    href: '/maintenance' 
  },
  { 
    label: 'Μηνύματα', 
    description: 'Επικοινωνία με πελάτες',
    icon: MessageSquare, 
    color: 'bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/20',
    iconColor: 'text-blue-400',
    href: '/messages' 
  },
  { 
    label: 'Ρυθμίσεις', 
    description: 'Ρυθμίσεις συστήματος',
    icon: Settings, 
    color: 'bg-slate-500/10 hover:bg-slate-500/20 border-slate-500/20',
    iconColor: 'text-slate-400',
    href: '/settings' 
  },
]

export function QuickActions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-100 mb-4">Γρήγορες Ενέργειες</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`${action.color} border rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-all duration-200 hover:shadow-lg hover:shadow-black/20`}
            >
              <div className="p-3 bg-slate-800 rounded-xl">
                <Icon className={`h-7 w-7 ${action.iconColor}`} />
              </div>
              <div>
                <span className="text-base font-semibold text-slate-100 block">{action.label}</span>
                <span className="text-xs text-slate-400 mt-1 block">{action.description}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}


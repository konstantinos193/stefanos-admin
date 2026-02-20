'use client'

import Link from 'next/link'
import { 
  CreditCard, 
  BarChart3, 
  FileText, 
  Bell, 
  Settings, 
  HelpCircle, 
  FileSearch, 
  MessageSquare 
} from 'lucide-react'

const actions = [
  {
    label: 'Πληρωμές',
    description: 'Κατάσταση πληρωμών',
    icon: CreditCard,
    href: '/payments',
    iconColor: 'text-emerald-400',
    iconBg: 'bg-emerald-500/15',
  },
  {
    label: 'Μηνύματα',
    description: 'Επικοινωνία πελατών',
    icon: MessageSquare,
    href: '/messages',
    iconColor: 'text-blue-400',
    iconBg: 'bg-blue-500/15',
  },
  {
    label: 'Αναλυτικά',
    description: 'Στατιστικά & γραφήματα',
    icon: BarChart3,
    href: '/analytics',
    iconColor: 'text-pink-400',
    iconBg: 'bg-pink-500/15',
  },
  {
    label: 'Αναφορές',
    description: 'Αναφορές & εξαγωγές',
    icon: FileText,
    href: '/reports',
    iconColor: 'text-cyan-400',
    iconBg: 'bg-cyan-500/15',
  },
  {
    label: 'Αρχείο Ελέγχου',
    description: 'Ιστορικό ενεργειών',
    icon: FileSearch,
    href: '/audit-logs',
    iconColor: 'text-gray-400',
    iconBg: 'bg-gray-500/15',
  },
  {
    label: 'Ειδοποιήσεις',
    description: 'Ειδοποιήσεις συστήματος',
    icon: Bell,
    href: '/notifications',
    iconColor: 'text-red-400',
    iconBg: 'bg-red-500/15',
  },
  {
    label: 'Ρυθμίσεις',
    description: 'Ρυθμίσεις συστήματος',
    icon: Settings,
    href: '/settings',
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-500/15',
  },
  {
    label: 'Βοήθεια',
    description: 'Οδηγίες & υποστήριξη',
    icon: HelpCircle,
    href: '/help',
    iconColor: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15',
  },
]

export function SystemActions() {
  return (
    <div>
      <h2 className="text-xl font-bold text-slate-100 mb-4">Γενικά & Σύστημα</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-3 p-5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 group text-center"
            >
              <div className={`${action.iconBg} p-3 rounded-xl`}>
                <Icon className={`h-6 w-6 ${action.iconColor}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100 group-hover:text-white transition-colors">
                  {action.label}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{action.description}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

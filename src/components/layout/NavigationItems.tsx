'use client'

import Link from 'next/link'
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Settings, 
  BarChart3,
  Calendar,
  FileText,
  Bell,
  HelpCircle,
  CreditCard,
  Star,
  Wrench,
  DoorOpen,
  Layers,
  Sparkles,
  MessageSquare,
  FileEdit,
  Briefcase,
  BookOpen,
  FileSearch
} from 'lucide-react'
import clsx from 'clsx'

interface NavigationItemsProps {
  pathname: string
}

interface NavSection {
  title: string
  items: {
    href: string
    label: string
    icon: typeof LayoutDashboard
    color: string
  }[]
}

const navSections: NavSection[] = [
  {
    title: 'Αρχική',
    items: [
      { href: '/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutDashboard, color: 'text-blue-600' },
    ],
  },
  {
    title: 'Καθημερινές Λειτουργίες',
    items: [
      { href: '/bookings', label: 'Κρατήσεις', icon: Calendar, color: 'text-orange-600' },
      { href: '/rooms', label: 'Δωμάτια', icon: DoorOpen, color: 'text-indigo-600' },
      { href: '/cleaning', label: 'Καθαρισμός', icon: Sparkles, color: 'text-cyan-600' },
      { href: '/maintenance', label: 'Συντήρηση', icon: Wrench, color: 'text-red-600' },
      { href: '/messages', label: 'Μηνύματα', icon: MessageSquare, color: 'text-blue-600' },
    ],
  },
  {
    title: 'Διαχείριση',
    items: [
      { href: '/properties', label: 'Ακίνητα', icon: Building2, color: 'text-purple-600' },
      { href: '/property-groups', label: 'Ομάδες Ακινήτων', icon: Layers, color: 'text-teal-600' },
      { href: '/users', label: 'Χρήστες', icon: Users, color: 'text-green-600' },
      { href: '/payments', label: 'Πληρωμές', icon: CreditCard, color: 'text-emerald-600' },
      { href: '/reviews', label: 'Αξιολογήσεις', icon: Star, color: 'text-yellow-600' },
    ],
  },
  {
    title: 'Περιεχόμενο & Υπηρεσίες',
    items: [
      { href: '/content', label: 'Περιεχόμενο', icon: FileEdit, color: 'text-violet-600' },
      { href: '/services', label: 'Υπηρεσίες', icon: Briefcase, color: 'text-amber-600' },
      { href: '/knowledge', label: 'Βάση Γνώσης', icon: BookOpen, color: 'text-slate-600' },
    ],
  },
  {
    title: 'Αναφορές & Σύστημα',
    items: [
      { href: '/analytics', label: 'Αναλυτικά', icon: BarChart3, color: 'text-pink-600' },
      { href: '/reports', label: 'Αναφορές', icon: FileText, color: 'text-cyan-600' },
      { href: '/audit-logs', label: 'Αρχείο Ελέγχου', icon: FileSearch, color: 'text-gray-700' },
      { href: '/notifications', label: 'Ειδοποιήσεις', icon: Bell, color: 'text-red-600' },
      { href: '/settings', label: 'Ρυθμίσεις', icon: Settings, color: 'text-gray-600' },
      { href: '/help', label: 'Βοήθεια', icon: HelpCircle, color: 'text-indigo-600' },
    ],
  },
]

export function NavigationItems({ pathname }: NavigationItemsProps) {
  return (
    <div className="space-y-5 px-3">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 mb-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150 group',
                      isActive
                        ? 'bg-blue-500/15 text-blue-400 shadow-sm border border-blue-500/20'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100'
                    )}
                  >
                    <Icon className={clsx(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'
                    )} />
                    <span className={clsx(
                      'text-[15px]',
                      isActive ? 'font-semibold' : 'font-medium'
                    )}>
                      {item.label}
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}


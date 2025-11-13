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
  FileSearch,
  DollarSign
} from 'lucide-react'
import clsx from 'clsx'

interface NavigationItemsProps {
  isOpen: boolean
  pathname: string
}

const navItems = [
  { href: '/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutDashboard, color: 'text-blue-500' },
  { href: '/users', label: 'Χρήστες', icon: Users, color: 'text-green-500' },
  { href: '/properties', label: 'Ακίνητα', icon: Building2, color: 'text-purple-500' },
  { href: '/bookings', label: 'Κρατήσεις', icon: Calendar, color: 'text-orange-500' },
  { href: '/payments', label: 'Πληρωμές', icon: CreditCard, color: 'text-emerald-500' },
  { href: '/reviews', label: 'Αξιολογήσεις', icon: Star, color: 'text-yellow-500' },
  { href: '/maintenance', label: 'Συντήρηση', icon: Wrench, color: 'text-red-600' },
  { href: '/rooms', label: 'Δωμάτια', icon: DoorOpen, color: 'text-indigo-500' },
  { href: '/property-groups', label: 'Ομάδες Ακινήτων', icon: Layers, color: 'text-teal-500' },
  { href: '/cleaning', label: 'Καθαρισμός', icon: Sparkles, color: 'text-cyan-500' },
  { href: '/messages', label: 'Μηνύματα', icon: MessageSquare, color: 'text-blue-600' },
  { href: '/content', label: 'Διαχείριση Περιεχομένου', icon: FileEdit, color: 'text-violet-500' },
  { href: '/services', label: 'Υπηρεσίες', icon: Briefcase, color: 'text-amber-500' },
  { href: '/knowledge', label: 'Βάση Γνώσης', icon: BookOpen, color: 'text-slate-500' },
  { href: '/analytics', label: 'Αναλυτικά', icon: BarChart3, color: 'text-pink-500' },
  { href: '/reports', label: 'Αναφορές', icon: FileText, color: 'text-cyan-500' },
  { href: '/audit-logs', label: 'Αρχείο Ελέγχου', icon: FileSearch, color: 'text-gray-700' },
  { href: '/notifications', label: 'Ειδοποιήσεις', icon: Bell, color: 'text-red-500' },
  { href: '/settings', label: 'Ρυθμίσεις', icon: Settings, color: 'text-gray-600' },
  { href: '/help', label: 'Βοήθεια', icon: HelpCircle, color: 'text-indigo-500' },
]

export function NavigationItems({ isOpen, pathname }: NavigationItemsProps) {
  return (
    <ul className="space-y-1 px-2">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              className={clsx(
                'flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              )}
            >
              <Icon className={clsx('h-5 w-5 flex-shrink-0', isActive ? item.color : 'text-gray-500 group-hover:text-gray-700')} />
              {isOpen && (
                <span className={clsx('font-medium', isActive && 'font-semibold')}>
                  {item.label}
                </span>
              )}
            </Link>
          </li>
        )
      })}
    </ul>
  )
}


'use client'

import { useState } from 'react'
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
  ChevronDown,
  Globe,
} from 'lucide-react'
import clsx from 'clsx'

interface NavigationItemsProps {
  pathname: string
}

interface NavItem {
  href: string
  label: string
  icon: typeof LayoutDashboard
  color: string
}

interface NavSection {
  title: string
  accent?: string
  activeAccent?: string
  activeBorder?: string
  items: NavItem[]
}

const navSections: NavSection[] = [
  {
    title: 'Αρχική',
    items: [
      { href: '/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutDashboard, color: 'text-blue-600' },
    ],
  },
  {
    title: '🏨 Incanto Hotel',
    accent: 'border-l-orange-500/40',
    activeAccent: 'bg-orange-500/15 text-orange-400',
    activeBorder: 'border-orange-500/20',
    items: [
      { href: '/bookings', label: 'Κρατήσεις', icon: Calendar, color: 'text-orange-500' },
      { href: '/rooms', label: 'Δωμάτια', icon: DoorOpen, color: 'text-indigo-500' },
      { href: '/cleaning', label: 'Καθαρισμός', icon: Sparkles, color: 'text-cyan-500' },
      { href: '/maintenance', label: 'Συντήρηση', icon: Wrench, color: 'text-red-500' },
      { href: '/services', label: 'Υπηρεσίες', icon: Briefcase, color: 'text-amber-500' },
      { href: '/knowledge', label: 'Βάση Γνώσης', icon: BookOpen, color: 'text-slate-500' },
      { href: '/external-bookings', label: 'Εξωτερικές Κρατήσεις', icon: Globe, color: 'text-sky-500' },
    ],
  },
  {
    title: '🏠 Stefanos Real Estate',
    accent: 'border-l-purple-500/40',
    activeAccent: 'bg-purple-500/15 text-purple-400',
    activeBorder: 'border-purple-500/20',
    items: [
      { href: '/properties', label: 'Ακίνητα', icon: Building2, color: 'text-purple-500' },
      { href: '/property-groups', label: 'Ομάδες Ακινήτων', icon: Layers, color: 'text-teal-500' },
      { href: '/content', label: 'Περιεχόμενο', icon: FileEdit, color: 'text-violet-500' },
      { href: '/reviews', label: 'Αξιολογήσεις', icon: Star, color: 'text-yellow-500' },
      { href: '/users', label: 'Χρήστες', icon: Users, color: 'text-green-500' },
    ],
  },
  {
    title: 'Γενικά',
    items: [
      { href: '/payments', label: 'Πληρωμές', icon: CreditCard, color: 'text-emerald-600' },
      { href: '/messages', label: 'Μηνύματα', icon: MessageSquare, color: 'text-blue-600' },
      { href: '/analytics', label: 'Αναλυτικά', icon: BarChart3, color: 'text-pink-600' },
      { href: '/reports', label: 'Αναφορές', icon: FileText, color: 'text-cyan-600' },
      { href: '/audit-logs', label: 'Αρχείο Ελέγχου', icon: FileSearch, color: 'text-gray-500' },
      { href: '/notifications', label: 'Ειδοποιήσεις', icon: Bell, color: 'text-red-600' },
      { href: '/settings', label: 'Ρυθμίσεις', icon: Settings, color: 'text-gray-600' },
      { href: '/help', label: 'Βοήθεια', icon: HelpCircle, color: 'text-indigo-600' },
    ],
  },
]

export function NavigationItems({ pathname }: NavigationItemsProps) {
  // Auto-expand sections that contain the active route
  const getInitialExpanded = () => {
    const expanded: Record<string, boolean> = {}
    navSections.forEach((section) => {
      if (section.accent) {
        const hasActiveItem = section.items.some(
          (item) => pathname === item.href || pathname.startsWith(item.href + '/')
        )
        expanded[section.title] = hasActiveItem
      }
    })
    return expanded
  }

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded)

  const toggleSection = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="space-y-4 px-3">
      {navSections.map((section) => {
        const isBusiness = !!section.accent
        const isExpanded = isBusiness ? expanded[section.title] ?? false : true

        return (
          <div key={section.title}>
            {/* Section header */}
            {isBusiness ? (
              <button
                onClick={() => toggleSection(section.title)}
                className={clsx(
                  'w-full flex items-center justify-between px-3 mb-2 text-xs font-bold uppercase tracking-widest',
                  'text-slate-300 hover:text-slate-100 transition-colors duration-150'
                )}
              >
                <span>{section.title}</span>
                <ChevronDown className={clsx(
                  'h-3.5 w-3.5 text-slate-500 transition-transform duration-200',
                  isExpanded && 'rotate-180'
                )} />
              </button>
            ) : (
              <p className={clsx(
                'px-3 mb-2 text-xs font-bold uppercase tracking-widest',
                'text-slate-500'
              )}>
                {section.title}
              </p>
            )}

            {/* Items wrapper — business sections get a colored left border */}
            <div
              className={clsx(
                'grid transition-[grid-template-rows] duration-200 ease-in-out',
                isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
              )}
            >
              <div className="overflow-hidden">
                <ul className={clsx(
                  'space-y-0.5',
                  isBusiness && `border-l-2 ${section.accent} ml-2 pl-1`
                )}>
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

                    // Business sections use their own accent color for active state
                    const activeClasses = isBusiness && section.activeAccent
                      ? `${section.activeAccent} shadow-sm border ${section.activeBorder}`
                      : 'bg-blue-500/15 text-blue-400 shadow-sm border border-blue-500/20'

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={clsx(
                            'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group',
                            isActive
                              ? activeClasses
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
            </div>
          </div>
        )
      })}
    </div>
  )
}


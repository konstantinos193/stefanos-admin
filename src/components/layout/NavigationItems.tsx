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
  CalendarRange,
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
  isCollapsed: boolean
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
      { href: '/dashboard', label: 'Πίνακας Ελέγχου', icon: LayoutDashboard, color: 'text-blue-400' },
    ],
  },
  {
    title: '🏨 Incanto Hotel',
    accent: 'border-l-orange-500/40',
    activeAccent: 'bg-orange-500/15 text-orange-400',
    activeBorder: 'border-orange-500/20',
    items: [
      { href: '/bookings', label: 'Κρατήσεις', icon: Calendar, color: 'text-orange-400' },
      { href: '/calendar', label: 'Ημερολόγιο', icon: CalendarRange, color: 'text-rose-400' },
      { href: '/rooms', label: 'Δωμάτια', icon: DoorOpen, color: 'text-indigo-400' },
      { href: '/cleaning', label: 'Καθαρισμός', icon: Sparkles, color: 'text-cyan-400' },
      { href: '/maintenance', label: 'Συντήρηση', icon: Wrench, color: 'text-red-400' },
      { href: '/services', label: 'Υπηρεσίες', icon: Briefcase, color: 'text-amber-400' },
      { href: '/knowledge', label: 'Βάση Γνώσης', icon: BookOpen, color: 'text-slate-400' },
      { href: '/external-bookings', label: 'Εξωτερικές Κρατήσεις', icon: Globe, color: 'text-sky-400' },
    ],
  },
  {
    title: '🏠 Stefanos Real Estate',
    accent: 'border-l-purple-500/40',
    activeAccent: 'bg-purple-500/15 text-purple-400',
    activeBorder: 'border-purple-500/20',
    items: [
      { href: '/properties', label: 'Ακίνητα', icon: Building2, color: 'text-purple-400' },
      { href: '/property-groups', label: 'Ομάδες Ακινήτων', icon: Layers, color: 'text-teal-400' },
      { href: '/content', label: 'Περιεχόμενο', icon: FileEdit, color: 'text-violet-400' },
      { href: '/reviews', label: 'Αξιολογήσεις', icon: Star, color: 'text-yellow-400' },
      { href: '/users', label: 'Χρήστες', icon: Users, color: 'text-green-400' },
    ],
  },
  {
    title: 'Γενικά',
    items: [
      { href: '/payments', label: 'Πληρωμές', icon: CreditCard, color: 'text-emerald-400' },
      { href: '/messages', label: 'Μηνύματα', icon: MessageSquare, color: 'text-blue-400' },
      { href: '/analytics', label: 'Αναλυτικά', icon: BarChart3, color: 'text-pink-400' },
      { href: '/reports', label: 'Αναφορές', icon: FileText, color: 'text-cyan-400' },
      { href: '/audit-logs', label: 'Αρχείο Ελέγχου', icon: FileSearch, color: 'text-slate-400' },
      { href: '/notifications', label: 'Ειδοποιήσεις', icon: Bell, color: 'text-red-400' },
      { href: '/settings', label: 'Ρυθμίσεις', icon: Settings, color: 'text-slate-400' },
      { href: '/help', label: 'Βοήθεια', icon: HelpCircle, color: 'text-indigo-400' },
    ],
  },
]

// ── Collapsed: flat icon list with tooltip ────────────────────────────────────

function CollapsedNav({ pathname }: { pathname: string }) {
  const allSections = navSections

  return (
    <div className="flex flex-col gap-1 px-1.5">
      {allSections.map((section, sIdx) => (
        <div key={section.title}>
          {sIdx > 0 && (
            <div className="my-1.5 mx-1 h-px bg-slate-800" />
          )}
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/')

              return (
                <li key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex items-center justify-center w-9 h-9 rounded-xl mx-auto transition-all duration-150',
                      isActive
                        ? 'bg-blue-500/15 border border-blue-500/20'
                        : 'hover:bg-slate-800',
                    )}
                  >
                    <Icon
                      className={clsx(
                        'h-4.5 w-4.5',
                        isActive ? item.color : 'text-slate-500 group-hover:text-slate-300',
                      )}
                    />
                  </Link>

                  {/* Tooltip */}
                  <div
                    className={clsx(
                      'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
                      'bg-slate-800 border border-slate-700/60 text-slate-100 text-xs font-medium',
                      'px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap',
                      'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
                      'transition-all duration-150',
                    )}
                  >
                    {item.label}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

// ── Expanded: sectioned list ──────────────────────────────────────────────────

function ExpandedNav({ pathname }: { pathname: string }) {
  const getInitialExpanded = () => {
    const expanded: Record<string, boolean> = {}
    navSections.forEach((section) => {
      if (section.accent) {
        expanded[section.title] = section.items.some(
          (item) => pathname === item.href || pathname.startsWith(item.href + '/'),
        )
      }
    })
    return expanded
  }

  const [expanded, setExpanded] = useState<Record<string, boolean>>(getInitialExpanded)

  const toggle = (title: string) => {
    setExpanded((prev) => ({ ...prev, [title]: !prev[title] }))
  }

  return (
    <div className="space-y-4 px-3">
      {navSections.map((section) => {
        const isBusiness = !!section.accent
        const isOpen = isBusiness ? (expanded[section.title] ?? false) : true

        return (
          <div key={section.title}>
            {isBusiness ? (
              <button
                onClick={() => toggle(section.title)}
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-bold uppercase tracking-widest text-slate-300 hover:text-slate-100 transition-colors duration-150"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={clsx(
                    'h-3.5 w-3.5 text-slate-500 transition-transform duration-200',
                    isOpen && 'rotate-180',
                  )}
                />
              </button>
            ) : (
              <p className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                {section.title}
              </p>
            )}

            <div
              className={clsx(
                'grid transition-[grid-template-rows] duration-200 ease-in-out',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <ul
                  className={clsx(
                    'space-y-0.5',
                    isBusiness && `border-l-2 ${section.accent} ml-2 pl-1`,
                  )}
                >
                  {section.items.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href || pathname.startsWith(item.href + '/')

                    const activeClasses =
                      isBusiness && section.activeAccent
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
                              : 'text-slate-300 hover:bg-slate-800 hover:text-slate-100',
                          )}
                        >
                          <Icon
                            className={clsx(
                              'h-5 w-5 shrink-0',
                              isActive
                                ? item.color
                                : 'text-slate-500 group-hover:text-slate-300',
                            )}
                          />
                          <span
                            className={clsx(
                              'text-[15px] truncate',
                              isActive ? 'font-semibold' : 'font-medium',
                            )}
                          >
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

// ── Public component ──────────────────────────────────────────────────────────

export function NavigationItems({ pathname, isCollapsed }: NavigationItemsProps) {
  return isCollapsed ? (
    <CollapsedNav pathname={pathname} />
  ) : (
    <ExpandedNav pathname={pathname} />
  )
}

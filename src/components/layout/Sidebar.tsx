'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PanelLeft } from 'lucide-react'
import { NavigationItems } from './NavigationItems'
import { SidebarFooter } from './SidebarFooter'
import clsx from 'clsx'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={clsx(
        'sidebar overflow-x-hidden transition-[width] duration-300 ease-in-out',
        isCollapsed ? 'w-14' : 'w-64',
      )}
    >
      <div className="flex flex-col h-full">
        {/* Logo + Toggle */}
        <div className="flex items-center h-15 px-3 gap-2 border-b border-slate-800 shrink-0">
          <div
            className={clsx(
              'flex-1 overflow-hidden transition-[opacity,width] duration-200',
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100',
            )}
          >
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logoetc.png"
                alt="SMH Holdings"
                width={130}
                height={36}
                className="h-9 w-auto object-contain"
                priority
                unoptimized
              />
            </Link>
          </div>

          <button
            onClick={onToggle}
            className={clsx(
              'shrink-0 flex items-center justify-center w-8 h-8 rounded-lg',
              'text-slate-400 hover:text-slate-100 hover:bg-slate-800',
              'transition-colors duration-150',
            )}
            title={isCollapsed ? 'Ανάπτυξη πλευρικής μπάρας' : 'Σύμπτυξη πλευρικής μπάρας'}
          >
            <PanelLeft
              className={clsx(
                'h-4 w-4 transition-transform duration-300',
                isCollapsed && 'rotate-180',
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3 scrollbar-thin">
          <NavigationItems pathname={pathname} isCollapsed={isCollapsed} />
        </nav>

        {/* Footer */}
        <SidebarFooter isCollapsed={isCollapsed} />
      </div>
    </aside>
  )
}

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavigationItems } from './NavigationItems'
import { SidebarFooter } from './SidebarFooter'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar w-72">
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-5 border-b border-slate-800">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="relative h-11 w-11 flex-shrink-0">
              <Image
                src="/logoetc.png"
                alt="SMH holdings logo"
                width={44}
                height={44}
                className="h-full w-full object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold text-slate-100">SMH Holdings</span>
              <span className="text-sm text-slate-400">Πίνακας Διαχείρισης</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <NavigationItems pathname={pathname} />
        </nav>

        {/* Footer */}
        <SidebarFooter />
      </div>
    </aside>
  )
}

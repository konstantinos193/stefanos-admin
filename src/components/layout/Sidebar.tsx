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
          <Link href="/dashboard" className="flex items-center justify-center">
            <Image
              src="/logoetc.png"
              alt="SMH Holdings"
              width={160}
              height={44}
              className="h-11 w-auto object-contain"
              priority
              unoptimized
            />
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

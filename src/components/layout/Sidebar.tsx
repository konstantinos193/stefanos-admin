'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { NavigationItems } from './NavigationItems'
import { SidebarFooter } from './SidebarFooter'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={`sidebar transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="Stefadash Logo"
                width={40}
                height={40}
                className="h-full w-full object-contain"
                priority
                unoptimized
              />
            </div>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900">Stefadash</span>
                <span className="text-xs text-gray-500">Πίνακας Διαχείρισης</span>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <NavigationItems isOpen={isOpen} pathname={pathname} />
        </nav>

        {/* Footer */}
        <SidebarFooter isOpen={isOpen} />
      </div>
    </aside>
  )
}


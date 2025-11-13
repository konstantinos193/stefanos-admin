'use client'

import { LogOut, User } from 'lucide-react'
import clsx from 'clsx'

interface SidebarFooterProps {
  isOpen: boolean
}

export function SidebarFooter({ isOpen }: SidebarFooterProps) {
  return (
    <div className="border-t border-gray-200 p-4 space-y-2">
      {/* User Profile */}
      <div className={clsx(
        'flex items-center space-x-3 px-3 py-2 rounded-lg bg-gray-100',
        !isOpen && 'justify-center'
      )}>
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        {isOpen && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin User</p>
            <p className="text-xs text-gray-500 truncate">admin@stefanos.com</p>
          </div>
        )}
      </div>

      {/* Logout Button */}
      <button
        className={clsx(
          'w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200',
          !isOpen && 'justify-center'
        )}
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        {isOpen && <span className="font-medium">Logout</span>}
      </button>
    </div>
  )
}


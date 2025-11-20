'use client'

import { Menu, Bell, User } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="header h-16 flex items-center justify-between px-6 bg-white">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5 text-gray-700" />
        </button>

        {/* Global Search */}
        <GlobalSearch />
      </div>

      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5 text-gray-700" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <span className="hidden md:block text-sm font-medium text-gray-700">Διαχειριστής</span>
        </button>
      </div>
    </header>
  )
}


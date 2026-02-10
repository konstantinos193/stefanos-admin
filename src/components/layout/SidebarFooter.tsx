'use client'

import { LogOut, User } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/lib/auth/AuthContext'

interface SidebarFooterProps {
}

export function SidebarFooter() {
  const { user, logout } = useAuth()

  return (
    <div className="border-t border-slate-800 p-4 space-y-3">
      {/* User Profile */}
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">{user?.name || 'Διαχειριστής'}</p>
          <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@smholdings.gr'}</p>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all duration-200 font-medium text-sm"
      >
        <LogOut className="h-5 w-5 flex-shrink-0" />
        <span>Αποσύνδεση</span>
      </button>
    </div>
  )
}

'use client'

import { LogOut, User } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/lib/auth/AuthContext'

interface SidebarFooterProps {
  isCollapsed: boolean
}

export function SidebarFooter({ isCollapsed }: SidebarFooterProps) {
  const { user, logout } = useAuth()

  if (isCollapsed) {
    return (
      <div className="border-t border-slate-800 p-2 flex flex-col items-center gap-2 shrink-0">
        {/* Avatar tooltip */}
        <div className="relative group">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center cursor-default">
            <User className="h-4 w-4 text-white" />
          </div>
          <div
            className={clsx(
              'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
              'bg-slate-800 border border-slate-700/60 text-xs font-medium',
              'px-2.5 py-2 rounded-lg shadow-xl whitespace-nowrap',
              'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
              'transition-all duration-150',
            )}
          >
            <p className="text-slate-100 font-semibold">{user?.name || 'Διαχειριστής'}</p>
            <p className="text-slate-400 text-[11px] mt-0.5">{user?.email}</p>
          </div>
        </div>

        {/* Logout icon */}
        <div className="relative group">
          <button
            onClick={logout}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-150"
          >
            <LogOut className="h-4 w-4" />
          </button>
          <div
            className={clsx(
              'pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-3 z-50',
              'bg-slate-800 border border-slate-700/60 text-slate-100 text-xs font-medium',
              'px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap',
              'opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0',
              'transition-all duration-150',
            )}
          >
            Αποσύνδεση
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-t border-slate-800 p-4 space-y-3 shrink-0">
      <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-slate-800/50">
        <div className="h-9 w-9 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
          <User className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-100 truncate">
            {user?.name || 'Διαχειριστής'}
          </p>
          <p className="text-xs text-slate-400 truncate">{user?.email || 'admin@smholdings.gr'}</p>
        </div>
      </div>

      <button
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-slate-300 hover:bg-red-500/10 hover:text-red-400 border border-slate-700 hover:border-red-500/30 transition-all duration-200 font-medium text-sm"
      >
        <LogOut className="h-4 w-4 shrink-0" />
        <span>Αποσύνδεση</span>
      </button>
    </div>
  )
}

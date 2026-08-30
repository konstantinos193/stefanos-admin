'use client'

import { useEffect, useState } from 'react'
import { X, Search, Loader2, UserPlus } from 'lucide-react'
import { MaintenanceRequest, User } from '@/lib/api/types'

interface MaintenanceAssignDialogProps {
  request: MaintenanceRequest | null
  users: User[]
  loading?: boolean
  error?: string | null
  onAssign: (userId: string) => void
  onClose: () => void
}

/**
 * POST /maintenance/:id/assign validates that assignedTo is an existing user id,
 * so assignment is a picker rather than a free-text name.
 */
export function MaintenanceAssignDialog({
  request,
  users,
  loading = false,
  error = null,
  onAssign,
  onClose,
}: MaintenanceAssignDialogProps) {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState('')

  useEffect(() => {
    if (!request) return
    setQuery('')
    setSelected(request.assignedTo && users.some((u) => u.id === request.assignedTo) ? request.assignedTo : '')
  }, [request, users])

  useEffect(() => {
    if (!request) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [request, loading, onClose])

  if (!request) return null

  const normalized = query.trim().toLowerCase()
  const visibleUsers = users.filter((user) => {
    if (!user.isActive) return false
    if (!normalized) return true
    return (
      user.name?.toLowerCase().includes(normalized) ||
      user.email.toLowerCase().includes(normalized)
    )
  })

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-md max-h-[85vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100">Ανάθεση αιτήματος</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{request.title}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Κλείσιμο"
            className="h-9 w-9 flex-shrink-0 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-4">
          {error && (
            <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Αναζήτηση χρήστη…"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {visibleUsers.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              {users.length === 0
                ? 'Η λίστα χρηστών δεν είναι διαθέσιμη για τον λογαριασμό σας.'
                : 'Κανένας χρήστης δεν ταιριάζει στην αναζήτηση.'}
            </p>
          ) : (
            visibleUsers.map((user) => {
              const isSelected = selected === user.id
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setSelected(user.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border text-left transition-colors ${
                    isSelected
                      ? 'bg-blue-500/15 border-blue-500 text-blue-100'
                      : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-600'
                  }`}
                >
                  <span className="h-9 w-9 rounded-full bg-slate-700 text-xs font-bold text-slate-100 flex items-center justify-center flex-shrink-0">
                    {(user.name || user.email).trim().charAt(0).toUpperCase()}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold truncate">
                      {user.name || user.email}
                    </span>
                    <span className="block text-xs text-slate-400 truncate">{user.email}</span>
                  </span>
                </button>
              )
            })
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Ακύρωση
          </button>
          <button
            type="button"
            onClick={() => selected && onAssign(selected)}
            disabled={!selected || loading}
            className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
            Ανάθεση
          </button>
        </div>
      </div>
    </div>
  )
}

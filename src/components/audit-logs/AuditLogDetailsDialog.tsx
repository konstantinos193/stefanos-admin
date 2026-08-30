'use client'

import { useEffect } from 'react'
import { X, Monitor, Globe, Clock, User as UserIcon, Hash } from 'lucide-react'
import type { AuditLog } from '@/lib/api/audit'
import {
  actionBadge,
  actionLabel,
  entityLabel,
  formatFullTimestamp,
  formatIp,
  roleBadge,
  roleLabel,
} from './auditUtils'

interface AuditLogDetailsDialogProps {
  log: AuditLog | null
  onClose: () => void
}

function hasContent(value: unknown): boolean {
  if (value === null || value === undefined) return false
  if (typeof value === 'object') return Object.keys(value as object).length > 0
  return true
}

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">{title}</p>
      <pre className="max-h-64 overflow-auto rounded-xl bg-slate-900 border border-slate-700 p-3 text-xs text-slate-200 whitespace-pre-wrap break-words">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}

function Field({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Clock
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </p>
      <div className="text-sm text-slate-200 break-words">{children}</div>
    </div>
  )
}

/** The details button used to only `console.log` — changes and metadata were unreachable. */
export function AuditLogDetailsDialog({ log, onClose }: AuditLogDetailsDialogProps) {
  useEffect(() => {
    if (!log) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [log, onClose])

  if (!log) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${actionBadge(log.action)}`}
              >
                {actionLabel(log.action)}
              </span>
              <h2 className="text-lg font-bold text-slate-100 truncate">
                {entityLabel(log.entityType)}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">{formatFullTimestamp(log.createdAt)}</p>
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field icon={UserIcon} label="Χρήστης">
              {log.user ? (
                <div className="space-y-1">
                  <p>{log.user.name || 'Χωρίς όνομα'}</p>
                  <p className="text-xs text-slate-400">{log.user.email}</p>
                  <span
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-lg ${roleBadge(
                      log.user.role,
                    )}`}
                  >
                    {roleLabel(log.user.role)}
                  </span>
                </div>
              ) : (
                <span className="text-slate-500">Ο χρήστης δεν υπάρχει πλέον</span>
              )}
            </Field>

            <Field icon={Globe} label="Διεύθυνση IP">
              <span className="tabular-nums">{formatIp(log.ipAddress)}</span>
            </Field>

            <Field icon={Hash} label="Αναγνωριστικό εγγραφής">
              <span className="text-xs break-all">{log.entityId || '—'}</span>
            </Field>

            <Field icon={Clock} label="Αναγνωριστικό καταγραφής">
              <span className="text-xs break-all">{log.id}</span>
            </Field>
          </div>

          {log.userAgent && (
            <Field icon={Monitor} label="Πρόγραμμα περιήγησης">
              <span className="text-xs text-slate-400 break-all">{log.userAgent}</span>
            </Field>
          )}

          {hasContent(log.changes) ? (
            <JsonBlock title="Αλλαγές" value={log.changes} />
          ) : (
            <p className="text-sm text-slate-500">Δεν καταγράφηκαν αλλαγές.</p>
          )}

          {hasContent(log.metadata) && <JsonBlock title="Πρόσθετα στοιχεία" value={log.metadata} />}
        </div>

        <div className="flex items-center justify-end px-5 py-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
          >
            Κλείσιμο
          </button>
        </div>
      </div>
    </div>
  )
}

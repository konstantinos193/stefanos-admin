'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Search,
  Download,
  Eye,
  Calendar,
  User,
  Activity,
  AlertCircle,
  Loader2,
  X,
  FileSearch,
} from 'lucide-react'
import { auditApi, AuditLog, AuditLogsQuery, AuditStats } from '@/lib/api/audit'
import { AuditLogDetailsDialog } from './AuditLogDetailsDialog'
import {
  actionBadge,
  actionLabel,
  entityLabel,
  formatIp,
  formatTimestamp,
  roleBadge,
  roleLabel,
} from './auditUtils'

const PAGE_SIZE = 50

const EMPTY_PAGINATION = {
  page: 1,
  limit: PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPrevPage: false,
}

export function AuditLogsTable({ className }: { className?: string }) {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null)
  const [pagination, setPagination] = useState(EMPTY_PAGINATION)

  const [searchInput, setSearchInput] = useState('')
  const [query, setQuery] = useState<AuditLogsQuery>({ page: 1, limit: PAGE_SIZE })

  // Debounced so typing doesn't fire a request (and a full refetch) per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery((prev) => {
        const next = searchInput.trim()
        if ((prev.search ?? '') === next) return prev
        return { ...prev, search: next || undefined, page: 1 }
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchInput])

  const loadData = useCallback(async (activeQuery: AuditLogsQuery) => {
    setLoading(true)
    try {
      const [logsResponse, statsResponse] = await Promise.all([
        auditApi.getAuditLogs(activeQuery),
        auditApi.getAuditStats(),
      ])

      setLogs(logsResponse?.data ?? [])
      setPagination({ ...EMPTY_PAGINATION, ...(logsResponse?.pagination ?? {}) })
      setStats(statsResponse ?? null)
      setError(null)
    } catch (err) {
      console.error('Error loading audit logs:', err)
      setError(err instanceof Error ? err.message : 'Αποτυχία φόρτωσης καταγραφών.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData(query)
  }, [query, loadData])

  const setFilter = (patch: Partial<AuditLogsQuery>) => {
    setQuery((prev) => ({ ...prev, ...patch, page: 1 }))
  }

  const clearFilters = () => {
    setSearchInput('')
    setQuery({ page: 1, limit: PAGE_SIZE })
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const response = await auditApi.exportAuditLogs(query)
      const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = response.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting audit logs:', err)
      setError(err instanceof Error ? err.message : 'Η εξαγωγή απέτυχε.')
    } finally {
      setExporting(false)
    }
  }

  /**
   * Filter options come from the data itself. The hard-coded list offered
   * "BOOKING" while the logs record "BOOKINGS", so that filter matched nothing.
   */
  const actionOptions = useMemo(
    () => (stats?.topActions ?? []).map((row) => row.action).filter(Boolean),
    [stats],
  )
  const entityOptions = useMemo(
    () => (stats?.topEntities ?? []).map((row) => row.entityType).filter(Boolean),
    [stats],
  )

  const isFiltered = Boolean(
    query.search || query.action || query.entityType || query.startDate || query.endDate,
  )

  const statCards = stats
    ? [
        {
          label: 'Σύνολο Καταγραφών',
          value: stats.totalLogs.toLocaleString('el-GR'),
          icon: Activity,
          tone: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
        },
        {
          label: 'Σήμερα',
          value: stats.logsToday.toLocaleString('el-GR'),
          icon: Calendar,
          tone: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
        },
        {
          label: 'Αυτή την Εβδομάδα',
          value: stats.logsThisWeek.toLocaleString('el-GR'),
          icon: Activity,
          tone: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
        },
        {
          // topUsers is capped at 10 server-side, so this is "at least N", not a total.
          label: 'Χρήστες με δραστηριότητα',
          value: stats.topUsers.length >= 10 ? '10+' : String(stats.topUsers.length),
          icon: User,
          tone: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
        },
      ]
    : []

  const inputClass =
    'h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'

  return (
    <div className={`space-y-5 ${className ?? ''}`}>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className="rounded-2xl bg-slate-800/60 border border-slate-700 px-5 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-slate-400">{card.label}</p>
                  <div className={`p-2 rounded-xl border ${card.tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-50 tabular-nums">{card.value}</p>
              </div>
            )
          })}
        </div>
      )}

      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Αναζήτηση ενέργειας, τύπου, χρήστη ή email..."
              className={`${inputClass} w-full pl-10 pr-10`}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                aria-label="Καθαρισμός αναζήτησης"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <select
              value={query.action || ''}
              onChange={(e) => setFilter({ action: e.target.value || undefined })}
              className={`${inputClass} [&>option]:bg-slate-800`}
            >
              <option value="">Όλες οι ενέργειες</option>
              {actionOptions.map((action) => (
                <option key={action} value={action}>
                  {actionLabel(action)}
                </option>
              ))}
            </select>

            <select
              value={query.entityType || ''}
              onChange={(e) => setFilter({ entityType: e.target.value || undefined })}
              className={`${inputClass} [&>option]:bg-slate-800`}
            >
              <option value="">Όλοι οι τύποι</option>
              {entityOptions.map((entity) => (
                <option key={entity} value={entity}>
                  {entityLabel(entity)}
                </option>
              ))}
            </select>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="inline-flex items-center gap-2 h-11 px-4 rounded-xl bg-slate-700 text-slate-100 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
            >
              {exporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Εξαγωγή
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Από
            </label>
            <input
              type="date"
              value={query.startDate || ''}
              max={query.endDate || undefined}
              onChange={(e) => setFilter({ startDate: e.target.value || undefined })}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Έως
            </label>
            <input
              type="date"
              value={query.endDate || ''}
              min={query.startDate || undefined}
              onChange={(e) => setFilter({ endDate: e.target.value || undefined })}
              className={`${inputClass} [color-scheme:dark]`}
            />
          </div>
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="h-11 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
            >
              Καθαρισμός φίλτρων
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-red-200">{error}</p>
          <button
            onClick={() => setError(null)}
            aria-label="Κλείσιμο"
            className="text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
        {loading ? (
          <div className="p-3 space-y-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-slate-700/40 rounded-xl" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="flex flex-col items-center text-center px-6 py-16">
            <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
              <FileSearch className="h-5 w-5 text-slate-400" />
            </div>
            <p className="mt-4 text-base font-semibold text-slate-200">Καμία καταγραφή</p>
            <p className="mt-1 text-sm text-slate-400 max-w-sm">
              {isFiltered
                ? 'Δοκιμάστε διαφορετικά φίλτρα ή διάστημα ημερομηνιών.'
                : 'Δεν έχουν καταγραφεί ακόμη ενέργειες.'}
            </p>
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="mt-5 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Καθαρισμός φίλτρων
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="md:hidden divide-y divide-slate-700/60">
              {logs.map((log) => (
                <button
                  key={log.id}
                  onClick={() => setSelectedLog(log)}
                  className="w-full text-left p-4 hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-100">
                        {entityLabel(log.entityType)}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {formatTimestamp(log.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${actionBadge(
                        log.action,
                      )}`}
                    >
                      {actionLabel(log.action)}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-400 truncate">
                    {log.user?.name || log.user?.email || 'Άγνωστος χρήστης'} ·{' '}
                    <span className="tabular-nums">{formatIp(log.ipAddress)}</span>
                  </p>
                </button>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800 border-b border-slate-700">
                  <tr>
                    {['Ημερομηνία', 'Χρήστης', 'Ενέργεια', 'Τύπος', 'Διεύθυνση IP', ''].map(
                      (header, index) => (
                        <th
                          key={header || index}
                          className={`px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                            index === 5 ? 'text-right' : 'text-left'
                          }`}
                        >
                          {header}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/60">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/60 transition-colors">
                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-200">
                        {formatTimestamp(log.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        {log.user ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-semibold text-slate-100">
                              {log.user.name || 'Χωρίς όνομα'}
                            </span>
                            <span className="text-xs text-slate-400">{log.user.email}</span>
                            <span
                              className={`w-fit px-2 py-0.5 text-xs font-semibold rounded-lg ${roleBadge(
                                log.user.role,
                              )}`}
                            >
                              {roleLabel(log.user.role)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-500">Διαγραμμένος χρήστης</span>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-lg ${actionBadge(
                            log.action,
                          )}`}
                        >
                          {actionLabel(log.action)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-200">{entityLabel(log.entityType)}</p>
                        {log.entityId && (
                          <p className="text-xs text-slate-500 mt-0.5 font-mono">
                            {log.entityId.slice(0, 8)}…
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-400 tabular-nums">
                        {formatIp(log.ipAddress)}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                            Λεπτομέρειες
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-t border-slate-700">
              <p className="text-sm text-slate-400">
                Εμφάνιση <span className="font-semibold text-slate-200">{logs.length}</span> από{' '}
                <span className="font-semibold text-slate-200">
                  {pagination.total.toLocaleString('el-GR')}
                </span>{' '}
                καταγραφές
              </p>
              <div className="flex items-center gap-2">
                <button
                  disabled={!pagination.hasPrevPage}
                  onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) - 1 }))}
                  className="h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Προηγούμενη
                </button>
                <span className="text-sm text-slate-400 tabular-nums">
                  {pagination.page} / {pagination.totalPages || 1}
                </span>
                <button
                  disabled={!pagination.hasNextPage}
                  onClick={() => setQuery((prev) => ({ ...prev, page: (prev.page ?? 1) + 1 }))}
                  className="h-10 px-3 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Επόμενη
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AuditLogDetailsDialog log={selectedLog} onClose={() => setSelectedLog(null)} />
    </div>
  )
}

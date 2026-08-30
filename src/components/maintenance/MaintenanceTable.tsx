'use client'

import { Edit, Loader2, UserPlus, CheckCircle2, Ban, Wrench, SearchX, CalendarDays } from 'lucide-react'
import { MaintenanceRequest, User } from '@/lib/api/types'
import { formatDate, formatRelativeDays } from '@/lib/dateFormat'
import { getStatusMeta, getPriorityMeta, isOpenRequest, resolveAssignee } from './maintenanceUtils'

interface MaintenanceTableProps {
  requests: MaintenanceRequest[]
  users: User[]
  loading: boolean
  busyId?: string | null
  isFiltered?: boolean
  onEdit: (request: MaintenanceRequest) => void
  onAssign: (request: MaintenanceRequest) => void
  onComplete: (request: MaintenanceRequest) => void
  onCancel: (request: MaintenanceRequest) => void
  onCreate?: () => void
  onClearFilters?: () => void
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatusMeta(status)
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const meta = getPriorityMeta(priority)
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${meta.badge}`}
    >
      {meta.label}
    </span>
  )
}

function AssigneeCell({ request, users }: { request: MaintenanceRequest; users: User[] }) {
  const assignee = resolveAssignee(request.assignedTo, users)

  if (!assignee) {
    return <span className="text-sm text-slate-500">Χωρίς ανάθεση</span>
  }

  return (
    <span className="inline-flex items-center gap-2 text-sm text-slate-200">
      <span className="h-6 w-6 rounded-full bg-slate-700 text-[11px] font-bold text-slate-200 flex items-center justify-center flex-shrink-0">
        {assignee.label.trim().charAt(0).toUpperCase()}
      </span>
      <span className={assignee.isKnown ? '' : 'text-slate-400 italic'} title={assignee.label}>
        {assignee.label}
      </span>
    </span>
  )
}

function EmptyState({
  isFiltered,
  onCreate,
  onClearFilters,
}: Pick<MaintenanceTableProps, 'isFiltered' | 'onCreate' | 'onClearFilters'>) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16">
      <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
        {isFiltered ? (
          <SearchX className="h-5 w-5 text-slate-400" />
        ) : (
          <Wrench className="h-5 w-5 text-blue-400" />
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-slate-200">
        {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν αιτήματα συντήρησης'}
      </p>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">
        {isFiltered
          ? 'Δοκιμάστε διαφορετική αναζήτηση ή αφαιρέστε τα φίλτρα.'
          : 'Καταγράψτε μια βλάβη ή εργασία για να την παρακολουθείτε μέχρι να ολοκληρωθεί.'}
      </p>
      {isFiltered ? (
        onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-5 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Καθαρισμός φίλτρων
          </button>
        )
      ) : (
        onCreate && (
          <button
            onClick={onCreate}
            className="mt-5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Νέο Αίτημα
          </button>
        )
      )}
    </div>
  )
}

export function MaintenanceTable({
  requests,
  users,
  loading,
  busyId,
  isFiltered,
  onEdit,
  onAssign,
  onComplete,
  onCancel,
  onCreate,
  onClearFilters,
}: MaintenanceTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-3 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-slate-700/40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (requests.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700">
        <EmptyState isFiltered={isFiltered} onCreate={onCreate} onClearFilters={onClearFilters} />
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-slate-800/60 border border-slate-700 overflow-hidden">
      {/* Mobile */}
      <div className="md:hidden divide-y divide-slate-700/60">
        {requests.map((request) => {
          const busy = busyId === request.id
          const meta = getStatusMeta(request.status)

          return (
            <div
              key={request.id}
              className={`p-4 border-l-4 ${meta.accent} ${busy ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <p className="text-base font-semibold text-slate-100">{request.title}</p>
                <PriorityBadge priority={request.priority} />
              </div>

              <p className="mt-1 text-sm text-slate-400 line-clamp-2">{request.description}</p>

              <p className="mt-2 text-xs text-slate-400">
                {request.property?.titleGr || request.property?.titleEn || 'Άγνωστο ακίνητο'}
                {request.property?.city ? ` · ${request.property.city}` : ''}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <StatusBadge status={request.status} />
                <AssigneeCell request={request} users={users} />
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                <CalendarDays className="h-3.5 w-3.5" />
                {formatDate(request.createdAt)} · {formatRelativeDays(request.createdAt)}
              </p>

              <div className="mt-4 flex items-center gap-2">
                {request.status === 'OPEN' && (
                  <button
                    onClick={() => onAssign(request)}
                    disabled={busy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                    Ανάθεση
                  </button>
                )}
                {request.status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => onComplete(request)}
                    disabled={busy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-green-600/90 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                  >
                    {busy ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Ολοκλήρωση
                  </button>
                )}
                <button
                  onClick={() => onEdit(request)}
                  disabled={busy}
                  aria-label="Επεξεργασία"
                  className={`h-10 inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-700/60 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50 ${
                    isOpenRequest(request) ? 'w-10' : 'flex-1 px-4 text-sm font-semibold'
                  }`}
                >
                  <Edit className="h-4 w-4" />
                  {!isOpenRequest(request) && 'Επεξεργασία'}
                </button>
                {isOpenRequest(request) && (
                  <button
                    onClick={() => onCancel(request)}
                    disabled={busy}
                    aria-label="Ακύρωση αιτήματος"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                  >
                    <Ban className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800 border-b border-slate-700">
            <tr>
              {['Αίτημα', 'Ακίνητο', 'Προτεραιότητα', 'Κατάσταση', 'Ανάθεση', 'Δημιουργήθηκε', ''].map(
                (header, index) => (
                  <th
                    key={header || index}
                    className={`px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                      index === 6 ? 'text-right' : 'text-left'
                    }`}
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {requests.map((request) => {
              const busy = busyId === request.id
              const meta = getStatusMeta(request.status)

              return (
                <tr
                  key={request.id}
                  className={`hover:bg-slate-800/60 transition-colors ${busy ? 'opacity-60' : ''}`}
                >
                  <td className="px-5 py-4 max-w-sm">
                    <div className="flex items-start gap-2.5">
                      <span className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${meta.dot}`} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100">{request.title}</p>
                        <p
                          title={request.description}
                          className="text-xs text-slate-400 mt-0.5 line-clamp-2"
                        >
                          {request.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 max-w-[14rem]">
                    <p className="text-sm text-slate-200 truncate">
                      {request.property?.titleGr || request.property?.titleEn || '—'}
                    </p>
                    {request.property?.city && (
                      <p className="text-xs text-slate-500 mt-0.5 truncate">
                        {request.property.city}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <PriorityBadge priority={request.priority} />
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={request.status} />
                    {request.status === 'COMPLETED' && request.completedAt && (
                      <p className="text-xs text-slate-500 mt-1">
                        {formatRelativeDays(request.completedAt)}
                      </p>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <AssigneeCell request={request} users={users} />
                  </td>

                  <td className="px-5 py-4">
                    <p className="text-sm text-slate-300">{formatDate(request.createdAt)}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {formatRelativeDays(request.createdAt)}
                    </p>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      {request.status === 'OPEN' && (
                        <button
                          onClick={() => onAssign(request)}
                          disabled={busy}
                          title="Ανάθεση σε υπεύθυνο"
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-blue-500/10 text-blue-300 border border-blue-500/25 text-sm font-semibold hover:bg-blue-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                          Ανάθεση
                        </button>
                      )}
                      {request.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => onComplete(request)}
                          disabled={busy}
                          title="Σήμανση ως ολοκληρωμένο"
                          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-green-500/10 text-green-300 border border-green-500/25 text-sm font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4" />
                          )}
                          Ολοκλήρωση
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(request)}
                        disabled={busy}
                        title="Επεξεργασία"
                        aria-label="Επεξεργασία"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {isOpenRequest(request) && (
                        <button
                          onClick={() => onCancel(request)}
                          disabled={busy}
                          title="Ακύρωση αιτήματος"
                          aria-label="Ακύρωση αιτήματος"
                          className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors disabled:opacity-50"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

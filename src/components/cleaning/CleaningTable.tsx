'use client'

import { Edit, Trash2, Sparkles, Loader2, StickyNote, User, CalendarOff } from 'lucide-react'
import { CleaningSchedule } from '@/lib/api/types'
import {
  STATUS_META,
  getFrequencyMeta,
  getStatus,
  formatDate,
  formatRelativeDays,
} from './cleaningUtils'

interface CleaningTableProps {
  schedules: CleaningSchedule[]
  loading: boolean
  busyId?: string | null
  isFiltered?: boolean
  onEdit: (schedule: CleaningSchedule) => void
  onDelete: (schedule: CleaningSchedule) => void
  onMarkCleaned: (schedule: CleaningSchedule) => void
  onCreate?: () => void
  onClearFilters?: () => void
}

function StatusBadge({ schedule }: { schedule: CleaningSchedule }) {
  const status = getStatus(schedule)
  const meta = STATUS_META[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {status === 'OVERDUE' && schedule.nextCleaning
        ? `Εκπρόθεσμο ${formatRelativeDays(schedule.nextCleaning).replace('πριν ', '')}`
        : meta.label}
    </span>
  )
}

function FrequencyBadge({ frequency }: { frequency: string }) {
  const meta = getFrequencyMeta(frequency)
  return (
    <span
      title={meta.hint}
      className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap ${meta.color}`}
    >
      {meta.label}
    </span>
  )
}

function EmptyState({
  isFiltered,
  onCreate,
  onClearFilters,
}: Pick<CleaningTableProps, 'isFiltered' | 'onCreate' | 'onClearFilters'>) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-16">
      <div className="h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
        {isFiltered ? (
          <CalendarOff className="h-5 w-5 text-slate-400" />
        ) : (
          <Sparkles className="h-5 w-5 text-blue-400" />
        )}
      </div>
      <p className="mt-4 text-base font-semibold text-slate-200">
        {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν προγράμματα καθαρισμού'}
      </p>
      <p className="mt-1 text-sm text-slate-400 max-w-sm">
        {isFiltered
          ? 'Δοκιμάστε διαφορετική αναζήτηση ή αφαιρέστε τα φίλτρα.'
          : 'Δημιουργήστε ένα πρόγραμμα για να παρακολουθείτε πότε πρέπει να καθαριστεί κάθε ακίνητο.'}
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
            Νέο Πρόγραμμα
          </button>
        )
      )}
    </div>
  )
}

export function CleaningTable({
  schedules,
  loading,
  busyId,
  isFiltered,
  onEdit,
  onDelete,
  onMarkCleaned,
  onCreate,
  onClearFilters,
}: CleaningTableProps) {
  if (loading) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 p-3 space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse h-16 bg-slate-700/40 rounded-xl" />
        ))}
      </div>
    )
  }

  if (schedules.length === 0) {
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
        {schedules.map((schedule) => {
          const status = getStatus(schedule)
          const busy = busyId === schedule.id

          return (
            <div
              key={schedule.id}
              className={`p-4 border-l-4 ${STATUS_META[status].accent} ${busy ? 'opacity-60' : ''}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-base font-semibold text-slate-100 truncate">
                    {schedule.property?.titleGr || 'Άγνωστο ακίνητο'}
                  </p>
                  {schedule.property?.city && (
                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                      {schedule.property.city}
                      {schedule.property.address ? ` · ${schedule.property.address}` : ''}
                    </p>
                  )}
                </div>
                <StatusBadge schedule={schedule} />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500 text-xs">Επόμενος</p>
                  <p className="text-slate-200 mt-0.5">
                    {schedule.nextCleaning ? formatDate(schedule.nextCleaning) : '—'}
                  </p>
                  {schedule.nextCleaning && (
                    <p className="text-xs text-slate-500">
                      {formatRelativeDays(schedule.nextCleaning)}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-slate-500 text-xs">Τελευταίος</p>
                  <p className="text-slate-200 mt-0.5">
                    {schedule.lastCleaned ? formatDate(schedule.lastCleaned) : 'Ποτέ'}
                  </p>
                  {schedule.lastCleaned && (
                    <p className="text-xs text-slate-500">
                      {formatRelativeDays(schedule.lastCleaned)}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <FrequencyBadge frequency={schedule.frequency} />
                {schedule.assignedCleaner && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                    <User className="h-3.5 w-3.5 text-slate-500" />
                    {schedule.assignedCleaner}
                  </span>
                )}
              </div>

              {schedule.notes && (
                <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-400">
                  <StickyNote className="h-3.5 w-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                  {schedule.notes}
                </p>
              )}

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => onMarkCleaned(schedule)}
                  disabled={busy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-green-600/90 hover:bg-green-600 text-white text-sm font-semibold transition-colors disabled:opacity-50"
                >
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Καθαρίστηκε
                </button>
                <button
                  onClick={() => onEdit(schedule)}
                  disabled={busy}
                  aria-label="Επεξεργασία"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(schedule)}
                  disabled={busy}
                  aria-label="Διαγραφή"
                  className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-red-300 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
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
              {['Ακίνητο', 'Κατάσταση', 'Επόμενος', 'Τελευταίος', 'Συχνότητα', 'Υπεύθυνος', ''].map(
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
            {schedules.map((schedule) => {
              const status = getStatus(schedule)
              const busy = busyId === schedule.id

              return (
                <tr
                  key={schedule.id}
                  className={`group hover:bg-slate-800/60 transition-colors ${
                    busy ? 'opacity-60' : ''
                  }`}
                >
                  <td className="px-5 py-4 max-w-xs">
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-1.5 h-2 w-2 rounded-full flex-shrink-0 ${STATUS_META[status].dot}`}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-100 truncate">
                          {schedule.property?.titleGr || 'Άγνωστο ακίνητο'}
                        </p>
                        {schedule.property?.city && (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">
                            {schedule.property.city}
                            {schedule.property.address ? ` · ${schedule.property.address}` : ''}
                          </p>
                        )}
                        {schedule.notes && (
                          <p
                            title={schedule.notes}
                            className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 truncate"
                          >
                            <StickyNote className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{schedule.notes}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge schedule={schedule} />
                  </td>

                  <td className="px-5 py-4">
                    {schedule.nextCleaning ? (
                      <>
                        <p className="text-sm text-slate-100">
                          {formatDate(schedule.nextCleaning)}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatRelativeDays(schedule.nextCleaning)}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">—</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    {schedule.lastCleaned ? (
                      <>
                        <p className="text-sm text-slate-300">{formatDate(schedule.lastCleaned)}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {formatRelativeDays(schedule.lastCleaned)}
                        </p>
                      </>
                    ) : (
                      <span className="text-sm text-slate-500">Ποτέ</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <FrequencyBadge frequency={schedule.frequency} />
                  </td>

                  <td className="px-5 py-4">
                    {schedule.assignedCleaner ? (
                      <span className="inline-flex items-center gap-2 text-sm text-slate-200">
                        <span className="h-6 w-6 rounded-full bg-slate-700 text-[11px] font-bold text-slate-200 flex items-center justify-center flex-shrink-0">
                          {schedule.assignedCleaner.trim().charAt(0).toUpperCase()}
                        </span>
                        {schedule.assignedCleaner}
                      </span>
                    ) : (
                      <span className="text-sm text-slate-500">Χωρίς ανάθεση</span>
                    )}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onMarkCleaned(schedule)}
                        disabled={busy}
                        title="Καταχώρηση ως καθαρισμένο σήμερα"
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-green-500/10 text-green-300 border border-green-500/25 text-sm font-semibold hover:bg-green-500/20 transition-colors disabled:opacity-50 whitespace-nowrap"
                      >
                        {busy ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Sparkles className="h-4 w-4" />
                        )}
                        Καθαρίστηκε
                      </button>
                      <button
                        onClick={() => onEdit(schedule)}
                        disabled={busy}
                        title="Επεξεργασία"
                        aria-label="Επεξεργασία"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDelete(schedule)}
                        disabled={busy}
                        title="Διαγραφή"
                        aria-label="Διαγραφή"
                        className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

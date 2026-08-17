'use client'

import { Calendar, Edit, Trash2, MoreHorizontal, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { CleaningSchedule } from '@/lib/api/types'

interface CleaningTableProps {
  schedules: CleaningSchedule[]
  loading: boolean
  onEdit: (schedule: CleaningSchedule) => void
  onDelete: (schedule: CleaningSchedule) => Promise<void>
  onMarkCleaned: (schedule: CleaningSchedule) => Promise<void>
}

export function CleaningTable({ schedules, loading, onEdit, onDelete, onMarkCleaned }: CleaningTableProps) {
  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'DAILY':
        return 'bg-blue-500/15 text-blue-400 border border-blue-500/20'
      case 'WEEKLY':
        return 'bg-green-500/15 text-green-400 border border-green-500/20'
      case 'MONTHLY':
        return 'bg-purple-500/15 text-purple-400 border border-purple-500/20'
      case 'BIWEEKLY':
        return 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/20'
      case 'AFTER_EACH_BOOKING':
        return 'bg-orange-500/15 text-orange-400 border border-orange-500/20'
      default:
        return 'bg-slate-500/15 text-slate-400 border border-slate-500/20'
    }
  }

  const getFrequencyLabel = (frequency: string) => {
    switch (frequency) {
      case 'DAILY': return 'Ημερήσια'
      case 'WEEKLY': return 'Εβδομαδιαία'
      case 'BIWEEKLY': return 'Δύφωνη'
      case 'MONTHLY': return 'Μηνιαία'
      case 'AFTER_EACH_BOOKING': return 'Μετά από κάθε κράτηση'
      default: return frequency
    }
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('el-GR', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="card p-0 overflow-hidden">
        <div className="space-y-3 p-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="animate-pulse h-16 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Mobile Card Layout */}
      <div className="md:hidden space-y-3 p-4">
        {schedules.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-base">
            Δεν βρέθηκαν προγράμματα καθαρισμού
          </div>
        ) : (
          schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="bg-slate-800/40 rounded-xl p-4 space-y-3 border border-slate-700/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-slate-100 truncate">
                    {schedule.property?.titleGr || 'N/A'}
                  </p>
                  {schedule.property?.address && (
                    <p className="text-sm text-slate-400 mt-1 truncate">
                      {schedule.property.address}
                    </p>
                  )}
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold rounded-lg ${getFrequencyColor(schedule.frequency)} flex-shrink-0`}>
                  {getFrequencyLabel(schedule.frequency)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400 text-xs mb-1">Υπεύθυνος</p>
                  <p className="text-slate-200">{schedule.assignedCleaner || '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Τελευταίος Καθαρισμός</p>
                  <p className="text-slate-200">{schedule.lastCleaned ? formatDate(schedule.lastCleaned) : '-'}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Επόμενος Καθαρισμός</p>
                  {schedule.nextCleaning ? (
                    <div className="flex items-center gap-1.5 text-slate-200">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      {formatDate(schedule.nextCleaning)}
                    </div>
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>
                <div>
                  <p className="text-slate-400 text-xs mb-1">Σημειώσεις</p>
                  <p className="text-slate-200 truncate">{schedule.notes || '-'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                <button
                  onClick={() => onEdit(schedule)}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50 rounded-lg transition-colors flex-1 justify-center"
                >
                  <Edit className="h-4 w-4 text-blue-400" />
                  Επεξεργασία
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-800/60 border-b border-slate-700">
            <tr>
              {[
                'Ακίνητο',
                'Συχνότητα',
                'Υπεύθυνος Καθαρισμού',
                'Τελευταίος Καθαρισμός',
                'Επόμενος Καθαρισμός',
                'Σημειώσεις',
                'Ενέργειες',
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-left"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {schedules.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center text-slate-400 text-base">
                  Δεν βρέθηκαν προγράμματα καθαρισμού
                </td>
              </tr>
            ) : (
              schedules.map((schedule) => (
                <tr
                  key={schedule.id}
                  className="hover:bg-slate-800/40 transition-colors"
                >
                  <td className="px-5 py-5">
                    <p className="text-base font-semibold text-slate-100">
                      {schedule.property?.titleGr || 'N/A'}
                    </p>
                    {schedule.property?.address && (
                      <p className="text-sm text-slate-400 mt-1">
                        {schedule.property.address}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-xl ${getFrequencyColor(schedule.frequency)}`}>
                      {getFrequencyLabel(schedule.frequency)}
                    </span>
                  </td>
                  <td className="px-5 py-5 text-slate-200">
                    {schedule.assignedCleaner || '-'}
                  </td>
                  <td className="px-5 py-5 text-slate-200">
                    {schedule.lastCleaned ? formatDate(schedule.lastCleaned) : '-'}
                  </td>
                  <td className="px-5 py-5">
                    {schedule.nextCleaning ? (
                      <div className="flex items-center gap-1.5 text-slate-200">
                        <Calendar className="h-4 w-4 text-slate-400" />
                        {formatDate(schedule.nextCleaning)}
                      </div>
                    ) : (
                      <span className="text-slate-500">-</span>
                    )}
                  </td>
                  <td className="px-5 py-5">
                    <p className="text-sm text-slate-400 max-w-xs truncate">
                      {schedule.notes || '-'}
                    </p>
                  </td>
                  <td className="px-5 py-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onEdit(schedule)}
                        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700/50 rounded-xl transition-colors"
                      >
                        <Edit className="h-4 w-4 text-blue-400" />
                        Επεξεργασία
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
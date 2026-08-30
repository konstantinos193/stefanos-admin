'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'
import { CleaningHeader } from '@/components/cleaning/CleaningHeader'
import { CleaningSummary, CleaningView } from '@/components/cleaning/CleaningStats'
import { CleaningTable } from '@/components/cleaning/CleaningTable'
import { CleaningScheduleDialog } from '@/components/cleaning/CleaningScheduleDialog'
import {
  CleaningFrequencyValue,
  getStatus,
  sortByUrgency,
} from '@/components/cleaning/cleaningUtils'
import { cleaningApi } from '@/lib/api/cleaning'
import { propertiesApi } from '@/lib/api/properties'
import { CleaningSchedule, CleaningStats, Property } from '@/lib/api/types'

const SCHEDULE_FETCH_LIMIT = 200

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function CleaningPage() {
  const [schedules, setSchedules] = useState<CleaningSchedule[]>([])
  const [stats, setStats] = useState<CleaningStats | null>(null)
  const [properties, setProperties] = useState<Property[]>([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<CleaningSchedule | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState<CleaningSchedule | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [view, setView] = useState<CleaningView>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [frequency, setFrequency] = useState<CleaningFrequencyValue | 'ALL'>('ALL')

  const fetchData = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const [schedulesRes, statsRes, propertiesRes] = await Promise.all([
        cleaningApi.getAll({ limit: SCHEDULE_FETCH_LIMIT }),
        cleaningApi.getStats(),
        propertiesApi.getAll({ limit: 100 }),
      ])

      setSchedules(schedulesRes?.data?.schedules ?? [])
      setStats(statsRes?.data ?? null)
      setProperties(propertiesRes?.data?.properties ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching cleaning data:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης δεδομένων καθαρισμού.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingSchedule(null)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleEdit = (schedule: CleaningSchedule) => {
    setEditingSchedule(schedule)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<CleaningSchedule>) => {
    setSubmitting(true)
    setDialogError(null)
    try {
      if (editingSchedule) {
        await cleaningApi.update(editingSchedule.id, data)
      } else {
        await cleaningApi.create(data)
      }
      setDialogOpen(false)
      setEditingSchedule(null)
      // Refetch instead of trusting the mutation response shape, which differs
      // between create (raw record) and update ({ success, data }).
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error saving schedule:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleMarkCleaned = async (schedule: CleaningSchedule) => {
    setBusyId(schedule.id)
    try {
      await cleaningApi.markCleaned(schedule.id, new Date().toISOString())
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error marking schedule as cleaned:', error)
      setPageError(errorMessage(error, 'Η καταχώρηση καθαρισμού απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setBusyId(target.id)
    setPendingDelete(null)
    try {
      await cleaningApi.delete(target.id)
      setSchedules((prev) => prev.filter((s) => s.id !== target.id))
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error deleting schedule:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const clearFilters = () => {
    setView('ALL')
    setSearchQuery('')
    setFrequency('ALL')
  }

  const counts = useMemo(() => {
    const result: Record<CleaningView, number> = {
      ALL: schedules.length,
      OVERDUE: 0,
      DUE_TODAY: 0,
      UPCOMING: 0,
    }
    schedules.forEach((schedule) => {
      const status = getStatus(schedule)
      if (status === 'OVERDUE') result.OVERDUE += 1
      else if (status === 'DUE_TODAY') result.DUE_TODAY += 1
      else if (status === 'UPCOMING') result.UPCOMING += 1
    })
    return result
  }, [schedules])

  const visibleSchedules = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = schedules.filter((schedule) => {
      if (view !== 'ALL' && getStatus(schedule) !== view) return false
      if (frequency !== 'ALL' && schedule.frequency !== frequency) return false
      if (!query) return true

      return [
        schedule.property?.titleGr,
        schedule.property?.titleEn,
        schedule.property?.city,
        schedule.property?.address,
        schedule.assignedCleaner,
        schedule.notes,
      ].some((field) => field?.toLowerCase().includes(query))
    })

    return sortByUrgency(filtered)
  }, [schedules, view, frequency, searchQuery])

  const isFiltered = view !== 'ALL' || frequency !== 'ALL' || searchQuery.trim().length > 0

  return (
    <div className="space-y-6">
      <CleaningHeader
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        frequency={frequency}
        onFrequencyChange={setFrequency}
        onCreate={handleCreate}
        onRefresh={() => fetchData({ silent: true })}
        refreshing={refreshing}
        isFiltered={isFiltered}
        resultCount={visibleSchedules.length}
        totalCount={schedules.length}
      />

      {pageError && (
        <div className="flex items-start gap-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="flex-1 text-sm text-red-200">{pageError}</p>
          <button
            onClick={() => setPageError(null)}
            aria-label="Κλείσιμο"
            className="text-red-300 hover:text-red-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <CleaningSummary
        counts={counts}
        view={view}
        onViewChange={setView}
        stats={stats}
        loading={loading}
      />

      <CleaningTable
        schedules={visibleSchedules}
        loading={loading}
        busyId={busyId}
        isFiltered={isFiltered}
        onEdit={handleEdit}
        onDelete={setPendingDelete}
        onMarkCleaned={handleMarkCleaned}
        onCreate={handleCreate}
        onClearFilters={clearFilters}
      />

      <CleaningScheduleDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingSchedule(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
        schedule={editingSchedule}
        properties={properties}
        loading={submitting}
        error={dialogError}
      />

      {pendingDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPendingDelete(null)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Διαγραφή προγράμματος;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Το πρόγραμμα καθαρισμού για{' '}
                  <span className="font-semibold text-slate-200">
                    {pendingDelete.property?.titleGr || 'αυτό το ακίνητο'}
                  </span>{' '}
                  θα διαγραφεί οριστικά.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setPendingDelete(null)}
                className="h-10 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
              >
                Ακύρωση
              </button>
              <button
                onClick={handleDelete}
                className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Διαγραφή
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

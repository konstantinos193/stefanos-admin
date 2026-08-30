'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Ban, X } from 'lucide-react'
import { MaintenanceHeader } from '@/components/maintenance/MaintenanceHeader'
import { MaintenanceSummary, MaintenanceView } from '@/components/maintenance/MaintenanceSummary'
import { MaintenanceTable } from '@/components/maintenance/MaintenanceTable'
import { MaintenanceDialog } from '@/components/maintenance/MaintenanceDialog'
import { MaintenanceAssignDialog } from '@/components/maintenance/MaintenanceAssignDialog'
import {
  MaintenancePriorityValue,
  isOpenRequest,
  sortByUrgency,
} from '@/components/maintenance/maintenanceUtils'
import { maintenanceApi } from '@/lib/api/maintenance'
import { propertiesApi } from '@/lib/api/properties'
import { usersApi } from '@/lib/api/users'
import { MaintenanceRequest, Property, User } from '@/lib/api/types'

const REQUEST_FETCH_LIMIT = 200

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function MaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [users, setUsers] = useState<User[]>([])

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [assigningRequest, setAssigningRequest] = useState<MaintenanceRequest | null>(null)
  const [assignError, setAssignError] = useState<string | null>(null)
  const [pendingCancel, setPendingCancel] = useState<MaintenanceRequest | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [view, setView] = useState<MaintenanceView>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [priority, setPriority] = useState<MaintenancePriorityValue | 'ALL'>('ALL')

  const fetchData = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const [maintenanceRes, propertiesRes] = await Promise.all([
        maintenanceApi.getAll({ page: 1, limit: REQUEST_FETCH_LIMIT }),
        propertiesApi.getAll({ page: 1, limit: 100 }),
      ])

      setRequests(maintenanceRes?.data?.maintenance ?? [])
      setProperties(propertiesRes?.data?.properties ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης αιτημάτων συντήρησης.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }

    // Listing users is ADMIN/MANAGER only — a 403 here must not break the page.
    try {
      const usersRes = await usersApi.getAll(1, 100)
      setUsers(usersRes?.data?.users ?? [])
    } catch {
      setUsers([])
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = () => {
    setEditingRequest(null)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleEdit = (request: MaintenanceRequest) => {
    setEditingRequest(request)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<MaintenanceRequest>) => {
    setSubmitting(true)
    setDialogError(null)
    try {
      if (editingRequest) {
        await maintenanceApi.update(editingRequest.id, data)
      } else {
        await maintenanceApi.create(data)
      }
      setDialogOpen(false)
      setEditingRequest(null)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error saving maintenance request:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleAssign = async (userId: string) => {
    if (!assigningRequest) return
    const target = assigningRequest
    setSubmitting(true)
    setAssignError(null)
    try {
      await maintenanceApi.assign(target.id, userId)
      setAssigningRequest(null)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error assigning request:', error)
      setAssignError(errorMessage(error, 'Η ανάθεση απέτυχε.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleComplete = async (request: MaintenanceRequest) => {
    setBusyId(request.id)
    try {
      await maintenanceApi.complete(request.id)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error completing request:', error)
      setPageError(errorMessage(error, 'Η ολοκλήρωση του αιτήματος απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleCancel = async () => {
    if (!pendingCancel) return
    const target = pendingCancel
    setBusyId(target.id)
    setPendingCancel(null)
    try {
      await maintenanceApi.update(target.id, { status: 'CANCELLED' })
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error cancelling request:', error)
      setPageError(errorMessage(error, 'Η ακύρωση του αιτήματος απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const clearFilters = () => {
    setView('ALL')
    setSearchQuery('')
    setPriority('ALL')
  }

  const counts = useMemo(() => {
    const result: Record<MaintenanceView, number> = {
      ALL: requests.length,
      OPEN: 0,
      IN_PROGRESS: 0,
      URGENT: 0,
      DONE: 0,
    }
    requests.forEach((request) => {
      if (request.status === 'OPEN') result.OPEN += 1
      if (request.status === 'IN_PROGRESS') result.IN_PROGRESS += 1
      if (request.status === 'COMPLETED') result.DONE += 1
      if (request.priority === 'URGENT' && isOpenRequest(request)) result.URGENT += 1
    })
    return result
  }, [requests])

  const visibleRequests = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filtered = requests.filter((request) => {
      if (view === 'OPEN' && request.status !== 'OPEN') return false
      if (view === 'IN_PROGRESS' && request.status !== 'IN_PROGRESS') return false
      if (view === 'DONE' && request.status !== 'COMPLETED') return false
      if (view === 'URGENT' && !(request.priority === 'URGENT' && isOpenRequest(request))) {
        return false
      }
      if (priority !== 'ALL' && request.priority !== priority) return false
      if (!query) return true

      return [
        request.title,
        request.description,
        request.property?.titleGr,
        request.property?.titleEn,
        request.property?.city,
      ].some((field) => field?.toLowerCase().includes(query))
    })

    return sortByUrgency(filtered)
  }, [requests, view, priority, searchQuery])

  const isFiltered = view !== 'ALL' || priority !== 'ALL' || searchQuery.trim().length > 0

  return (
    <div className="space-y-6">
      <MaintenanceHeader
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        priority={priority}
        onPriorityChange={setPriority}
        onCreate={handleCreate}
        onRefresh={() => fetchData({ silent: true })}
        refreshing={refreshing}
        isFiltered={isFiltered}
        resultCount={visibleRequests.length}
        totalCount={requests.length}
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

      <MaintenanceSummary
        counts={counts}
        view={view}
        onViewChange={setView}
        loading={loading}
      />

      <MaintenanceTable
        requests={visibleRequests}
        users={users}
        loading={loading}
        busyId={busyId}
        isFiltered={isFiltered}
        onEdit={handleEdit}
        onAssign={(request) => {
          setAssignError(null)
          setAssigningRequest(request)
        }}
        onComplete={handleComplete}
        onCancel={setPendingCancel}
        onCreate={handleCreate}
        onClearFilters={clearFilters}
      />

      <MaintenanceDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditingRequest(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
        request={editingRequest}
        properties={properties}
        users={users}
        loading={submitting}
        error={dialogError}
      />

      <MaintenanceAssignDialog
        request={assigningRequest}
        users={users}
        loading={submitting}
        error={assignError}
        onAssign={handleAssign}
        onClose={() => {
          setAssigningRequest(null)
          setAssignError(null)
        }}
      />

      {pendingCancel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setPendingCancel(null)
          }}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-2xl bg-slate-800 border border-slate-700 p-5 shadow-2xl"
          >
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-xl bg-red-500/15 border border-red-500/25 flex items-center justify-center">
                <Ban className="h-5 w-5 text-red-300" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-100">Ακύρωση αιτήματος;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Το αίτημα{' '}
                  <span className="font-semibold text-slate-200">{pendingCancel.title}</span> θα
                  σημανθεί ως ακυρωμένο. Μπορείτε να το επαναφέρετε από την επεξεργασία.
                </p>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-end gap-3">
              <button
                onClick={() => setPendingCancel(null)}
                className="h-10 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
              >
                Πίσω
              </button>
              <button
                onClick={handleCancel}
                className="h-10 px-4 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Ακύρωση αιτήματος
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

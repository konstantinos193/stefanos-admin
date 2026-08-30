'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'
import { ServicesHeader } from '@/components/services/ServicesHeader'
import { ServicesSummary, ServicesView } from '@/components/services/ServicesSummary'
import { ServicesTable } from '@/components/services/ServicesTable'
import { ServiceDialog } from '@/components/services/ServiceDialog'
import { servicesApi, Service } from '@/lib/api/services'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | 'view'>('create')
  const [activeService, setActiveService] = useState<Service | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState<Service | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [view, setView] = useState<ServicesView>('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchServices = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await servicesApi.getAll({ limit: 100 })
      setServices(response?.data?.services ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching services:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης υπηρεσιών.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const openDialog = (mode: 'create' | 'edit' | 'view', service: Service | null) => {
    setDialogMode(mode)
    setActiveService(service)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<Service>) => {
    setSubmitting(true)
    setDialogError(null)
    try {
      if (dialogMode === 'edit' && activeService) {
        await servicesApi.update(activeService.id, data)
      } else {
        await servicesApi.create(data)
      }
      setDialogOpen(false)
      setActiveService(null)
      await fetchServices({ silent: true })
    } catch (error) {
      console.error('Error saving service:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleToggleActive = async (service: Service) => {
    setBusyId(service.id)
    try {
      await servicesApi.toggleActive(service.id)
      await fetchServices({ silent: true })
    } catch (error) {
      console.error('Error toggling service:', error)
      setPageError(errorMessage(error, 'Η αλλαγή κατάστασης απέτυχε.'))
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
      await servicesApi.delete(target.id)
      setServices((prev) => prev.filter((s) => s.id !== target.id))
      await fetchServices({ silent: true })
    } catch (error) {
      console.error('Error deleting service:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const clearFilters = () => {
    setView('ALL')
    setSearchQuery('')
  }

  const counts = useMemo(() => {
    const result: Record<ServicesView, number> = {
      ALL: services.length,
      ACTIVE: 0,
      INACTIVE: 0,
    }
    services.forEach((service) => {
      if (service.isActive) result.ACTIVE += 1
      else result.INACTIVE += 1
    })
    return result
  }, [services])

  const visibleServices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return services.filter((service) => {
      if (view === 'ACTIVE' && !service.isActive) return false
      if (view === 'INACTIVE' && service.isActive) return false
      if (!query) return true

      return (
        service.titleGr?.toLowerCase().includes(query) ||
        service.titleEn?.toLowerCase().includes(query) ||
        service.descriptionGr?.toLowerCase().includes(query) ||
        service.descriptionEn?.toLowerCase().includes(query) ||
        service.features?.some((feature) => feature.toLowerCase().includes(query))
      )
    })
  }, [services, view, searchQuery])

  const isFiltered = view !== 'ALL' || searchQuery.trim().length > 0

  return (
    <div className="space-y-6">
      <ServicesHeader
        searchValue={searchQuery}
        onSearch={setSearchQuery}
        onCreate={() => openDialog('create', null)}
        onRefresh={() => fetchServices({ silent: true })}
        refreshing={refreshing}
        isFiltered={isFiltered}
        resultCount={visibleServices.length}
        totalCount={services.length}
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

      <ServicesSummary counts={counts} view={view} onViewChange={setView} loading={loading} />

      <ServicesTable
        services={visibleServices}
        loading={loading}
        busyId={busyId}
        isFiltered={isFiltered}
        onView={(service) => openDialog('view', service)}
        onEdit={(service) => openDialog('edit', service)}
        onDelete={setPendingDelete}
        onToggleActive={handleToggleActive}
        onCreate={() => openDialog('create', null)}
        onClearFilters={clearFilters}
      />

      <ServiceDialog
        isOpen={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setActiveService(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
        service={activeService}
        mode={dialogMode}
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
                <h3 className="text-base font-bold text-slate-100">Διαγραφή υπηρεσίας;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Η υπηρεσία{' '}
                  <span className="font-semibold text-slate-200">{pendingDelete.titleGr}</span> θα
                  διαγραφεί οριστικά και θα αφαιρεθεί από την ιστοσελίδα.
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

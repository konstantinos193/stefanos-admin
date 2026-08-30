'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AlertCircle, Trash2, X } from 'lucide-react'
import { PropertiesHeader } from '@/components/properties/PropertiesHeader'
import { PropertiesFilters } from '@/components/properties/PropertiesFilters'
import { PropertiesGrid } from '@/components/properties/PropertiesGrid'
import { PropertyDialog } from '@/components/properties/PropertyDialog'
import { PropertyDetailsDialog } from '@/components/properties/PropertyDetailsDialog'
import {
  PropertyStatusValue,
  PropertyTypeValue,
  collectCities,
  statusMeta,
  typeLabel,
} from '@/components/properties/propertyUtils'
import { propertiesApi } from '@/lib/api/properties'
import type { Property } from '@/lib/api/types'

const FETCH_LIMIT = 100

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Property | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [viewing, setViewing] = useState<Property | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Property | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [search, setSearch] = useState('')
  const [type, setType] = useState<PropertyTypeValue | 'ALL'>('ALL')
  const [status, setStatus] = useState<PropertyStatusValue | 'ALL'>('ALL')
  const [city, setCity] = useState('')

  const fetchProperties = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const response = await propertiesApi.getAll({ limit: FETCH_LIMIT })
      setProperties(response?.data?.properties ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching properties:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης ακινήτων.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  const handleCreate = () => {
    setEditing(null)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleEdit = (property: Property) => {
    setViewing(null)
    setEditing(property)
    setDialogError(null)
    setDialogOpen(true)
  }

  const handleSubmit = async (data: Partial<Property>) => {
    setSubmitting(true)
    setDialogError(null)
    try {
      if (editing) {
        await propertiesApi.update(editing.id, data)
      } else {
        await propertiesApi.create(data)
      }
      setDialogOpen(false)
      setEditing(null)
      await fetchProperties({ silent: true })
    } catch (error) {
      console.error('Error saving property:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setBusyId(target.id)
    setPendingDelete(null)
    try {
      await propertiesApi.delete(target.id)
      setProperties((prev) => prev.filter((p) => p.id !== target.id))
      await fetchProperties({ silent: true })
    } catch (error) {
      console.error('Error deleting property:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyId(null)
    }
  }

  const clearFilters = () => {
    setSearch('')
    setType('ALL')
    setStatus('ALL')
    setCity('')
  }

  const cities = useMemo(() => collectCities(properties), [properties])

  const visibleProperties = useMemo(() => {
    const query = search.trim().toLowerCase()

    return properties.filter((property) => {
      if (type !== 'ALL' && property.type !== type) return false
      if (status !== 'ALL' && property.status !== status) return false
      if (city && property.city !== city) return false
      if (!query) return true

      return [
        property.titleGr,
        property.titleEn,
        property.city,
        property.address,
        property.country,
      ].some((field) => field?.toLowerCase().includes(query))
    })
  }, [properties, search, type, status, city])

  const isFiltered = Boolean(search.trim()) || type !== 'ALL' || status !== 'ALL' || Boolean(city)

  const handleExport = () => {
    setExporting(true)
    try {
      const rows: (string | number)[][] = [
        [
          'Τίτλος (EL)',
          'Τίτλος (EN)',
          'Τύπος',
          'Κατάσταση',
          'Διεύθυνση',
          'Πόλη',
          'Χώρα',
          'Άτομα',
          'Υπνοδωμάτια',
          'Μπάνια',
          'Εμβαδόν (m²)',
          'Τιμή/διανυκτέρευση',
          'Νόμισμα',
        ],
        ...visibleProperties.map((property) => [
          property.titleGr,
          property.titleEn,
          typeLabel(property.type),
          statusMeta(property.status).label,
          property.address,
          property.city,
          property.country,
          property.maxGuests,
          property.bedrooms,
          property.bathrooms,
          property.area ?? '',
          property.basePrice,
          property.currency,
        ]),
      ]

      const body = rows
        .map((row) =>
          row
            .map((cell) => {
              const value = String(cell ?? '')
              return /[";\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
            })
            .join(';'),
        )
        .join('\r\n')

      // BOM + `;` so Excel in a Greek locale opens it with columns and accents intact.
      const blob = new Blob([`﻿${body}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `properties-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting properties:', error)
      setPageError(errorMessage(error, 'Η εξαγωγή απέτυχε.'))
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PropertiesHeader
        onCreate={handleCreate}
        onExport={handleExport}
        onRefresh={() => fetchProperties({ silent: true })}
        refreshing={refreshing}
        exporting={exporting}
        exportDisabled={visibleProperties.length === 0}
        totalCount={properties.length}
        resultCount={visibleProperties.length}
        isFiltered={isFiltered}
      />

      <PropertiesFilters
        search={search}
        onSearchChange={setSearch}
        type={type}
        onTypeChange={setType}
        status={status}
        onStatusChange={setStatus}
        city={city}
        onCityChange={setCity}
        cities={cities}
        isFiltered={isFiltered}
        onClear={clearFilters}
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

      <PropertiesGrid
        properties={visibleProperties}
        loading={loading}
        busyId={busyId}
        isFiltered={isFiltered}
        onView={setViewing}
        onEdit={handleEdit}
        onDelete={setPendingDelete}
        onCreate={handleCreate}
        onClearFilters={clearFilters}
      />

      <PropertyDialog
        isOpen={dialogOpen}
        property={editing}
        loading={submitting}
        error={dialogError}
        onClose={() => {
          setDialogOpen(false)
          setEditing(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
      />

      <PropertyDetailsDialog
        property={viewing}
        onClose={() => setViewing(null)}
        onEdit={handleEdit}
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
                <h3 className="text-base font-bold text-slate-100">Διαγραφή ακινήτου;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Το ακίνητο{' '}
                  <span className="font-semibold text-slate-200">{pendingDelete.titleGr}</span> θα
                  διαγραφεί οριστικά, μαζί με τα δωμάτια και τις κρατήσεις του.
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

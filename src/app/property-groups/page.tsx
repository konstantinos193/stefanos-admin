'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  Layers,
  Plus,
  RefreshCw,
  Trash2,
  X,
  Edit,
  Building2,
  Settings2,
} from 'lucide-react'
import { PropertyGroupDialog } from '@/components/property-groups/PropertyGroupDialog'
import { ManageGroupPropertiesDialog } from '@/components/property-groups/ManageGroupPropertiesDialog'
import { propertyGroupsApi, type PropertyGroup } from '@/lib/api/property-groups'
import { propertiesApi } from '@/lib/api/properties'
import type { Property } from '@/lib/api/types'

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

export default function PropertyGroupsPage() {
  const [groups, setGroups] = useState<PropertyGroup[]>([])
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<PropertyGroup | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [dialogError, setDialogError] = useState<string | null>(null)

  const [managing, setManaging] = useState<PropertyGroup | null>(null)
  const [manageError, setManageError] = useState<string | null>(null)
  const [busyPropertyId, setBusyPropertyId] = useState<string | null>(null)

  const [pendingDelete, setPendingDelete] = useState<PropertyGroup | null>(null)
  const [busyGroupId, setBusyGroupId] = useState<string | null>(null)

  const fetchData = useCallback(async (options: { silent?: boolean } = {}) => {
    const { silent = false } = options
    if (silent) setRefreshing(true)
    else setLoading(true)

    try {
      const [groupsRes, propertiesRes] = await Promise.all([
        propertyGroupsApi.getAll(),
        propertiesApi.getAll({ limit: 100 }),
      ])

      setGroups(groupsRes?.data?.groups ?? [])
      setProperties(propertiesRes?.data?.properties ?? [])
      setPageError(null)
    } catch (error) {
      console.error('Error fetching property groups:', error)
      setPageError(errorMessage(error, 'Αποτυχία φόρτωσης ομάδων ακινήτων.'))
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Keep the open manage dialog pointed at the refreshed group record.
  useEffect(() => {
    if (!managing) return
    const next = groups.find((group) => group.id === managing.id)
    if (next && next !== managing) setManaging(next)
  }, [groups, managing])

  const handleSubmit = async (data: Partial<PropertyGroup>) => {
    setSubmitting(true)
    setDialogError(null)
    try {
      if (editing) {
        await propertyGroupsApi.update(editing.id, data)
      } else {
        await propertyGroupsApi.create(data)
      }
      setDialogOpen(false)
      setEditing(null)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error saving property group:', error)
      setDialogError(errorMessage(error, 'Η αποθήκευση απέτυχε. Δοκιμάστε ξανά.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const target = pendingDelete
    setBusyGroupId(target.id)
    setPendingDelete(null)
    try {
      await propertyGroupsApi.delete(target.id)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error deleting property group:', error)
      setPageError(errorMessage(error, 'Η διαγραφή απέτυχε.'))
    } finally {
      setBusyGroupId(null)
    }
  }

  const handleAddProperty = async (propertyId: string) => {
    if (!managing) return
    setBusyPropertyId(propertyId)
    setManageError(null)
    try {
      await propertyGroupsApi.addProperty(managing.id, propertyId)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error adding property to group:', error)
      setManageError(errorMessage(error, 'Η προσθήκη απέτυχε.'))
    } finally {
      setBusyPropertyId(null)
    }
  }

  const handleRemoveProperty = async (propertyId: string) => {
    if (!managing) return
    setBusyPropertyId(propertyId)
    setManageError(null)
    try {
      await propertyGroupsApi.removeProperty(managing.id, propertyId)
      await fetchData({ silent: true })
    } catch (error) {
      console.error('Error removing property from group:', error)
      setManageError(errorMessage(error, 'Η αφαίρεση απέτυχε.'))
    } finally {
      setBusyPropertyId(null)
    }
  }

  const ungroupedCount = useMemo(
    () => properties.filter((property) => !property.propertyGroupId).length,
    [properties],
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">Ομάδες Ακινήτων</h1>
          <p className="text-slate-400 mt-1 text-sm">
            {groups.length > 0
              ? `${groups.length} ${groups.length === 1 ? 'ομάδα' : 'ομάδες'} · ${ungroupedCount} ακίνητα χωρίς ομάδα`
              : 'Ομαδοποιήστε ακίνητα για κοινή διαχείριση'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData({ silent: true })}
            disabled={refreshing}
            title="Ανανέωση"
            aria-label="Ανανέωση"
            className="flex items-center justify-center h-11 w-11 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setDialogError(null)
              setDialogOpen(true)
            }}
            className="flex items-center gap-2 h-11 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Νέα Ομάδα</span>
            <span className="sm:hidden">Νέα</span>
          </button>
        </div>
      </div>

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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-48 rounded-2xl bg-slate-800/50 border border-slate-700/60 animate-pulse"
            />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700 py-16 text-center">
          <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Layers className="h-5 w-5 text-blue-400" />
          </div>
          <p className="mt-4 text-base font-semibold text-slate-200">Δεν υπάρχουν ομάδες</p>
          <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
            Δημιουργήστε μια ομάδα για να διαχειρίζεστε μαζί ακίνητα που ανήκουν στην ίδια
            τοποθεσία ή κατηγορία.
          </p>
          <button
            onClick={() => {
              setEditing(null)
              setDialogError(null)
              setDialogOpen(true)
            }}
            className="mt-5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
          >
            Νέα Ομάδα
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {groups.map((group) => {
            const members = group.properties ?? []
            const count = group._count?.properties ?? members.length
            const busy = busyGroupId === group.id

            return (
              <div
                key={group.id}
                className={`flex flex-col rounded-2xl bg-slate-800/60 border border-slate-700 p-5 ${
                  busy ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-xl border bg-blue-500/15 text-blue-300 border-blue-500/25">
                    <Layers className="h-5 w-5" />
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-semibold text-slate-300">
                    {count} {count === 1 ? 'ακίνητο' : 'ακίνητα'}
                  </span>
                </div>

                <h2 className="mt-4 text-base font-bold text-slate-100">{group.name}</h2>
                {group.description && (
                  <p className="mt-1 text-sm text-slate-400 line-clamp-2">{group.description}</p>
                )}

                <div className="mt-4 flex-1">
                  {members.length === 0 ? (
                    <p className="text-xs text-slate-500">Καμία ανάθεση ακινήτου.</p>
                  ) : (
                    <ul className="space-y-1.5">
                      {members.slice(0, 3).map((property) => (
                        <li
                          key={property.id}
                          className="flex items-center gap-2 text-sm text-slate-300"
                        >
                          <Building2 className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                          <span className="truncate">{property.titleGr || property.titleEn}</span>
                        </li>
                      ))}
                      {members.length > 3 && (
                        <li className="text-xs text-slate-500">
                          +{members.length - 3} ακόμη
                        </li>
                      )}
                    </ul>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setManageError(null)
                      setManaging(group)
                    }}
                    disabled={busy}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 h-10 rounded-xl bg-slate-700/60 text-slate-200 text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <Settings2 className="h-4 w-4" />
                    Ακίνητα
                  </button>
                  <button
                    onClick={() => {
                      setEditing(group)
                      setDialogError(null)
                      setDialogOpen(true)
                    }}
                    disabled={busy}
                    aria-label="Επεξεργασία"
                    className="h-10 w-10 inline-flex items-center justify-center rounded-xl bg-slate-700/60 text-slate-200 hover:bg-slate-700 transition-colors disabled:opacity-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setPendingDelete(group)}
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
      )}

      <PropertyGroupDialog
        isOpen={dialogOpen}
        group={editing}
        loading={submitting}
        error={dialogError}
        onClose={() => {
          setDialogOpen(false)
          setEditing(null)
          setDialogError(null)
        }}
        onSubmit={handleSubmit}
      />

      <ManageGroupPropertiesDialog
        group={managing}
        properties={properties}
        busyPropertyId={busyPropertyId}
        error={manageError}
        onAdd={handleAddProperty}
        onRemove={handleRemoveProperty}
        onClose={() => {
          setManaging(null)
          setManageError(null)
        }}
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
                <h3 className="text-base font-bold text-slate-100">Διαγραφή ομάδας;</h3>
                <p className="mt-1 text-sm text-slate-400">
                  Η ομάδα{' '}
                  <span className="font-semibold text-slate-200">{pendingDelete.name}</span> θα
                  διαγραφεί. Τα ακίνητά της δεν διαγράφονται — απλώς μένουν χωρίς ομάδα.
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

'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Search, Check, Plus, Building2 } from 'lucide-react'
import type { PropertyGroup } from '@/lib/api/property-groups'
import type { Property } from '@/lib/api/types'

interface ManageGroupPropertiesDialogProps {
  group: PropertyGroup | null
  properties: Property[]
  busyPropertyId?: string | null
  error?: string | null
  onAdd: (propertyId: string) => void
  onRemove: (propertyId: string) => void
  onClose: () => void
}

/**
 * A property belongs to at most one group (Property.propertyGroupId), so a
 * property already in another group is shown as taken rather than offered.
 */
export function ManageGroupPropertiesDialog({
  group,
  properties,
  busyPropertyId,
  error,
  onAdd,
  onRemove,
  onClose,
}: ManageGroupPropertiesDialogProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (group) setQuery('')
  }, [group])

  useEffect(() => {
    if (!group) return
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
  }, [group, onClose])

  if (!group) return null

  const normalized = query.trim().toLowerCase()
  const visible = properties.filter((property) => {
    if (!normalized) return true
    return [property.titleGr, property.titleEn, property.city].some((field) =>
      field?.toLowerCase().includes(normalized),
    )
  })

  const memberCount = properties.filter((p) => p.propertyGroupId === group.id).length

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
        className="w-full sm:max-w-lg max-h-[88vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100 truncate">Ακίνητα ομάδας</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {group.name} · {memberCount} {memberCount === 1 ? 'ακίνητο' : 'ακίνητα'}
            </p>
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

        <div className="px-5 pt-4">
          {error && (
            <div className="mb-3 rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Αναζήτηση ακινήτου…"
              className="w-full h-11 pl-10 pr-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-400">
              {properties.length === 0
                ? 'Δεν υπάρχουν ακίνητα.'
                : 'Κανένα ακίνητο δεν ταιριάζει στην αναζήτηση.'}
            </p>
          ) : (
            visible.map((property) => {
              const inThisGroup = property.propertyGroupId === group.id
              const inOtherGroup = Boolean(property.propertyGroupId) && !inThisGroup
              const busy = busyPropertyId === property.id

              return (
                <div
                  key={property.id}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-colors ${
                    inThisGroup
                      ? 'bg-blue-500/10 border-blue-500/40'
                      : 'bg-slate-900 border-slate-700'
                  } ${busy ? 'opacity-60' : ''}`}
                >
                  <div className="h-9 w-9 flex-shrink-0 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-slate-300" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-100 truncate">
                      {property.titleGr}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {property.city}
                      {inOtherGroup ? ' · σε άλλη ομάδα' : ''}
                    </p>
                  </div>

                  {inThisGroup ? (
                    <button
                      onClick={() => onRemove(property.id)}
                      disabled={busy}
                      className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                      Αφαίρεση
                    </button>
                  ) : (
                    <button
                      onClick={() => onAdd(property.id)}
                      disabled={busy || inOtherGroup}
                      title={inOtherGroup ? 'Ανήκει ήδη σε άλλη ομάδα' : 'Προσθήκη στην ομάδα'}
                      className="h-9 px-3 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Προσθήκη
                    </button>
                  )}
                </div>
              )
            })
          )}
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

'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, MapPin, Bed, Bath, Square, Users, Building2, SearchX } from 'lucide-react'
import type { Property } from '@/lib/api/types'
import { formatNightlyPrice, statusMeta, typeLabel } from './propertyUtils'

interface PropertiesGridProps {
  properties: Property[]
  loading: boolean
  busyId?: string | null
  isFiltered?: boolean
  onView: (property: Property) => void
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
  onCreate?: () => void
  onClearFilters?: () => void
}

/** The <img> had no error handling, so a dead URL rendered the alt text over the gradient. */
function PropertyImage({ property }: { property: Property }) {
  const [failed, setFailed] = useState(false)
  const source = property.images?.[0]
  const showImage = Boolean(source) && !failed

  return (
    <div className="relative h-44 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700">
      {showImage ? (
        <img
          src={source}
          alt={property.titleGr}
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-slate-400">
          <Building2 className="h-7 w-7" />
          <span className="text-xs font-medium">{typeLabel(property.type)}</span>
        </div>
      )}

      <span
        className={`absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold rounded-lg backdrop-blur-sm ${
          statusMeta(property.status).badge
        }`}
      >
        {statusMeta(property.status).label}
      </span>
    </div>
  )
}

export function PropertiesGrid({
  properties,
  loading,
  busyId,
  isFiltered,
  onView,
  onEdit,
  onDelete,
  onCreate,
  onClearFilters,
}: PropertiesGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-800/60 border border-slate-700 p-4 animate-pulse"
          >
            <div className="h-44 bg-slate-700/50 rounded-xl" />
            <div className="mt-4 h-4 w-2/3 bg-slate-700/50 rounded" />
            <div className="mt-2 h-3 w-1/2 bg-slate-700/40 rounded" />
            <div className="mt-4 h-8 bg-slate-700/40 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-800/60 border border-slate-700 py-16 text-center">
        <div className="h-12 w-12 mx-auto rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center">
          {isFiltered ? (
            <SearchX className="h-5 w-5 text-slate-400" />
          ) : (
            <Building2 className="h-5 w-5 text-blue-400" />
          )}
        </div>
        <p className="mt-4 text-base font-semibold text-slate-200">
          {isFiltered ? 'Κανένα αποτέλεσμα' : 'Δεν υπάρχουν ακίνητα'}
        </p>
        <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
          {isFiltered
            ? 'Δοκιμάστε διαφορετική αναζήτηση ή αφαιρέστε τα φίλτρα.'
            : 'Προσθέστε το πρώτο σας ακίνητο για να ξεκινήσετε.'}
        </p>
        {isFiltered
          ? onClearFilters && (
              <button
                onClick={onClearFilters}
                className="mt-5 h-10 px-4 rounded-xl bg-slate-800 border border-slate-700 text-sm font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
              >
                Καθαρισμός φίλτρων
              </button>
            )
          : onCreate && (
              <button
                onClick={onCreate}
                className="mt-5 h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
              >
                Προσθήκη Ακινήτου
              </button>
            )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {properties.map((property) => {
        const busy = busyId === property.id

        return (
          <div
            key={property.id}
            className={`flex flex-col rounded-2xl bg-slate-800/60 border border-slate-700 p-4 transition-colors hover:border-slate-600 ${
              busy ? 'opacity-60' : ''
            }`}
          >
            <PropertyImage property={property} />

            <div className="mt-4 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-bold text-slate-100 leading-snug">
                  {property.titleGr}
                </h3>
                <span className="flex-shrink-0 px-2 py-0.5 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-semibold text-slate-300">
                  {typeLabel(property.type)}
                </span>
              </div>

              <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">
                  {property.city}
                  {property.country ? `, ${property.country}` : ''}
                </span>
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  {property.maxGuests}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bed className="h-4 w-4" />
                  {property.bedrooms}
                </span>
                <span className="flex items-center gap-1.5">
                  <Bath className="h-4 w-4" />
                  {property.bathrooms}
                </span>
                {property.area ? (
                  <span className="flex items-center gap-1.5">
                    <Square className="h-4 w-4" />
                    {property.area}m²
                  </span>
                ) : null}
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-center justify-between gap-2">
              <p className="text-base font-bold text-slate-50">
                {formatNightlyPrice(property.basePrice, property.currency)}
              </p>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => onView(property)}
                  disabled={busy}
                  title="Προβολή"
                  aria-label="Προβολή"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onEdit(property)}
                  disabled={busy}
                  title="Επεξεργασία"
                  aria-label="Επεξεργασία"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-700 hover:text-slate-100 transition-colors disabled:opacity-50"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDelete(property)}
                  disabled={busy}
                  title="Διαγραφή"
                  aria-label="Διαγραφή"
                  className="h-9 w-9 inline-flex items-center justify-center rounded-lg text-slate-400 hover:bg-red-500/15 hover:text-red-300 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { X, MapPin, Users, Bed, Bath, Square, Star, Building2, Pencil } from 'lucide-react'
import type { Property } from '@/lib/api/types'
import { formatNightlyPrice, formatPrice, statusMeta, typeLabel } from './propertyUtils'

interface PropertyDetailsDialogProps {
  property: Property | null
  onClose: () => void
  onEdit: (property: Property) => void
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</p>
      <div className="text-sm text-slate-200">{children}</div>
    </div>
  )
}

export function PropertyDetailsDialog({ property, onClose, onEdit }: PropertyDetailsDialogProps) {
  const [imageFailed, setImageFailed] = useState(false)

  useEffect(() => {
    setImageFailed(false)
  }, [property])

  useEffect(() => {
    if (!property) return
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
  }, [property, onClose])

  if (!property) return null

  const cover = property.images?.[0]
  const showImage = Boolean(cover) && !imageFailed
  const status = statusMeta(property.status)

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
        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100 truncate">{property.titleGr}</h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">{property.titleEn}</p>
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <div className="h-52 rounded-xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-700">
            {showImage ? (
              <img
                src={cover}
                alt={property.titleGr}
                onError={() => setImageFailed(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-slate-400">
                <Building2 className="h-8 w-8" />
                <span className="text-xs font-medium">Χωρίς φωτογραφία</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${status.badge}`}>
              {status.label}
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-700/50 border border-slate-600/50 text-xs font-semibold text-slate-300">
              {typeLabel(property.type)}
            </span>
            {typeof property.averageRating === 'number' && property.averageRating > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-xs font-semibold text-amber-300">
                <Star className="h-3.5 w-3.5" />
                {property.averageRating.toFixed(1)}
                {property.reviewCount ? ` · ${property.reviewCount} κριτικές` : ''}
              </span>
            )}
          </div>

          <Field label="Τοποθεσία">
            <span className="inline-flex items-start gap-1.5">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-slate-400" />
              <span>
                {property.address}
                {property.city ? `, ${property.city}` : ''}
                {property.country ? `, ${property.country}` : ''}
              </span>
            </span>
          </Field>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Field label="Άτομα">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-slate-400" />
                {property.maxGuests}
              </span>
            </Field>
            <Field label="Υπνοδωμάτια">
              <span className="inline-flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-slate-400" />
                {property.bedrooms}
              </span>
            </Field>
            <Field label="Μπάνια">
              <span className="inline-flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-slate-400" />
                {property.bathrooms}
              </span>
            </Field>
            <Field label="Εμβαδόν">
              <span className="inline-flex items-center gap-1.5">
                <Square className="h-4 w-4 text-slate-400" />
                {property.area ? `${property.area}m²` : '—'}
              </span>
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Τιμή">
              <span className="font-semibold text-slate-50">
                {formatNightlyPrice(property.basePrice, property.currency)}
              </span>
            </Field>
            <Field label="Χρέωση καθαρισμού">
              {property.cleaningFee != null
                ? formatPrice(property.cleaningFee, property.currency)
                : '—'}
            </Field>
            <Field label="Χρέωση υπηρεσιών">
              {property.serviceFee != null
                ? formatPrice(property.serviceFee, property.currency)
                : '—'}
            </Field>
          </div>

          {(property.descriptionGr || property.descriptionEn) && (
            <div className="space-y-4">
              {property.descriptionGr && (
                <Field label="Περιγραφή (Ελληνικά)">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {property.descriptionGr}
                  </p>
                </Field>
              )}
              {property.descriptionEn && (
                <Field label="Περιγραφή (Αγγλικά)">
                  <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {property.descriptionEn}
                  </p>
                </Field>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors"
          >
            Κλείσιμο
          </button>
          <button
            type="button"
            onClick={() => onEdit(property)}
            className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors"
          >
            <Pencil className="h-4 w-4" />
            Επεξεργασία
          </button>
        </div>
      </div>
    </div>
  )
}

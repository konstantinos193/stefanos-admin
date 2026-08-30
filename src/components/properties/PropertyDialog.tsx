'use client'

import { useEffect, useState } from 'react'
import { X, Loader2, Building2, MapPin, Users, Euro } from 'lucide-react'
import type { Property } from '@/lib/api/types'
import {
  PROPERTY_TYPES,
  PROPERTY_STATUSES,
  PropertyStatusValue,
  PropertyTypeValue,
} from './propertyUtils'

interface PropertyDialogProps {
  isOpen: boolean
  property?: Property | null
  loading?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: Partial<Property>) => void
}

const EMPTY_FORM = {
  titleGr: '',
  titleEn: '',
  descriptionGr: '',
  descriptionEn: '',
  type: 'APARTMENT' as PropertyTypeValue,
  status: 'ACTIVE' as PropertyStatusValue,
  address: '',
  city: '',
  country: 'Greece',
  maxGuests: '2',
  bedrooms: '1',
  bathrooms: '1',
  area: '',
  basePrice: '0',
  currency: 'EUR',
}

export function PropertyDialog({
  isOpen,
  property,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}: PropertyDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    if (property) {
      setFormData({
        titleGr: property.titleGr || '',
        titleEn: property.titleEn || '',
        descriptionGr: property.descriptionGr || '',
        descriptionEn: property.descriptionEn || '',
        type: property.type,
        status: property.status,
        address: property.address || '',
        city: property.city || '',
        country: property.country || 'Greece',
        maxGuests: String(property.maxGuests ?? 1),
        bedrooms: String(property.bedrooms ?? 0),
        bathrooms: String(property.bathrooms ?? 0),
        area: property.area != null ? String(property.area) : '',
        basePrice: String(property.basePrice ?? 0),
        currency: property.currency || 'EUR',
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [property, isOpen])

  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !loading) onClose()
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, loading, onClose])

  const canSubmit =
    formData.titleGr.trim().length > 0 &&
    formData.titleEn.trim().length > 0 &&
    formData.address.trim().length > 0 &&
    formData.city.trim().length > 0 &&
    formData.country.trim().length > 0 &&
    Number(formData.maxGuests) >= 1 &&
    Number(formData.basePrice) >= 0 &&
    !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    // Only keys the API's DTO declares — it validates with forbidNonWhitelisted.
    const payload: Partial<Property> = {
      titleGr: formData.titleGr.trim(),
      titleEn: formData.titleEn.trim(),
      descriptionGr: formData.descriptionGr.trim() || null,
      descriptionEn: formData.descriptionEn.trim() || null,
      type: formData.type,
      status: formData.status,
      address: formData.address.trim(),
      city: formData.city.trim(),
      country: formData.country.trim(),
      maxGuests: Number(formData.maxGuests) || 1,
      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      basePrice: Number(formData.basePrice) || 0,
      currency: formData.currency || 'EUR',
    }

    if (formData.area.trim()) payload.area = Number(formData.area)

    onSubmit(payload)
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'
  const labelClass =
    'block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'
  const sectionClass =
    'flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-300'

  const set = (patch: Partial<typeof EMPTY_FORM>) =>
    setFormData((prev) => ({ ...prev, ...patch }))

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm p-0 sm:p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !loading) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full sm:max-w-2xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100">
              {property ? 'Επεξεργασία Ακινήτου' : 'Νέο Ακίνητο'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {property ? property.titleGr : 'Συμπληρώστε τα στοιχεία σε ελληνικά και αγγλικά'}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <p className={sectionClass}>
              <Building2 className="h-3.5 w-3.5" />
              Βασικά στοιχεία
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Τίτλος (Ελληνικά) *</label>
                <input
                  type="text"
                  value={formData.titleGr}
                  onChange={(e) => set({ titleGr: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Τίτλος (Αγγλικά) *</label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => set({ titleEn: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Τύπος</label>
                <select
                  value={formData.type}
                  onChange={(e) => set({ type: e.target.value as PropertyTypeValue })}
                  className={`${fieldClass} [&>option]:bg-slate-800`}
                >
                  {PROPERTY_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Κατάσταση</label>
                <select
                  value={formData.status}
                  onChange={(e) => set({ status: e.target.value as PropertyStatusValue })}
                  className={`${fieldClass} [&>option]:bg-slate-800`}
                >
                  {PROPERTY_STATUSES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Περιγραφή (Ελληνικά)</label>
                <textarea
                  value={formData.descriptionGr}
                  onChange={(e) => set({ descriptionGr: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                />
              </div>
              <div>
                <label className={labelClass}>Περιγραφή (Αγγλικά)</label>
                <textarea
                  value={formData.descriptionEn}
                  onChange={(e) => set({ descriptionEn: e.target.value })}
                  rows={3}
                  className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={sectionClass}>
              <MapPin className="h-3.5 w-3.5" />
              Τοποθεσία
            </p>

            <div>
              <label className={labelClass}>Διεύθυνση *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => set({ address: e.target.value })}
                className={fieldClass}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Πόλη *</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => set({ city: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Χώρα *</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => set({ country: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={sectionClass}>
              <Users className="h-3.5 w-3.5" />
              Χωρητικότητα
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClass}>Άτομα *</label>
                <input
                  type="number"
                  min={1}
                  value={formData.maxGuests}
                  onChange={(e) => set({ maxGuests: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Υπνοδωμάτια</label>
                <input
                  type="number"
                  min={0}
                  value={formData.bedrooms}
                  onChange={(e) => set({ bedrooms: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Μπάνια</label>
                <input
                  type="number"
                  min={0}
                  value={formData.bathrooms}
                  onChange={(e) => set({ bathrooms: e.target.value })}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className={labelClass}>Εμβαδόν (m²)</label>
                <input
                  type="number"
                  min={0}
                  value={formData.area}
                  onChange={(e) => set({ area: e.target.value })}
                  placeholder="—"
                  className={fieldClass}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className={sectionClass}>
              <Euro className="h-3.5 w-3.5" />
              Τιμολόγηση
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Τιμή ανά διανυκτέρευση *</label>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) => set({ basePrice: e.target.value })}
                  className={fieldClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Νόμισμα</label>
                <input
                  type="text"
                  value={formData.currency}
                  onChange={(e) => set({ currency: e.target.value.toUpperCase() })}
                  maxLength={3}
                  className={fieldClass}
                />
              </div>
            </div>
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700 bg-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            Ακύρωση
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Αποθήκευση…' : property ? 'Ενημέρωση' : 'Δημιουργία'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { X, Eye, Edit, Plus, Loader2, Briefcase } from 'lucide-react'
import { Service } from '@/lib/api/services'

interface ServiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: Partial<Service>) => void
  service?: Service | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
  error?: string | null
}

const EMPTY_FORM = {
  titleGr: '',
  titleEn: '',
  descriptionGr: '',
  descriptionEn: '',
  icon: '',
  features: [] as string[],
  pricingGr: '',
  pricingEn: '',
  isActive: true,
}

export function ServiceDialog({
  isOpen,
  onClose,
  onSubmit,
  service,
  mode = 'create',
  loading = false,
  error = null,
}: ServiceDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [newFeature, setNewFeature] = useState('')

  // `isOpen` belongs in the deps: without it, reopening the dialog in the same
  // mode kept the previous session's half-typed values.
  useEffect(() => {
    if (!isOpen) return
    setNewFeature('')
    if (service && mode !== 'create') {
      setFormData({
        titleGr: service.titleGr || '',
        titleEn: service.titleEn || '',
        descriptionGr: service.descriptionGr || '',
        descriptionEn: service.descriptionEn || '',
        icon: service.icon || '',
        features: service.features || [],
        pricingGr: service.pricingGr || '',
        pricingEn: service.pricingEn || '',
        isActive: service.isActive,
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [service, mode, isOpen])

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

  const isReadOnly = mode === 'view'

  const addFeature = () => {
    const value = newFeature.trim()
    if (!value || formData.features.includes(value)) return
    setFormData((prev) => ({ ...prev, features: [...prev.features, value] }))
    setNewFeature('')
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  const canSubmit =
    formData.titleGr.trim().length > 0 && formData.titleEn.trim().length > 0 && !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isReadOnly || !onSubmit || !canSubmit) return

    onSubmit({
      titleGr: formData.titleGr.trim(),
      titleEn: formData.titleEn.trim(),
      descriptionGr: formData.descriptionGr.trim() || null,
      descriptionEn: formData.descriptionEn.trim() || null,
      icon: formData.icon.trim() || null,
      features: formData.features,
      pricingGr: formData.pricingGr.trim() || null,
      pricingEn: formData.pricingEn.trim() || null,
      isActive: formData.isActive,
    })
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors read-only:opacity-70'
  const textareaClass =
    'w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none read-only:opacity-70'
  const labelClass =
    'block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'

  const modeIcon =
    mode === 'view' ? (
      <Eye className="h-4 w-4 text-blue-300" />
    ) : mode === 'edit' ? (
      <Edit className="h-4 w-4 text-amber-300" />
    ) : (
      <Plus className="h-4 w-4 text-green-300" />
    )

  const modeIconBg =
    mode === 'view'
      ? 'bg-blue-500/15 border-blue-500/30'
      : mode === 'edit'
        ? 'bg-amber-500/15 border-amber-500/30'
        : 'bg-green-500/15 border-green-500/30'

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
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`h-9 w-9 flex-shrink-0 rounded-xl border flex items-center justify-center ${modeIconBg}`}
            >
              {modeIcon}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-100 truncate">
                {mode === 'view'
                  ? 'Προβολή Υπηρεσίας'
                  : mode === 'edit'
                    ? 'Επεξεργασία Υπηρεσίας'
                    : 'Νέα Υπηρεσία'}
              </h2>
              <p className="text-xs text-slate-400 truncate">
                {mode === 'create'
                  ? 'Συμπληρώστε τα στοιχεία σε ελληνικά και αγγλικά'
                  : service?.titleGr || ''}
              </p>
            </div>
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Τίτλος (Ελληνικά) *</label>
              <input
                type="text"
                value={formData.titleGr}
                onChange={(e) => setFormData((prev) => ({ ...prev, titleGr: e.target.value }))}
                placeholder="π.χ. Διαχείριση Ακινήτων"
                className={fieldClass}
                required
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className={labelClass}>Τίτλος (Αγγλικά) *</label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, titleEn: e.target.value }))}
                placeholder="e.g. Property Management"
                className={fieldClass}
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Περιγραφή (Ελληνικά)</label>
              <textarea
                value={formData.descriptionGr}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descriptionGr: e.target.value }))
                }
                rows={4}
                placeholder="Τι περιλαμβάνει η υπηρεσία…"
                className={textareaClass}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className={labelClass}>Περιγραφή (Αγγλικά)</label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))
                }
                rows={4}
                placeholder="What the service includes…"
                className={textareaClass}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Εικονίδιο (emoji)</label>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 flex-shrink-0 rounded-xl bg-slate-700/60 border border-slate-600/60 flex items-center justify-center">
                {formData.icon ? (
                  <span className="text-lg leading-none">{formData.icon}</span>
                ) : (
                  <Briefcase className="h-4 w-4 text-slate-400" />
                )}
              </div>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="π.χ. 🏠"
                className={fieldClass}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Χαρακτηριστικά</label>
            {!isReadOnly && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                  placeholder="Προσθήκη χαρακτηριστικού και Enter…"
                  className={fieldClass}
                />
                <button
                  type="button"
                  onClick={addFeature}
                  disabled={!newFeature.trim()}
                  className="h-11 px-4 flex-shrink-0 rounded-xl bg-slate-700 text-slate-100 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Προσθήκη
                </button>
              </div>
            )}
            {formData.features.length === 0 ? (
              <p className="text-xs text-slate-500">Δεν έχουν προστεθεί χαρακτηριστικά.</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.features.map((feature, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-lg bg-slate-700/60 border border-slate-600/60 text-sm text-slate-200"
                  >
                    {feature}
                    {!isReadOnly && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        aria-label={`Αφαίρεση ${feature}`}
                        className="text-slate-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Τιμολόγηση (Ελληνικά)</label>
              <input
                type="text"
                value={formData.pricingGr}
                onChange={(e) => setFormData((prev) => ({ ...prev, pricingGr: e.target.value }))}
                placeholder="π.χ. Από €50/ώρα"
                className={fieldClass}
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className={labelClass}>Τιμολόγηση (Αγγλικά)</label>
              <input
                type="text"
                value={formData.pricingEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, pricingEn: e.target.value }))}
                placeholder="e.g. From €50/hour"
                className={fieldClass}
                readOnly={isReadOnly}
              />
            </div>
          </div>

          <label
            className={`flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
              isReadOnly
                ? 'bg-slate-900/40 border-slate-700 cursor-default'
                : 'bg-slate-900 border-slate-700 hover:border-slate-600 cursor-pointer'
            }`}
          >
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
              disabled={isReadOnly}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-100">Ενεργή υπηρεσία</span>
              <span className="block text-xs text-slate-400 mt-0.5">
                Οι ανενεργές υπηρεσίες δεν εμφανίζονται στην ιστοσελίδα.
              </span>
            </span>
          </label>
        </form>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700 bg-slate-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-11 px-4 rounded-xl bg-slate-700 text-slate-200 text-sm font-semibold hover:bg-slate-600 transition-colors disabled:opacity-50"
          >
            {isReadOnly ? 'Κλείσιμο' : 'Ακύρωση'}
          </button>
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-11 px-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? 'Αποθήκευση…' : mode === 'edit' ? 'Ενημέρωση' : 'Δημιουργία'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

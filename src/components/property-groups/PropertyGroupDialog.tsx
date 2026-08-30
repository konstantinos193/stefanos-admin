'use client'

import { useEffect, useState } from 'react'
import { X, Loader2 } from 'lucide-react'
import type { PropertyGroup } from '@/lib/api/property-groups'

interface PropertyGroupDialogProps {
  isOpen: boolean
  group?: PropertyGroup | null
  loading?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: Partial<PropertyGroup>) => void
}

const EMPTY_FORM = { name: '', nameGr: '', nameEn: '', description: '' }

export function PropertyGroupDialog({
  isOpen,
  group,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}: PropertyGroupDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    setFormData(
      group
        ? {
            name: group.name || '',
            nameGr: group.nameGr || '',
            nameEn: group.nameEn || '',
            description: group.description || '',
          }
        : EMPTY_FORM,
    )
  }, [group, isOpen])

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

  const canSubmit = formData.name.trim().length > 0 && !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    // Only the four keys the DTO declares — the API validates with forbidNonWhitelisted.
    onSubmit({
      name: formData.name.trim(),
      nameGr: formData.nameGr.trim() || undefined,
      nameEn: formData.nameEn.trim() || undefined,
      description: formData.description.trim() || undefined,
    })
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'

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
        className="w-full sm:max-w-lg max-h-[92vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100">
              {group ? 'Επεξεργασία Ομάδας' : 'Νέα Ομάδα Ακινήτων'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate">
              {group ? group.name : 'Ομαδοποιήστε ακίνητα για κοινή διαχείριση'}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>Όνομα ομάδας *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              placeholder="π.χ. Ακίνητα Πρέβεζας"
              className={fieldClass}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Όνομα (Ελληνικά)</label>
              <input
                type="text"
                value={formData.nameGr}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameGr: e.target.value }))}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Όνομα (Αγγλικά)</label>
              <input
                type="text"
                value={formData.nameEn}
                onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Περιγραφή</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              placeholder="Σε τι χρησιμεύει αυτή η ομάδα…"
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
            />
          </div>
        </form>

        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-slate-700">
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
            {loading ? 'Αποθήκευση…' : group ? 'Ενημέρωση' : 'Δημιουργία'}
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { X, Save, Globe, Loader2 } from 'lucide-react'
import type { ContentItem, ContentTypeValue } from '@/lib/api/content'

interface ContentEditorDialogProps {
  isOpen: boolean
  item?: ContentItem | null
  loading?: boolean
  error?: string | null
  onClose: () => void
  onSubmit: (data: Partial<ContentItem>) => void
}

export const CONTENT_TYPES: { value: ContentTypeValue; label: string }[] = [
  { value: 'TEXT', label: 'Κείμενο' },
  { value: 'HTML', label: 'HTML' },
  { value: 'MARKDOWN', label: 'Markdown' },
  { value: 'JSON', label: 'JSON' },
  { value: 'IMAGE', label: 'Εικόνα' },
  { value: 'GALLERY', label: 'Γκαλερί' },
  { value: 'HERO', label: 'Hero' },
]

const EMPTY_FORM = {
  page: '',
  section: '',
  key: '',
  type: 'TEXT' as ContentTypeValue,
  contentGr: '',
  contentEn: '',
  active: true,
}

export function ContentEditorDialog({
  isOpen,
  item,
  loading = false,
  error = null,
  onClose,
  onSubmit,
}: ContentEditorDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    setFormData(
      item
        ? {
            page: item.page,
            section: item.section,
            key: item.key,
            type: item.type || 'TEXT',
            contentGr: item.contentGr || '',
            contentEn: item.contentEn || '',
            active: item.active,
          }
        : EMPTY_FORM,
    )
  }, [item, isOpen])

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
    formData.page.trim().length > 0 &&
    formData.section.trim().length > 0 &&
    formData.key.trim().length > 0 &&
    !loading

  const handleSubmit = () => {
    if (!canSubmit) return

    // Only keys CreateContentDto declares — the API uses forbidNonWhitelisted,
    // and the columns are contentGr / contentEn.
    if (item) {
      onSubmit({
        contentGr: formData.contentGr,
        contentEn: formData.contentEn,
        type: formData.type,
        active: formData.active,
      })
      return
    }

    onSubmit({
      page: formData.page.trim(),
      section: formData.section.trim(),
      key: formData.key.trim(),
      type: formData.type,
      contentGr: formData.contentGr,
      contentEn: formData.contentEn,
      active: formData.active,
    })
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'
  const labelClass = 'block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'
  const isCode = formData.type === 'HTML' || formData.type === 'JSON' || formData.type === 'MARKDOWN'

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
        className="w-full sm:max-w-2xl max-h-[92vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-100">
              {item ? 'Επεξεργασία Περιεχομένου' : 'Νέο Περιεχόμενο'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 truncate font-mono">
              {item
                ? `${item.page} › ${item.section} › ${item.key}`
                : 'Ορίστε σελίδα, ενότητα και κλειδί'}
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

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          {!item && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Σελίδα *</label>
                <input
                  type="text"
                  value={formData.page}
                  onChange={(e) => setFormData({ ...formData, page: e.target.value })}
                  placeholder="home"
                  className={`${fieldClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Ενότητα *</label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  placeholder="hero"
                  className={`${fieldClass} font-mono`}
                />
              </div>
              <div>
                <label className={labelClass}>Κλειδί *</label>
                <input
                  type="text"
                  value={formData.key}
                  onChange={(e) => setFormData({ ...formData, key: e.target.value })}
                  placeholder="title"
                  className={`${fieldClass} font-mono`}
                />
              </div>
            </div>
          )}

          <div>
            <label className={labelClass}>Τύπος</label>
            <select
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value as ContentTypeValue })
              }
              className={`${fieldClass} [&>option]:bg-slate-800`}
            >
              {CONTENT_TYPES.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`${labelClass} flex items-center gap-1.5`}>
              <Globe className="h-3.5 w-3.5" />
              Ελληνικά
            </label>
            <textarea
              rows={isCode ? 8 : 5}
              value={formData.contentGr}
              onChange={(e) => setFormData({ ...formData, contentGr: e.target.value })}
              className={`w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-y ${
                isCode ? 'font-mono text-xs' : ''
              }`}
            />
          </div>

          <div>
            <label className={`${labelClass} flex items-center gap-1.5`}>
              <Globe className="h-3.5 w-3.5" />
              English
            </label>
            <textarea
              rows={isCode ? 8 : 5}
              value={formData.contentEn}
              onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
              className={`w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-y ${
                isCode ? 'font-mono text-xs' : ''
              }`}
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl bg-slate-900 border border-slate-700 px-4 py-3 cursor-pointer hover:border-slate-600 transition-colors">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-slate-600 bg-slate-800 accent-blue-500"
            />
            <span>
              <span className="block text-sm font-semibold text-slate-100">Ενεργό</span>
              <span className="block text-xs text-slate-400 mt-0.5">
                Το ανενεργό περιεχόμενο δεν εμφανίζεται στην ιστοσελίδα.
              </span>
            </span>
          </label>
        </div>

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
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {loading ? 'Αποθήκευση…' : 'Αποθήκευση'}
          </button>
        </div>
      </div>
    </div>
  )
}

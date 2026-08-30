'use client'

import { useState, useEffect, useMemo } from 'react'
import { X, Calendar, User, Home, Repeat, StickyNote, Loader2, Info } from 'lucide-react'
import { CleaningSchedule, Property } from '@/lib/api/types'
import {
  FREQUENCY_OPTIONS,
  CleaningFrequencyValue,
  formatDateLong,
  parseDate,
  toDateInputValue,
  fromDateInputValue,
  previewNextCleaning,
} from './cleaningUtils'

interface CleaningScheduleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<CleaningSchedule>) => void
  schedule?: CleaningSchedule | null
  properties?: Property[]
  loading?: boolean
  error?: string | null
}

const EMPTY_FORM = {
  propertyId: '',
  frequency: 'WEEKLY' as CleaningFrequencyValue,
  assignedCleaner: '',
  notes: '',
  lastCleaned: '',
  nextCleaning: '',
}

export function CleaningScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  schedule,
  properties = [],
  loading = false,
  error = null,
}: CleaningScheduleDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    if (schedule) {
      setFormData({
        propertyId: schedule.propertyId,
        frequency: schedule.frequency as CleaningFrequencyValue,
        assignedCleaner: schedule.assignedCleaner || '',
        notes: schedule.notes || '',
        lastCleaned: toDateInputValue(schedule.lastCleaned),
        nextCleaning: toDateInputValue(schedule.nextCleaning),
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [schedule, isOpen])

  // Escape to close, and keep the page behind from scrolling.
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

  const computedNext = useMemo(() => {
    if (formData.nextCleaning) return null
    const base = formData.lastCleaned ? parseDate(formData.lastCleaned) : new Date()
    return previewNextCleaning(formData.frequency, base)
  }, [formData.frequency, formData.lastCleaned, formData.nextCleaning])

  const dateOrderError =
    formData.lastCleaned &&
    formData.nextCleaning &&
    formData.nextCleaning < formData.lastCleaned
      ? 'Ο επόμενος καθαρισμός δεν μπορεί να προηγείται του τελευταίου.'
      : null

  const canSubmit = Boolean(formData.propertyId) && !dateOrderError && !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    onSubmit({
      propertyId: formData.propertyId,
      frequency: formData.frequency,
      assignedCleaner: formData.assignedCleaner.trim() || null,
      notes: formData.notes.trim() || null,
      lastCleaned: fromDateInputValue(formData.lastCleaned),
      nextCleaning: fromDateInputValue(formData.nextCleaning),
    })
  }

  if (!isOpen) return null

  const fieldClass =
    'w-full h-11 px-3.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors'
  const labelClass =
    'flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2'

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
        className="w-full sm:max-w-lg max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {schedule ? 'Επεξεργασία Προγράμματος' : 'Νέο Πρόγραμμα Καθαρισμού'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {schedule
                ? schedule.property?.titleGr || 'Ενημέρωση στοιχείων'
                : 'Ορίστε πότε και πόσο συχνά καθαρίζεται το ακίνητο'}
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

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          {error && (
            <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <div>
            <label className={labelClass}>
              <Home className="h-3.5 w-3.5" />
              Ακίνητο
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              disabled={Boolean(schedule)}
              required
              className={`${fieldClass} [&>option]:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="">Επιλέξτε ακίνητο…</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.titleGr}
                  {property.city ? ` — ${property.city}` : ''}
                </option>
              ))}
            </select>
            {!schedule && properties.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Δεν βρέθηκαν ακίνητα. Προσθέστε πρώτα ένα ακίνητο.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              <Repeat className="h-3.5 w-3.5" />
              Συχνότητα
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FREQUENCY_OPTIONS.map((option) => {
                const isActive = formData.frequency === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    title={option.hint}
                    onClick={() => setFormData({ ...formData, frequency: option.value })}
                    className={`h-11 px-2 rounded-xl border text-sm font-semibold transition-colors ${
                      isActive
                        ? 'bg-blue-500/15 border-blue-500 text-blue-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              {FREQUENCY_OPTIONS.find((o) => o.value === formData.frequency)?.hint}
            </p>
          </div>

          <div>
            <label className={labelClass}>
              <User className="h-3.5 w-3.5" />
              Υπεύθυνος καθαρισμού
            </label>
            <input
              type="text"
              value={formData.assignedCleaner}
              onChange={(e) => setFormData({ ...formData, assignedCleaner: e.target.value })}
              placeholder="Όνομα (προαιρετικό)"
              className={fieldClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                <Calendar className="h-3.5 w-3.5" />
                Τελευταίος καθαρισμός
              </label>
              <input
                type="date"
                value={formData.lastCleaned}
                onChange={(e) => setFormData({ ...formData, lastCleaned: e.target.value })}
                className={`${fieldClass} [color-scheme:dark]`}
              />
              <p className="mt-1.5 text-xs text-slate-500 min-h-[1rem]">
                {formData.lastCleaned ? formatDateLong(formData.lastCleaned) : 'Προαιρετικό'}
              </p>
            </div>

            <div>
              <label className={labelClass}>
                <Calendar className="h-3.5 w-3.5" />
                Επόμενος καθαρισμός
              </label>
              <input
                type="date"
                value={formData.nextCleaning}
                onChange={(e) => setFormData({ ...formData, nextCleaning: e.target.value })}
                className={`${fieldClass} [color-scheme:dark] ${
                  dateOrderError ? 'border-red-500 focus:border-red-500' : ''
                }`}
              />
              <p className="mt-1.5 text-xs text-slate-500 min-h-[1rem]">
                {formData.nextCleaning ? formatDateLong(formData.nextCleaning) : 'Προαιρετικό'}
              </p>
            </div>
          </div>

          {dateOrderError && (
            <p className="text-xs text-red-300 -mt-2">{dateOrderError}</p>
          )}

          {computedNext && (
            <div className="flex items-start gap-2 rounded-xl bg-slate-900/60 border border-slate-700 px-3.5 py-3">
              <Info className="h-4 w-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-slate-300">
                Χωρίς ημερομηνία, ο επόμενος καθαρισμός υπολογίζεται αυτόματα:{' '}
                <span className="font-semibold text-slate-100">
                  {formatDateLong(computedNext)}
                </span>
              </p>
            </div>
          )}

          <div>
            <label className={labelClass}>
              <StickyNote className="h-3.5 w-3.5" />
              Σημειώσεις
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Οδηγίες, κλειδιά, ιδιαιτερότητες…"
              rows={3}
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
            />
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
            {loading ? 'Αποθήκευση…' : schedule ? 'Ενημέρωση' : 'Δημιουργία'}
          </button>
        </div>
      </div>
    </div>
  )
}

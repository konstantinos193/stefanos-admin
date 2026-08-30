'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, Home, User as UserIcon, FileText, Loader2, Info } from 'lucide-react'
import { MaintenanceRequest, Property, User } from '@/lib/api/types'
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  MaintenancePriorityValue,
  MaintenanceStatusValue,
} from './maintenanceUtils'

interface MaintenanceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<MaintenanceRequest>) => void
  request?: MaintenanceRequest | null
  properties?: Property[]
  users?: User[]
  loading?: boolean
  error?: string | null
}

const EMPTY_FORM = {
  propertyId: '',
  title: '',
  description: '',
  priority: 'MEDIUM' as MaintenancePriorityValue,
  status: 'OPEN' as MaintenanceStatusValue,
  assignedTo: '',
}

export function MaintenanceDialog({
  isOpen,
  onClose,
  onSubmit,
  request,
  properties = [],
  users = [],
  loading = false,
  error = null,
}: MaintenanceDialogProps) {
  const [formData, setFormData] = useState(EMPTY_FORM)

  useEffect(() => {
    if (!isOpen) return
    if (request) {
      setFormData({
        propertyId: request.propertyId,
        title: request.title,
        description: request.description,
        priority: request.priority as MaintenancePriorityValue,
        status: request.status as MaintenanceStatusValue,
        assignedTo: request.assignedTo || '',
      })
    } else {
      setFormData(EMPTY_FORM)
    }
  }, [request, isOpen])

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

  /**
   * The API validates assignedTo as a UUID, so an unknown value (a name typed
   * before this picker existed) can't be sent back on update.
   */
  const assigneeIsUnknown =
    Boolean(formData.assignedTo) && !users.some((u) => u.id === formData.assignedTo)

  const canSubmit =
    Boolean(formData.propertyId) &&
    formData.title.trim().length > 0 &&
    formData.description.trim().length > 0 &&
    !loading

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit) return

    // The API validates with forbidNonWhitelisted, so each payload must carry
    // only the keys its own DTO declares — UpdateMaintenanceRequestDto has no
    // propertyId, and both DTOs reject an assignedTo that isn't a user id.
    const payload: Partial<MaintenanceRequest> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
    }

    if (request) {
      payload.status = formData.status
      if (formData.assignedTo && !assigneeIsUnknown) payload.assignedTo = formData.assignedTo
    } else {
      payload.propertyId = formData.propertyId
      if (formData.assignedTo) payload.assignedTo = formData.assignedTo
    }

    onSubmit(payload)
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
        className="w-full sm:max-w-xl max-h-[92vh] sm:max-h-[90vh] flex flex-col bg-slate-800 border border-slate-700 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-700">
          <div>
            <h2 className="text-lg font-bold text-slate-100">
              {request ? 'Επεξεργασία Αιτήματος' : 'Νέο Αίτημα Συντήρησης'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {request
                ? request.property?.titleGr || 'Ενημέρωση στοιχείων'
                : 'Καταγράψτε τη βλάβη ή την εργασία που χρειάζεται'}
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
              disabled={Boolean(request)}
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
            {!request && properties.length === 0 && (
              <p className="mt-2 text-xs text-amber-300">
                Δεν βρέθηκαν ακίνητα. Προσθέστε πρώτα ένα ακίνητο.
              </p>
            )}
          </div>

          <div>
            <label className={labelClass}>
              <FileText className="h-3.5 w-3.5" />
              Τίτλος
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="π.χ. Διαρροή στο μπάνιο"
              required
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>
              <FileText className="h-3.5 w-3.5" />
              Περιγραφή
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Τι ακριβώς συμβαίνει, πού, και τι χρειάζεται…"
              rows={4}
              required
              className="w-full px-3.5 py-3 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-none"
            />
          </div>

          <div>
            <label className={labelClass}>
              <AlertTriangle className="h-3.5 w-3.5" />
              Προτεραιότητα
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRIORITY_OPTIONS.map((option) => {
                const isActive = formData.priority === option.value
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, priority: option.value })}
                    className={`h-11 px-2 rounded-xl border text-sm font-semibold transition-colors ${
                      isActive
                        ? option.active
                        : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-slate-100'
                    }`}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>

          {request && (
            <div>
              <label className={labelClass}>
                <AlertTriangle className="h-3.5 w-3.5" />
                Κατάσταση
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as MaintenanceStatusValue })
                }
                className={`${fieldClass} [&>option]:bg-slate-800`}
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className={labelClass}>
              <UserIcon className="h-3.5 w-3.5" />
              Ανάθεση σε
            </label>
            <select
              value={assigneeIsUnknown ? '' : formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              disabled={users.length === 0}
              className={`${fieldClass} [&>option]:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed`}
            >
              <option value="">Χωρίς ανάθεση</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="mt-2 text-xs text-slate-500">
                Η λίστα χρηστών δεν είναι διαθέσιμη για τον λογαριασμό σας.
              </p>
            )}
            {assigneeIsUnknown && (
              <p className="mt-2 flex items-start gap-1.5 text-xs text-amber-300">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
                Η τρέχουσα ανάθεση (&laquo;{formData.assignedTo}&raquo;) δεν αντιστοιχεί σε χρήστη
                του συστήματος. Επιλέξτε χρήστη για να την αντικαταστήσετε.
              </p>
            )}
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
            {loading ? 'Αποθήκευση…' : request ? 'Ενημέρωση' : 'Δημιουργία'}
          </button>
        </div>
      </div>
    </div>
  )
}

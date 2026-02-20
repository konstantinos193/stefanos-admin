'use client'

import { useState, useEffect } from 'react'
import { X, Calendar, User, Home, Clock } from 'lucide-react'
import { CleaningSchedule, Property } from '@/lib/api/types'

interface CleaningScheduleDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<CleaningSchedule>) => void
  schedule?: CleaningSchedule | null
  properties?: Property[]
  loading?: boolean
}

export function CleaningScheduleDialog({
  isOpen,
  onClose,
  onSubmit,
  schedule,
  properties = [],
  loading = false
}: CleaningScheduleDialogProps) {
  const [formData, setFormData] = useState({
    propertyId: '',
    frequency: 'WEEKLY' as 'AFTER_EACH_BOOKING' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'CUSTOM',
    assignedCleaner: '',
    notes: '',
    lastCleaned: '',
    nextCleaning: ''
  })

  useEffect(() => {
    if (schedule) {
      setFormData({
        propertyId: schedule.propertyId,
        frequency: schedule.frequency,
        assignedCleaner: schedule.assignedCleaner || '',
        notes: schedule.notes || '',
        lastCleaned: schedule.lastCleaned ? new Date(schedule.lastCleaned).toISOString().split('T')[0] : '',
        nextCleaning: schedule.nextCleaning ? new Date(schedule.nextCleaning).toISOString().split('T')[0] : ''
      })
    } else {
      setFormData({
        propertyId: '',
        frequency: 'WEEKLY',
        assignedCleaner: '',
        notes: '',
        lastCleaned: '',
        nextCleaning: ''
      })
    }
  }, [schedule, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData: Partial<CleaningSchedule> = {
      propertyId: formData.propertyId,
      frequency: formData.frequency,
      assignedCleaner: formData.assignedCleaner || null,
      notes: formData.notes || null,
      lastCleaned: formData.lastCleaned ? new Date(formData.lastCleaned).toISOString() : null,
      nextCleaning: formData.nextCleaning ? new Date(formData.nextCleaning).toISOString() : null
    }

    onSubmit(submitData)
  }

  const frequencyOptions = [
    { value: 'AFTER_EACH_BOOKING', label: 'Μετά από κάθε κράτηση' },
    { value: 'DAILY', label: 'Ημερήσια' },
    { value: 'WEEKLY', label: 'Εβδομαδιαία' },
    { value: 'BIWEEKLY', label: 'Δ两周εία' },
    { value: 'MONTHLY', label: 'Μηνιαία' },
    { value: 'CUSTOM', label: 'Προσαρμοσμένη' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {schedule ? 'Επεξεργασία Προγράμματος Καθαρισμού' : 'Νέο Πρόγραμμα Καθαρισμού'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Property Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Home className="h-4 w-4 inline mr-2" />
              Ακίνητο
            </label>
            <select
              value={formData.propertyId}
              onChange={(e) => setFormData({ ...formData, propertyId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Επιλέξτε ακίνητο</option>
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.titleGr} - {property.city}
                </option>
              ))}
            </select>
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Συχνότητα Καθαρισμού
            </label>
            <select
              value={formData.frequency}
              onChange={(e) => setFormData({ ...formData, frequency: e.target.value as any })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {frequencyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assigned Cleaner */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Υπεύθυνος Καθαρισμού
            </label>
            <input
              type="text"
              value={formData.assignedCleaner}
              onChange={(e) => setFormData({ ...formData, assignedCleaner: e.target.value })}
              placeholder="Όνομα υπευθύνου"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Last Cleaned Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Τελευταίος Καθαρισμός
            </label>
            <input
              type="date"
              value={formData.lastCleaned}
              onChange={(e) => setFormData({ ...formData, lastCleaned: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Next Cleaning Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Επόμενος Καθαρισμός
            </label>
            <input
              type="date"
              value={formData.nextCleaning}
              onChange={(e) => setFormData({ ...formData, nextCleaning: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Σημειώσεις
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Προσθέστε σημειώσεις για το πρόγραμμα καθαρισμού..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
            <button
              type="submit"
              disabled={loading || !formData.propertyId}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Αποθήκευση...' : schedule ? 'Ενημέρωση' : 'Δημιουργία'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

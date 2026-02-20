'use client'

import { useState, useEffect } from 'react'
import { X, AlertTriangle, Home, User, Calendar, FileText } from 'lucide-react'
import { MaintenanceRequest, Property } from '@/lib/api/types'
import { maintenanceApi } from '@/lib/api/maintenance'

interface MaintenanceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<MaintenanceRequest>) => void
  request?: MaintenanceRequest | null
  properties?: Property[]
  loading?: boolean
}

export function MaintenanceDialog({
  isOpen,
  onClose,
  onSubmit,
  request,
  properties = [],
  loading = false
}: MaintenanceDialogProps) {
  const [formData, setFormData] = useState({
    propertyId: '',
    bookingId: '',
    title: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
    assignedTo: ''
  })

  useEffect(() => {
    if (request) {
      setFormData({
        propertyId: request.propertyId,
        bookingId: request.bookingId || '',
        title: request.title,
        description: request.description,
        priority: request.priority,
        assignedTo: request.assignedTo || ''
      })
    } else {
      setFormData({
        propertyId: '',
        bookingId: '',
        title: '',
        description: '',
        priority: 'MEDIUM',
        assignedTo: ''
      })
    }
  }, [request, isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData: Partial<MaintenanceRequest> = {
      propertyId: formData.propertyId,
      bookingId: formData.bookingId || null,
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      assignedTo: formData.assignedTo || null
    }

    onSubmit(submitData)
  }

  const priorityOptions = [
    { value: 'LOW', label: 'Χαμηλή', color: 'bg-blue-100 text-blue-800' },
    { value: 'MEDIUM', label: 'Μεσαία', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'HIGH', label: 'Υψηλή', color: 'bg-orange-100 text-orange-800' },
    { value: 'URGENT', label: 'Επείγουσα', color: 'bg-red-100 text-red-800' }
  ]

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {request ? 'Επεξεργασία Αιτήματος Συντήρησης' : 'Νέο Αίτημα Συντήρησης'}
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
              Ακίνητο *
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

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Τίτλος *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Περιγράψτε σύντομα το πρόβλημα..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="h-4 w-4 inline mr-2" />
              Περιγραφή *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Αναλυτική περιγραφή του προβλήματος συντήρησης..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="h-4 w-4 inline mr-2" />
              Προτεραιότητα
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorityOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: option.value as any })}
                  className={`px-3 py-2 rounded-lg border-2 transition-colors ${
                    formData.priority === option.value
                      ? option.color + ' border-current'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Assigned To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="h-4 w-4 inline mr-2" />
              Ανάθεση σε
            </label>
            <input
              type="text"
              value={formData.assignedTo}
              onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
              placeholder="Όνομα υπευθύνου (προαιρετικό)"
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
              disabled={loading || !formData.propertyId || !formData.title || !formData.description}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Αποθήκευση...' : request ? 'Ενημέρωση' : 'Δημιουργία'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

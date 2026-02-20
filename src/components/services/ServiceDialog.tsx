'use client'

import { useState, useEffect } from 'react'
import { X, Save, Eye, Edit } from 'lucide-react'
import { Service } from '@/lib/api/services'

interface ServiceDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit?: (data: Partial<Service>) => void
  service?: Service | null
  mode?: 'create' | 'edit' | 'view'
  loading?: boolean
}

export function ServiceDialog({
  isOpen,
  onClose,
  onSubmit,
  service,
  mode = 'create',
  loading = false
}: ServiceDialogProps) {
  const [formData, setFormData] = useState({
    titleGr: '',
    titleEn: '',
    descriptionGr: '',
    descriptionEn: '',
    icon: '',
    features: [] as string[],
    pricingGr: '',
    pricingEn: '',
    isActive: true
  })
  const [newFeature, setNewFeature] = useState('')

  useEffect(() => {
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
        isActive: service.isActive
      })
    } else if (mode === 'create') {
      setFormData({
        titleGr: '',
        titleEn: '',
        descriptionGr: '',
        descriptionEn: '',
        icon: '',
        features: [],
        pricingGr: '',
        pricingEn: '',
        isActive: true
      })
    }
  }, [service, mode])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit && mode !== 'view') {
      onSubmit(formData)
    }
  }

  const addFeature = () => {
    if (newFeature.trim() && !formData.features.includes(newFeature.trim())) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const isReadOnly = mode === 'view'

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              mode === 'view' ? 'bg-blue-100' : mode === 'edit' ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              {mode === 'view' ? (
                <Eye className="h-4 w-4 text-blue-600" />
              ) : mode === 'edit' ? (
                <Edit className="h-4 w-4 text-yellow-600" />
              ) : (
                <Save className="h-4 w-4 text-green-600" />
              )}
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === 'view' ? 'Προβολή Υπηρεσίας' : mode === 'edit' ? 'Επεξεργασία Υπηρεσίας' : 'Νέα Υπηρεσία'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τίτλος (Ελληνικά) *
              </label>
              <input
                type="text"
                value={formData.titleGr}
                onChange={(e) => setFormData(prev => ({ ...prev, titleGr: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τίτλος (Αγγλικά) *
              </label>
              <input
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Περιγραφή (Ελληνικά)
              </label>
              <textarea
                value={formData.descriptionGr}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionGr: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Περιγραφή (Αγγλικά)
              </label>
              <textarea
                value={formData.descriptionEn}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Icon */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Εικονίδιο (Emoji ή κλάση SVG)
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              placeholder="π.χ. 🚗, star, home"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              readOnly={isReadOnly}
            />
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Χαρακτηριστικά
            </label>
            {!isReadOnly && (
              <div className="flex space-x-2 mb-3">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                  placeholder="Προσθήκη χαρακτηριστικού..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Προσθήκη
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <span
                  key={index}
                  className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                >
                  <span>{feature}</span>
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τιμολόγηση (Ελληνικά)
              </label>
              <input
                type="text"
                value={formData.pricingGr}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingGr: e.target.value }))}
                placeholder="π.χ. Από €50/ώρα"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly={isReadOnly}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Τιμολόγηση (Αγγλικά)
              </label>
              <input
                type="text"
                value={formData.pricingEn}
                onChange={(e) => setFormData(prev => ({ ...prev, pricingEn: e.target.value }))}
                placeholder="π.χ. From €50/hour"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                readOnly={isReadOnly}
              />
            </div>
          </div>

          {/* Active Status */}
          {!isReadOnly && (
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                Ενεργή υπηρεσία
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {mode === 'view' ? 'Κλείσιμο' : 'Ακύρωση'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>{loading ? 'Αποθήκευση...' : 'Αποθήκευση'}</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

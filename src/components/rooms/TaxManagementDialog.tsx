'use client'

import { useState, useEffect } from 'react'
import { X, Save, Percent, Receipt, Leaf } from 'lucide-react'
import { roomsApi, TaxSettings } from '@/lib/api/rooms'

interface TaxManagementDialogProps {
  isOpen: boolean
  onClose: () => void
  onTaxUpdate: () => void
}

export function TaxManagementDialog({ isOpen, onClose, onTaxUpdate }: TaxManagementDialogProps) {
  const [taxSettings, setTaxSettings] = useState<TaxSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    vatRate: 0,
    municipalFee: 0,
    environmentalTax: 0,
    isActive: true
  })

  useEffect(() => {
    if (isOpen) {
      fetchTaxSettings()
    }
  }, [isOpen])

  const fetchTaxSettings = async () => {
    setLoading(true)
    try {
      const response = await roomsApi.getTaxSettings()
      if (response.success) {
        const settings = response.data
        setTaxSettings(settings)
        setFormData({
          vatRate: settings.vatRate,
          municipalFee: settings.municipalFee,
          environmentalTax: settings.environmentalTax,
          isActive: settings.isActive
        })
      }
    } catch (error) {
      console.error('Error fetching tax settings:', error)
      setError('Αποτυχία φόρτωσης φορολογικών ρυθμίσεων')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    
    try {
      await roomsApi.updateTaxSettings(formData)
      await fetchTaxSettings()
      onTaxUpdate()
    } catch (error) {
      console.error('Error updating tax settings:', error)
      setError('Αποτυχία αποθήκευσης φορολογικών ρυθμίσεων')
    } finally {
      setSaving(false)
    }
  }

  const calculateTotalTaxes = () => {
    return formData.municipalFee + formData.environmentalTax
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Φορολογικές Ρυθμίσεις</h2>
            <p className="text-slate-400 mt-1">Διαχείριση ΦΠΑ, δημοτικών τελών και περιβαλλοντικού φόρου</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8 text-slate-400">Φόρτωση ρυθμίσεων...</div>
          ) : (
            <div className="space-y-6">
              {error && (
                <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-slate-300">Ενεργοποίηση φορολογίας</span>
                </div>
                <button
                  onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    formData.isActive ? 'bg-green-600' : 'bg-slate-600'
                  }`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>

              {/* VAT Rate */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Percent className="h-4 w-4 text-indigo-400" />
                  ΦΠΑ (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.vatRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, vatRate: parseFloat(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-8"
                    disabled={!formData.isActive}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500">Τρέχον ΦΠΑ: {formData.vatRate}%</p>
              </div>

              {/* Municipal Fee */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Receipt className="h-4 w-4 text-amber-400" />
                  Δημοτικά Τέλη (€ ανά διανυκτέρευση)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.municipalFee}
                    onChange={(e) => setFormData(prev => ({ ...prev, municipalFee: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    disabled={!formData.isActive}
                  />
                </div>
                <p className="text-xs text-slate-500">Προστίθεται σε κάθε διανυκτέρευση</p>
              </div>

              {/* Environmental Tax */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <Leaf className="h-4 w-4 text-green-400" />
                  Περιβαλλοντικός Φόρος (€ ανά διανυκτέρευση)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">€</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.environmentalTax}
                    onChange={(e) => setFormData(prev => ({ ...prev, environmentalTax: parseFloat(e.target.value) || 0 }))}
                    className="w-full pl-8 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                    disabled={!formData.isActive}
                  />
                </div>
                <p className="text-xs text-slate-500">Προστίθεται σε κάθε διανυκτέρευση</p>
              </div>

              {/* Summary */}
              <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                <h3 className="text-sm font-semibold text-slate-300 mb-3">Σύνοψη Φορολογίας</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ΦΠΑ:</span>
                    <span className="text-slate-300">{formData.vatRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Δημοτικά τέλη:</span>
                    <span className="text-slate-300">€{formData.municipalFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Περιβαλλοντικός φόρος:</span>
                    <span className="text-slate-300">€{formData.environmentalTax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-700">
                    <span className="text-slate-400">Συνολικά τέλη ανά διανυκτέρευση:</span>
                    <span className="text-amber-400 font-semibold">€{calculateTotalTaxes().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Example Calculation */}
              <div className="p-4 bg-indigo-500/10 rounded-lg border border-indigo-500/30">
                <h3 className="text-sm font-semibold text-indigo-300 mb-2">Παράδειγμα Υπολογισμού</h3>
                <div className="text-xs space-y-1 text-slate-400">
                  <div>Βασική τιμή διαμερίσματος: €100.00</div>
                  <div>ΦΠΑ ({formData.vatRate}%): €{(100 * formData.vatRate / 100).toFixed(2)}</div>
                  <div>Δημοτικά τέλη: €{formData.municipalFee.toFixed(2)}</div>
                  <div>Περιβαλλοντικός φόρος: €{formData.environmentalTax.toFixed(2)}</div>
                  <div className="pt-1 border-t border-indigo-500/30">
                    <span className="text-indigo-300 font-semibold">Τελική τιμή: €{(100 + (100 * formData.vatRate / 100) + formData.municipalFee + formData.environmentalTax).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Οι αλλαγές εφαρμόζονται σε όλες τις νέες κρατήσεις
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-300 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
            >
              Ακύρωση
            </button>
            <button
              onClick={handleSave}
              disabled={saving || loading}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
            >
              <Save className="h-4 w-4" />
              {saving ? 'Αποθήκευση...' : 'Αποθήκευση'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

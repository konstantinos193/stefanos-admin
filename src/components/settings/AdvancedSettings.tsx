'use client'

import { AlertTriangle } from 'lucide-react'

export function AdvancedSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Προχωρημένες Ρυθμίσεις</h2>
        <p className="text-gray-600 mb-6">Ρυθμίσεις για προχωρημένους χρήστες</p>

        <div className="space-y-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Cache Management</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Clear Application Cache</p>
                  <p className="text-sm text-gray-600">Clear all cached data</p>
                </div>
                <button className="btn btn-secondary">Clear Cache</button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Clear Database Cache</p>
                  <p className="text-sm text-gray-600">Clear database query cache</p>
                </div>
                <button className="btn btn-secondary">Clear Cache</button>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Logging</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Level
                </label>
                <select className="input">
                  <option>DEBUG</option>
                  <option>INFO</option>
                  <option>WARN</option>
                  <option>ERROR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Retention (days)
                </label>
                <input type="number" className="input" defaultValue="30" />
              </div>
            </div>
          </div>

          <div className="border border-red-200 bg-red-50 rounded-lg p-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
                <p className="text-sm text-red-700 mb-4">
                  Αυτές οι ενέργειες δεν μπορούν να αναιρεθούν. Προχωρήστε με προσοχή.
                </p>
                <div className="space-y-2">
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Reset All Settings
                  </button>
                  <button className="btn bg-red-600 hover:bg-red-700 text-white">
                    Delete All Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


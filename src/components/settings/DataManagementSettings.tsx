'use client'

import { Download, Upload, Database, Trash2 } from 'lucide-react'

export function DataManagementSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Διαχείριση Δεδομένων</h2>
        <p className="text-gray-600 mb-6">Εξαγωγή, εισαγωγή και διαχείριση δεδομένων</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="h-6 w-6 text-blue-500" />
              <h3 className="text-lg font-semibold text-gray-900">Εξαγωγή Δεδομένων</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Εξαγωγή όλων των δεδομένων σε JSON, CSV ή Excel format
            </p>
            <div className="space-y-2">
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Εξαγωγή JSON</span>
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Εξαγωγή CSV</span>
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Εξαγωγή Excel</span>
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Εισαγωγή Δεδομένων</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Εισαγωγή δεδομένων από αρχείο JSON, CSV ή Excel
            </p>
            <div className="space-y-2">
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Εισαγωγή JSON</span>
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Εισαγωγή CSV</span>
              </button>
              <button className="btn btn-secondary w-full flex items-center justify-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Εισαγωγή Excel</span>
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-6 w-6 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-900">Database Information</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Database Type:</span>
              <span className="ml-2 font-medium text-gray-900">MongoDB</span>
            </div>
            <div>
              <span className="text-gray-600">Total Records:</span>
              <span className="ml-2 font-medium text-gray-900">12,345</span>
            </div>
            <div>
              <span className="text-gray-600">Database Size:</span>
              <span className="ml-2 font-medium text-gray-900">245 MB</span>
            </div>
            <div>
              <span className="text-gray-600">Last Backup:</span>
              <span className="ml-2 font-medium text-gray-900">2024-01-20</span>
            </div>
          </div>
          <button className="mt-4 btn btn-secondary flex items-center space-x-2">
            <Database className="h-4 w-4" />
            <span>Create Backup</span>
          </button>
        </div>
      </div>
    </div>
  )
}


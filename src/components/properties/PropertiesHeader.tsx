'use client'

import { Plus, Download, Upload } from 'lucide-react'

export function PropertiesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
        <p className="text-gray-600 mt-1">Manage all properties in the system</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Export</span>
        </button>
        <button className="btn btn-secondary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Import</span>
        </button>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Property</span>
        </button>
      </div>
    </div>
  )
}


'use client'

import { Plus, Download, Upload } from 'lucide-react'

interface PropertiesHeaderProps {
  onAddProperty: () => void
  onExport: () => void
  onImport: () => void
}

export function PropertiesHeader({ onAddProperty, onExport, onImport }: PropertiesHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ακίνητα</h1>
        <p className="text-gray-600 mt-1">Διαχείριση όλων των ακινήτων στο σύστημα</p>
      </div>
      <div className="flex items-center space-x-3">
        <button 
          onClick={onExport}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
        <button 
          onClick={onImport}
          className="btn btn-secondary flex items-center space-x-2"
        >
          <Upload className="h-4 w-4" />
          <span>Εισαγωγή</span>
        </button>
        <button 
          onClick={onAddProperty}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Προσθήκη Ακινήτου</span>
        </button>
      </div>
    </div>
  )
}


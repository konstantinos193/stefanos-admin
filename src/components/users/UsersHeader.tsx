'use client'

import { Plus, Download, Upload } from 'lucide-react'

export function UsersHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Χρήστες</h1>
        <p className="text-gray-600 mt-1">Διαχείριση όλων των χρηστών στο σύστημα</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Εξαγωγή</span>
        </button>
        <button className="btn btn-secondary flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Εισαγωγή</span>
        </button>
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Προσθήκη Χρήστη</span>
        </button>
      </div>
    </div>
  )
}


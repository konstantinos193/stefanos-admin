'use client'

import { Plus, DoorOpen } from 'lucide-react'

export function RoomsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Δωμάτια</h1>
        <p className="text-gray-600 mt-1">Διαχείριση δωματίων ακινήτων</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Προσθήκη Δωματίου</span>
        </button>
      </div>
    </div>
  )
}


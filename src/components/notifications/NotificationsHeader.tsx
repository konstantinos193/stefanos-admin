'use client'

import { Bell, Settings } from 'lucide-react'

export function NotificationsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Ειδοποιήσεις</h1>
        <p className="text-gray-600 mt-1">Διαχείριση ειδοποιήσεων και ενημερώσεων</p>
      </div>
      <div className="flex items-center space-x-3">
        <button className="btn btn-secondary flex items-center space-x-2">
          <Settings className="h-4 w-4" />
          <span>Ρυθμίσεις</span>
        </button>
      </div>
    </div>
  )
}


'use client'

import { Plus, Edit, Trash2, Download, Upload, Settings } from 'lucide-react'

const actions = [
  { label: 'Add User', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Add Property', icon: Plus, color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Edit Property', icon: Edit, color: 'bg-orange-500 hover:bg-orange-600' },
  { label: 'Delete Item', icon: Trash2, color: 'bg-red-500 hover:bg-red-600' },
  { label: 'Export Data', icon: Download, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Import Data', icon: Upload, color: 'bg-cyan-500 hover:bg-cyan-600' },
]

export function QuickActions() {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
        <Settings className="h-5 w-5 text-gray-400" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon
          return (
            <button
              key={index}
              className={`${action.color} text-white p-4 rounded-lg flex flex-col items-center justify-center space-y-2 transition-all duration-200 transform hover:scale-105`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-sm font-medium">{action.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


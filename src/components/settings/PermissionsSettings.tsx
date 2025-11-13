'use client'

import { ShieldCheck } from 'lucide-react'

export function PermissionsSettings() {
  const roles = [
    {
      name: 'ADMIN',
      label: 'Διαχειριστής',
      permissions: ['All permissions'],
    },
    {
      name: 'MANAGER',
      label: 'Διαχειριστής',
      permissions: ['View all', 'Edit properties', 'Manage bookings', 'View reports'],
    },
    {
      name: 'PROPERTY_OWNER',
      label: 'Ιδιοκτήτης',
      permissions: ['View own properties', 'Edit own properties', 'Manage own bookings'],
    },
    {
      name: 'USER',
      label: 'Χρήστης',
      permissions: ['View own bookings', 'Create bookings'],
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Δικαιώματα</h2>
        <p className="text-gray-600 mb-6">Διαχείριση ρόλων και δικαιωμάτων</p>

        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.name} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShieldCheck className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">{role.label}</h3>
                <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded">
                  {role.name}
                </span>
              </div>
              <div className="space-y-2">
                {role.permissions.map((permission, index) => (
                  <div key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                    <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                    <span>{permission}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 text-blue-600 hover:text-blue-900 text-sm font-medium">
                Επεξεργασία Δικαιωμάτων
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


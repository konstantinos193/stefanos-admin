'use client'

import { AlertTriangle, Wrench, CheckCircle } from 'lucide-react'

export function MaintenanceAlerts() {
  const alerts = [
    { id: '1', property: 'Luxury Apartment', issue: 'Broken AC unit', priority: 'HIGH', status: 'OPEN' },
    { id: '2', property: 'Beach House', issue: 'Leaky faucet', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: '3', property: 'City Studio', issue: 'WiFi router replacement', priority: 'LOW', status: 'COMPLETED' },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'IN_PROGRESS':
        return <Wrench className="h-4 w-4 text-blue-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Ειδοποιήσεις Συντήρησης</h2>
        <AlertTriangle className="h-5 w-5 text-orange-500" />
      </div>
      <div className="space-y-3">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            {getStatusIcon(alert.status)}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{alert.property}</p>
              <p className="text-xs text-gray-600 mt-0.5">{alert.issue}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`px-2 py-0.5 text-xs font-semibold rounded border ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </span>
                <span className="text-xs text-gray-500">{alert.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


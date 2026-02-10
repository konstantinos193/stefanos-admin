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
        return 'bg-red-500/15 text-red-400 border-red-500/30'
      case 'MEDIUM':
        return 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30'
      case 'LOW':
        return 'bg-blue-500/15 text-blue-400 border-blue-500/30'
      default:
        return 'bg-slate-500/15 text-slate-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-400" />
      case 'IN_PROGRESS':
        return <Wrench className="h-4 w-4 text-blue-400" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'HIGH': case 'URGENT': return 'Υψηλή'
      case 'MEDIUM': return 'Μεσαία'
      case 'LOW': return 'Χαμηλή'
      default: return priority
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Ολοκληρώθηκε'
      case 'IN_PROGRESS': return 'Σε Εξέλιξη'
      case 'OPEN': return 'Ανοιχτό'
      default: return status
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-slate-100">Ειδοποιήσεις Συντήρησης</h2>
        <AlertTriangle className="h-5 w-5 text-orange-400" />
      </div>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <div key={alert.id} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
            <div className="flex-shrink-0 pt-0.5">
              {getStatusIcon(alert.status)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-semibold text-slate-100">{alert.property}</p>
              <p className="text-sm text-slate-400 mt-1">{alert.issue}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${getPriorityColor(alert.priority)}`}>
                  {getPriorityLabel(alert.priority)}
                </span>
                <span className="text-sm text-slate-500 font-medium">{getStatusLabel(alert.status)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}


'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, Wrench, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { maintenanceApi, type MaintenanceRequest } from '@/lib/api/maintenance'
import { format } from 'date-fns'
import { el } from 'date-fns/locale'

export function MaintenanceAlerts() {
  const [alerts, setAlerts] = useState<MaintenanceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await maintenanceApi.getAll({ limit: 5 })
        setAlerts(res.data.maintenance)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching maintenance alerts:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()
  }, [])

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

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-100">Ειδοποιήσεις Συντήρησης</h2>
          <AlertTriangle className="h-5 w-5 text-orange-400" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse h-20 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-bold text-slate-100">Ειδοποιήσεις Συντήρησης</h2>
        </div>
        <Link href="/maintenance" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Δείτε όλα →
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <CheckCircle className="h-8 w-8 mb-2 text-green-500/50" />
          <p className="text-sm">Δεν υπάρχουν εκκρεμότητες</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-start gap-4 p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="shrink-0 pt-0.5">
                {getStatusIcon(alert.status)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-semibold text-slate-100 truncate">
                  {alert.property?.titleGr ?? alert.property?.titleEn ?? 'Ακίνητο'}
                </p>
                <p className="text-sm text-slate-400 mt-1 truncate">{alert.title}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${getPriorityColor(alert.priority)}`}>
                    {getPriorityLabel(alert.priority)}
                  </span>
                  <span className="text-sm text-slate-500 font-medium">{getStatusLabel(alert.status)}</span>
                  <span className="text-xs text-slate-600 ml-auto">
                    {format(new Date(alert.createdAt), 'd MMM', { locale: el })}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

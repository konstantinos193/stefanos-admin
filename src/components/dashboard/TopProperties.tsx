'use client'

import { useEffect, useState } from 'react'
import { Building2, Euro, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { analyticsApi, type FinancialAnalytics } from '@/lib/api/analytics'

type TopProperty = FinancialAnalytics['properties'][number]

export function TopProperties() {
  const [properties, setProperties] = useState<TopProperty[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTopProperties() {
      try {
        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const data = await analyticsApi.getFinancialAnalytics({
          period: 'MONTHLY',
          startDate: firstOfMonth.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        })
        const sorted = [...data.properties]
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 4)
        setProperties(sorted)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching top properties:', error)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchTopProperties()
  }, [])

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-100">Κορυφαία Ακίνητα</h2>
          <TrendingUp className="h-5 w-5 text-emerald-400" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse h-14 bg-slate-700/50 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <h2 className="text-xl font-bold text-slate-100">Κορυφαία Ακίνητα</h2>
        </div>
        <Link href="/analytics" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          Αναλυτικά →
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-slate-500">
          <Building2 className="h-8 w-8 mb-2 text-slate-700" />
          <p className="text-sm">Δεν υπάρχουν δεδομένα για αυτή την περίοδο</p>
        </div>
      ) : (
        <div className="space-y-3">
          {properties.map((property, index) => (
            <div key={property.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex items-center justify-center w-8 h-8 bg-blue-500/20 text-blue-400 rounded-full font-bold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-100 truncate">{property.title}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="h-3 w-3 text-slate-500" />
                    <span className="text-xs text-slate-400">{property.bookings} κρατήσεις</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-400 shrink-0">
                <Euro className="h-4 w-4" />
                <span className="text-sm font-semibold">{property.revenue.toLocaleString('el-GR')}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

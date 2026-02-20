'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, Calendar, DollarSign, Clock, CheckCircle } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import { AdminDashboardOverview } from '@/lib/api/types'

export function StatsCards() {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const res = await adminApi.getDashboardStats()
        setOverview(res.overview)
      } catch (error: any) {
        if (!error?.message?.includes('Unauthorized') && !error?.message?.includes('401')) {
          console.error('Error fetching dashboard stats:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const cards = [
    {
      title: 'Χρήστες',
      value: overview?.totalUsers ?? 0,
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
    {
      title: 'Ακίνητα',
      value: overview?.totalProperties ?? 0,
      icon: Building2,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
    },
    {
      title: 'Σύνολο Κρατήσεων',
      value: overview?.totalBookings ?? 0,
      icon: Calendar,
      iconColor: 'text-orange-400',
      iconBg: 'bg-orange-500/15',
    },
    {
      title: 'Ενεργές Κρατήσεις',
      value: overview?.activeBookings ?? 0,
      icon: CheckCircle,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/15',
    },
    {
      title: 'Εκκρεμείς Κρατήσεις',
      value: overview?.pendingBookings ?? 0,
      icon: Clock,
      iconColor: 'text-yellow-400',
      iconBg: 'bg-yellow-500/15',
    },
    {
      title: 'Συνολικά Έσοδα',
      value: overview?.totalRevenue ?? 0,
      icon: DollarSign,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/15',
      isCurrency: true,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 bg-slate-700 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon
        const displayValue = card.isCurrency
          ? `€${Number(card.value).toLocaleString('el-GR', { minimumFractionDigits: 0 })}`
          : Number(card.value).toLocaleString('el-GR')

        return (
          <div key={card.title} className="card hover:shadow-lg hover:shadow-black/20 transition-shadow text-center p-5">
            <div className={`${card.iconBg} p-3 rounded-xl inline-flex mb-3`}>
              <Icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
            <p className="text-2xl font-bold text-slate-100">{displayValue}</p>
            <p className="text-sm font-medium text-slate-400 mt-1">{card.title}</p>
          </div>
        )
      })}
    </div>
  )
}


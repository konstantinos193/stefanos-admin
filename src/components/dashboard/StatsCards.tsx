'use client'

import { useEffect, useState } from 'react'
import { Users, Building2, Calendar, DollarSign, Clock, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react'
import { adminApi } from '@/lib/api/admin'
import { analyticsApi, type AnalyticsMetrics } from '@/lib/api/analytics'
import { AdminDashboardOverview } from '@/lib/api/types'

interface KpiCard {
  title: string
  value: number
  icon: React.ElementType
  iconColor: string
  iconBg: string
  isCurrency?: boolean
  trendPercent?: number
}

function TrendBadge({ percent }: { percent: number }) {
  if (percent > 0) {
    return (
      <div className="flex items-center gap-1 text-emerald-400">
        <TrendingUp className="h-3 w-3" />
        <span className="text-xs font-medium">+{percent.toFixed(1)}%</span>
      </div>
    )
  }
  return (
    <div className="flex items-center gap-1 text-red-400">
      <TrendingDown className="h-3 w-3" />
      <span className="text-xs font-medium">{percent.toFixed(1)}%</span>
    </div>
  )
}

export function StatsCards() {
  const [overview, setOverview] = useState<AdminDashboardOverview | null>(null)
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const now = new Date()
        const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const period = {
          period: 'MONTHLY' as const,
          startDate: firstOfMonth.toISOString().split('T')[0],
          endDate: now.toISOString().split('T')[0],
        }

        const [adminRes] = await Promise.all([
          adminApi.getDashboardStats(),
        ])
        setOverview(adminRes.overview)

        try {
          const m = await analyticsApi.getDashboardMetrics(period)
          setMetrics(m)
        } catch {
          // metrics are optional; cards still render without trends
        }
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

  const cards: KpiCard[] = [
    {
      title: 'Χρήστες',
      value: overview?.totalUsers ?? 0,
      icon: Users,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
      trendPercent: metrics?.activeUsersChange,
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
      trendPercent: metrics?.bookingsChange,
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
      trendPercent: metrics?.revenueChange,
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-24 bg-slate-700 rounded" />
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
          <div key={card.title} className="card hover:shadow-lg hover:shadow-black/20 transition-shadow p-5">
            <div className="flex items-start justify-between mb-3">
              <div className={`${card.iconBg} p-2.5 rounded-xl`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              {card.trendPercent !== undefined && (
                <TrendBadge percent={card.trendPercent} />
              )}
            </div>
            <p className="text-2xl font-bold text-slate-100">{displayValue}</p>
            <p className="text-sm font-medium text-slate-400 mt-1">{card.title}</p>
            {card.trendPercent !== undefined && (
              <p className="text-xs text-slate-600 mt-1">vs προηγ. μήνα</p>
            )}
          </div>
        )
      })}
    </div>
  )
}

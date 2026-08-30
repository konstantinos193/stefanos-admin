'use client'

import { TrendingUp, TrendingDown, Minus, Users, DollarSign, Calendar, Receipt } from 'lucide-react'
import type { AnalyticsMetrics as AnalyticsMetricsData } from '@/lib/api/analytics'
import { formatCurrency } from './analyticsTheme'

interface AnalyticsMetricsProps {
  metrics: AnalyticsMetricsData | null
  loading: boolean
  refreshing?: boolean
}

function DeltaBadge({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-xs text-slate-500">—</span>
  }

  const flat = change === 0
  const up = change > 0
  const Icon = flat ? Minus : up ? TrendingUp : TrendingDown
  const tone = flat ? 'text-slate-400' : up ? 'text-green-400' : 'text-red-400'

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${tone}`}>
      <Icon className="h-3.5 w-3.5" />
      {up ? '+' : ''}
      {change}%
      <span className="font-normal text-slate-500">vs προηγ. περίοδο</span>
    </span>
  )
}

export function AnalyticsMetrics({ metrics, loading, refreshing }: AnalyticsMetricsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-[116px] rounded-2xl bg-slate-800/50 border border-slate-700/60 animate-pulse"
          />
        ))}
      </div>
    )
  }

  if (!metrics) return null

  const averageBookingValue =
    metrics.bookings > 0 ? metrics.revenue / metrics.bookings : 0

  const cards = [
    {
      key: 'revenue',
      title: 'Έσοδα',
      value: formatCurrency(metrics.revenue),
      change: metrics.revenueChange,
      icon: DollarSign,
      tone: 'bg-blue-500/15 text-blue-300 border-blue-500/25',
    },
    {
      key: 'bookings',
      title: 'Κρατήσεις',
      value: metrics.bookings.toLocaleString('el-GR'),
      change: metrics.bookingsChange,
      icon: Calendar,
      tone: 'bg-orange-500/15 text-orange-300 border-orange-500/25',
    },
    {
      key: 'activeUsers',
      title: 'Ενεργοί Χρήστες',
      value: metrics.activeUsers.toLocaleString('el-GR'),
      change: metrics.activeUsersChange,
      icon: Users,
      tone: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
    },
    {
      // Derived from the two figures above — no previous-period value to compare.
      key: 'averageBookingValue',
      title: 'Μέση Αξία Κράτησης',
      value: averageBookingValue > 0 ? formatCurrency(averageBookingValue) : '—',
      change: null,
      icon: Receipt,
      tone: 'bg-violet-500/15 text-violet-300 border-violet-500/25',
    },
  ]

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${
        refreshing ? 'opacity-60' : 'opacity-100'
      }`}
    >
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.key}
            className="rounded-2xl bg-slate-800/60 border border-slate-700 px-5 py-4"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-slate-400">{card.title}</p>
              <div className={`p-2 rounded-xl border ${card.tone}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-50">{card.value}</p>
            <div className="mt-2">
              <DeltaBadge change={card.change} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

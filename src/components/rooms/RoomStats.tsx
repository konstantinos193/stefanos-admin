'use client'

import { DoorOpen, DoorClosed, Euro, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { RoomDashboardStats } from '@/lib/api/rooms'

interface RoomStatsProps {
  stats: RoomDashboardStats | null
  loading: boolean
}

export function RoomStats({ stats, loading }: RoomStatsProps) {
  const cards = [
    {
      title: 'Σύνολο Δωματίων',
      value: stats?.totalRooms ?? 0,
      icon: DoorOpen,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/15',
    },
    {
      title: 'Διαθέσιμα',
      value: stats?.bookableRooms ?? 0,
      icon: DoorOpen,
      iconColor: 'text-green-400',
      iconBg: 'bg-green-500/15',
    },
    {
      title: 'Μη Διαθέσιμα',
      value: stats?.unavailableRooms ?? 0,
      icon: DoorClosed,
      iconColor: 'text-red-400',
      iconBg: 'bg-red-500/15',
    },
    {
      title: 'Μέση Τιμή / Βράδυ',
      value: stats?.averagePrice ?? 0,
      icon: Euro,
      iconColor: 'text-amber-400',
      iconBg: 'bg-amber-500/15',
      isCurrency: true,
    },
    {
      title: 'Κρατήσεις (30 ημ.)',
      value: stats?.totalUpcomingBookings ?? 0,
      icon: Calendar,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/15',
    },
    {
      title: 'Πληρότητα',
      value: stats?.occupancyRate ?? 0,
      icon: BarChart3,
      iconColor: 'text-cyan-400',
      iconBg: 'bg-cyan-500/15',
      isPercentage: true,
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
        let displayValue: string
        if (card.isCurrency) {
          displayValue = `€${Number(card.value).toLocaleString('el-GR', { minimumFractionDigits: 0 })}`
        } else if (card.isPercentage) {
          displayValue = `${card.value}%`
        } else {
          displayValue = Number(card.value).toLocaleString('el-GR')
        }

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
